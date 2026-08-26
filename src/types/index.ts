export type TransactionType = 'income' | 'expense' | 'transfer';

export type AccountType = 'Cash' | 'Bank' | 'E-Wallet' | 'Credit Card' | 'Investment' | 'Other';

export type IconFamily = 'Ionicons' | 'MaterialCommunityIcons';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  current_balance: number;
  icon: string;
  icon_family: IconFamily;
  color: string;
  is_archived: number; // 0 = active, 1 = archived
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type?: 'all' | 'income' | 'expense';
  icon: string;
  icon_family: IconFamily;
  color: string;
  is_archived: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  account_id: string | null;
  to_account_id: string | null;
  category_id: string | null;
  note: string;
  receipt_images: string; // JSON array string e.g. '["file://..."]'
  created_at: string;
  updated_at: string;
  // Joined fields for convenience
  category_name?: string;
  category_icon?: string;
  category_icon_family?: IconFamily;
  category_color?: string;
  account_name?: string;
  account_icon?: string;
  account_color?: string;
  to_account_name?: string;
}

export type BudgetPeriodType = 'monthly' | 'custom';

export interface Budget {
  id: string;
  name: string;
  category_id: string;
  limit_amount: number;
  period_type: BudgetPeriodType;
  start_date: string; // YYYY-MM-01 or YYYY-MM-DD
  end_date: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_icon?: string;
  category_icon_family?: IconFamily;
  category_color?: string;
  spent_amount?: number;
  percentage?: number;
}

export type RecurringInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  account_id: string | null;
  to_account_id: string | null;
  category_id: string | null;
  note: string;
  interval: RecurringInterval;
  start_date: string;
  end_date: string | null;
  last_prompted_date: string | null;
  is_active: number;
  created_at: string;
  // Joined fields
  category_name?: string;
  category_icon?: string;
  category_icon_family?: IconFamily;
  category_color?: string;
  account_name?: string;
}

export type DebtType = 'receivable' | 'debt'; // Piutang (receivable) | Utang (debt)
export type DebtStatus = 'unpaid' | 'paid';

export interface Debt {
  id: string;
  person_name: string;
  amount: number;
  type: DebtType;
  date: string;
  due_date: string | null;
  status: DebtStatus;
  note: string;
  settled_at: string | null;
  settled_account_id: string | null;
  created_at: string;
  updated_at: string;
  settled_account_name?: string;
}

export type TimePeriodFilter = 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface TransactionFilterOptions {
  period: TimePeriodFilter;
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  accountId?: string;
  type?: TransactionType | 'debt' | 'all';
  searchQuery?: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  totalBalance: number;
}

export interface CategorySpendingSummary {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryIconFamily: IconFamily;
  categoryColor: string;
  totalSpent: number;
  percentage: number;
  transactionCount: number;
}

export interface QuickShortcut {
  id: string;
  title: string;
  emoji: string;
  amount: number;
  category_id: string | null;
  account_id: string | null;
  type: TransactionType;
  created_at: string;
  category_name?: string;
  account_name?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  emoji: string;
  target_date?: string | null;
  created_at: string;
  updated_at: string;
}

