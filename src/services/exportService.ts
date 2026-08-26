import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getTransactions } from '../database/transactionRepo';
import { getAllAccounts } from '../database/accountRepo';
import { getAllCategories } from '../database/categoryRepo';
import { getAllDebts } from '../database/debtRepo';
import { getActiveBudgets } from '../database/budgetRepo';

export async function exportTransactionsToCSV(): Promise<string> {
  const transactions = await getTransactions({ period: 'all' });

  let csvContent = 'ID,Tanggal,Tipe,Nominal,Kategori,Akun Asal,Akun Tujuan,Catatan,Foto_Struk_Ada\n';

  transactions.forEach((tx) => {
    const hasReceipt = tx.receipt_images && JSON.parse(tx.receipt_images || '[]').length > 0 ? 'Ya' : 'Tidak';
    const row = [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${tx.type}"`,
      tx.amount,
      `"${(tx.category_name || '').replace(/"/g, '""')}"`,
      `"${(tx.account_name || '').replace(/"/g, '""')}"`,
      `"${(tx.to_account_name || '').replace(/"/g, '""')}"`,
      `"${(tx.note || '').replace(/"/g, '""')}"`,
      `"${hasReceipt}"`,
    ].join(',');
    csvContent += row + '\n';
  });

  const fileName = `MoneyTracker_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
  const file = new File(Paths.document, fileName);
  file.create({ overwrite: true });
  file.write(csvContent);

  const filePath = file.uri;

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'text/csv',
      dialogTitle: 'Bagikan / Ekspor Data CSV',
      UTI: 'public.comma-separated-values-text',
    });
  }

  return filePath;
}

export async function exportFullBackupJSON(): Promise<string> {
  const [accounts, categories, transactions, budgets, debts] = await Promise.all([
    getAllAccounts(true),
    getAllCategories(undefined, true),
    getTransactions({ period: 'all' }),
    getActiveBudgets(),
    getAllDebts(),
  ]);

  const backupData = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    data: {
      accounts,
      categories,
      transactions,
      budgets,
      debts,
    },
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const fileName = `MoneyTracker_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File(Paths.document, fileName);
  file.create({ overwrite: true });
  file.write(jsonString);

  const filePath = file.uri;

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Bagikan File Backup JSON',
      UTI: 'public.json',
    });
  }

  return filePath;
}
