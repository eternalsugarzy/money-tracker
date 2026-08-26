import * as FileSystem from 'expo-file-system';
import { getDatabase } from '../database/db';
import { createTransaction } from '../database/transactionRepo';
import { getAllAccounts, createAccount, recalculateAccountBalance } from '../database/accountRepo';
import { getAllCategories, createCategory } from '../database/categoryRepo';

export interface ImportResult {
  success: boolean;
  importedCount: number;
  accountsCreated: number;
  categoriesCreated: number;
  message: string;
}

/**
 * Smart parser for Money+ CSV / JSON data
 */
export async function importDataFromMoneyPlus(
  fileContent: string
): Promise<ImportResult> {
  const trimmed = fileContent.trim();
  if (!trimmed) {
    return {
      success: false,
      importedCount: 0,
      accountsCreated: 0,
      categoriesCreated: 0,
      message: 'File kosong atau tidak dapat dibaca.',
    };
  }

  // 1. Check if JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseAndImportJSON(trimmed);
  }

  // 2. Otherwise treat as CSV
  return parseAndImportCSV(trimmed);
}

async function parseAndImportJSON(jsonStr: string): Promise<ImportResult> {
  try {
    const data = JSON.parse(jsonStr);
    let rawTransactions: any[] = [];

    if (Array.isArray(data)) {
      rawTransactions = data;
    } else if (data.transactions && Array.isArray(data.transactions)) {
      rawTransactions = data.transactions;
    } else {
      return {
        success: false,
        importedCount: 0,
        accountsCreated: 0,
        categoriesCreated: 0,
        message: 'Format JSON tidak dikenali. Tidak ada daftar transaksi.',
      };
    }

    return processNormalizedRecords(rawTransactions);
  } catch (err: any) {
    return {
      success: false,
      importedCount: 0,
      accountsCreated: 0,
      categoriesCreated: 0,
      message: `Gagal membaca JSON: ${err?.message || 'Format tidak valid'}`,
    };
  }
}

async function parseAndImportCSV(csvStr: string): Promise<ImportResult> {
  try {
    const lines = csvStr
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) {
      return {
        success: false,
        importedCount: 0,
        accountsCreated: 0,
        categoriesCreated: 0,
        message: 'File CSV tidak memiliki baris data transaksi.',
      };
    }

    // Header parser
    const headerLine = lines[0].toLowerCase();
    const headers = splitCsvLine(headerLine);

    // Map column indices
    const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('tanggal') || h.includes('waktu') || h.includes('time'));
    const typeIdx = headers.findIndex((h) => h.includes('type') || h.includes('tipe') || h.includes('jenis') || h.includes('income/expense'));
    const amountIdx = headers.findIndex((h) => h.includes('amount') || h.includes('nominal') || h.includes('jumlah') || h.includes('total') || h.includes('rp') || h.includes('idr'));
    const catIdx = headers.findIndex((h) => h.includes('category') || h.includes('kategori') || h.includes('pos'));
    const accIdx = headers.findIndex((h) => h.includes('account') || h.includes('akun') || h.includes('dompet') || h.includes('wallet') || h.includes('bank'));
    const noteIdx = headers.findIndex((h) => h.includes('note') || h.includes('catatan') || h.includes('keterangan') || h.includes('deskripsi') || h.includes('memo') || h.includes('description'));

    const records: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = splitCsvLine(lines[i]);
      if (cols.length < 2) continue;

      const rawDate = dateIdx >= 0 ? cols[dateIdx] : new Date().toISOString().slice(0, 10);
      const rawType = typeIdx >= 0 ? cols[typeIdx] : 'expense';
      const rawAmount = amountIdx >= 0 ? cols[amountIdx] : '0';
      const rawCat = catIdx >= 0 ? cols[catIdx] : 'Lain-lain';
      const rawAcc = accIdx >= 0 ? cols[accIdx] : 'Utama';
      const rawNote = noteIdx >= 0 ? cols[noteIdx] : '';

      records.push({
        date: rawDate,
        type: rawType,
        amount: rawAmount,
        category: rawCat,
        account: rawAcc,
        note: rawNote,
      });
    }

    return processNormalizedRecords(records);
  } catch (err: any) {
    return {
      success: false,
      importedCount: 0,
      accountsCreated: 0,
      categoriesCreated: 0,
      message: `Gagal memproses CSV: ${err?.message || 'Format tidak valid'}`,
    };
  }
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if ((char === ',' || char === ';') && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

async function processNormalizedRecords(records: any[]): Promise<ImportResult> {
  const existingAccounts = await getAllAccounts(true);
  const existingCategories = await getAllCategories('all', true);

  const accountMap = new Map<string, string>(); // name.toLowerCase() -> id
  existingAccounts.forEach((a) => accountMap.set(a.name.toLowerCase().trim(), a.id));

  const categoryMap = new Map<string, string>(); // name.toLowerCase() -> id
  existingCategories.forEach((c) => categoryMap.set(c.name.toLowerCase().trim(), c.id));

  let accountsCreated = 0;
  let categoriesCreated = 0;
  let importedCount = 0;

  // Ensure default account exists
  let defaultAccountId = existingAccounts[0]?.id;
  if (!defaultAccountId) {
    const acc = await createAccount({
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: 'Dompet Tunai',
      type: 'Cash',
      initial_balance: 0,
      icon: 'cash',
      icon_family: 'Ionicons',
      color: '#54E346',
      is_archived: 0,
    });
    defaultAccountId = acc.id;
    accountMap.set('dompet tunai', acc.id);
    accountsCreated++;
  }

  for (const item of records) {
    // 1. Clean Amount
    let nominal = 0;
    if (typeof item.amount === 'number') {
      nominal = Math.abs(item.amount);
    } else {
      const cleanStr = String(item.amount || '0')
        .replace(/[^0-9.-]/g, '')
        .replace(/,/g, '.');
      nominal = Math.abs(parseFloat(cleanStr) || 0);
    }
    if (nominal <= 0) continue;

    // 2. Clean Type
    let type: 'income' | 'expense' | 'transfer' = 'expense';
    const typeStr = String(item.type || '').toLowerCase();
    if (typeStr.includes('inc') || typeStr.includes('masuk') || typeStr.includes('pemasukan') || typeStr.includes('income')) {
      type = 'income';
    } else if (typeStr.includes('trans') || typeStr.includes('pindah')) {
      type = 'transfer';
    } else {
      type = 'expense';
    }

    // 3. Clean Date
    let dateStr = new Date().toISOString();
    try {
      const rawDate = String(item.date || item.created_at || '').trim();
      if (rawDate) {
        const parsedDate = new Date(rawDate);
        if (!isNaN(parsedDate.getTime())) {
          dateStr = parsedDate.toISOString();
        }
      }
    } catch (e) {
      dateStr = new Date().toISOString();
    }

    // 4. Resolve Account
    const accName = String(item.account || item.account_name || 'Utama').trim();
    const accKey = accName.toLowerCase();
    let accountId = accountMap.get(accKey);

    if (!accountId && accName) {
      const newAcc = await createAccount({
        id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: accName,
        type: 'Cash',
        initial_balance: 0,
        icon: 'wallet',
        icon_family: 'Ionicons',
        color: '#FFE600',
        is_archived: 0,
      });
      accountId = newAcc.id;
      accountMap.set(accKey, newAcc.id);
      accountsCreated++;
    }
    if (!accountId) accountId = defaultAccountId;

    // 5. Resolve Category
    const catName = String(item.category || item.category_name || (type === 'income' ? 'Pemasukan Lain' : 'Pengeluaran Lain')).trim();
    const catKey = catName.toLowerCase();
    let categoryId = categoryMap.get(catKey);

    if (!categoryId && catName) {
      const newCat = await createCategory({
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: catName,
        type: 'all',
        icon: type === 'income' ? 'wallet-outline' : 'receipt-outline',
        icon_family: 'Ionicons',
        color: type === 'income' ? '#54E346' : '#FF5D8F',
        is_archived: 0,
      });
      categoryId = newCat.id;
      categoryMap.set(catKey, newCat.id);
      categoriesCreated++;
    }

    // 6. Insert Transaction
    await createTransaction({
      type,
      amount: nominal,
      date: dateStr,
      account_id: accountId,
      to_account_id: null,
      category_id: categoryId || null,
      note: String(item.note || item.memo || item.description || ''),
      receipt_images: '[]',
    });

    importedCount++;
  }

  // Recalculate all accounts balances
  for (const accId of accountMap.values()) {
    await recalculateAccountBalance(accId);
  }

  return {
    success: true,
    importedCount,
    accountsCreated,
    categoriesCreated,
    message: `Berhasil mengimpor ${importedCount} transaksi, ${accountsCreated} akun baru, dan ${categoriesCreated} kategori baru dari Money+!`,
  };
}
