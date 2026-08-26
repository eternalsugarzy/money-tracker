import React, { useState, useEffect, useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
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

interface TransactionSection {
  title: string;
  dateKey: string;
  dayTotalIncome: number;
  dayTotalExpense: number;
  data: Transaction[];
}

export const TransactionsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { categories, accounts, refreshData, isLoading } = useAppData();

  const [period, setPeriod] = useState<TimePeriodFilter>('month');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
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
  };

  useEffect(() => {
    fetchTransactions();
  }, [period, typeFilter, selectedAccountId, selectedCategoryIds, searchQuery]);

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

  // Compute live summary from filtered list
  const summary = useMemo(() => {
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

  // Group transactions by date for SectionList
  const sections: TransactionSection[] = useMemo(() => {
    const map = new Map<string, Transaction[]>();

    transactions.forEach((tx) => {
      const dateKey = tx.date.slice(0, 10);
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(tx);
    });

    const result: TransactionSection[] = [];
    map.forEach((items, dateKey) => {
      let dayInc = 0;
      let dayExp = 0;
      items.forEach((item) => {
        if (item.type === 'income') dayInc += item.amount;
        if (item.type === 'expense') dayExp += item.amount;
      });

      result.push({
        title: formatDateLabel(dateKey),
        dateKey,
        dayTotalIncome: dayInc,
        dayTotalExpense: dayExp,
        data: items,
      });
    });

    return result;
  }, [transactions]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
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

      {/* Real-time Summary Header for Active Filters */}
      <NeoCard style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>PEMASUKAN</Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.income }]}>
              {formatCurrency(summary.income)}
            </Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>PENGELUARAN</Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.expense }]}>
              {formatCurrency(summary.expense)}
            </Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.summaryCol}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>SELISIH (NET)</Text>
            <Text
              style={[
                styles.summaryAmount,
                { color: summary.net >= 0 ? theme.colors.income : theme.colors.expense },
              ]}
            >
              {formatCurrency(summary.net, { showSign: true })}
            </Text>
          </View>
        </View>
      </NeoCard>

      {/* Date-Grouped Transaction List */}
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
          <View style={styles.sectionHeaderRow}>
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

            <View style={styles.sectionTotalsRow}>
              {section.dayTotalIncome > 0 && (
                <Text style={[styles.dayTotalText, { color: theme.colors.income }]}>
                  +{formatCurrency(section.dayTotalIncome)}
                </Text>
              )}
              {section.dayTotalExpense > 0 && (
                <Text
                  style={[
                    styles.dayTotalText,
                    { color: theme.colors.expense, marginLeft: 8 },
                  ]}
                >
                  -{formatCurrency(section.dayTotalExpense)}
                </Text>
              )}
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
              Tidak ada transaksi ditemukan
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
              Coba ubah filter periode atau kata kunci pencarian.
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
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 12,
    fontWeight: '900',
  },
  summaryDivider: {
    width: 1.5,
    height: 28,
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  sectionDateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderRadius: 6,
  },
  sectionDateText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#121212',
  },
  sectionTotalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTotalText: {
    fontSize: 11,
    fontWeight: '800',
  },
  emptyCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});
