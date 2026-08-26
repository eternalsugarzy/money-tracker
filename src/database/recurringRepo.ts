import { getDatabase } from './db';
import { RecurringTransaction } from '../types';

export async function getAllRecurring(activeOnly: boolean = false): Promise<RecurringTransaction[]> {
  const db = await getDatabase();
  let query = `
    SELECT 
      r.*,
      c.name as category_name,
      c.icon as category_icon,
      c.icon_family as category_icon_family,
      c.color as category_color,
      a.name as account_name
    FROM recurring_transactions r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN accounts a ON r.account_id = a.id
  `;

  if (activeOnly) {
    query += ' WHERE r.is_active = 1';
  }

  query += ' ORDER BY r.created_at DESC';

  return (await db.getAllAsync<RecurringTransaction>(query)) || [];
}

export async function getRecurringById(id: string): Promise<RecurringTransaction | null> {
  const db = await getDatabase();
  const query = `
    SELECT 
      r.*,
      c.name as category_name,
      c.icon as category_icon,
      c.icon_family as category_icon_family,
      c.color as category_color,
      a.name as account_name
    FROM recurring_transactions r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN accounts a ON r.account_id = a.id
    WHERE r.id = ?
  `;
  const res = await db.getFirstAsync<RecurringTransaction>(query, [id]);
  return res || null;
}

export async function createRecurring(
  data: Omit<RecurringTransaction, 'id' | 'created_at' | 'category_name' | 'account_name'>
): Promise<RecurringTransaction> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const id = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  await db.runAsync(
    `INSERT INTO recurring_transactions (id, type, amount, account_id, to_account_id, category_id, note, interval, start_date, end_date, last_prompted_date, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.type,
      data.amount,
      data.account_id,
      data.to_account_id || null,
      data.category_id || null,
      data.note || '',
      data.interval,
      data.start_date,
      data.end_date || null,
      null,
      data.is_active ?? 1,
      now,
    ]
  );

  const created = await getRecurringById(id);
  return created!;
}

export async function updateRecurring(
  id: string,
  updates: Partial<RecurringTransaction>
): Promise<void> {
  const db = await getDatabase();
  const current = await getRecurringById(id);
  if (!current) throw new Error('Transaksi berulang tidak ditemukan');

  const type = updates.type !== undefined ? updates.type : current.type;
  const amount = updates.amount !== undefined ? updates.amount : current.amount;
  const account_id = updates.account_id !== undefined ? updates.account_id : current.account_id;
  const to_account_id = updates.to_account_id !== undefined ? updates.to_account_id : current.to_account_id;
  const category_id = updates.category_id !== undefined ? updates.category_id : current.category_id;
  const note = updates.note !== undefined ? updates.note : current.note;
  const interval = updates.interval !== undefined ? updates.interval : current.interval;
  const start_date = updates.start_date !== undefined ? updates.start_date : current.start_date;
  const end_date = updates.end_date !== undefined ? updates.end_date : current.end_date;
  const is_active = updates.is_active !== undefined ? updates.is_active : current.is_active;

  await db.runAsync(
    `UPDATE recurring_transactions 
     SET type = ?, amount = ?, account_id = ?, to_account_id = ?, category_id = ?, note = ?, interval = ?, start_date = ?, end_date = ?, is_active = ?
     WHERE id = ?`,
    [type, amount, account_id, to_account_id, category_id, note, interval, start_date, end_date, is_active, id]
  );
}

export async function deleteRecurring(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM recurring_transactions WHERE id = ?', [id]);
}

export async function markRecurringPrompted(id: string, dateStr: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE recurring_transactions SET last_prompted_date = ? WHERE id = ?',
    [dateStr, id]
  );
}
