import { type SQLiteDatabase } from 'expo-sqlite';
import { SEED_ACCOUNTS, SEED_CATEGORIES, SEED_TRANSACTIONS } from './initialMoneyPlusData';
import { seedDefaultGoalsIfEmpty } from './goalRepo';

export async function seedInitialData(db: SQLiteDatabase): Promise<void> {
  // 1. Check if database has already been seeded in the past
  const alreadySeeded = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_settings WHERE key = 'app_seeded_v1'`
  );
  if (alreadySeeded) {
    return; // Already initialized in the past; respect ALL user edits, additions, and custom wallets!
  }

  const now = new Date().toISOString();

  // 2. Insert initial accounts only if accounts table is empty
  const countAcc = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM accounts`);
  if (!countAcc || countAcc.count === 0) {
    for (const acc of SEED_ACCOUNTS) {
      await db.runAsync(
        `INSERT OR IGNORE INTO accounts (id, name, type, initial_balance, current_balance, icon, icon_family, color, is_archived, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [acc.id, acc.name, acc.type, acc.initial_balance, acc.current_balance, acc.icon, acc.icon_family, acc.color, now, now]
      );
    }
  }

  // 3. Insert Categories from Money+ dataset if categories table is empty
  const countCat = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM categories`);
  if (!countCat || countCat.count === 0) {
    for (const cat of SEED_CATEGORIES) {
      await db.runAsync(
        `INSERT OR IGNORE INTO categories (id, name, type, icon, icon_family, color, is_archived, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'Ionicons', ?, 0, ?, ?)`,
        [cat.id, cat.name, cat.type, cat.icon, cat.color, now, now]
      );
    }
  }

  // 4. Insert All 722 Historical Transactions from Money+ if transactions table is empty
  const countTx = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM transactions`);
  if (!countTx || countTx.count === 0) {
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

    // Calculate initial accurate real-world balance from transaction flow
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
  }

  // 5. Authentic Quick-Add Shortcuts
  const defaultShortcuts = [
    { id: 'sc_def_nongkrong', title: 'Nongkrongs', emoji: '☕', amount: 20000, category_id: 'cat_nongkrong', type: 'expense' },
    { id: 'sc_def_makan', title: 'Food (Makanan)', emoji: '🍽️', amount: 25000, category_id: 'cat_makan', type: 'expense' },
    { id: 'sc_def_cemilan', title: 'Cemal Cemil', emoji: '🥐', amount: 10000, category_id: 'cat_cemilan', type: 'expense' },
    { id: 'sc_def_bensin', title: 'Bensin', emoji: '⛽', amount: 50000, category_id: 'cat_bensin', type: 'expense' },
    { id: 'sc_def_parkir', title: 'Ojol, Parkir', emoji: '🛵', amount: 2000, category_id: 'cat_parkir', type: 'expense' },
    { id: 'sc_def_pet', title: 'Pet (Kucing)', emoji: '🐱', amount: 15000, category_id: 'cat_pet', type: 'expense' },
  ];

  for (const sc of defaultShortcuts) {
    await db.runAsync(
      `INSERT OR IGNORE INTO shortcuts (id, title, emoji, amount, category_id, account_id, type, created_at)
       VALUES (?, ?, ?, ?, ?, 'acc_cash', ?, ?)`,
      [sc.id, sc.title, sc.emoji, sc.amount, sc.category_id, sc.type, now]
    );
  }

  // 6. Default Savings Goals (only on first app install)
  await seedDefaultGoalsIfEmpty();

  // 7. Mark app as permanently seeded
  await db.runAsync(
    `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('app_seeded_v1', 'true')`
  );
}
