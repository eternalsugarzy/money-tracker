import { getDatabase } from './db';
import { SavingsGoal } from '../types';

export async function getAllGoals(): Promise<SavingsGoal[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SavingsGoal>(
    `SELECT * FROM savings_goals ORDER BY created_at DESC`
  );
  return rows || [];
}

export async function getGoalById(id: string): Promise<SavingsGoal | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SavingsGoal>(
    `SELECT * FROM savings_goals WHERE id = ?`,
    [id]
  );
  return row || null;
}

export async function createGoal(
  data: Omit<SavingsGoal, 'created_at' | 'updated_at'>
): Promise<SavingsGoal> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const id = data.id || `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

  await db.runAsync(
    `INSERT INTO savings_goals (id, title, target_amount, current_amount, emoji, target_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.title,
      data.target_amount,
      data.current_amount || 0,
      data.emoji || '🎯',
      data.target_date || null,
      now,
      now,
    ]
  );

  return {
    ...data,
    id,
    created_at: now,
    updated_at: now,
  };
}

export async function updateGoal(
  id: string,
  updates: Partial<Omit<SavingsGoal, 'id' | 'created_at'>>
): Promise<void> {
  const db = await getDatabase();
  const current = await getGoalById(id);
  if (!current) throw new Error('Target celengan tidak ditemukan');

  const now = new Date().toISOString();
  const title = updates.title !== undefined ? updates.title : current.title;
  const target_amount = updates.target_amount !== undefined ? updates.target_amount : current.target_amount;
  const current_amount = updates.current_amount !== undefined ? updates.current_amount : current.current_amount;
  const emoji = updates.emoji !== undefined ? updates.emoji : current.emoji;
  const target_date = updates.target_date !== undefined ? updates.target_date : current.target_date;

  await db.runAsync(
    `UPDATE savings_goals 
     SET title = ?, target_amount = ?, current_amount = ?, emoji = ?, target_date = ?, updated_at = ?
     WHERE id = ?`,
    [title, target_amount, current_amount, emoji, target_date || null, now, id]
  );
}

export async function depositToGoal(id: string, addedAmount: number): Promise<number> {
  const db = await getDatabase();
  const current = await getGoalById(id);
  if (!current) throw new Error('Target celengan tidak ditemukan');

  const now = new Date().toISOString();
  const newAmount = current.current_amount + addedAmount;

  await db.runAsync(
    `UPDATE savings_goals SET current_amount = ?, updated_at = ? WHERE id = ?`,
    [newAmount, now, id]
  );

  return newAmount;
}

export async function deleteGoal(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM savings_goals WHERE id = ?`, [id]);
}

export async function seedDefaultGoalsIfEmpty(): Promise<void> {
  const db = await getDatabase();
  const countRes = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM savings_goals`
  );

  if (countRes && countRes.count === 0) {
    const now = new Date().toISOString();
    const defaults = [
      { id: 'goal_def_1', title: 'Dana Darurat (6 Bulan)', target_amount: 15000000, current_amount: 8500000, emoji: '🛡️' },
      { id: 'goal_def_2', title: 'Beli iPhone 16 Pro', target_amount: 22000000, current_amount: 14000000, emoji: '📱' },
      { id: 'goal_def_3', title: 'Liburan Akhir Tahun', target_amount: 8000000, current_amount: 5000000, emoji: '✈️' },
    ];

    for (const d of defaults) {
      await db.runAsync(
        `INSERT INTO savings_goals (id, title, target_amount, current_amount, emoji, target_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NULL, ?, ?)`,
        [d.id, d.title, d.target_amount, d.current_amount, d.emoji, now, now]
      );
    }
  }
}
