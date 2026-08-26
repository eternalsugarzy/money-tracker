import { getDatabase } from './db';
import { Transaction, TransactionFilterOptions, SummaryData, CategorySpendingSummary } from '../types';
import { recalculateAccountBalance } from './accountRepo';

export async function getTransactions(filter?: TransactionFilterOptions): Promise<Transaction[]> {
  const db = await getDatabase();
  let query = `
    SELECT 
      t.*,
      c.name as category_name,
      c.icon as category_icon,
      c.icon_family as category_icon_family,
      c.color as category_color,
      a.name as account_name,
      a.icon as account_icon,
      a.color as account_color,
      ta.name as to_account_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN accounts a ON t.account_id = a.id
    LEFT JOIN accounts ta ON t.to_account_id = ta.id
  `;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filter) {
    // Period filter
    const now = new Date();
    if (filter.period === 'day') {
      const todayStr = now.toISOString().slice(0, 10);
      conditions.push(`t.date LIKE ?`);
      params.push(`${todayStr}%`);
    } else if (filter.period === 'week') {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startOfWeek.setDate(diff);
      const startStr = startOfWeek.toISOString().slice(0, 10);
      conditions.push(`t.date >= ?`);
      params.push(startStr);
    } else if (filter.period === 'month') {
      const currentMonthStr = now.toISOString().slice(0, 7);
      conditions.push(`t.date LIKE ?`);
      params.push(`${currentMonthStr}%`);
    } else if (filter.period === 'year') {
      const currentYearStr = now.getFullYear().toString();
      conditions.push(`t.date LIKE ?`);
      params.push(`${currentYearStr}%`);
    } else if (filter.period === 'custom' && filter.startDate && filter.endDate) {
      conditions.push(`t.date >= ? AND t.date <= ?`);
      params.push(filter.startDate, filter.endDate + 'T23:59:59');
    }

    // Type filter
    if (filter.type && filter.type !== 'all' && filter.type !== 'debt') {
      conditions.push(`t.type = ?`);
      params.push(filter.type);
    }

    // Account filter
    if (filter.accountId) {
      conditions.push(`(t.account_id = ? OR t.to_account_id = ?)`);
      params.push(filter.accountId, filter.accountId);
    }

    // Category filter (multi-select)
    if (filter.categoryIds && filter.categoryIds.length > 0) {
      const placeholders = filter.categoryIds.map(() => '?').join(',');
      conditions.push(`t.category_id IN (${placeholders})`);
      params.push(...filter.categoryIds);
    }

    // Search query
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const term = `%${filter.searchQuery.trim()}%`;
      conditions.push(`(t.note LIKE ? OR CAST(t.amount AS TEXT) LIKE ? OR c.name LIKE ? OR a.name LIKE ?)`);
      params.push(term, term, term, term);
    }
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY t.date DESC, t.created_at DESC';

  return (await db.getAllAsync<Transaction>(query, params)) || [];
}

export async function getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
  const db = await getDatabase();
  const query = `
    SELECT 
      t.*,
      c.name as category_name,
      c.icon as category_icon,
      c.icon_family as category_icon_family,
      c.color as category_color,
      a.name as account_name,
      a.icon as account_icon,
      a.color as account_color,
      ta.name as to_account_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN accounts a ON t.account_id = a.id
    LEFT JOIN accounts ta ON t.to_account_id = ta.id
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT ?
  `;
  return (await db.getAllAsync<Transaction>(query, [limit])) || [];
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const db = await getDatabase();
  const query = `
    SELECT 
      t.*,
      c.name as category_name,
      c.icon as category_icon,
      c.icon_family as category_icon_family,
      c.color as category_color,
      a.name as account_name,
      a.icon as account_icon,
      a.color as account_color,
      ta.name as to_account_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN accounts a ON t.account_id = a.id
    LEFT JOIN accounts ta ON t.to_account_id = ta.id
    WHERE t.id = ?
  `;
  const res = await db.getFirstAsync<Transaction>(query, [id]);
  return res || null;
}

export async function createTransaction(
  data: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'category_name' | 'account_name' | 'to_account_name'>
): Promise<Transaction> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const receipt_images = data.receipt_images || '[]';

  await db.runAsync(
    `INSERT INTO transactions (id, type, amount, date, account_id, to_account_id, category_id, note, receipt_images, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.type,
      data.amount,
      data.date,
      data.account_id,
      data.to_account_id,
      data.category_id,
      data.note || '',
      receipt_images,
      now,
      now,
    ]
  );

  // Recalculate affected accounts
  if (data.account_id) {
    await recalculateAccountBalance(data.account_id);
  }
  if (data.to_account_id) {
    await recalculateAccountBalance(data.to_account_id);
  }

  const created = await getTransactionById(id);
  return created!;
}

export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, 'id' | 'created_at'>>
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const current = await getTransactionById(id);
  if (!current) throw new Error('Transaksi tidak ditemukan');

  const oldAccountId = current.account_id;
  const oldToAccountId = current.to_account_id;

  const type = updates.type !== undefined ? updates.type : current.type;
  const amount = updates.amount !== undefined ? updates.amount : current.amount;
  const date = updates.date !== undefined ? updates.date : current.date;
  const account_id = updates.account_id !== undefined ? updates.account_id : current.account_id;
  const to_account_id = updates.to_account_id !== undefined ? updates.to_account_id : current.to_account_id;
  const category_id = updates.category_id !== undefined ? updates.category_id : current.category_id;
  const note = updates.note !== undefined ? updates.note : current.note;
  const receipt_images = updates.receipt_images !== undefined ? updates.receipt_images : current.receipt_images;

  await db.runAsync(
    `UPDATE transactions 
     SET type = ?, amount = ?, date = ?, account_id = ?, to_account_id = ?, category_id = ?, note = ?, receipt_images = ?, updated_at = ?
     WHERE id = ?`,
    [type, amount, date, account_id, to_account_id, category_id, note, receipt_images, now, id]
  );

  // Recalculate balances
  const accountsToUpdate = new Set<string>();
  if (oldAccountId) accountsToUpdate.add(oldAccountId);
  if (oldToAccountId) accountsToUpdate.add(oldToAccountId);
  if (account_id) accountsToUpdate.add(account_id);
  if (to_account_id) accountsToUpdate.add(to_account_id);

  for (const accId of accountsToUpdate) {
    await recalculateAccountBalance(accId);
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDatabase();
  const current = await getTransactionById(id);
  if (!current) return;

  const accountId = current.account_id;
  const toAccountId = current.to_account_id;

  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);

  if (accountId) await recalculateAccountBalance(accountId);
  if (toAccountId) await recalculateAccountBalance(toAccountId);
}

export async function getSummaryForPeriod(
  period: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom',
  customStart?: string,
  customEnd?: string
): Promise<SummaryData> {
  const db = await getDatabase();
  const now = new Date();
  let dateCondition = '';
  const params: any[] = [];

  if (period === 'day') {
    const todayStr = now.toISOString().slice(0, 10);
    dateCondition = 'WHERE date LIKE ?';
    params.push(`${todayStr}%`);
  } else if (period === 'week') {
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    dateCondition = 'WHERE date >= ?';
    params.push(startOfWeek.toISOString().slice(0, 10));
  } else if (period === 'month') {
    const currentMonthStr = now.toISOString().slice(0, 7);
    dateCondition = 'WHERE date LIKE ?';
    params.push(`${currentMonthStr}%`);
  } else if (period === 'year') {
    const currentYearStr = now.getFullYear().toString();
    dateCondition = 'WHERE date LIKE ?';
    params.push(`${currentYearStr}%`);
  } else if (period === 'custom' && customStart && customEnd) {
    dateCondition = 'WHERE date >= ? AND date <= ?';
    params.push(customStart, customEnd + 'T23:59:59');
  }

  const incRes = await db.getFirstAsync<{ sum: number }>(
    `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions ${dateCondition ? dateCondition + " AND type = 'income'" : "WHERE type = 'income'"}`,
    params
  );

  const expRes = await db.getFirstAsync<{ sum: number }>(
    `SELECT COALESCE(SUM(amount), 0) as sum FROM transactions ${dateCondition ? dateCondition + " AND type = 'expense'" : "WHERE type = 'expense'"}`,
    params
  );

  const totalBalRes = await db.getFirstAsync<{ sum: number }>(
    `SELECT COALESCE(SUM(current_balance), 0) as sum FROM accounts WHERE is_archived = 0`
  );

  const totalIncome = incRes?.sum || 0;
  const totalExpense = expRes?.sum || 0;
  const netSavings = totalIncome - totalExpense;
  const totalBalance = totalBalRes?.sum || 0;

  return { totalIncome, totalExpense, netSavings, totalBalance };
}

export async function getCategorySpendingBreakdown(
  period: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom',
  customStart?: string,
  customEnd?: string
): Promise<CategorySpendingSummary[]> {
  const db = await getDatabase();
  const now = new Date();
  let dateCondition = "WHERE t.type = 'expense'";
  const params: any[] = [];

  if (period === 'day') {
    const todayStr = now.toISOString().slice(0, 10);
    dateCondition += ' AND t.date LIKE ?';
    params.push(`${todayStr}%`);
  } else if (period === 'week') {
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    dateCondition += ' AND t.date >= ?';
    params.push(startOfWeek.toISOString().slice(0, 10));
  } else if (period === 'month') {
    const currentMonthStr = now.toISOString().slice(0, 7);
    dateCondition += ' AND t.date LIKE ?';
    params.push(`${currentMonthStr}%`);
  } else if (period === 'year') {
    dateCondition += ' AND t.date LIKE ?';
    params.push(`${now.getFullYear()}%`);
  } else if (period === 'custom' && customStart && customEnd) {
    dateCondition += ' AND t.date >= ? AND t.date <= ?';
    params.push(customStart, customEnd + 'T23:59:59');
  }

  const query = `
    SELECT 
      c.id as categoryId,
      COALESCE(c.name, 'Lain-lain') as categoryName,
      COALESCE(c.icon, 'help-circle') as categoryIcon,
      COALESCE(c.icon_family, 'Ionicons') as categoryIconFamily,
      COALESCE(c.color, '#FF5D8F') as categoryColor,
      SUM(t.amount) as totalSpent,
      COUNT(t.id) as transactionCount
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    ${dateCondition}
    GROUP BY t.category_id
    ORDER BY totalSpent DESC
  `;

  const results = (await db.getAllAsync<any>(query, params)) || [];
  const total = results.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);

  return results.map((item) => ({
    categoryId: item.categoryId || 'unknown',
    categoryName: item.categoryName,
    categoryIcon: item.categoryIcon,
    categoryIconFamily: item.categoryIconFamily,
    categoryColor: item.categoryColor,
    totalSpent: item.totalSpent,
    percentage: total > 0 ? (item.totalSpent / total) * 100 : 0,
    transactionCount: item.transactionCount,
  }));
}
