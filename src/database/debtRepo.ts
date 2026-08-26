import { getDatabase } from './db';
import { Debt, DebtType, DebtStatus } from '../types';
import { createTransaction } from './transactionRepo';

export async function getAllDebts(type?: DebtType, status?: DebtStatus): Promise<Debt[]> {
  const db = await getDatabase();
  let query = `
    SELECT 
      d.*,
      a.name as settled_account_name
    FROM debts d
    LEFT JOIN accounts a ON d.settled_account_id = a.id
  `;

  const conditions: string[] = [];
  const params: any[] = [];

  if (type) {
    conditions.push('d.type = ?');
    params.push(type);
  }
  if (status) {
    conditions.push('d.status = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY d.status ASC, d.date DESC';

  return (await db.getAllAsync<Debt>(query, params)) || [];
}

export async function getDebtById(id: string): Promise<Debt | null> {
  const db = await getDatabase();
  const query = `
    SELECT 
      d.*,
      a.name as settled_account_name
    FROM debts d
    LEFT JOIN accounts a ON d.settled_account_id = a.id
    WHERE d.id = ?
  `;
  const res = await db.getFirstAsync<Debt>(query, [id]);
  return res || null;
}

export async function createDebt(
  data: Omit<Debt, 'id' | 'created_at' | 'updated_at' | 'settled_account_name'>
): Promise<Debt> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const id = `debt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  await db.runAsync(
    `INSERT INTO debts (id, person_name, amount, type, date, due_date, status, note, settled_at, settled_account_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.person_name,
      data.amount,
      data.type,
      data.date,
      data.due_date || null,
      data.status || 'unpaid',
      data.note || '',
      data.settled_at || null,
      data.settled_account_id || null,
      now,
      now,
    ]
  );

  const created = await getDebtById(id);
  return created!;
}

export async function updateDebt(
  id: string,
  updates: Partial<Omit<Debt, 'id' | 'created_at'>>
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const current = await getDebtById(id);
  if (!current) throw new Error('Catatan hutang-piutang tidak ditemukan');

  const person_name = updates.person_name !== undefined ? updates.person_name : current.person_name;
  const amount = updates.amount !== undefined ? updates.amount : current.amount;
  const type = updates.type !== undefined ? updates.type : current.type;
  const date = updates.date !== undefined ? updates.date : current.date;
  const due_date = updates.due_date !== undefined ? updates.due_date : current.due_date;
  const status = updates.status !== undefined ? updates.status : current.status;
  const note = updates.note !== undefined ? updates.note : current.note;
  const settled_at = updates.settled_at !== undefined ? updates.settled_at : current.settled_at;
  const settled_account_id = updates.settled_account_id !== undefined ? updates.settled_account_id : current.settled_account_id;

  await db.runAsync(
    `UPDATE debts 
     SET person_name = ?, amount = ?, type = ?, date = ?, due_date = ?, status = ?, note = ?, settled_at = ?, settled_account_id = ?, updated_at = ?
     WHERE id = ?`,
    [person_name, amount, type, date, due_date, status, note, settled_at, settled_account_id, now, id]
  );
}

export async function deleteDebt(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM debts WHERE id = ?', [id]);
}

export async function settleDebt(
  id: string,
  options: {
    createTx?: boolean;
    accountId?: string;
    settledDate?: string;
  }
): Promise<void> {
  const db = await getDatabase();
  const debt = await getDebtById(id);
  if (!debt) throw new Error('Catatan hutang-piutang tidak ditemukan');

  const now = options.settledDate || new Date().toISOString().slice(0, 10);

  await db.runAsync(
    `UPDATE debts SET status = 'paid', settled_at = ?, settled_account_id = ?, updated_at = ? WHERE id = ?`,
    [now, options.accountId || null, new Date().toISOString(), id]
  );

  // If user requested creating an automatic transaction
  if (options.createTx && options.accountId) {
    if (debt.type === 'receivable') {
      // Piutang dilunasi -> Pemasukan (Income)
      await createTransaction({
        type: 'income',
        amount: debt.amount,
        date: now,
        account_id: options.accountId,
        to_account_id: null,
        category_id: null,
        note: `[Pelunasan Piutang] ${debt.person_name} ${debt.note ? '(' + debt.note + ')' : ''}`,
        receipt_images: '[]',
      });
    } else {
      // Utang dilunasi -> Pengeluaran (Expense)
      await createTransaction({
        type: 'expense',
        amount: debt.amount,
        date: now,
        account_id: options.accountId,
        to_account_id: null,
        category_id: null,
        note: `[Pelunasan Utang] ${debt.person_name} ${debt.note ? '(' + debt.note + ')' : ''}`,
        receipt_images: '[]',
      });
    }
  }
}
