import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { seedInitialData } from './seed';

let dbInstance: SQLiteDatabase | null = null;
let initPromise: Promise<SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  if (!initPromise) {
    initPromise = (async () => {
      const db = await openDatabaseAsync('money_tracker.db');
      await initDatabase(db);
      dbInstance = db;
      return db;
    })();
  }
  return initPromise;
}

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  // Enable foreign keys and WAL mode for better performance
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

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

    CREATE TABLE IF NOT EXISTS savings_goals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL NOT NULL DEFAULT 0,
      emoji TEXT NOT NULL DEFAULT '🎯',
      target_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Seed default categories, accounts, and shortcuts from authentic dataset (only on initial database creation)
  await seedInitialData(db);
}
