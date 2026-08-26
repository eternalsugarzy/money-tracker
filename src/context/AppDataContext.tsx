import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Account,
  Category,
  Transaction,
  Budget,
  RecurringTransaction,
  Debt,
  SummaryData,
  CategorySpendingSummary,
} from '../types';
import { getDatabase } from '../database/db';
import { getAllAccounts, getTotalNetWorth } from '../database/accountRepo';
import { getAllCategories } from '../database/categoryRepo';
import {
  getRecentTransactions,
  getSummaryForPeriod,
  getCategorySpendingBreakdown,
} from '../database/transactionRepo';
import { getActiveBudgets } from '../database/budgetRepo';
import { getAllRecurring } from '../database/recurringRepo';
import { getAllDebts } from '../database/debtRepo';
import { populateSampleData } from '../services/sampleDataService';
import { scheduleDailyExpenseReminder } from '../services/notificationService';

interface AppDataContextType {
  isLoading: boolean;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  recurring: RecurringTransaction[];
  debts: Debt[];
  totalNetWorth: number;
  todaySummary: SummaryData;
  monthSummary: SummaryData;
  categorySpending: CategorySpendingSummary[];
  refreshData: () => Promise<void>;
  generateSampleData: () => Promise<void>;
}

const defaultSummary: SummaryData = {
  totalIncome: 0,
  totalExpense: 0,
  netSavings: 0,
  totalBalance: 0,
};

const AppDataContext = createContext<AppDataContextType>({
  isLoading: true,
  accounts: [],
  categories: [],
  transactions: [],
  budgets: [],
  recurring: [],
  debts: [],
  totalNetWorth: 0,
  todaySummary: defaultSummary,
  monthSummary: defaultSummary,
  categorySpending: [],
  refreshData: async () => {},
  generateSampleData: async () => {},
});

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [totalNetWorth, setTotalNetWorth] = useState<number>(0);
  const [todaySummary, setTodaySummary] = useState<SummaryData>(defaultSummary);
  const [monthSummary, setMonthSummary] = useState<SummaryData>(defaultSummary);
  const [categorySpending, setCategorySpending] = useState<CategorySpendingSummary[]>([]);

  const refreshData = useCallback(async () => {
    try {
      await getDatabase(); // Ensure DB is initialized

      const [
        accs,
        cats,
        recentTxs,
        bdgs,
        recs,
        dbts,
        netWorth,
        todaySum,
        monthSum,
        catSpend,
      ] = await Promise.all([
        getAllAccounts(true),
        getAllCategories(undefined, true),
        getRecentTransactions(20),
        getActiveBudgets(),
        getAllRecurring(),
        getAllDebts(),
        getTotalNetWorth(),
        getSummaryForPeriod('day'),
        getSummaryForPeriod('month'),
        getCategorySpendingBreakdown('month'),
      ]);

      setAccounts(accs);
      setCategories(cats);
      setTransactions(recentTxs);
      setBudgets(bdgs);
      setRecurring(recs);
      setDebts(dbts);
      setTotalNetWorth(netWorth);
      setTodaySummary(todaySum);
      setMonthSummary(monthSum);
      setCategorySpending(catSpend);
    } catch (err) {
      console.error('Error loading app data from SQLite:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    // Default setup daily reminder at 20:00
    scheduleDailyExpenseReminder(20, 0, true);
  }, [refreshData]);

  const generateSampleData = async () => {
    setIsLoading(true);
    await populateSampleData();
    await refreshData();
  };

  return (
    <AppDataContext.Provider
      value={{
        isLoading,
        accounts,
        categories,
        transactions,
        budgets,
        recurring,
        debts,
        totalNetWorth,
        todaySummary,
        monthSummary,
        categorySpending,
        refreshData,
        generateSampleData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
