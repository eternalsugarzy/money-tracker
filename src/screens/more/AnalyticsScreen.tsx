import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoBadge } from '../../components/common/NeoBadge';
import { NeoPieChart } from '../../components/charts/NeoPieChart';
import { NeoLineChart, TrendDataPoint } from '../../components/charts/NeoLineChart';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TimePeriodFilter, SummaryData, CategorySpendingSummary } from '../../types';
import {
  getSummaryForPeriod,
  getCategorySpendingBreakdown,
  getMonthlyTrendData,
} from '../../database/transactionRepo';

export const AnalyticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const navigation = useNavigation<any>();
  const { transactions, refreshData, isLoading } = useAppData();

  const [period, setPeriod] = useState<TimePeriodFilter>('month');
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense');
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    totalBalance: 0,
  });
  const [breakdown, setBreakdown] = useState<CategorySpendingSummary[]>([]);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = useCallback(async () => {
    try {
      const [sum, bdown, trend] = await Promise.all([
        getSummaryForPeriod(period),
        getCategorySpendingBreakdown(period, undefined, undefined, chartType),
        getMonthlyTrendData(),
      ]);
      setSummary(sum);
      setBreakdown(bdown);
      setTrendData(trend);
    } catch (err) {
      console.warn('Error loading analytics:', err);
    }
  }, [period, chartType]);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [loadAnalytics])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshData();
      await loadAnalytics();
    } catch (e) {
      // safe
    } finally {
      setRefreshing(false);
    }
  };

  const PERIODS: { key: TimePeriodFilter; label: string }[] = [
    { key: 'day', label: t.day },
    { key: 'week', label: t.week },
    { key: 'month', label: t.month },
    { key: 'year', label: t.year },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t.analyticsTitle}
        </Text>
        <View style={{ width: 40 }} />
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
        {/* Period Selector Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodRow}
        >
          {PERIODS.map((p) => {
            const isActive = period === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => setPeriod(p.key)}
                style={[
                  styles.periodChip,
                  {
                    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.periodChipText,
                    {
                      color: isActive ? '#121212' : theme.colors.text,
                      fontWeight: isActive ? '900' : '700',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 1. Grand Financial Overview Card */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t.summary} ({period === 'day' ? t.day.toUpperCase() : period === 'week' ? t.week.toUpperCase() : period === 'month' ? t.month.toUpperCase() : t.year.toUpperCase()})
          </Text>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCol, { borderRightWidth: 1.5, borderRightColor: theme.colors.border }]}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>{t.income}</Text>
              <Text style={[styles.summaryVal, { color: theme.colors.income }]}>
                +{formatCurrency(summary.totalIncome)}
              </Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>{t.expense}</Text>
              <Text style={[styles.summaryVal, { color: theme.colors.expense }]}>
                -{formatCurrency(summary.totalExpense)}
              </Text>
            </View>
          </View>

          <View style={[styles.netRow, { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border }]}>
            <Text style={[styles.netLabel, { color: theme.colors.text }]}>{t.netSavings}:</Text>
            <Text
              style={[
                styles.netVal,
                { color: summary.netSavings >= 0 ? theme.colors.income : theme.colors.expense },
              ]}
            >
              {formatCurrency(summary.netSavings, { showSign: true })}
            </Text>
          </View>
        </NeoCard>

        {/* 2. Donut Pie Chart with Pemasukan / Pengeluaran Toggle */}
        <NeoCard style={styles.card}>
          <View style={styles.chartHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {language === 'id' ? 'DISTRIBUSI KATEGORI' : 'CATEGORY DISTRIBUTION'}
            </Text>

            <View style={styles.typeToggle}>
              <TouchableOpacity
                onPress={() => setChartType('expense')}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor: chartType === 'expense' ? theme.colors.expense : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    { color: chartType === 'expense' ? '#FFFFFF' : theme.colors.text },
                  ]}
                  numberOfLines={1}
                >
                  {t.expense}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setChartType('income')}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor: chartType === 'income' ? theme.colors.income : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    { color: chartType === 'income' ? '#0A3B0A' : theme.colors.text },
                  ]}
                  numberOfLines={1}
                >
                  {t.income}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <NeoPieChart data={breakdown} />
        </NeoCard>

        {/* 3. Monthly Net Cashflow Trend Line Chart */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {language === 'id' ? 'TREN SELISIH BERSIH 6 BULAN TERAKHIR' : '6-MONTH NET CASHFLOW TREND'}
          </Text>
          <Text style={[styles.trendSub, { color: theme.colors.textMuted }]}>
            {language === 'id' ? 'Grafik riwayat performa surplus/defisit bulanan' : 'Monthly surplus / deficit performance history'}
          </Text>

          <NeoLineChart
            data={trendData}
            width={Dimensions.get('window').width - 64}
            height={180}
            lineColor={theme.colors.primary}
          />
        </NeoCard>

        {/* 4. Top Category Ranking List */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {language === 'id' ? 'PERINGKAT KATEGORI' : 'CATEGORY RANKING'} ({chartType === 'expense' ? t.expense.toUpperCase() : t.income.toUpperCase()})
          </Text>
          {breakdown.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
              {language === 'id' ? 'Belum ada data pada periode ini.' : 'No transaction data for this period.'}
            </Text>
          ) : (
            breakdown.map((item, idx) => (
              <View key={item.categoryId} style={styles.rankingRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNum}>#{idx + 1}</Text>
                </View>
                <NeoBadge
                  icon={item.categoryIcon}
                  iconFamily={item.categoryIconFamily}
                  color={item.categoryColor}
                  size="sm"
                />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.rankCatName, { color: theme.colors.text }]}>
                      {item.categoryName}
                    </Text>
                    <Text style={[styles.rankCatAmount, { color: theme.colors.text }]}>
                      {formatCurrency(item.totalSpent)}
                    </Text>
                  </View>
                  {/* Mini Progress Bar */}
                  <View style={styles.rankBarTrack}>
                    <View
                      style={[
                        styles.rankBarFill,
                        {
                          width: `${Math.min(100, item.percentage)}%`,
                          backgroundColor: item.categoryColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </NeoCard>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  periodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  periodChipText: {
    fontSize: 12,
  },
  card: {
    padding: 14,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  summaryGrid: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  summaryVal: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    marginTop: 8,
  },
  netLabel: {
    fontSize: 11,
    fontWeight: '900',
  },
  netVal: {
    fontSize: 13,
    fontWeight: '900',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  typeBtnText: {
    fontSize: 10,
    fontWeight: '900',
  },
  trendSub: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#121212',
    backgroundColor: '#FFE600',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rankNum: {
    fontSize: 10,
    fontWeight: '900',
    color: '#121212',
  },
  rankCatName: {
    fontSize: 12,
    fontWeight: '800',
  },
  rankCatAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  rankBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginTop: 4,
    overflow: 'hidden',
  },
  rankBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
