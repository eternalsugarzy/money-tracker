import { getDatabase } from './db';
import { Budget } from '../types';

export async function getActiveBudgets(targetMonth?: string): Promise<Budget[]> {
  const db = await getDatabase();
  const now = new Date();
  const monthStr = targetMonth || now.toISOString().slice(0, 7); // e.g. "2026-08"
  const startOfMonth = `${monthStr}-01`;
  const endOfMonth = `${monthStr}-31T23:59:59`;

  const query = `
    SELECT 
      b.*,
      c.name as category_name,
      c.icon as category_icon,
      c.icon_family as category_icon_family,
      c.color as category_color,
      COALESCE((
        SELECT SUM(t.amount) 
        FROM transactions t 
        WHERE t.category_id = b.category_id 
          AND t.type = 'expense'
          AND t.date >= ? AND t.date <= ?
      ), 0) as spent_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    ORDER BY b.created_at DESC
  `;

  const rows = (await db.getAllAsync<any>(query, [startOfMonth, endOfMonth])) || [];

  return rows.map((r) => {
    const spent = r.spent_amount || 0;
    const limit = r.limit_amount || 1;
    const percentage = Math.round((spent / limit) * 100);
    return {
      ...r,
      spent_amount: spent,
      percentage,
    };
  });
}

export async function getBudgetById(id: string, targetMonth?: string): Promise<Budget | null> {
  const db = await getDatabase();
  const now = new Date();
  const monthStr = targetMonth || now.toISOString().slice(0, 7);
  const startOfMonth = `${monthStr}-01`;
  const endOfMonth = `${monthStr}-31T23:59:59`;

  const query = `
    SELECT 
      b.*,
      c.name as category_name,
      c.icon as category_icon,
      c.icon_family as category_icon_family,
      c.color as category_color,
      COALESCE((
        SELECT SUM(t.amount) 
        FROM transactions t 
        WHERE t.category_id = b.category_id 
          AND t.type = 'expense'
          AND t.date >= ? AND t.date <= ?
      ), 0) as spent_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    WHERE b.id = ?
  `;

  const r = await db.getFirstAsync<any>(query, [startOfMonth, endOfMonth, id]);
  if (!r) return null;

  const spent = r.spent_amount || 0;
  const limit = r.limit_amount || 1;
  const percentage = Math.round((spent / limit) * 100);

  return {
    ...r,
    spent_amount: spent,
    percentage,
  };
}

export async function createBudget(
  data: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'spent_amount' | 'percentage'>
): Promise<Budget> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const id = `bdg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  await db.runAsync(
    `INSERT INTO budgets (id, name, category_id, limit_amount, period_type, start_date, end_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.category_id,
      data.limit_amount,
      data.period_type || 'monthly',
      data.start_date,
      data.end_date || null,
      now,
      now,
    ]
  );

  const created = await getBudgetById(id);
  return created!;
}

export async function updateBudget(
  id: string,
  updates: Partial<Omit<Budget, 'id' | 'created_at'>>
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const current = await getBudgetById(id);
  if (!current) throw new Error('Budget tidak ditemukan');

  const name = updates.name !== undefined ? updates.name : current.name;
  const category_id = updates.category_id !== undefined ? updates.category_id : current.category_id;
  const limit_amount = updates.limit_amount !== undefined ? updates.limit_amount : current.limit_amount;
  const period_type = updates.period_type !== undefined ? updates.period_type : current.period_type;
  const start_date = updates.start_date !== undefined ? updates.start_date : current.start_date;
  const end_date = updates.end_date !== undefined ? updates.end_date : current.end_date;

  await db.runAsync(
    `UPDATE budgets 
     SET name = ?, category_id = ?, limit_amount = ?, period_type = ?, start_date = ?, end_date = ?, updated_at = ?
     WHERE id = ?`,
    [name, category_id, limit_amount, period_type, start_date, end_date, now, id]
  );
}

export async function deleteBudget(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM budgets WHERE id = ?', [id]);
}

export interface BudgetHistoryMonth {
  monthKey: string; // "2026-07"
  monthLabel: string; // "Juli 2026"
  totalLimit: number;
  totalSpent: number;
  budgets: Budget[];
}

export async function getBudgetHistory(monthsBack: number = 3): Promise<BudgetHistoryMonth[]> {
  const history: BudgetHistoryMonth[] = [];
  const now = new Date();

  for (let i = 1; i <= monthsBack; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toISOString().slice(0, 7);
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

    const budgets = await getActiveBudgets(monthKey);
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit_amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent_amount || 0), 0);

    history.push({
      monthKey,
      monthLabel,
      totalLimit,
      totalSpent,
      budgets,
    });
  }

  return history;
}
