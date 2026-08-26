import { getDatabase } from './db';
import { Account } from '../types';

export async function getAllAccounts(includeArchived: boolean = false): Promise<Account[]> {
  const db = await getDatabase();
  const query = includeArchived
    ? 'SELECT * FROM accounts ORDER BY is_archived ASC, name ASC'
    : 'SELECT * FROM accounts WHERE is_archived = 0 ORDER BY name ASC';
  return (await db.getAllAsync<Account>(query)) || [];
}

export async function getAccountById(id: string): Promise<Account | null> {
  const db = await getDatabase();
  const res = await db.getFirstAsync<Account>('SELECT * FROM accounts WHERE id = ?', [id]);
  return res || null;
}

export async function createAccount(
  data: Omit<Account, 'current_balance' | 'created_at' | 'updated_at'>
): Promise<Account> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const id = data.id || `acc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const current_balance = data.initial_balance;

  await db.runAsync(
    `INSERT INTO accounts (id, name, type, initial_balance, current_balance, icon, icon_family, color, is_archived, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.type,
      data.initial_balance,
      current_balance,
      data.icon,
      data.icon_family,
      data.color,
      data.is_archived || 0,
      now,
      now,
    ]
  );

  return {
    ...data,
    id,
    current_balance,
    created_at: now,
    updated_at: now,
  };
}

export async function updateAccount(
  id: string,
  updates: Partial<Omit<Account, 'id' | 'created_at'>> & { target_current_balance?: number }
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const current = await getAccountById(id);
  if (!current) throw new Error('Akun tidak ditemukan');

  const name = updates.name !== undefined ? updates.name : current.name;
  const type = updates.type !== undefined ? updates.type : current.type;
  const icon = updates.icon !== undefined ? updates.icon : current.icon;
  const icon_family = updates.icon_family !== undefined ? updates.icon_family : current.icon_family;
  const color = updates.color !== undefined ? updates.color : current.color;
  const is_archived = updates.is_archived !== undefined ? updates.is_archived : current.is_archived;

  let initial_balance = updates.initial_balance !== undefined ? updates.initial_balance : current.initial_balance;

  if (updates.target_current_balance !== undefined) {
    const incRes = await db.getFirstAsync<{ sum: number }>(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE account_id = ? AND type = 'income'`,
      [id]
    );
    const expRes = await db.getFirstAsync<{ sum: number }>(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE account_id = ? AND type = 'expense'`,
      [id]
    );
    const trOutRes = await db.getFirstAsync<{ sum: number }>(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE account_id = ? AND type = 'transfer'`,
      [id]
    );
    const trInRes = await db.getFirstAsync<{ sum: number }>(
      `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE to_account_id = ? AND type = 'transfer'`,
      [id]
    );

    const totalInc = incRes?.sum || 0;
    const totalExp = expRes?.sum || 0;
    const totalTrOut = trOutRes?.sum || 0;
    const totalTrIn = trInRes?.sum || 0;
    const txDelta = totalInc - totalExp - totalTrOut + totalTrIn;

    initial_balance = updates.target_current_balance - txDelta;
  }

  await db.runAsync(
    `UPDATE accounts 
     SET name = ?, type = ?, initial_balance = ?, icon = ?, icon_family = ?, color = ?, is_archived = ?, updated_at = ?
     WHERE id = ?`,
    [name, type, initial_balance, icon, icon_family, color, is_archived, now, id]
  );

  await recalculateAccountBalance(id);
}

export async function deleteAccount(id: string): Promise<{ action: 'deleted' | 'archived' }> {
  const db = await getDatabase();

  // Check if account has any associated transactions
  const txCount = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM transactions WHERE account_id = ? OR to_account_id = ?`,
    [id, id]
  );

  if (txCount && txCount.count > 0) {
    // Soft-delete / archive
    await db.runAsync(
      `UPDATE accounts SET is_archived = 1, updated_at = ? WHERE id = ?`,
      [new Date().toISOString(), id]
    );
    return { action: 'archived' };
  } else {
    // Hard delete
    await db.runAsync(`DELETE FROM accounts WHERE id = ?`, [id]);
    return { action: 'deleted' };
  }
}

export async function recalculateAccountBalance(accountId: string): Promise<number> {
  const db = await getDatabase();
  const account = await getAccountById(accountId);
  if (!account) return 0;

  // Income transactions
  const incRes = await db.getFirstAsync<{ sum: number }>(
    `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE account_id = ? AND type = 'income'`,
    [accountId]
  );

  // Expense transactions
  const expRes = await db.getFirstAsync<{ sum: number }>(
    `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE account_id = ? AND type = 'expense'`,
    [accountId]
  );

  // Transfer Out
  const trOutRes = await db.getFirstAsync<{ sum: number }>(
    `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE account_id = ? AND type = 'transfer'`,
    [accountId]
  );

  // Transfer In
  const trInRes = await db.getFirstAsync<{ sum: number }>(
    `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions WHERE to_account_id = ? AND type = 'transfer'`,
    [accountId]
  );

  const totalInc = incRes?.sum || 0;
  const totalExp = expRes?.sum || 0;
  const totalTrOut = trOutRes?.sum || 0;
  const totalTrIn = trInRes?.sum || 0;

  const current_balance = account.initial_balance + totalInc - totalExp - totalTrOut + totalTrIn;

  await db.runAsync(
    `UPDATE accounts SET current_balance = ?, updated_at = ? WHERE id = ?`,
    [current_balance, new Date().toISOString(), accountId]
  );

  return current_balance;
}

export async function recalculateAllAccountBalances(): Promise<void> {
  const db = await getDatabase();
  const accounts = await db.getAllAsync<{ id: string }>('SELECT id FROM accounts');
  for (const acc of accounts) {
    await recalculateAccountBalance(acc.id);
  }
}

export async function getTotalNetWorth(): Promise<number> {
  const db = await getDatabase();
  const res = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(current_balance), 0) as total FROM accounts WHERE is_archived = 0`
  );
  return res?.total || 0;
}
