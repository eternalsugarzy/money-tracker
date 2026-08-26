import { type SQLiteDatabase } from 'expo-sqlite';

export async function seedInitialData(db: SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();

  // Universal Default Categories (usable across Income, Expense, Budget, etc.)
  const defaultCategories = [
    { id: 'cat_makan', name: 'Makan', type: 'all', icon: 'restaurant', icon_family: 'Ionicons', color: '#FF5D8F' },
    { id: 'cat_cemilan', name: 'Cemilan & Kopi', type: 'all', icon: 'cafe', icon_family: 'Ionicons', color: '#FF9E00' },
    { id: 'cat_transport', name: 'Transport', type: 'all', icon: 'car', icon_family: 'Ionicons', color: '#00F0FF' },
    { id: 'cat_belanja', name: 'Belanja', type: 'all', icon: 'cart', icon_family: 'Ionicons', color: '#FFE600' },
    { id: 'cat_tagihan', name: 'Tagihan & Listrik', type: 'all', icon: 'flash', icon_family: 'Ionicons', color: '#FF7A00' },
    { id: 'cat_hiburan', name: 'Hiburan & Hobi', type: 'all', icon: 'game-controller', icon_family: 'Ionicons', color: '#A06CD5' },
    { id: 'cat_kesehatan', name: 'Kesehatan', type: 'all', icon: 'medkit', icon_family: 'Ionicons', color: '#FF3366' },
    { id: 'cat_pendidikan', name: 'Pendidikan', type: 'all', icon: 'school', icon_family: 'Ionicons', color: '#3A86FF' },
    { id: 'cat_rumah', name: 'Rumah Tangga', type: 'all', icon: 'home', icon_family: 'Ionicons', color: '#52B788' },
    { id: 'cat_gaji', name: 'Gaji', type: 'all', icon: 'cash', icon_family: 'Ionicons', color: '#54E346' },
    { id: 'cat_bonus', name: 'Bonus & THR', type: 'all', icon: 'trophy', icon_family: 'Ionicons', color: '#FFE600' },
    { id: 'cat_usaha', name: 'Usaha / Freelance', type: 'all', icon: 'briefcase', icon_family: 'Ionicons', color: '#00F0FF' },
    { id: 'cat_investasi', name: 'Investasi', type: 'all', icon: 'trending-up', icon_family: 'Ionicons', color: '#A06CD5' },
    { id: 'cat_hadiah', name: 'Hadiah & Sedekah', type: 'all', icon: 'gift', icon_family: 'Ionicons', color: '#FF5D8F' },
    { id: 'cat_lainnya', name: 'Lainnya', type: 'all', icon: 'ellipsis-horizontal-circle', icon_family: 'Ionicons', color: '#8338EC' },
  ];

  for (const cat of defaultCategories) {
    await db.runAsync(
      `INSERT OR IGNORE INTO categories (id, name, type, icon, icon_family, color, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [cat.id, cat.name, cat.type, cat.icon, cat.icon_family, cat.color, now, now]
    );
  }

  // Default Initial Accounts
  const defaultAccounts = [
    { id: 'acc_cash', name: 'Dompet Tunai', type: 'Cash', initial_balance: 500000, current_balance: 500000, icon: 'cash', icon_family: 'Ionicons', color: '#54E346' },
    { id: 'acc_bca', name: 'Rekening Bank (BCA)', type: 'Bank', initial_balance: 5000000, current_balance: 5000000, icon: 'card', icon_family: 'Ionicons', color: '#3A86FF' },
    { id: 'acc_gopay', name: 'GoPay / E-Wallet', type: 'E-Wallet', initial_balance: 350000, current_balance: 350000, icon: 'wallet', icon_family: 'Ionicons', color: '#00F0FF' },
  ];

  for (const acc of defaultAccounts) {
    await db.runAsync(
      `INSERT OR IGNORE INTO accounts (id, name, type, initial_balance, current_balance, icon, icon_family, color, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [acc.id, acc.name, acc.type, acc.initial_balance, acc.current_balance, acc.icon, acc.icon_family, acc.color, now, now]
    );
  }
}
