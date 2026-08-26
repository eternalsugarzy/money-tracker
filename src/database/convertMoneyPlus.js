const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'moneyPlusRawData.csv');
const rawText = fs.readFileSync(csvPath, 'utf8');

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const categoryDefinition = [
  { id: 'cat_makan', name: 'Food (Makanan)', type: 'expense', icon: 'restaurant', color: '#FF5D8F' },
  { id: 'cat_cemilan', name: 'Cemal Cemil', type: 'expense', icon: 'pizza', color: '#FF9E00' },
  { id: 'cat_nongkrong', name: 'Nongkrongs', type: 'expense', icon: 'cafe', color: '#FF7A00' },
  { id: 'cat_parkir', name: 'Ojol, Parkir', type: 'expense', icon: 'car', color: '#00F0FF' },
  { id: 'cat_bahan_makan', name: 'Foodstuffs (Bahan Makanan)', type: 'expense', icon: 'basket', color: '#52B788' },
  { id: 'cat_rumah', name: 'House needs (Kost & Rumah)', type: 'expense', icon: 'home', color: '#3A86FF' },
  { id: 'cat_bensin', name: 'Bensin', type: 'expense', icon: 'speedometer', color: '#FFE600' },
  { id: 'cat_olahraga', name: 'Olahraga', type: 'expense', icon: 'football', color: '#54E346' },
  { id: 'cat_motor', name: 'Perawatan Motor', type: 'expense', icon: 'construct', color: '#8338EC' },
  { id: 'cat_trinity_exp', name: 'TRINITY SCENT (Modal)', type: 'expense', icon: 'sparkles', color: '#D90429' },
  { id: 'cat_trinity_inc', name: 'Trinity Scents (Penjualan)', type: 'income', icon: 'sparkles', color: '#D90429' },
  { id: 'cat_random', name: 'Random Stuff', type: 'expense', icon: 'cube', color: '#A06CD5' },
  { id: 'cat_hiburan', name: 'Hiburan & Rekreasi', type: 'expense', icon: 'game-controller', color: '#A06CD5' },
  { id: 'cat_pet', name: 'Hewan Peliharaan (Pet)', type: 'expense', icon: 'paw', color: '#FF9E00' },
  { id: 'cat_komunikasi', name: 'Komunikasi & Pulsa', type: 'expense', icon: 'phone-portrait', color: '#00F0FF' },
  { id: 'cat_pendidikan', name: 'Pendidikan (Kuliah & Wisuda)', type: 'expense', icon: 'school', color: '#3A86FF' },
  { id: 'cat_perawatan', name: 'Perawatan Diri & Parfum', type: 'expense', icon: 'flower', color: '#FF3366' },
  { id: 'cat_tagihan', name: 'Pajak & Tagihan', type: 'expense', icon: 'receipt', color: '#6C757D' },
  { id: 'cat_pakaian', name: 'Pakaian & Fashion', type: 'expense', icon: 'shirt', color: '#FF5D8F' },
  { id: 'cat_hadiah', name: 'Hadiah & Donasi', type: 'expense', icon: 'gift', color: '#FF7A00' },
  { id: 'cat_travel', name: 'Perjalanan & Travel', type: 'expense', icon: 'airplane', color: '#00B4D8' },
  { id: 'cat_ortu', name: 'Mingguan Ortu', type: 'income', icon: 'cash', color: '#54E346' },
  { id: 'cat_bonus', name: 'Bonus', type: 'income', icon: 'trophy', color: '#FFE600' },
  { id: 'cat_freelance', name: 'Part-time Job', type: 'income', icon: 'briefcase', color: '#00F0FF' },
  { id: 'cat_lainnya', name: 'Lain-lain', type: 'all', icon: 'ellipsis-horizontal-circle', color: '#8338EC' },
];

function resolveAccountId(name) {
  const norm = String(name || '').toLowerCase().trim();
  if (norm.includes('sea') || norm.includes('seabank')) return 'acc_seabank';
  if (norm.includes('bri')) return 'acc_bri';
  if (norm.includes('cash') || norm.includes('tunai')) return 'acc_cash';
  return 'acc_cash';
}

function resolveCategoryId(txType, rawCat, rawName) {
  const c = (String(rawCat || '') + ' ' + String(rawName || '')).toLowerCase();
  
  if (txType === 'income') {
    if (c.includes('trinity')) return 'cat_trinity_inc';
    if (c.includes('parttime') || c.includes('part time') || c.includes('kerja')) return 'cat_freelance';
    if (c.includes('bonus')) return 'cat_bonus';
    if (c.includes('wage') || c.includes('ortu') || c.includes('gaji') || c.includes('mingguan')) return 'cat_ortu';
    return 'cat_ortu';
  }

  // Expense
  if (c.includes('trinity')) return 'cat_trinity_exp';
  if (c.includes('nongkrong')) return 'cat_nongkrong';
  if (c.includes('ojol') || c.includes('parkir')) return 'cat_parkir';
  if (c.includes('foodstuffs') || c.includes('bahan')) return 'cat_bahan_makan';
  if (c.includes('cemal') || c.includes('cemil') || c.includes('snack')) return 'cat_cemilan';
  if (c.includes('house') || c.includes('rumah') || c.includes('kost') || c.includes('kos')) return 'cat_rumah';
  if (c.includes('bensin') || c.includes('bbm')) return 'cat_bensin';
  if (c.includes('olahraga') || c.includes('sport')) return 'cat_olahraga';
  if (c.includes('motor')) return 'cat_motor';
  if (c.includes('recreation') || c.includes('hiburan') || c.includes('game') || c.includes('konser')) return 'cat_hiburan';
  if (c.includes('pet') || c.includes('kucing') || c.includes('grooming')) return 'cat_pet';
  if (c.includes('communication') || c.includes('pulsa') || c.includes('kuota') || c.includes('wifi') || c.includes('icloud')) return 'cat_komunikasi';
  if (c.includes('education') || c.includes('print') || c.includes('kuliah') || c.includes('wisuda')) return 'cat_pendidikan';
  if (c.includes('beautify') || c.includes('parfum') || c.includes('perfume') || c.includes('rambut') || c.includes('skincare')) return 'cat_perawatan';
  if (c.includes('tax') || c.includes('pajak') || c.includes('shopee') || c.includes('utang')) return 'cat_tagihan';
  if (c.includes('dress') || c.includes('sepatu') || c.includes('baju') || c.includes('jersey') || c.includes('pakaian')) return 'cat_pakaian';
  if (c.includes('gift') || c.includes('hadiah') || c.includes('donasi')) return 'cat_hadiah';
  if (c.includes('travel') || c.includes('jas hujan')) return 'cat_travel';
  if (c.includes('random')) return 'cat_random';
  if (c.includes('food') || c.includes('makan') || c.includes('soto') || c.includes('ayam') || c.includes('geprek') || c.includes('nasi')) return 'cat_makan';
  
  return 'cat_lainnya';
}

const transactions = [];
let totalIncome = 0;
let totalExpense = 0;

for (let i = 1; i < lines.length; i++) {
  const cols = splitCsvLine(lines[i]);
  if (cols.length < 5) continue;

  const id = cols[0];
  const rawDateTime = cols[1]; // '2026-01-06 09:53:17'
  const date = rawDateTime.slice(0, 10);
  const rawJenis = cols[2].toLowerCase();
  const rawName = cols[3];
  const rawAcc = cols[4];
  const rawToAcc = cols[5];
  const rawCat = cols[7];
  const amount = Math.abs(parseFloat(cols[8].replace(/[^0-9.]/g, '')) || 0);
  const note = cols[9] || '';

  let type = 'expense';
  let account_id = resolveAccountId(rawAcc);
  let to_account_id = null;
  let category_id = null;

  if (rawJenis.includes('transfer')) {
    type = 'transfer';
    account_id = resolveAccountId(rawAcc);
    to_account_id = resolveAccountId(rawToAcc || rawName);
    if (account_id === to_account_id) {
      if (rawAcc.toUpperCase().includes('BRI')) account_id = 'acc_bri';
      if ((rawToAcc || rawName).toUpperCase().includes('CASH')) to_account_id = 'acc_cash';
    }
  } else if (rawJenis.includes('pemasukan') || rawJenis.includes('income')) {
    type = 'income';
    category_id = resolveCategoryId('income', rawCat, rawName);
    totalIncome += amount;
  } else {
    type = 'expense';
    category_id = resolveCategoryId('expense', rawCat, rawName);
    totalExpense += amount;
  }

  transactions.push({
    id: `tx_mp_${id}`,
    date,
    type,
    amount,
    account_id,
    to_account_id,
    category_id,
    note: note.trim() || rawName.trim() || (type === 'transfer' ? 'Transfer Saldo' : ''),
  });
}

// Exactly 3 authentic accounts from user's data:
const accounts = [
  { id: 'acc_bri', name: 'BRI', type: 'Bank', initial_balance: 0, current_balance: 1920000, icon: 'card', icon_family: 'Ionicons', color: '#00529C' },
  { id: 'acc_cash', name: 'UANG CASH', type: 'Cash', initial_balance: 0, current_balance: 24000, icon: 'cash', icon_family: 'Ionicons', color: '#54E346' },
  { id: 'acc_seabank', name: 'Sea Bank', type: 'Bank', initial_balance: 0, current_balance: 0, icon: 'wallet', icon_family: 'Ionicons', color: '#FF5722' },
];

const outputTs = `// Seed data generated directly from user Money+ authentic backup
export interface SeedTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  account_id: string;
  to_account_id: string | null;
  category_id: string | null;
  note: string;
}

export const SEED_ACCOUNTS = ${JSON.stringify(accounts, null, 2)};

export const SEED_CATEGORIES = ${JSON.stringify(categoryDefinition, null, 2)};

export const SEED_TRANSACTIONS: SeedTransaction[] = ${JSON.stringify(transactions, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'initialMoneyPlusData.ts'), outputTs, 'utf8');
console.log('Successfully generated initialMoneyPlusData.ts!');
