import { type SQLiteDatabase } from 'expo-sqlite';
import { SEED_ACCOUNTS, SEED_CATEGORIES, SEED_TRANSACTIONS } from './initialMoneyPlusData';
import { seedDefaultGoalsIfEmpty } from './goalRepo';

export async function seedInitialData(db: SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();

  // 1. Ensure accounts exist (using INSERT OR IGNORE to never overwrite user modifications)
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

  // 2. Ensure categories exist
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

  // 3. Ensure 722 transactions exist
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
  }

  // 4. Ensure shortcuts exist
  const countSc = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM shortcuts`);
  if (!countSc || countSc.count === 0) {
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
  }

  // 5. Default Savings Goals
  await seedDefaultGoalsIfEmpty();
}
