import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
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
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { QuickShortcutsModal } from './QuickShortcutsModal';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TimePeriodFilter, SummaryData, CategorySpendingSummary, Transaction, QuickShortcut } from '../../types';
import {
  getSummaryForPeriod,
  getCategorySpendingBreakdown,
  getRecentTransactions,
  createTransaction,
} from '../../database/transactionRepo';
import { getAllShortcuts } from '../../database/shortcutRepo';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
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
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  const [periodSummary, setPeriodSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    totalBalance: 0,
  });
  const [chartData, setChartData] = useState<CategorySpendingSummary[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [shortcuts, setShortcuts] = useState<QuickShortcut[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = useCallback(async () => {
    try {
      const [sum, breakdown, recent, scList] = await Promise.all([
        getSummaryForPeriod(period),
        getCategorySpendingBreakdown(chartPeriod, undefined, undefined, chartType),
        getRecentTransactions(5),
        getAllShortcuts(),
      ]);
      setPeriodSummary(sum);
      setChartData(breakdown);
      setRecentTx(recent);
      setShortcuts(scList);
    } catch (err) {
      console.warn('Error loading home data:', err);
    }
  }, [period, chartPeriod, chartType]);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshData();
      await loadHomeData();
    } catch (e) {
      // safe fallback
    } finally {
      setRefreshing(false);
    }
  };

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
        label: t.healthyStatus,
        desc: t.healthyDesc,
        color: theme.colors.income,
        textColor: '#0A3B0A',
        icon: 'checkmark-circle',
      };
    }
    if (savingsRate >= 10) {
      return {
        label: t.stableStatus,
        desc: t.stableDesc,
        color: theme.colors.warning,
        textColor: '#3B2900',
        icon: 'alert-circle',
      };
    }
    return {
      label: t.warningStatus,
      desc: t.warningDesc,
      color: theme.colors.expense,
      textColor: '#3B0A18',
      icon: 'warning',
    };
  };

  const healthStatus = getHealthStatus();

  // Smart Budget Alerts Check (>80% or >100%)
  const overBudgets = budgets.filter((b) => (b.percentage || 0) >= 80);

  // True 1-TAP Instant Record Handler
  const handleInstantRecord = async (sc: QuickShortcut) => {
    try {
      const targetAccId = sc.account_id || accounts[0]?.id;
      if (!targetAccId) {
        Alert.alert('Akun Belum Ada', 'Silakan buat akun/dompet terlebih dahulu.');
        return;
      }
      await createTransaction({
        type: sc.type || 'expense',
        amount: sc.amount,
        date: new Date().toISOString(),
        account_id: targetAccId,
        to_account_id: null,
        category_id: sc.category_id || categories[0]?.id || null,
        note: `Catat Cepat: ${sc.title}`,
        receipt_images: '[]',
      });
      await refreshData();
      await loadHomeData();
      Alert.alert(
        '⚡ Transaksi Langsung Tercatat!',
        `${sc.emoji} ${sc.title} (${formatCurrency(sc.amount)}) berhasil dicatat secara instan.`
      );
    } catch (err) {
      Alert.alert('Error', 'Gagal mencatat transaksi.');
    }
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
            refreshing={refreshing}
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
              <Text style={styles.cardSuperLabel}>{t.totalNetWorth}</Text>
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
              <Text style={styles.manageAccText}>{t.manageAccounts}</Text>
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

        {/* 2. Financial Health Score Widget (Clean No-Overlap Flexbox) */}
        <NeoCard style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <View style={styles.healthTitleRow}>
              <Ionicons name={healthStatus.icon as any} size={18} color={healthStatus.color} />
              <Text style={[styles.healthTitle, { color: theme.colors.text }]}>
                {t.financialHealth}
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
                <Text style={styles.budgetWarningTitle}>{t.budgetWarning}</Text>
                <Text style={styles.budgetWarningSub}>
                  {overBudgets[0]?.name} {language === 'id' ? 'telah terpakai' : 'has spent'} {formatPercentage(overBudgets[0]?.percentage || 0)} ({formatCurrency(overBudgets[0]?.spent_amount || 0)} / {formatCurrency(overBudgets[0]?.limit_amount || 0)}).
                </Text>
              </View>
            </View>
          </NeoCard>
        )}

        {/* 4. Quick-Add 1-Tap Shortcuts with CRUD Manager */}
        <View style={styles.quickAddSection}>
          <View style={styles.quickAddHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t.quickAdd}
            </Text>
            <TouchableOpacity
              onPress={() => setShowShortcutsModal(true)}
              style={[
                styles.manageShortcutsBtn,
                { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border },
              ]}
            >
              <Ionicons name="options-outline" size={13} color={theme.colors.text} />
              <Text style={[styles.manageShortcutsText, { color: theme.colors.text }]}>
                {t.manage} ({shortcuts.length})
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAddScroll}
          >
            {shortcuts.map((sc) => (
              <TouchableOpacity
                key={sc.id}
                onPress={() => handleInstantRecord(sc)}
                activeOpacity={0.7}
                style={[
                  styles.quickAddChip,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.quickAddEmoji}>{sc.emoji}</Text>
                <Text style={[styles.quickAddLabel, { color: theme.colors.text }]}>
                  {sc.title}
                </Text>
                <Text style={[styles.quickAddNominal, { color: theme.colors.expense }]}>
                  {formatCurrency(sc.amount)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowShortcutsModal(true)}
              style={[
                styles.quickAddAddBtn,
                {
                  backgroundColor: theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="add" size={20} color={theme.colors.text} />
              <Text style={[styles.quickAddAddText, { color: theme.colors.text }]}>{t.addNew}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 5. Periodic Income & Expense Summary Card */}
        <NeoCard style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>{t.summary}</Text>
            {/* Period Switcher Tabs */}
            <View
              style={[
                styles.periodTabContainer,
                { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border },
              ]}
            >
              {(['day', 'week', 'month'] as const).map((pKey) => {
                const isSelected = period === pKey;
                const pLabel = pKey === 'day' ? t.day : pKey === 'week' ? t.week : t.month;
                return (
                  <TouchableOpacity
                    key={pKey}
                    onPress={() => setPeriod(pKey)}
                    style={[
                      styles.periodTabItem,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                        borderColor: isSelected ? theme.colors.border : 'transparent',
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
                      numberOfLines={1}
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
                <Text style={[styles.boxLabel, { color: theme.colors.textMuted }]}>{t.income}</Text>
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
                <Text style={[styles.boxLabel, { color: theme.colors.textMuted }]}>{t.expense}</Text>
              </View>
              <Text style={[styles.boxAmount, { color: theme.colors.expense }]}>
                -{formatCurrency(periodSummary.totalExpense)}
              </Text>
            </View>
          </View>

          {/* Net Flow Footer */}
          <View style={[styles.netFlowFooter, { borderColor: theme.colors.border }]}>
            <Text style={[styles.netFlowLabel, { color: theme.colors.textMuted }]}>
              {t.netSavings} ({period === 'day' ? t.day.toUpperCase() : period === 'week' ? t.week.toUpperCase() : t.month.toUpperCase()}):
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
              {t.categoryCharts}
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
                  numberOfLines={1}
                >
                  {t.expense}
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
                  numberOfLines={1}
                >
                  {t.income}
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
              const lbl = cp === 'day' ? t.day : cp === 'week' ? t.week : cp === 'month' ? t.month : t.year;
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
                    numberOfLines={1}
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
            {t.recentTransactions}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionsTab')}>
            <Text style={[styles.viewAllText, { color: theme.colors.primaryText }]}>
              {t.viewAll}
            </Text>
          </TouchableOpacity>
        </View>

        {recentTx.length === 0 ? (
          <NeoCard style={{ alignItems: 'center', padding: 24, marginHorizontal: 16 }}>
            <Ionicons name="receipt-outline" size={40} color={theme.colors.textMuted} />
            <Text style={[styles.noTxText, { color: theme.colors.textMuted }]}>
              {t.noTransactions}
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

      {/* Quick Shortcuts CRUD Manager Modal */}
      <QuickShortcutsModal
        visible={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        shortcuts={shortcuts}
        onRefresh={loadHomeData}
      />
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
    padding: 14,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  healthTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
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
    marginTop: 6,
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
    marginTop: 14,
  },
  quickAddHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 6,
  },
  manageShortcutsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  manageShortcutsText: {
    fontSize: 10,
    fontWeight: '800',
  },
  quickAddScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
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
    fontSize: 20,
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
  quickAddAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  quickAddAddText: {
    fontSize: 10,
    fontWeight: '800',
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
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
