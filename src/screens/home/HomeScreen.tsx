import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoBadge } from '../../components/common/NeoBadge';
import { NeoPieChart } from '../../components/charts/NeoPieChart';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TimePeriodFilter, SummaryData, CategorySpendingSummary, Transaction } from '../../types';
import { getSummaryForPeriod, getCategorySpendingBreakdown, getRecentTransactions } from '../../database/transactionRepo';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const {
    totalNetWorth,
    accounts,
    categories,
    budgets,
    transactions,
    refreshData,
    isLoading,
  } = useAppData();

  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [chartPeriod, setChartPeriod] = useState<TimePeriodFilter>('month');
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense');
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const [periodSummary, setPeriodSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    totalBalance: 0,
  });
  const [chartData, setChartData] = useState<CategorySpendingSummary[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = useCallback(async () => {
    try {
      const [sum, breakdown, recent] = await Promise.all([
        getSummaryForPeriod(period),
        getCategorySpendingBreakdown(chartPeriod, undefined, undefined, chartType),
        getRecentTransactions(5),
      ]);
      setPeriodSummary(sum);
      setChartData(breakdown);
      setRecentTx(recent);
    } catch (err) {
      console.warn('Error loading home data:', err);
    }
  }, [period, chartPeriod, chartType]);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData, transactions])
  );

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData, transactions, period, chartPeriod, chartType]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await loadHomeData();
    setRefreshing(false);
  };

  const topSpendingCategory = chartData.length > 0 ? chartData[0] : null;

  // Financial Health Score Calculation
  const savingsRate =
    periodSummary.totalIncome > 0
      ? Math.round(((periodSummary.totalIncome - periodSummary.totalExpense) / periodSummary.totalIncome) * 100)
      : periodSummary.totalExpense === 0
      ? 100
      : -100;

  const getHealthStatus = () => {
    if (savingsRate >= 30) {
      return {
        label: 'SEHAT FINANSIAL',
        desc: `Keren! Kamu menabung ${savingsRate}% dari pemasukanmu hari ini/bulan ini.`,
        color: theme.colors.income,
        textColor: '#0A3B0A',
        icon: 'checkmark-circle',
      };
    }
    if (savingsRate >= 10) {
      return {
        label: 'CUKUP STABIL',
        desc: `Rasio tabungan ${savingsRate}%. Pertahankan pengeluaran agar tabungan bertambah.`,
        color: theme.colors.warning,
        textColor: '#3B2900',
        icon: 'alert-circle',
      };
    }
    return {
      label: 'WASPADA / OVERSPENDING',
      desc: 'Pengeluaran mendekati atau melampaui pemasukan. Evaluasi pengeluaranmu.',
      color: theme.colors.expense,
      textColor: '#3B0A18',
      icon: 'warning',
    };
  };

  const healthStatus = getHealthStatus();

  // Smart Budget Alerts Check (>80% or >100%)
  const overBudgets = budgets.filter((b) => (b.percentage || 0) >= 80);

  // Quick 1-Tap Preset Shortcut Handler
  const handleQuickAddShortcut = (catNameSearch: string, amount: number) => {
    const matchedCat = categories.find((c) =>
      c.name.toLowerCase().includes(catNameSearch.toLowerCase())
    );
    navigation.navigate('AddModal', {
      initialCategoryId: matchedCat?.id,
      initialAmount: amount,
      initialType: 'expense',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Top App Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.greetingText, { color: theme.colors.textMuted }]}>
            SUGARZY FINANCE TRACKER
          </Text>
          <View style={styles.appTitleRow}>
            <Text style={[styles.appName, { color: theme.colors.text }]}>SUFIKER</Text>
            <View
              style={[
                styles.plusBadge,
                {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={styles.plusText}>+</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={[
            styles.settingsBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="settings-sharp" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* 1. Total Net Worth Card with Eye Hide/Show Button */}
        <NeoCard
          backgroundColor={theme.colors.primary}
          style={styles.netWorthCard}
        >
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.cardSuperLabel}>TOTAL SALDO BERSIH (NET WORTH)</Text>
              <TouchableOpacity
                onPress={() => setShowBalance(!showBalance)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                  size={16}
                  color="#121212"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Accounts')}
              style={styles.manageAccBtn}
            >
              <Text style={styles.manageAccText}>Kelola Akun &gt;</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.netWorthAmount}>
            {showBalance ? formatCurrency(totalNetWorth) : 'Rp ••••••••'}
          </Text>

          {/* Mini Account Balance Strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsMiniScroll}>
            {accounts
              .filter((a) => a.is_archived === 0)
              .map((acc) => (
                <View
                  key={acc.id}
                  style={[
                    styles.accPill,
                    {
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      borderColor: '#121212',
                    },
                  ]}
                >
                  <NeoBadge
                    icon={acc.icon}
                    iconFamily={acc.icon_family}
                    color={acc.color}
                    size="sm"
                  />
                  <View style={{ marginLeft: 6 }}>
                    <Text style={styles.accPillName}>{acc.name}</Text>
                    <Text style={styles.accPillBal}>
                      {showBalance ? formatCurrency(acc.current_balance) : '••••'}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        </NeoCard>

        {/* 2. Financial Health Score Widget */}
        <NeoCard style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <Ionicons name={healthStatus.icon as any} size={18} color={healthStatus.color} />
              <Text style={[styles.healthTitle, { color: theme.colors.text }]}>
                SKOR KESEHATAN KEUANGAN
              </Text>
            </View>
            <View
              style={[
                styles.healthBadge,
                {
                  backgroundColor: healthStatus.color,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.healthBadgeText, { color: healthStatus.textColor }]}>
                {healthStatus.label}
              </Text>
            </View>
          </View>
          <Text style={[styles.healthDesc, { color: theme.colors.textMuted }]}>
            {healthStatus.desc}
          </Text>
        </NeoCard>

        {/* 3. Smart Budget Warning Alert (if any budget >80%) */}
        {overBudgets.length > 0 && (
          <NeoCard backgroundColor={theme.colors.expense} style={styles.budgetWarningCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="warning" size={20} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.budgetWarningTitle}>PERINGATAN BUDGET BULANAN</Text>
                <Text style={styles.budgetWarningSub}>
                  {overBudgets[0]?.name} telah terpakai {formatPercentage(overBudgets[0]?.percentage || 0)} ({formatCurrency(overBudgets[0]?.spent_amount || 0)} dari {formatCurrency(overBudgets[0]?.limit_amount || 0)}).
                </Text>
              </View>
            </View>
          </NeoCard>
        )}

        {/* 4. Quick-Add 1-Tap Shortcuts */}
        <View style={styles.quickAddSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginHorizontal: 16 }]}>
            ⚡ CATAT CEPAT (1-TAP)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAddScroll}
          >
            <TouchableOpacity
              onPress={() => handleQuickAddShortcut('kopi', 25000)}
              style={[styles.quickAddChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={styles.quickAddEmoji}>☕</Text>
              <Text style={[styles.quickAddLabel, { color: theme.colors.text }]}>Kopi / Cafe</Text>
              <Text style={[styles.quickAddNominal, { color: theme.colors.expense }]}>Rp 25rb</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickAddShortcut('makan', 35000)}
              style={[styles.quickAddChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={styles.quickAddEmoji}>🍽️</Text>
              <Text style={[styles.quickAddLabel, { color: theme.colors.text }]}>Makan Siang</Text>
              <Text style={[styles.quickAddNominal, { color: theme.colors.expense }]}>Rp 35rb</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickAddShortcut('transport', 50000)}
              style={[styles.quickAddChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={styles.quickAddEmoji}>⛽</Text>
              <Text style={[styles.quickAddLabel, { color: theme.colors.text }]}>Bensin BBM</Text>
              <Text style={[styles.quickAddNominal, { color: theme.colors.expense }]}>Rp 50rb</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickAddShortcut('belanja', 100000)}
              style={[styles.quickAddChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={styles.quickAddEmoji}>🛒</Text>
              <Text style={[styles.quickAddLabel, { color: theme.colors.text }]}>Supermarket</Text>
              <Text style={[styles.quickAddNominal, { color: theme.colors.expense }]}>Rp 100rb</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 5. Periodic Income & Expense Summary Card */}
        <NeoCard style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>RINGKASAN</Text>
            {/* Period Switcher Tabs */}
            <View
              style={[
                styles.periodTabContainer,
                { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border },
              ]}
            >
              {(['day', 'week', 'month'] as const).map((pKey) => {
                const isSelected = period === pKey;
                const pLabel = pKey === 'day' ? 'Hari ini' : pKey === 'week' ? 'Minggu ini' : 'Bulan ini';
                return (
                  <TouchableOpacity
                    key={pKey}
                    onPress={() => setPeriod(pKey)}
                    style={[
                      styles.periodTabItem,
                      isSelected && {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.border,
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.periodTabLabel,
                        {
                          color: isSelected ? '#121212' : theme.colors.text,
                          fontWeight: isSelected ? '900' : '600',
                        },
                      ]}
                    >
                      {pLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Income & Expense Split Boxes */}
          <View style={styles.incomeExpenseRow}>
            {/* Income Box */}
            <View
              style={[
                styles.summaryBox,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderLeftWidth: 6,
                  borderLeftColor: theme.colors.income,
                },
              ]}
            >
              <View style={styles.boxHeader}>
                <Ionicons name="arrow-down-circle" size={16} color={theme.colors.income} />
                <Text style={[styles.boxLabel, { color: theme.colors.textMuted }]}>PEMASUKAN</Text>
              </View>
              <Text style={[styles.boxAmount, { color: theme.colors.income }]}>
                +{formatCurrency(periodSummary.totalIncome)}
              </Text>
            </View>

            {/* Expense Box */}
            <View
              style={[
                styles.summaryBox,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderLeftWidth: 6,
                  borderLeftColor: theme.colors.expense,
                },
              ]}
            >
              <View style={styles.boxHeader}>
                <Ionicons name="arrow-up-circle" size={16} color={theme.colors.expense} />
                <Text style={[styles.boxLabel, { color: theme.colors.textMuted }]}>PENGELUARAN</Text>
              </View>
              <Text style={[styles.boxAmount, { color: theme.colors.expense }]}>
                -{formatCurrency(periodSummary.totalExpense)}
              </Text>
            </View>
          </View>

          {/* Net Flow Footer */}
          <View style={[styles.netFlowFooter, { borderColor: theme.colors.border }]}>
            <Text style={[styles.netFlowLabel, { color: theme.colors.textMuted }]}>
              SELISIH BERSIH ({period === 'day' ? 'HARI INI' : period === 'week' ? 'MINGGU INI' : 'BULAN INI'}):
            </Text>
            <Text
              style={[
                styles.netFlowAmount,
                {
                  color: periodSummary.netSavings >= 0 ? theme.colors.income : theme.colors.expense,
                },
              ]}
            >
              {formatCurrency(periodSummary.netSavings, { showSign: true })}
            </Text>
          </View>
        </NeoCard>

        {/* 6. Category Breakdown Donut Chart with Pemasukan / Pengeluaran Toggle */}
        <NeoCard style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              GRAFIK KATEGORI
            </Text>

            {/* Expense / Income Type Toggle */}
            <View style={styles.chartTypeToggle}>
              <TouchableOpacity
                onPress={() => setChartType('expense')}
                style={[
                  styles.chartTypeBtn,
                  {
                    backgroundColor: chartType === 'expense' ? theme.colors.expense : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chartTypeBtnText,
                    { color: chartType === 'expense' ? '#FFFFFF' : theme.colors.text },
                  ]}
                >
                  Pengeluaran
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setChartType('income')}
                style={[
                  styles.chartTypeBtn,
                  {
                    backgroundColor: chartType === 'income' ? theme.colors.income : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chartTypeBtnText,
                    { color: chartType === 'income' ? '#0A3B0A' : theme.colors.text },
                  ]}
                >
                  Pemasukan
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Period selector for chart */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartPeriodChips}
          >
            {(['day', 'week', 'month', 'year'] as const).map((cp) => {
              const isActive = chartPeriod === cp;
              const lbl = cp === 'day' ? 'Hari ini' : cp === 'week' ? 'Minggu ini' : cp === 'month' ? 'Bulan ini' : 'Tahun ini';
              return (
                <TouchableOpacity
                  key={cp}
                  onPress={() => setChartPeriod(cp)}
                  style={[
                    styles.chartPeriodChip,
                    {
                      backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chartPeriodChipText,
                      { color: isActive ? '#121212' : theme.colors.text, fontWeight: isActive ? '900' : '600' },
                    ]}
                  >
                    {lbl}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Donut Chart Component */}
          <NeoPieChart data={chartData} />
        </NeoCard>

        {/* 7. Recent Transactions List */}
        <View style={styles.recentSectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            TRANSAKSI TERBARU
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionsTab')}>
            <Text style={[styles.viewAllText, { color: theme.colors.primaryText }]}>
              Lihat Semua &gt;
            </Text>
          </TouchableOpacity>
        </View>

        {recentTx.length === 0 ? (
          <NeoCard style={{ alignItems: 'center', padding: 24, marginHorizontal: 16 }}>
            <Ionicons name="receipt-outline" size={40} color={theme.colors.textMuted} />
            <Text style={[styles.noTxText, { color: theme.colors.textMuted }]}>
              Belum ada transaksi. Tekan tombol ➕ di bawah untuk mencatat!
            </Text>
          </NeoCard>
        ) : (
          recentTx.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={() => navigation.navigate('TransactionDetail', { transactionId: tx.id })}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  greetingText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  appTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  plusBadge: {
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  plusText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#121212',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  netWorthCard: {
    marginHorizontal: 16,
    padding: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSuperLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#121212',
  },
  eyeBtn: {
    padding: 4,
  },
  manageAccBtn: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  manageAccText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
  },
  netWorthAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#121212',
    marginVertical: 10,
    letterSpacing: 0.5,
  },
  accountsMiniScroll: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  accPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    marginRight: 8,
  },
  accPillName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#121212',
  },
  accPillBal: {
    fontSize: 11,
    fontWeight: '900',
    color: '#121212',
  },
  healthCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  healthBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  healthDesc: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 16,
  },
  budgetWarningCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
  },
  budgetWarningTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  budgetWarningSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  quickAddSection: {
    marginTop: 12,
  },
  quickAddScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  quickAddChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    marginRight: 8,
    minWidth: 88,
  },
  quickAddEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  quickAddLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  quickAddNominal: {
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  periodTabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 2,
  },
  periodTabItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  periodTabLabel: {
    fontSize: 11,
  },
  incomeExpenseRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boxLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  boxAmount: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
  },
  netFlowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1.5,
  },
  netFlowLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  netFlowAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  chartCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTypeToggle: {
    flexDirection: 'row',
    gap: 6,
  },
  chartTypeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  chartTypeBtnText: {
    fontSize: 10,
    fontWeight: '900',
  },
  chartPeriodChips: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  chartPeriodChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  chartPeriodChipText: {
    fontSize: 11,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '900',
  },
  noTxText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});
