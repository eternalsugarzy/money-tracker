import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { seedInitialData } from './seed';

let dbInstance: SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await openDatabaseAsync('money_tracker.db');
  await initDatabase(dbInstance);
  return dbInstance;
}

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  // Enable foreign keys and WAL mode for better performance
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      initial_balance REAL NOT NULL DEFAULT 0,
      current_balance REAL NOT NULL DEFAULT 0,
      icon TEXT NOT NULL,
      icon_family TEXT NOT NULL DEFAULT 'Ionicons',
      color TEXT NOT NULL,
      is_archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT NOT NULL,
      icon_family TEXT NOT NULL DEFAULT 'Ionicons',
      color TEXT NOT NULL,
      is_archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      account_id TEXT,
      to_account_id TEXT,
      category_id TEXT,
      note TEXT,
      receipt_images TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
      FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      limit_amount REAL NOT NULL,
      period_type TEXT NOT NULL DEFAULT 'monthly',
      start_date TEXT NOT NULL,
      end_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recurring_transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      account_id TEXT,
      to_account_id TEXT,
      category_id TEXT,
      note TEXT,
      interval TEXT NOT NULL DEFAULT 'monthly',
      start_date TEXT NOT NULL,
      end_date TEXT,
      last_prompted_date TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
      FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS debts (
      id TEXT PRIMARY KEY,
      person_name TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'unpaid',
      note TEXT,
      settled_at TEXT,
      settled_account_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (settled_account_id) REFERENCES accounts(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS shortcuts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      emoji TEXT NOT NULL,
      amount REAL NOT NULL,
      category_id TEXT,
      account_id TEXT,
      type TEXT NOT NULL DEFAULT 'expense',
      created_at TEXT NOT NULL
    );
  `);

  // Clean up unused legacy categories, shortcuts, and accounts from previous builds
  try {
    await db.execAsync(`
      DELETE FROM accounts 
      WHERE id NOT IN ('acc_bri', 'acc_cash', 'acc_seabank');

      DELETE FROM categories 
      WHERE (id LIKE 'cat_exp_%' OR id LIKE 'cat_inc_%')
      AND id NOT IN (SELECT DISTINCT category_id FROM transactions WHERE category_id IS NOT NULL)
      AND id NOT IN (SELECT DISTINCT category_id FROM budgets WHERE category_id IS NOT NULL);

      DELETE FROM shortcuts 
      WHERE id NOT IN (
        SELECT MIN(id) FROM shortcuts GROUP BY LOWER(TRIM(title))
      );
    `);
  } catch (e) {
    // Ignore if table was just created
  }

  // Seed default categories, accounts, and shortcuts from authentic dataset
  await seedInitialData(db);
}
