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
import { NeoLineChart, TrendDataPoint } from '../../components/charts/NeoLineChart';
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
    transactions,
    refreshData,
    isLoading,
  } = useAppData();

  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [chartPeriod, setChartPeriod] = useState<TimePeriodFilter>('month');
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
        getCategorySpendingBreakdown(chartPeriod),
        getRecentTransactions(5),
      ]);
      setPeriodSummary(sum);
      setChartData(breakdown);
      setRecentTx(recent);
    } catch (err) {
      console.warn('Error loading home data:', err);
    }
  }, [period, chartPeriod]);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData, transactions])
  );

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData, transactions, period, chartPeriod]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await loadHomeData();
    setRefreshing(false);
  };

  const topSpendingCategory = chartData.length > 0 ? chartData[0] : null;

  // Mock sample 5-point data for Net Worth Trend
  const trendPoints: TrendDataPoint[] = [
    { label: 'Mei', value: Math.max(0, totalNetWorth * 0.75) },
    { label: 'Jun', value: Math.max(0, totalNetWorth * 0.82) },
    { label: 'Jul', value: Math.max(0, totalNetWorth * 0.9) },
    { label: 'Agu', value: totalNetWorth },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Top App Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.greetingText, { color: theme.colors.textMuted }]}>
            SELAMAT DATANG DI
          </Text>
          <View style={styles.appTitleRow}>
            <Text style={[styles.appName, { color: theme.colors.text }]}>MONEY</Text>
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
          onPress={() => navigation.navigate('MoreTab', { screen: 'Settings' })}
          style={[
            styles.settingsBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="settings-outline" size={22} color={theme.colors.text} />
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
        {/* 1. Total Net Worth Card */}
        <NeoCard
          backgroundColor={theme.colors.primary}
          style={styles.netWorthCard}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSuperLabel}>TOTAL SALDO SEMUA AKUN</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MoreTab', { screen: 'Accounts' })}
              style={styles.manageAccBtn}
            >
              <Text style={styles.manageAccText}>{accounts.length} Akun &gt;</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.netWorthAmount}>
            {formatCurrency(totalNetWorth)}
          </Text>

          {/* Accounts mini row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountsMiniScroll}
          >
            {accounts.filter((a) => a.is_archived === 0).map((acc) => (
              <View
                key={acc.id}
                style={[
                  styles.accPill,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <NeoBadge
                  icon={acc.icon}
                  iconFamily={acc.icon_family}
                  color={acc.color}
                  size="sm"
                  noShadow
                />
                <View style={{ marginLeft: 6 }}>
                  <Text style={[styles.accPillName, { color: theme.colors.text }]}>{acc.name}</Text>
                  <Text style={[styles.accPillBal, { color: theme.colors.text }]}>
                    {formatCurrency(acc.current_balance)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </NeoCard>

        {/* 2. Today / Period Summary Card */}
        <NeoCard style={styles.summaryCard}>
          <View style={styles.periodSwitcherRow}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              RINGKASAN
            </Text>
            <View
              style={[
                styles.periodTabGroup,
                {
                  backgroundColor: theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              {(['day', 'week', 'month'] as const).map((pKey) => {
                const isSelected = period === pKey;
                const pLabel = pKey === 'day' ? 'Hari Ini' : pKey === 'week' ? 'Minggu' : 'Bulan';
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
                          color: '#121212',
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
              <View style={styles.summaryBoxHeader}>
                <Ionicons name="arrow-down-circle" size={18} color={theme.colors.income} />
                <Text style={[styles.summaryBoxLabel, { color: theme.colors.textMuted }]}>
                  PEMASUKAN
                </Text>
              </View>
              <Text style={[styles.summaryBoxAmount, { color: theme.colors.income }]}>
                {formatCurrency(periodSummary.totalIncome)}
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
              <View style={styles.summaryBoxHeader}>
                <Ionicons name="arrow-up-circle" size={18} color={theme.colors.expense} />
                <Text style={[styles.summaryBoxLabel, { color: theme.colors.textMuted }]}>
                  PENGELUARAN
                </Text>
              </View>
              <Text style={[styles.summaryBoxAmount, { color: theme.colors.expense }]}>
                {formatCurrency(periodSummary.totalExpense)}
              </Text>
            </View>
          </View>

          {/* Net Flow / Savings */}
          <View
            style={[
              styles.netFlowBox,
              {
                backgroundColor: theme.colors.cardSecondary,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.netFlowLabel, { color: theme.colors.text }]}>
              Selisih Bersih (Net):
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

        {/* 3. Top Spending Insight Banner */}
        {topSpendingCategory && (
          <NeoCard
            backgroundColor={theme.colors.transfer}
            style={styles.insightCard}
          >
            <View style={styles.insightHeader}>
              <Ionicons name="flash" size={18} color="#121212" />
              <Text style={styles.insightTitle}>INSIGHT PENGELUARAN TERBESAR</Text>
            </View>
            <View style={styles.insightBody}>
              <NeoBadge
                icon={topSpendingCategory.categoryIcon}
                iconFamily={topSpendingCategory.categoryIconFamily}
                color={topSpendingCategory.categoryColor}
                size="md"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.insightCatName}>
                  {topSpendingCategory.categoryName}
                </Text>
                <Text style={styles.insightDesc}>
                  Menyumbang {formatPercentage(topSpendingCategory.percentage)} dari total pengeluaranmu bulan ini ({formatCurrency(topSpendingCategory.totalSpent)}).
                </Text>
              </View>
            </View>
          </NeoCard>
        )}

        {/* 4. Category Spending Breakdown Chart */}
        <NeoCard style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              PENGELUARAN PER KATEGORI
            </Text>
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

          {/* Pie Chart Component */}
          <NeoPieChart data={chartData} />
        </NeoCard>

        {/* 5. Net Worth Trend Line Chart */}
        <NeoCard style={styles.chartCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            TREND SALDO BULANAN
          </Text>
          <NeoLineChart data={trendPoints} lineColor={theme.colors.primary} />
        </NeoCard>

        {/* 6. Recent Transactions List */}
        <View style={styles.recentSectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            TRANSAKSI TERBARU
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greetingText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
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
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#121212',
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
  },
  accPillName: {
    fontSize: 10,
    fontWeight: '700',
  },
  accPillBal: {
    fontSize: 11,
    fontWeight: '900',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  periodSwitcherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  periodTabGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 2,
  },
  periodTabItem: {
    paddingHorizontal: 10,
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
    borderWidth: 2,
    borderRadius: 8,
  },
  summaryBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },
  summaryBoxAmount: {
    fontSize: 16,
    fontWeight: '900',
  },
  netFlowBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    marginTop: 10,
  },
  netFlowLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  netFlowAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  insightCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#121212',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  insightBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCatName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#121212',
  },
  insightDesc: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
    marginTop: 2,
    lineHeight: 15,
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
  chartPeriodChips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
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
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '900',
  },
  noTxText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});
