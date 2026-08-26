import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoBadge } from '../../components/common/NeoBadge';
import { NeoProgressBar } from '../../components/common/NeoProgressBar';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Budget } from '../../types';
import { getActiveBudgets, getBudgetHistory, BudgetHistoryMonth, deleteBudget } from '../../database/budgetRepo';

export const BudgetScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { refreshData, isLoading } = useAppData();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [history, setHistory] = useState<BudgetHistoryMonth[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const fetchBudgets = async () => {
    try {
      const [activeList, histList] = await Promise.all([
        getActiveBudgets(),
        getBudgetHistory(3),
      ]);
      setBudgets(activeList);
      setHistory(histList);
    } catch (err) {
      console.warn('Error fetching budgets:', err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await fetchBudgets();
    setRefreshing(false);
  };

  const handleDeleteBudget = (budget: Budget) => {
    Alert.alert(
      'Hapus Budget',
      `Hapus budget "${budget.name}"? Data transaksi tidak akan terhapus.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await deleteBudget(budget.id);
            await fetchBudgets();
            await refreshData();
          },
        },
      ]
    );
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limit_amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent_amount || 0), 0);
  const totalPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>ANGGARAN & BUDGET</Text>
        <NeoButton
          title="+ BUDGET"
          size="sm"
          variant="primary"
          onPress={() => navigation.navigate('BudgetFormModal')}
        />
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
        {/* Total Budget Overview Card */}
        <NeoCard
          backgroundColor={theme.colors.cardSecondary}
          style={styles.overviewCard}
        >
          <View style={styles.overviewHeader}>
            <Text style={[styles.overviewLabel, { color: theme.colors.textMuted }]}>
              TOTAL ANGGARAN BULAN INI
            </Text>
            <View
              style={[
                styles.pctBadge,
                {
                  backgroundColor: totalPercentage > 100 ? theme.colors.expense : totalPercentage >= 80 ? theme.colors.warning : theme.colors.income,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={styles.pctBadgeText}>{totalPercentage}%</Text>
            </View>
          </View>

          <View style={styles.overviewNominals}>
            <Text style={[styles.spentText, { color: theme.colors.text }]}>
              {formatCurrency(totalSpent)}
            </Text>
            <Text style={[styles.limitText, { color: theme.colors.textMuted }]}>
              / {formatCurrency(totalLimit)}
            </Text>
          </View>

          <NeoProgressBar percentage={totalPercentage} height={16} />

          <Text style={[styles.sisaText, { color: theme.colors.textMuted }]}>
            {totalLimit >= totalSpent
              ? `Tersisa: ${formatCurrency(totalLimit - totalSpent)}`
              : `Melebihi budget sebesar ${formatCurrency(totalSpent - totalLimit)}`}
          </Text>
        </NeoCard>

        {/* Tab Selector: Active vs History */}
        <View style={styles.tabSwitchRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            style={[
              styles.tabSwitchBtn,
              {
                backgroundColor: activeTab === 'active' ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabSwitchText,
                { color: '#121212', fontWeight: activeTab === 'active' ? '900' : '700' },
              ]}
            >
              Budget Aktif ({budgets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={[
              styles.tabSwitchBtn,
              {
                backgroundColor: activeTab === 'history' ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabSwitchText,
                { color: '#121212', fontWeight: activeTab === 'history' ? '900' : '700' },
              ]}
            >
              Riwayat Bulan Lalu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Budgets List */}
        {activeTab === 'active' ? (
          budgets.length === 0 ? (
            <NeoCard style={styles.emptyCard}>
              <Ionicons name="pie-chart-outline" size={44} color={theme.colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                Belum Ada Budget Terpasang
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
                Atur batasan pengeluaran bulanan per kategori untuk mengontrol keuanganmu.
              </Text>
              <NeoButton
                title="+ BUAT BUDGET PERTAMA"
                variant="primary"
                onPress={() => navigation.navigate('BudgetFormModal')}
                style={{ marginTop: 14 }}
              />
            </NeoCard>
          ) : (
            budgets.map((b) => {
              const spent = b.spent_amount || 0;
              const limit = b.limit_amount;
              const pct = b.percentage || 0;
              const remaining = limit - spent;

              return (
                <NeoCard key={b.id} style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <View style={styles.budgetHeaderLeft}>
                      <NeoBadge
                        icon={b.category_icon || 'pricetag'}
                        iconFamily={b.category_icon_family || 'Ionicons'}
                        color={b.category_color || theme.colors.primary}
                        size="md"
                      />
                      <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={[styles.budgetName, { color: theme.colors.text }]}>
                          {b.name}
                        </Text>
                        <Text style={[styles.budgetCategory, { color: theme.colors.textMuted }]}>
                          Kategori: {b.category_name}
                        </Text>
                      </View>
                    </View>

                    {/* Edit & Delete Action Menu */}
                    <View style={styles.actionIcons}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('BudgetFormModal', { editBudget: b })}
                        style={styles.iconBtn}
                      >
                        <Ionicons name="pencil" size={16} color={theme.colors.text} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteBudget(b)}
                        style={styles.iconBtn}
                      >
                        <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={{ marginVertical: 10 }}>
                    <NeoProgressBar percentage={pct} height={14} showLabel />
                  </View>

                  {/* Footer Nominals */}
                  <View style={styles.budgetFooter}>
                    <Text style={[styles.footerText, { color: theme.colors.text }]}>
                      Terpakai: <Text style={{ fontWeight: '900' }}>{formatCurrency(spent)}</Text>
                    </Text>
                    <Text style={[styles.footerText, { color: theme.colors.text }]}>
                      Limit: <Text style={{ fontWeight: '900' }}>{formatCurrency(limit)}</Text>
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.sisaStatus,
                      { color: remaining >= 0 ? theme.colors.income : theme.colors.expense },
                    ]}
                  >
                    {remaining >= 0
                      ? `Sisa Anggaran: ${formatCurrency(remaining)}`
                      : `Over Budget: ${formatCurrency(Math.abs(remaining))}`}
                  </Text>
                </NeoCard>
              );
            })
          )
        ) : (
          /* History Section for Past Months */
          history.length === 0 ? (
            <NeoCard style={styles.emptyCard}>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
                Belum ada data riwayat bulan-bulan sebelumnya.
              </Text>
            </NeoCard>
          ) : (
            history.map((hist) => (
              <NeoCard key={hist.monthKey} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={[styles.historyMonthTitle, { color: theme.colors.text }]}>
                    {hist.monthLabel}
                  </Text>
                  <Text style={[styles.historySpend, { color: theme.colors.text }]}>
                    {formatCurrency(hist.totalSpent)} / {formatCurrency(hist.totalLimit)}
                  </Text>
                </View>

                {hist.budgets.map((hb) => (
                  <View key={`hist_${hb.id}`} style={styles.historyItemRow}>
                    <NeoBadge
                      icon={hb.category_icon || 'pricetag'}
                      color={hb.category_color || theme.colors.primary}
                      size="sm"
                    />
                    <Text style={[styles.histCatName, { color: theme.colors.text }]}>
                      {hb.name}
                    </Text>
                    <Text style={[styles.histPct, { color: (hb.percentage || 0) > 100 ? theme.colors.expense : theme.colors.text }]}>
                      {formatCurrency(hb.spent_amount || 0)} ({hb.percentage}%)
                    </Text>
                  </View>
                ))}
              </NeoCard>
            ))
          )
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  overviewCard: {
    padding: 16,
    marginBottom: 12,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  pctBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#121212',
  },
  overviewNominals: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  spentText: {
    fontSize: 24,
    fontWeight: '900',
  },
  limitText: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 6,
  },
  sisaText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  tabSwitchRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabSwitchText: {
    fontSize: 13,
  },
  budgetCard: {
    marginVertical: 6,
    padding: 14,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetName: {
    fontSize: 14,
    fontWeight: '900',
  },
  budgetCategory: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
  },
  sisaStatus: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  historyCard: {
    marginVertical: 6,
    padding: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  historyMonthTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  historySpend: {
    fontSize: 12,
    fontWeight: '800',
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  histCatName: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    marginLeft: 8,
  },
  histPct: {
    fontSize: 12,
    fontWeight: '800',
  },
});
