import { type SQLiteDatabase } from 'expo-sqlite';
import { SEED_ACCOUNTS, SEED_CATEGORIES, SEED_TRANSACTIONS } from './initialMoneyPlusData';

export async function seedInitialData(db: SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();

  // 1. Insert Categories from Money+ and Defaults
  for (const cat of SEED_CATEGORIES) {
    await db.runAsync(
      `INSERT OR IGNORE INTO categories (id, name, type, icon, icon_family, color, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'Ionicons', ?, 0, ?, ?)`,
      [cat.id, cat.name, cat.type, cat.icon, cat.color, now, now]
    );
  }

  // 2. Insert Accounts from Money+
  for (const acc of SEED_ACCOUNTS) {
    await db.runAsync(
      `INSERT OR IGNORE INTO accounts (id, name, type, initial_balance, current_balance, icon, icon_family, color, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [acc.id, acc.name, acc.type, acc.initial_balance, acc.current_balance, acc.icon, acc.icon_family, acc.color, now, now]
    );
  }

  // 3. Insert Historical Transactions (722 Transactions from Money+ Backup)
  // Execute in transactions chunk
  await db.withTransactionAsync(async () => {
    for (const tx of SEED_TRANSACTIONS) {
      await db.runAsync(
        `INSERT OR IGNORE INTO transactions (id, type, amount, date, account_id, to_account_id, category_id, note, receipt_images, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?)`,
        [
          tx.id,
          tx.type,
          tx.amount,
          tx.date,
          tx.account_id,
          tx.to_account_id,
          tx.category_id,
          tx.note || '',
          now,
          now,
        ]
      );
    }
  });

  // 4. Recalculate each account's accurate current balance based on transactions
  for (const acc of SEED_ACCOUNTS) {
    const incRes = await db.getFirstAsync<{ sum: number | null }>(
      `SELECT SUM(amount) as sum FROM transactions WHERE type = 'income' AND account_id = ?`,
      [acc.id]
    );
    const expRes = await db.getFirstAsync<{ sum: number | null }>(
      `SELECT SUM(amount) as sum FROM transactions WHERE type = 'expense' AND account_id = ?`,
      [acc.id]
    );
    const trInRes = await db.getFirstAsync<{ sum: number | null }>(
      `SELECT SUM(amount) as sum FROM transactions WHERE type = 'transfer' AND to_account_id = ?`,
      [acc.id]
    );
    const trOutRes = await db.getFirstAsync<{ sum: number | null }>(
      `SELECT SUM(amount) as sum FROM transactions WHERE type = 'transfer' AND account_id = ?`,
      [acc.id]
    );

    const totalInc = incRes?.sum || 0;
    const totalExp = expRes?.sum || 0;
    const totalTrIn = trInRes?.sum || 0;
    const totalTrOut = trOutRes?.sum || 0;

    const accurateBalance = acc.initial_balance + totalInc - totalExp + totalTrIn - totalTrOut;

    await db.runAsync(
      `UPDATE accounts SET current_balance = ?, updated_at = ? WHERE id = ?`,
      [accurateBalance, now, acc.id]
    );
  }

  // 5. Default Quick-Add Shortcuts tailored to user habits
  const defaultShortcuts = [
    { id: 'sc_def_nongkrong', title: 'Nongkrong & Kopi', emoji: '☕', amount: 20000, category_id: 'cat_nongkrong', type: 'expense' },
    { id: 'sc_def_makan', title: 'Makan (Food)', emoji: '🍽️', amount: 25000, category_id: 'cat_makan', type: 'expense' },
    { id: 'sc_def_cemilan', title: 'Cemal Cemil', emoji: '🥐', amount: 10000, category_id: 'cat_cemilan', type: 'expense' },
    { id: 'sc_def_bensin', title: 'Bensin BBM', emoji: '⛽', amount: 50000, category_id: 'cat_bensin', type: 'expense' },
    { id: 'sc_def_parkir', title: 'Parkir / Ojol', emoji: '🛵', amount: 2000, category_id: 'cat_parkir', type: 'expense' },
    { id: 'sc_def_pet', title: 'Makanan Kucing', emoji: '🐱', amount: 15000, category_id: 'cat_pet', type: 'expense' },
  ];

  for (const sc of defaultShortcuts) {
    await db.runAsync(
      `INSERT OR IGNORE INTO shortcuts (id, title, emoji, amount, category_id, account_id, type, created_at)
       VALUES (?, ?, ?, ?, ?, 'acc_cash', ?, ?)`,
      [sc.id, sc.title, sc.emoji, sc.amount, sc.category_id, sc.type, now]
    );
  }
}
