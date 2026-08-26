import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import { formatCurrency, formatDetailedDateHeader, formatDateLabel } from '../../utils/formatters';
import {
  Transaction,
  TimePeriodFilter,
  TransactionType,
  TransactionFilterOptions,
} from '../../types';
import { getTransactions } from '../../database/transactionRepo';

interface DayGroup {
  dateKey: string;
  relative: string;
  fullDate: string;
  totalIncome: number;
  totalExpense: number;
  netDiff: number;
  items: Transaction[];
}

export const TransactionsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { categories, accounts, refreshData, isLoading, transactions: globalTx } = useAppData();

  const [period, setPeriod] = useState<TimePeriodFilter>('month');
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

  // Group transactions per 1 Day into Consolidated Day Cards
  const dayGroups: DayGroup[] = useMemo(() => {
    const map = new Map<string, Transaction[]>();

    transactions.forEach((tx) => {
      const dateKey = tx.date.slice(0, 10);
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(tx);
    });

    const result: DayGroup[] = [];
    map.forEach((items, dateKey) => {
      let dayInc = 0;
      let dayExp = 0;

      items.forEach((item) => {
        if (item.type === 'income') dayInc += item.amount;
        if (item.type === 'expense') dayExp += item.amount;
      });

      const { relative, fullDate } = formatDetailedDateHeader(dateKey);

      result.push({
        dateKey,
        relative,
        fullDate,
        totalIncome: dayInc,
        totalExpense: dayExp,
        netDiff: dayInc - dayExp,
        items,
      });
    });

    return result;
  }, [transactions]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Screen Title Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>RIWAYAT TRANSAKSI</Text>
      </View>

      {/* Filter Bar */}
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

      {/* Grand Summary Card (Pemasukan, Pengeluaran, Selisih Bersih) */}
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

      {/* Grouped Day Cards List */}
      <FlatList
        data={dayGroups}
        keyExtractor={(item) => item.dateKey}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item: day }) => (
          <NeoCard style={styles.dayConsolidatedCard}>
            {/* Day Card Header: Full Date, Relative Tag & Net Totals */}
            <View style={styles.dayCardHeader}>
              <View style={styles.dayTitleGroup}>
                {day.relative ? (
                  <View
                    style={[
                      styles.relativeBadge,
                      {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.relativeBadgeText}>{day.relative}</Text>
                  </View>
                ) : null}
                <Text style={[styles.fullDateText, { color: theme.colors.text }]}>
                  {day.fullDate}
                </Text>
              </View>

              {/* Day Net Difference Pill */}
              <View
                style={[
                  styles.dayNetPill,
                  {
                    backgroundColor:
                      day.netDiff >= 0
                        ? theme.isDark
                          ? '#1C3822'
                          : '#E8F5E9'
                        : theme.isDark
                        ? '#3D1C22'
                        : '#FFEBEE',
                    borderColor: day.netDiff >= 0 ? theme.colors.income : theme.colors.expense,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayNetPillText,
                    {
                      color:
                        day.netDiff >= 0
                          ? theme.isDark
                            ? '#54E346'
                            : '#1B5E20'
                          : theme.isDark
                          ? '#FF5D8F'
                          : '#B71C1C',
                    },
                  ]}
                >
                  {formatCurrency(day.netDiff, { showSign: true })}
                </Text>
              </View>
            </View>

            {/* Subtotal Mini Stats Bar */}
            <View style={[styles.daySubtotalRow, { backgroundColor: theme.colors.cardSecondary }]}>
              <View style={styles.daySubCol}>
                <Ionicons name="arrow-down-circle" size={13} color={theme.colors.income} />
                <Text style={[styles.daySubLabel, { color: theme.colors.textMuted }]}> Masuk: </Text>
                <Text style={[styles.daySubVal, { color: theme.colors.income }]}>
                  {formatCurrency(day.totalIncome)}
                </Text>
              </View>

              <View style={styles.daySubCol}>
                <Ionicons name="arrow-up-circle" size={13} color={theme.colors.expense} />
                <Text style={[styles.daySubLabel, { color: theme.colors.textMuted }]}> Keluar: </Text>
                <Text style={[styles.daySubVal, { color: theme.colors.expense }]}>
                  {formatCurrency(day.totalExpense)}
                </Text>
              </View>
            </View>

            {/* Transactions Inside This Day Card */}
            <View style={styles.dayItemsContainer}>
              {day.items.map((tx, idx) => (
                <View key={tx.id}>
                  <TransactionItem
                    transaction={tx}
                    onPress={(item) =>
                      navigation.navigate('TransactionDetail', { transactionId: item.id })
                    }
                  />
                  {idx < day.items.length - 1 && (
                    <View style={[styles.itemDivider, { backgroundColor: theme.colors.border }]} />
                  )}
                </View>
              ))}
            </View>
          </NeoCard>
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
    paddingBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
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
    paddingTop: 6,
    paddingBottom: 110,
  },
  dayConsolidatedCard: {
    padding: 12,
    marginBottom: 14,
  },
  dayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  dayTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    marginRight: 6,
  },
  relativeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  relativeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#121212',
  },
  fullDateText: {
    fontSize: 12,
    fontWeight: '900',
  },
  dayNetPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  dayNetPillText: {
    fontSize: 11,
    fontWeight: '900',
  },
  daySubtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  daySubCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daySubLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  daySubVal: {
    fontSize: 11,
    fontWeight: '900',
  },
  dayItemsContainer: {
    marginTop: 6,
  },
  itemDivider: {
    height: 1,
    opacity: 0.15,
    marginVertical: 4,
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
