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
    summary: 'RINGKASAN',
    income: 'PEMASUKAN',
    expense: 'PENGELUARAN',
    transfer: 'TRANSFER SALDO',
    netSavings: 'SELISIH BERSIH',
    today: 'Hari ini',
    thisWeek: 'Minggu ini',
    thisMonth: 'Bulan ini',
    thisYear: 'Tahun ini',
    allPeriod: 'Semua',
    categoryCharts: 'GRAFIK KATEGORI',
    recentTransactions: 'TRANSAKSI TERBARU',
    viewAll: 'Lihat Semua >',
    noTransactions: 'Belum ada transaksi. Tekan tombol ➕ di bawah untuk mencatat!',

    // Settings
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
    analyticsMenu: 'Statistik & Trend Keuangan',
    analyticsSub: 'Analisis visual pemasukan, pengeluaran, perbandingan & tren saldo',
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

    // Budget Screen
    budgetTitle: 'ANGGARAN & BUDGET',
    activeBudgets: 'Budget Aktif',
    historyBudgets: 'Riwayat Bulan Lalu',
    addBudget: '+ PASANG BUDGET',
    spent: 'Terpakai',
    remaining: 'Sisa',

    // Celengan Screen
    savingsTitle: 'CELENGAN & TARGET IMPIAN',
    targetAccumulation: 'AKUMULASI CELENGAN IMPIAN',
    savingsList: 'DAFTAR TARGET TABUNGAN',
    addSavings: '+ ISI TABUNGAN',
    createGoal: '+ BUAT TARGET SEKARANG',
  },
  en: {
    // Navigation / Tabs
    home: 'Home',
    transactions: 'Transactions',
    budget: 'Budget',
    more: 'More',
    add: 'Add',

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
    summary: 'SUMMARY',
    income: 'INCOME',
    expense: 'EXPENSE',
    transfer: 'TRANSFER',
    netSavings: 'NET SAVINGS',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    allPeriod: 'All',
    categoryCharts: 'CATEGORY CHARTS',
    recentTransactions: 'RECENT TRANSACTIONS',
    viewAll: 'View All >',
    noTransactions: 'No transactions yet. Tap ➕ below to record your first one!',

    // Settings
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
    analyticsMenu: 'Financial Stats & Trends',
    analyticsSub: 'Visual breakdown of income, expenses, comparisons & cashflow trend',
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

    // Budget Screen
    budgetTitle: 'BUDGETING & LIMITS',
    activeBudgets: 'Active Budgets',
    historyBudgets: 'Past Month History',
    addBudget: '+ SET BUDGET',
    spent: 'Spent',
    remaining: 'Remaining',

    // Celengan Screen
    savingsTitle: 'PIGGY BANK & GOALS',
    targetAccumulation: 'ACCUMULATED SAVINGS GOALS',
    savingsList: 'SAVINGS GOALS LIST',
    addSavings: '+ DEPOSIT MONEY',
    createGoal: '+ CREATE GOAL NOW',
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
