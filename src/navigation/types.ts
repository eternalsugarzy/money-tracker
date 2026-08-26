import { Transaction, Budget, Account, Category, RecurringTransaction, Debt, DebtType } from '../types';

export type RootTabParamList = {
  HomeTab: undefined;
  TransactionsTab: undefined;
  AddPlaceholder: undefined;
  BudgetTab: undefined;
  MoreTab: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  TransactionDetail: { transactionId: string };
  AddModal?: { editTransaction?: Transaction };
  BudgetFormModal?: { editBudget?: Budget };
  Accounts: undefined;
  AccountFormModal?: { editAccount?: Account };
  Categories: undefined;
  CategoryFormModal?: { editCategory?: Category; defaultType?: 'income' | 'expense' };
  Recurring: undefined;
  RecurringFormModal?: { editRecurring?: RecurringTransaction };
  Debts: undefined;
  DebtFormModal?: { editDebt?: Debt; defaultType?: DebtType };
  ExportReport: undefined;
  Settings: undefined;
};
