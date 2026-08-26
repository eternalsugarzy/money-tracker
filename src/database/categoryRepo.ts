import { getDatabase } from './db';
import { Category } from '../types';

export async function getAllCategories(
  type?: 'all' | 'income' | 'expense',
  includeArchived: boolean = false
): Promise<Category[]> {
  const db = await getDatabase();
  let query = 'SELECT * FROM categories';
  const params: any[] = [];

  const conditions: string[] = [];
  if (!includeArchived) {
    conditions.push('is_archived = 0');
  }
  if (type && type !== 'all') {
    conditions.push('(type = ? OR type = \'all\' OR type IS NULL)');
    params.push(type);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY name ASC';

  return (await db.getAllAsync<Category>(query, params)) || [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDatabase();
  const res = await db.getFirstAsync<Category>('SELECT * FROM categories WHERE id = ?', [id]);
  return res || null;
}

export async function createCategory(
  data: Omit<Category, 'created_at' | 'updated_at'>
): Promise<Category> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const id = data.id || `cat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const type = data.type || 'all';

  await db.runAsync(
    `INSERT INTO categories (id, name, type, icon, icon_family, color, is_archived, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      type,
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
    type,
    created_at: now,
    updated_at: now,
  };
}

export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'created_at'>>
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const current = await getCategoryById(id);
  if (!current) throw new Error('Kategori tidak ditemukan');

  const name = updates.name !== undefined ? updates.name : current.name;
  const type = updates.type !== undefined ? updates.type : (current.type || 'all');
  const icon = updates.icon !== undefined ? updates.icon : current.icon;
  const icon_family = updates.icon_family !== undefined ? updates.icon_family : current.icon_family;
  const color = updates.color !== undefined ? updates.color : current.color;
  const is_archived = updates.is_archived !== undefined ? updates.is_archived : current.is_archived;

  await db.runAsync(
    `UPDATE categories 
     SET name = ?, type = ?, icon = ?, icon_family = ?, color = ?, is_archived = ?, updated_at = ?
     WHERE id = ?`,
    [name, type, icon, icon_family, color, is_archived, now, id]
  );
}

export async function deleteCategory(id: string): Promise<{ action: 'deleted' | 'archived' }> {
  const db = await getDatabase();

  // Check if category is used in transactions or budgets
  const txCount = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM transactions WHERE category_id = ?`,
    [id]
  );
  const budgetCount = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM budgets WHERE category_id = ?`,
    [id]
  );

  const isUsed = (txCount?.count || 0) > 0 || (budgetCount?.count || 0) > 0;

  if (isUsed) {
    await db.runAsync(
      `UPDATE categories SET is_archived = 1, updated_at = ? WHERE id = ?`,
      [new Date().toISOString(), id]
    );
    return { action: 'archived' };
  } else {
    await db.runAsync(`DELETE FROM categories WHERE id = ?`, [id]);
    return { action: 'deleted' };
  }
}
