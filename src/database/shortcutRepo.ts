import { getDatabase } from './db';
import { QuickShortcut } from '../types';

export async function getAllShortcuts(): Promise<QuickShortcut[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(`
    SELECT 
      s.*,
      c.name as category_name,
      a.name as account_name
    FROM shortcuts s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN accounts a ON s.account_id = a.id
    ORDER BY s.created_at ASC
  `);

  // Robust deduplication by lowercase title to guarantee no duplicates
  const seen = new Set<string>();
  const uniqueList: QuickShortcut[] = [];

  for (const r of rows) {
    const key = (r.title || '').trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push({
        id: r.id,
        title: r.title,
        emoji: r.emoji,
        amount: r.amount,
        category_id: r.category_id,
        account_id: r.account_id,
        type: r.type || 'expense',
        created_at: r.created_at,
        category_name: r.category_name,
        account_name: r.account_name,
      });
    }
  }

  return uniqueList;
}

export async function insertShortcut(
  shortcut: Omit<QuickShortcut, 'id' | 'created_at'>
): Promise<QuickShortcut> {
  const db = await getDatabase();
  const id = `sc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Delete any existing shortcut with the same title to avoid duplicate
  await db.runAsync('DELETE FROM shortcuts WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))', [shortcut.title]);

  await db.runAsync(
    `INSERT INTO shortcuts (id, title, emoji, amount, category_id, account_id, type, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      shortcut.title.trim(),
      shortcut.emoji || '⚡',
      shortcut.amount,
      shortcut.category_id || null,
      shortcut.account_id || null,
      shortcut.type || 'expense',
      now,
    ]
  );

  return {
    id,
    title: shortcut.title.trim(),
    emoji: shortcut.emoji || '⚡',
    amount: shortcut.amount,
    category_id: shortcut.category_id || null,
    account_id: shortcut.account_id || null,
    type: shortcut.type || 'expense',
    created_at: now,
  };
}

export async function updateShortcut(
  id: string,
  updates: Partial<Omit<QuickShortcut, 'id' | 'created_at'>>
): Promise<void> {
  const db = await getDatabase();
  const current = await db.getFirstAsync<any>('SELECT * FROM shortcuts WHERE id = ?', [id]);
  if (!current) return;

  const title = (updates.title !== undefined ? updates.title : current.title).trim();
  const emoji = updates.emoji !== undefined ? updates.emoji : current.emoji;
  const amount = updates.amount !== undefined ? updates.amount : current.amount;
  const category_id = updates.category_id !== undefined ? updates.category_id : current.category_id;
  const account_id = updates.account_id !== undefined ? updates.account_id : current.account_id;
  const type = updates.type !== undefined ? updates.type : current.type;

  await db.runAsync(
    `UPDATE shortcuts 
     SET title = ?, emoji = ?, amount = ?, category_id = ?, account_id = ?, type = ?
     WHERE id = ?`,
    [title, emoji, amount, category_id, account_id, type, id]
  );
}

export async function deleteShortcut(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM shortcuts WHERE id = ?', [id]);
}

export async function seedDefaultShortcutsIfEmpty(): Promise<void> {
  const db = await getDatabase();

  // First, clean any duplicate entries in SQLite
  try {
    await db.execAsync(`
      DELETE FROM shortcuts 
      WHERE id NOT IN (
        SELECT MIN(id) FROM shortcuts GROUP BY LOWER(TRIM(title))
      );
    `);
  } catch (e) {
    // ignore
  }

  const countRes = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM shortcuts');
  if (countRes && countRes.count > 0) return;

  const firstCat = await db.getFirstAsync<{ id: string }>('SELECT id FROM categories LIMIT 1');
  const catId = firstCat?.id || null;

  const defaults = [
    { id: 'sc_def_kopi', title: 'Kopi / Cafe', emoji: '☕', amount: 25000, type: 'expense' as const },
    { id: 'sc_def_makan', title: 'Makan Siang', emoji: '🍽️', amount: 35000, type: 'expense' as const },
    { id: 'sc_def_bensin', title: 'Bensin BBM', emoji: '⛽', amount: 50000, type: 'expense' as const },
    { id: 'sc_def_supermarket', title: 'Supermarket', emoji: '🛒', amount: 100000, type: 'expense' as const },
  ];

  for (const item of defaults) {
    await db.runAsync(
      `INSERT OR IGNORE INTO shortcuts (id, title, emoji, amount, category_id, account_id, type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.id, item.title, item.emoji, item.amount, catId, null, item.type, new Date().toISOString()]
    );
  }
}
