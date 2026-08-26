import React, { createContext, useContext, useState } from 'react';

export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Navigation / Tabs
    home: 'Home',
    transactions: 'Transaksi',
    budget: 'Budget',
    more: 'Lainnya',
    add: 'Tambah',

    // Common / Global
    save: 'SIMPAN',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Edit',
    back: 'Kembali',
    close: 'Tutup',
    done: 'Selesai',
    search: 'Cari',
    filter: 'Filter',
    reset: 'Reset',
    success: 'Sukses',
    error: 'Error',
    warning: 'Peringatan',
    all: 'Semua',
    day: 'Hari ini',
    week: 'Minggu ini',
    month: 'Bulan ini',
    year: 'Tahun ini',
    customPeriod: 'Kustom',
    loading: 'Memuat...',

    // Top App Header
    appSubTitle: 'SUGARZY FINANCE TRACKER',
    appName: 'SUFIKER+',

    // Home Screen
    totalNetWorth: 'TOTAL SALDO BERSIH (NET WORTH)',
    manageAccounts: 'Kelola Akun >',
    financialHealth: 'SKOR KESEHATAN KEUANGAN',
    healthyStatus: 'SEHAT FINANSIAL',
    stableStatus: 'CUKUP STABIL',
    warningStatus: 'WASPADA (DEFISIT)',
    healthyDesc: 'Keren! Kamu berhasil menabung dari pemasukanmu.',
    stableDesc: 'Keuangan cukup stabil. Pertahankan pengeluaran agar tabungan bertambah.',
    warningDesc: 'Pengeluaran mendekati atau melebihi pemasukan. Evaluasi budgetmu.',
    budgetWarning: 'PERINGATAN BUDGET BULANAN',
    quickAdd: '⚡ CATAT CEPAT (1-TAP INSTAN)',
    manage: 'Kelola',
    addNew: 'Tambah',
    summary: 'RINGKASAN',
    income: 'PEMASUKAN',
    expense: 'PENGELUARAN',
    transfer: 'TRANSFER',
    debtTab: 'HUTANG',
    netSavings: 'SELISIH BERSIH',
    categoryCharts: 'GRAFIK KATEGORI',
    recentTransactions: 'TRANSAKSI TERBARU',
    viewAll: 'Lihat Semua >',
    noTransactions: 'Belum ada transaksi. Tekan tombol ➕ di bawah untuk mencatat!',
    instantTxRecorded: '⚡ Transaksi Langsung Tercatat!',
    instantTxSuccess: 'berhasil dicatat secara instan.',

    // Settings Screen
    settings: 'PENGATURAN',
    appearance: 'TAMPILAN & TEMA',
    darkMode: 'Mode Gelap (Dark Mode)',
    darkModeSub: 'Gunakan tema gelap kontras tinggi Neo-Brutalism',
    languageSection: 'PILIHAN BAHASA (LANGUAGE)',
    indonesian: 'Bahasa Indonesia (ID)',
    english: 'English (US)',
    notifications: 'NOTIFIKASI & PENGINGAT',
    dailyReminder: 'Pengingat Harian Catat Keuangan',
    dailyReminderSub: 'Notifikasi harian pukul 20:00 malam',
    dataManagement: 'MANAJEMEN DATA',
    generateSample: 'Isi Data Simulasi Demo',
    generateSampleSub: 'Tambahkan data transaksi contoh untuk mencoba seluruh fitur',
    resetData: 'Reset Seluruh Database',
    resetDataSub: 'Hapus semua data dan kembalikan ke kondisi awal',
    aboutApp: 'TENTANG APLIKASI',
    createdBy: 'Dibuat dengan ❤️ oleh',
    rightsReserved: 'All rights reserved.',

    // More Screen
    mainMenu: 'MENU UTAMA',
    analyticsTitle: 'STATISTIK & TREND LENGKAP',
    analyticsMenu: 'Statistik & Trend Keuangan',
    analyticsSub: 'Analisis visual pemasukan, pengeluaran, perbandingan & tren saldo',
    savingsGoalsTitle: 'CELENGAN & TARGET IMPIAN',
    savingsMenu: 'Celengan & Target Impian',
    savingsSub: 'Simpan dan pantau progress tabungan tujuanmu',
    accountsMenu: 'Akun & Dompet',
    categoriesMenu: 'Kategori Keuangan',
    debtsMenu: 'Hutang - Piutang',
    recurringMenu: 'Transaksi Berulang (Recurring)',
    exportMenu: 'Laporan & Ekspor Data',
    aboutDesc: 'Aplikasi Pencatatan Keuangan iOS dengan Desain Neo-Brutalism, Built-in Calculator, Multi-Account & Offline SQLite.',

    // Transactions Screen
    transactionsTitle: 'RIWAYAT TRANSAKSI',
    searchPlaceholder: 'Cari transaksi atau catatan...',
    allTypes: 'Semua Tipe',
    netDiff: 'Selisih Net',
    noTxFiltered: 'Tidak ada transaksi yang cocok dengan filter.',
    filterDrawer: 'FILTER LANJUTAN',
    selectAccount: 'Pilih Akun / Dompet',
    selectCategory: 'Pilih Kategori',
    applyFilter: 'TERAPKAN FILTER',
    clearFilter: 'RESET FILTER',

    // Transaction Detail Screen
    txDetailTitle: 'DETAIL TRANSAKSI',
    nominal: 'Nominal',
    account: 'Akun / Dompet',
    category: 'Kategori',
    date: 'Tanggal',
    note: 'Catatan',
    receiptAttachment: 'Lampiran Struk',
    deleteTxConfirm: 'Apakah Anda yakin ingin menghapus transaksi ini? Saldo akun akan dikoreksi kembali otomatis.',

    // Add Transaction Modal
    addTxTitle: 'CATAT TRANSAKSI',
    editTxTitle: 'EDIT TRANSAKSI',
    fromAccount: 'Dari Akun',
    toAccount: 'Ke Akun',
    selectCatPrompt: 'PILIH KATEGORI',
    noteOptional: 'Catatan tambahan (opsional)...',
    attachReceipt: 'Lampirkan Foto Struk',
    saveTransaction: 'SIMPAN TRANSAKSI',

    // Budget Screen
    budgetTitle: 'ANGGARAN & BUDGET',
    activeBudgets: 'Budget Aktif',
    historyBudgets: 'Riwayat Bulan Lalu',
    addBudget: '+ PASANG BUDGET',
    spent: 'Terpakai',
    remaining: 'Sisa',
    overBudget: 'Over Budget',
    noBudgets: 'Belum ada anggaran bulanan aktif.',

    // Budget Form Modal
    newBudgetTitle: 'PASANG BUDGET BARU',
    editBudgetTitle: 'EDIT BUDGET',
    budgetName: 'Nama Budget',
    budgetLimit: 'Batas Anggaran Bulanan',
    saveBudget: 'SIMPAN BUDGET',

    // Celengan / Savings Goals
    savingsTitle: 'CELENGAN & TARGET IMPIAN',
    targetAccumulation: 'AKUMULASI CELENGAN IMPIAN',
    savingsList: 'DAFTAR TARGET TABUNGAN',
    addSavings: '+ ISI TABUNGAN',
    createGoal: '+ BUAT TARGET SEKARANG',
    currentSaved: 'Terkumpul',
    targetAmount: 'Target',
    depositPrompt: 'Setor Nominal Tabungan',

    // Accounts Screen & Form
    accountsTitle: 'AKUN & DOMPET',
    addAccount: '+ TAMBAH AKUN',
    initialBalance: 'Saldo Awal',
    currentBalance: 'Saldo Saat Ini',
    saveAccount: 'SIMPAN AKUN',

    // Categories Screen & Form
    categoriesTitle: 'KATEGORI KEUANGAN',
    addCategory: '+ TAMBAH KATEGORI',
    categoryName: 'Nama Kategori',
    saveCategory: 'SIMPAN KATEGORI',

    // Debts Screen & Form
    debtsTitle: 'HUTANG - PIUTANG',
    receivableTab: 'Piutang (Orang Berhutang ke Saya)',
    payableTab: 'Utang (Saya Berhutang ke Orang)',
    addDebt: '+ CATAT HUTANG/PIUTANG',
    personName: 'Nama Orang / Pihak',
    dueDate: 'Jatuh Tempo',
    markAsPaid: 'Tandai Lunas',
    unpaid: 'Belum Lunas',
    paid: 'Lunas',

    // Recurring Screen & Form
    recurringTitle: 'TRANSAKSI BERULANG',
    addRecurring: '+ TEMPLATE BARU',
    interval: 'Frekuensi Pengulangan',
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    yearly: 'Tahunan',

    // Export & Import Screen
    exportTitle: 'LAPORAN & DATA',
    importMoneyPlusTitle: 'Impor Data dari Money+ (CSV / JSON)',
    importMoneyPlusDesc: 'Pindahkan seluruh riwayat transaksi lama dari aplikasi Money+ atau spreadsheet Excel secara otomatis.',
    pickFile: 'PILIH FILE',
    pasteText: 'PASTE TEKS',
    exportCsvTitle: 'Ekspor Transaksi ke CSV (Excel)',
    exportCsvBtn: 'EKSPOR FILE CSV',
    exportJsonTitle: 'Full Backup JSON',
    exportJsonBtn: 'EKSPOR FULL BACKUP JSON',
  },
  en: {
    // Navigation / Tabs
    home: 'Home',
    transactions: 'Transactions',
    budget: 'Budget',
    more: 'More',
    add: 'Add',

    // Common / Global
    save: 'SAVE',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    close: 'Close',
    done: 'Done',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    all: 'All',
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
    customPeriod: 'Custom',
    loading: 'Loading...',

    // Top App Header
    appSubTitle: 'SUGARZY FINANCE TRACKER',
    appName: 'SUFIKER+',

    // Home Screen
    totalNetWorth: 'TOTAL NET WORTH',
    manageAccounts: 'Manage Accounts >',
    financialHealth: 'FINANCIAL HEALTH SCORE',
    healthyStatus: 'FINANCIALLY HEALTHY',
    stableStatus: 'FAIRLY STABLE',
    warningStatus: 'WARNING (DEFICIT)',
    healthyDesc: 'Great! You are successfully saving from your income.',
    stableDesc: 'Finances are fairly stable. Keep spending low to boost your savings rate.',
    warningDesc: 'Expenses are nearing or exceeding your income. Review your budget.',
    budgetWarning: 'MONTHLY BUDGET ALERT',
    quickAdd: '⚡ 1-TAP QUICK RECORD',
    manage: 'Manage',
    addNew: 'Add',
    summary: 'SUMMARY',
    income: 'INCOME',
    expense: 'EXPENSE',
    transfer: 'TRANSFER',
    debtTab: 'DEBT',
    netSavings: 'NET SAVINGS',
    categoryCharts: 'CATEGORY CHARTS',
    recentTransactions: 'RECENT TRANSACTIONS',
    viewAll: 'View All >',
    noTransactions: 'No transactions yet. Tap ➕ below to record your first one!',
    instantTxRecorded: '⚡ Instant Transaction Recorded!',
    instantTxSuccess: 'recorded instantly.',

    // Settings Screen
    settings: 'SETTINGS',
    appearance: 'APPEARANCE & THEME',
    darkMode: 'Dark Mode',
    darkModeSub: 'Use high-contrast Neo-Brutalism dark theme',
    languageSection: 'LANGUAGE SELECTION',
    indonesian: 'Bahasa Indonesia (ID)',
    english: 'English (US)',
    notifications: 'NOTIFICATIONS & REMINDERS',
    dailyReminder: 'Daily Expense Reminder',
    dailyReminderSub: 'Daily notification at 08:00 PM',
    dataManagement: 'DATA MANAGEMENT',
    generateSample: 'Fill Demo Sample Data',
    generateSampleSub: 'Add realistic sample transactions to test all features',
    resetData: 'Reset Entire Database',
    resetDataSub: 'Erase all data and restore to fresh state',
    aboutApp: 'ABOUT APPLICATION',
    createdBy: 'Created with ❤️ by',
    rightsReserved: 'All rights reserved.',

    // More Screen
    mainMenu: 'MAIN MENU',
    analyticsTitle: 'STATISTICS & FULL TRENDS',
    analyticsMenu: 'Financial Stats & Trends',
    analyticsSub: 'Visual breakdown of income, expenses, comparisons & cashflow trend',
    savingsGoalsTitle: 'PIGGY BANK & GOALS',
    savingsMenu: 'Piggy Bank & Dream Goals',
    savingsSub: 'Save and track your target savings progress',
    accountsMenu: 'Accounts & Wallets',
    categoriesMenu: 'Financial Categories',
    debtsMenu: 'Debts & Loans',
    recurringMenu: 'Recurring Transactions',
    exportMenu: 'Reports & Data Export',
    aboutDesc: 'iOS Personal Finance App with Neo-Brutalism Design, Built-in Calculator, Multi-Account & Offline SQLite.',

    // Transactions Screen
    transactionsTitle: 'TRANSACTIONS HISTORY',
    searchPlaceholder: 'Search transaction or note...',
    allTypes: 'All Types',
    netDiff: 'Net Flow',
    noTxFiltered: 'No transactions match the selected filter.',
    filterDrawer: 'ADVANCED FILTER',
    selectAccount: 'Select Account / Wallet',
    selectCategory: 'Select Category',
    applyFilter: 'APPLY FILTER',
    clearFilter: 'RESET FILTER',

    // Transaction Detail Screen
    txDetailTitle: 'TRANSACTION DETAIL',
    nominal: 'Amount',
    account: 'Account / Wallet',
    category: 'Category',
    date: 'Date',
    note: 'Note',
    receiptAttachment: 'Receipt Photo',
    deleteTxConfirm: 'Are you sure you want to delete this transaction? Account balance will be recalculated automatically.',

    // Add Transaction Modal
    addTxTitle: 'RECORD TRANSACTION',
    editTxTitle: 'EDIT TRANSACTION',
    fromAccount: 'From Account',
    toAccount: 'To Account',
    selectCatPrompt: 'SELECT CATEGORY',
    noteOptional: 'Additional note (optional)...',
    attachReceipt: 'Attach Receipt Photo',
    saveTransaction: 'SAVE TRANSACTION',

    // Budget Screen
    budgetTitle: 'BUDGETING & LIMITS',
    activeBudgets: 'Active Budgets',
    historyBudgets: 'Past Month History',
    addBudget: '+ SET BUDGET',
    spent: 'Spent',
    remaining: 'Remaining',
    overBudget: 'Over Budget',
    noBudgets: 'No active monthly budgets yet.',

    // Budget Form Modal
    newBudgetTitle: 'SET NEW BUDGET',
    editBudgetTitle: 'EDIT BUDGET',
    budgetName: 'Budget Name',
    budgetLimit: 'Monthly Limit Amount',
    saveBudget: 'SAVE BUDGET',

    // Celengan / Savings Goals
    savingsTitle: 'PIGGY BANK & GOALS',
    targetAccumulation: 'ACCUMULATED SAVINGS GOALS',
    savingsList: 'SAVINGS GOALS LIST',
    addSavings: '+ DEPOSIT MONEY',
    createGoal: '+ CREATE GOAL NOW',
    currentSaved: 'Saved',
    targetAmount: 'Target',
    depositPrompt: 'Deposit Amount',

    // Accounts Screen & Form
    accountsTitle: 'ACCOUNTS & WALLETS',
    addAccount: '+ ADD ACCOUNT',
    initialBalance: 'Initial Balance',
    currentBalance: 'Current Balance',
    saveAccount: 'SAVE ACCOUNT',

    // Categories Screen & Form
    categoriesTitle: 'FINANCIAL CATEGORIES',
    addCategory: '+ ADD CATEGORY',
    categoryName: 'Category Name',
    saveCategory: 'SAVE CATEGORY',

    // Debts Screen & Form
    debtsTitle: 'DEBTS & LOANS',
    receivableTab: 'Receivables (Money owed to me)',
    payableTab: 'Payables (I owe to others)',
    addDebt: '+ RECORD DEBT/LOAN',
    personName: 'Person / Entity Name',
    dueDate: 'Due Date',
    markAsPaid: 'Mark as Settled',
    unpaid: 'Unsettled',
    paid: 'Settled',

    // Recurring Screen & Form
    recurringTitle: 'RECURRING TRANSACTIONS',
    addRecurring: '+ NEW TEMPLATE',
    interval: 'Recurring Interval',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',

    // Export & Import Screen
    exportTitle: 'REPORTS & DATA',
    importMoneyPlusTitle: 'Import Data from Money+ (CSV / JSON)',
    importMoneyPlusDesc: 'Transfer your entire past transaction history from Money+ or Excel spreadsheets seamlessly.',
    pickFile: 'CHOOSE FILE',
    pasteText: 'PASTE TEXT',
    exportCsvTitle: 'Export Transactions to CSV (Excel)',
    exportCsvBtn: 'EXPORT CSV FILE',
    exportJsonTitle: 'Full Backup JSON',
    exportJsonBtn: 'EXPORT FULL BACKUP JSON',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.id;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  t: translations.id,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const t = translations[language] || translations.id;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
