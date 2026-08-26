import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { FilterBar } from '../../components/transactions/FilterBar';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { NeoCard } from '../../components/common/NeoCard';
import { formatCurrency, formatDateLabel } from '../../utils/formatters';
import {
  Transaction,
  TimePeriodFilter,
  TransactionType,
  TransactionFilterOptions,
} from '../../types';
import { getTransactions } from '../../database/transactionRepo';

export type GroupByMode = 'date' | 'week' | 'month';

interface TransactionSection {
  title: string;
  subtitle?: string;
  groupKey: string;
  totalIncome: number;
  totalExpense: number;
  netDiff: number;
  data: Transaction[];
}

export const TransactionsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { categories, accounts, refreshData, isLoading, transactions: globalTx } = useAppData();

  const [period, setPeriod] = useState<TimePeriodFilter>('month');
  const [groupBy, setGroupBy] = useState<GroupByMode>('date');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const filters: TransactionFilterOptions = {
        period,
        type: typeFilter,
        accountId: selectedAccountId,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        searchQuery: searchQuery.trim() || undefined,
      };
      const list = await getTransactions(filters);
      setTransactions(list);
    } catch (err) {
      console.warn('Error fetching transactions:', err);
    }
  }, [period, typeFilter, selectedAccountId, selectedCategoryIds, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [fetchTransactions, globalTx])
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, globalTx]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleToggleCategory = (catId: string) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const handleClearCategories = () => {
    setSelectedCategoryIds([]);
  };

  // Grand summary for active filters
  const grandSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount;
      if (tx.type === 'expense') expense += tx.amount;
    });
    return {
      income,
      expense,
      net: income - expense,
    };
  }, [transactions]);

  // Group transactions by Date / Week / Month
  const sections: TransactionSection[] = useMemo(() => {
    const map = new Map<string, { title: string; subtitle?: string; items: Transaction[] }>();

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      let key = '';
      let title = '';
      let subtitle = '';

      if (groupBy === 'month') {
        const monthNames = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        key = tx.date.slice(0, 7); // YYYY-MM
        title = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      } else if (groupBy === 'week') {
        // Calculate start of week (Monday)
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const mStr = monday.toISOString().slice(0, 10);
        const sStr = sunday.toISOString().slice(0, 10);
        key = `week_${mStr}`;
        title = `Minggu: ${monday.getDate()} - ${sunday.getDate()} ${monday.toLocaleString('id-ID', { month: 'short' })} ${monday.getFullYear()}`;
      } else {
        // Default: By Date
        key = tx.date.slice(0, 10);
        title = formatDateLabel(key);
        subtitle = key;
      }

      if (!map.has(key)) {
        map.set(key, { title, subtitle, items: [] });
      }
      map.get(key)!.items.push(tx);
    });

    const result: TransactionSection[] = [];
    map.forEach((val, groupKey) => {
      let totalInc = 0;
      let totalExp = 0;

      val.items.forEach((item) => {
        if (item.type === 'income') totalInc += item.amount;
        if (item.type === 'expense') totalExp += item.amount;
      });

      result.push({
        title: val.title,
        subtitle: val.subtitle,
        groupKey,
        totalIncome: totalInc,
        totalExpense: totalExp,
        netDiff: totalInc - totalExp,
        data: val.items,
      });
    });

    return result;
  }, [transactions, groupBy]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>RIWAYAT TRANSAKSI</Text>
      </View>

      {/* Filter Bar (Period, Types, Wallets, Categories, Search) */}
      <FilterBar
        selectedPeriod={period}
        onSelectPeriod={setPeriod}
        selectedType={typeFilter}
        onSelectType={setTypeFilter}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        selectedCategoryIds={selectedCategoryIds}
        onToggleCategory={handleToggleCategory}
        onClearCategories={handleClearCategories}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        categories={categories}
        accounts={accounts}
      />

      {/* Grouping Mode Switcher (Tanggal | Minggu | Bulan) */}
      <View style={styles.groupModeRow}>
        <Text style={[styles.groupModeLabel, { color: theme.colors.textMuted }]}>
          KELOMPOKKAN BERDASARKAN:
        </Text>
        <View style={styles.groupChips}>
          <TouchableOpacity
            onPress={() => setGroupBy('date')}
            style={[
              styles.groupChip,
              {
                backgroundColor: groupBy === 'date' ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: groupBy === 'date' ? 2 : 1.5,
              },
            ]}
          >
            <Text
              style={[
                styles.groupChipText,
                { color: groupBy === 'date' ? '#121212' : theme.colors.text },
              ]}
            >
              📅 Per Tanggal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGroupBy('week')}
            style={[
              styles.groupChip,
              {
                backgroundColor: groupBy === 'week' ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: groupBy === 'week' ? 2 : 1.5,
              },
            ]}
          >
            <Text
              style={[
                styles.groupChipText,
                { color: groupBy === 'week' ? '#121212' : theme.colors.text },
              ]}
            >
              🗓️ Per Minggu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGroupBy('month')}
            style={[
              styles.groupChip,
              {
                backgroundColor: groupBy === 'month' ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: groupBy === 'month' ? 2 : 1.5,
              },
            ]}
          >
            <Text
              style={[
                styles.groupChipText,
                { color: groupBy === 'month' ? '#121212' : theme.colors.text },
              ]}
            >
              📊 Per Bulan
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grand Summary Card (Pemasukan, Pengeluaran, Selisih) */}
      <NeoCard style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>PEMASUKAN</Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.income }]}>
              +{formatCurrency(grandSummary.income)}
            </Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>PENGELUARAN</Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.expense }]}>
              -{formatCurrency(grandSummary.expense)}
            </Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>SELISIH (NET)</Text>
            <Text
              style={[
                styles.summaryAmount,
                { color: grandSummary.net >= 0 ? theme.colors.income : theme.colors.expense },
              ]}
            >
              {formatCurrency(grandSummary.net, { showSign: true })}
            </Text>
          </View>
        </View>
      </NeoCard>

      {/* Grouped SectionList with Header Totals & Difference */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.sectionHeaderCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {/* Top Row: Section Title & Net Difference Pill */}
            <View style={styles.sectionTopRow}>
              <View
                style={[
                  styles.sectionDateBadge,
                  {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.sectionDateText}>{section.title}</Text>
              </View>

              <View
                style={[
                  styles.netDiffPill,
                  {
                    backgroundColor: section.netDiff >= 0 ? '#E8F5E9' : '#FFEBEE',
                    borderColor: section.netDiff >= 0 ? theme.colors.income : theme.colors.expense,
                  },
                ]}
              >
                <Text style={[styles.netDiffLabel, { color: theme.colors.textMuted }]}>Selisih: </Text>
                <Text
                  style={[
                    styles.netDiffAmount,
                    { color: section.netDiff >= 0 ? '#1B5E20' : '#B71C1C' },
                  ]}
                >
                  {formatCurrency(section.netDiff, { showSign: true })}
                </Text>
              </View>
            </View>

            {/* Bottom Row: Detail Pemasukan & Pengeluaran Subtotals */}
            <View style={styles.sectionBottomRow}>
              <View style={styles.subtotalItem}>
                <Ionicons name="arrow-down-circle" size={14} color={theme.colors.income} />
                <Text style={[styles.subtotalLabel, { color: theme.colors.textMuted }]}> Masuk: </Text>
                <Text style={[styles.subtotalValue, { color: theme.colors.income }]}>
                  {formatCurrency(section.totalIncome)}
                </Text>
              </View>

              <View style={styles.subtotalItem}>
                <Ionicons name="arrow-up-circle" size={14} color={theme.colors.expense} />
                <Text style={[styles.subtotalLabel, { color: theme.colors.textMuted }]}> Keluar: </Text>
                <Text style={[styles.subtotalValue, { color: theme.colors.expense }]}>
                  {formatCurrency(section.totalExpense)}
                </Text>
              </View>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={(tx) =>
              navigation.navigate('TransactionDetail', { transactionId: tx.id })
            }
          />
        )}
        ListEmptyComponent={
          <NeoCard style={styles.emptyCard}>
            <Ionicons name="search-outline" size={40} color={theme.colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Tidak Ada Transaksi
            </Text>
            <Text style={[styles.emptySub, { color: theme.colors.textMuted }]}>
              Coba sesuaikan filter atau tambahkan transaksi baru menggunakan tombol ➕ di bawah.
            </Text>
          </NeoCard>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  groupModeRow: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  groupModeLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  groupChips: {
    flexDirection: 'row',
    gap: 6,
  },
  groupChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1.5,
    height: 28,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  summaryAmount: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  sectionHeaderCard: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 8,
    marginTop: 14,
    marginBottom: 6,
  },
  sectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionDateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  sectionDateText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#121212',
  },
  netDiffPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  netDiffLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  netDiffAmount: {
    fontSize: 11,
    fontWeight: '900',
  },
  sectionBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  subtotalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  subtotalValue: {
    fontSize: 11,
    fontWeight: '800',
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
