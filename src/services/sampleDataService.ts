import { createTransaction } from '../database/transactionRepo';
import { createBudget } from '../database/budgetRepo';
import { createDebt } from '../database/debtRepo';
import { createRecurring } from '../database/recurringRepo';
import { getAllAccounts } from '../database/accountRepo';
import { getAllCategories } from '../database/categoryRepo';

export async function populateSampleData(): Promise<void> {
  const accounts = await getAllAccounts();
  const categories = await getAllCategories();

  const cashAcc = accounts.find((a) => a.type === 'Cash') || accounts[0];
  const bankAcc = accounts.find((a) => a.type === 'Bank') || accounts[0];
  const ewalletAcc = accounts.find((a) => a.type === 'E-Wallet') || accounts[0];

  const foodCat = categories.find((c) => c.name.includes('Makanan')) || categories[0];
  const transportCat = categories.find((c) => c.name.includes('Transport')) || categories[0];
  const shoppingCat = categories.find((c) => c.name.includes('Belanja')) || categories[0];
  const billsCat = categories.find((c) => c.name.includes('Tagihan')) || categories[0];
  const entertainmentCat = categories.find((c) => c.name.includes('Hiburan')) || categories[0];
  const salaryCat = categories.find((c) => c.name.includes('Gaji')) || categories[0];
  const bonusCat = categories.find((c) => c.name.includes('Bonus')) || categories[0];

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const threeDaysAgoStr = threeDaysAgo.toISOString().slice(0, 10);

  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fiveDaysAgoStr = fiveDaysAgo.toISOString().slice(0, 10);

  // 1. Transactions
  // Income
  await createTransaction({
    type: 'income',
    amount: 12500000,
    date: fiveDaysAgoStr,
    account_id: bankAcc.id,
    to_account_id: null,
    category_id: salaryCat.id,
    note: 'Gaji Bulanan Agustus',
    receipt_images: '[]',
  });

  await createTransaction({
    type: 'income',
    amount: 1500000,
    date: threeDaysAgoStr,
    account_id: ewalletAcc.id,
    to_account_id: null,
    category_id: bonusCat.id,
    note: 'Bonus Project Freelance',
    receipt_images: '[]',
  });

  // Transfer
  await createTransaction({
    type: 'transfer',
    amount: 1000000,
    date: threeDaysAgoStr,
    account_id: bankAcc.id,
    to_account_id: cashAcc.id,
    category_id: null,
    note: 'Tarik Tunai ATM',
    receipt_images: '[]',
  });

  await createTransaction({
    type: 'transfer',
    amount: 500000,
    date: yesterdayStr,
    account_id: bankAcc.id,
    to_account_id: ewalletAcc.id,
    category_id: null,
    note: 'Top up saldo GoPay',
    receipt_images: '[]',
  });

  // Expenses
  await createTransaction({
    type: 'expense',
    amount: 48000,
    date: todayStr,
    account_id: cashAcc.id,
    to_account_id: null,
    category_id: foodCat.id,
    note: 'Makan Siang Nasi Padang & Es Teh',
    receipt_images: '[]',
  });

  await createTransaction({
    type: 'expense',
    amount: 25000,
    date: todayStr,
    account_id: ewalletAcc.id,
    to_account_id: null,
    category_id: transportCat.id,
    note: 'Ojek Online ke Kantor',
    receipt_images: '[]',
  });

  await createTransaction({
    type: 'expense',
    amount: 320000,
    date: yesterdayStr,
    account_id: bankAcc.id,
    to_account_id: null,
    category_id: billsCat.id,
    note: 'Token Listrik PLN 300rb',
    receipt_images: '[]',
  });

  await createTransaction({
    type: 'expense',
    amount: 245000,
    date: yesterdayStr,
    account_id: ewalletAcc.id,
    to_account_id: null,
    category_id: shoppingCat.id,
    note: 'Belanja Bulanan Supermarket',
    receipt_images: '[]',
  });

  await createTransaction({
    type: 'expense',
    amount: 85000,
    date: threeDaysAgoStr,
    account_id: cashAcc.id,
    to_account_id: null,
    category_id: entertainmentCat.id,
    note: 'Tiket Bioskop XXI & Popcorn',
    receipt_images: '[]',
  });

  // 2. Budgets
  const currentMonthStart = `${now.toISOString().slice(0, 7)}-01`;
  await createBudget({
    name: 'Budget Makan & Jajan Bulanan',
    category_id: foodCat.id,
    limit_amount: 1500000,
    period_type: 'monthly',
    start_date: currentMonthStart,
    end_date: null,
  });

  await createBudget({
    name: 'Budget Transportasi Harian',
    category_id: transportCat.id,
    limit_amount: 600000,
    period_type: 'monthly',
    start_date: currentMonthStart,
    end_date: null,
  });

  await createBudget({
    name: 'Budget Belanja & Belanjaan',
    category_id: shoppingCat.id,
    limit_amount: 1000000,
    period_type: 'monthly',
    start_date: currentMonthStart,
    end_date: null,
  });

  // 3. Debts (Hutang-Piutang)
  await createDebt({
    person_name: 'Budi Santoso',
    amount: 350000,
    type: 'receivable', // Piutang (orang berhutang ke saya)
    date: threeDaysAgoStr,
    due_date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-28`,
    status: 'unpaid',
    note: 'Pinjam uang untuk bayar servis motor',
    settled_at: null,
    settled_account_id: null,
  });

  await createDebt({
    person_name: 'Andi Pratama',
    amount: 150000,
    type: 'debt', // Utang (saya berhutang)
    date: fiveDaysAgoStr,
    due_date: null,
    status: 'unpaid',
    note: 'Talangan beli tiket konser',
    settled_at: null,
    settled_account_id: null,
  });

  // 4. Recurring Transaction
  await createRecurring({
    type: 'expense',
    amount: 150000,
    account_id: bankAcc.id,
    to_account_id: null,
    category_id: billsCat.id,
    note: 'Langganan WiFi Rumah Indihome',
    interval: 'monthly',
    start_date: todayStr,
    end_date: null,
    last_prompted_date: null,
    is_active: 1,
  });
}
