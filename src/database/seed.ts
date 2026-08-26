import { type SQLiteDatabase } from 'expo-sqlite';
import { SEED_ACCOUNTS, SEED_CATEGORIES, SEED_TRANSACTIONS } from './initialMoneyPlusData';
import { seedDefaultGoalsIfEmpty } from './goalRepo';

export async function seedInitialData(db: SQLiteDatabase): Promise<void> {
  // 1. Check if database has already been seeded in the past
  const alreadySeeded = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_settings WHERE key = 'app_seeded_v1'`
  );
  if (alreadySeeded) {
    return; // Already initialized in the past; fast return!
  }

  const now = new Date().toISOString();

  // 2. Insert initial accounts in a single batch
  const countAcc = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM accounts`);
  if (!countAcc || countAcc.count === 0) {
    const accPlaceholders = SEED_ACCOUNTS.map(() => `(?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`).join(', ');
    const accValues = SEED_ACCOUNTS.flatMap((acc) => [
      acc.id,
      acc.name,
      acc.type,
      acc.initial_balance,
      acc.current_balance,
      acc.icon,
      acc.icon_family,
      acc.color,
      now,
      now,
    ]);
    await db.runAsync(
      `INSERT OR IGNORE INTO accounts (id, name, type, initial_balance, current_balance, icon, icon_family, color, is_archived, created_at, updated_at) VALUES ${accPlaceholders}`,
      accValues
    );
  }

  // 3. Insert Categories in a single batch
  const countCat = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM categories`);
  if (!countCat || countCat.count === 0) {
    const catPlaceholders = SEED_CATEGORIES.map(() => `(?, ?, ?, ?, 'Ionicons', ?, 0, ?, ?)`).join(', ');
    const catValues = SEED_CATEGORIES.flatMap((cat) => [
      cat.id,
      cat.name,
      cat.type,
      cat.icon,
      cat.color,
      now,
      now,
    ]);
    await db.runAsync(
      `INSERT OR IGNORE INTO categories (id, name, type, icon, icon_family, color, is_archived, created_at, updated_at) VALUES ${catPlaceholders}`,
      catValues
    );
  }

  // 4. Insert All 722 Historical Transactions in high-speed 50-row chunks
  const countTx = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM transactions`);
  if (!countTx || countTx.count === 0) {
    const chunkSize = 50;
    await db.withTransactionAsync(async () => {
      for (let i = 0; i < SEED_TRANSACTIONS.length; i += chunkSize) {
        const chunk = SEED_TRANSACTIONS.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => `(?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?)`).join(', ');
        const values: any[] = [];
        for (const tx of chunk) {
          values.push(
            tx.id,
            tx.type,
            tx.amount,
            tx.date,
            tx.account_id,
            tx.to_account_id,
            tx.category_id,
            tx.note || '',
            now,
            now
          );
        }
        await db.runAsync(
          `INSERT OR IGNORE INTO transactions (id, type, amount, date, account_id, to_account_id, category_id, note, receipt_images, created_at, updated_at) VALUES ${placeholders}`,
          values
        );
      }
    });

    // Recalculate account balances with a single fast SQL query
    await db.runAsync(`
      UPDATE accounts
      SET current_balance = initial_balance + (
        COALESCE((SELECT SUM(amount) FROM transactions WHERE type = 'income' AND account_id = accounts.id), 0)
        - COALESCE((SELECT SUM(amount) FROM transactions WHERE type = 'expense' AND account_id = accounts.id), 0)
        + COALESCE((SELECT SUM(amount) FROM transactions WHERE type = 'transfer' AND to_account_id = accounts.id), 0)
        - COALESCE((SELECT SUM(amount) FROM transactions WHERE type = 'transfer' AND account_id = accounts.id), 0)
      ),
      updated_at = ?
    `, [now]);
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

  // 6. Default Savings Goals
  await seedDefaultGoalsIfEmpty();

  // 7. Mark app as permanently seeded
  await db.runAsync(
    `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('app_seeded_v1', 'true')`
  );
}
