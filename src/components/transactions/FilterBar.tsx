import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { TimePeriodFilter, TransactionType, Category, Account } from '../../types';
import { NeoModal } from '../common/NeoModal';
import { NeoButton } from '../common/NeoButton';
import { NeoBadge } from '../common/NeoBadge';

interface FilterBarProps {
  selectedPeriod: TimePeriodFilter;
  onSelectPeriod: (period: TimePeriodFilter) => void;
  selectedType: TransactionType | 'all';
  onSelectType: (type: TransactionType | 'all') => void;
  selectedAccountId?: string;
  onSelectAccount: (accId?: string) => void;
  selectedCategoryIds: string[];
  onToggleCategory: (catId: string) => void;
  onClearCategories: () => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  categories: Category[];
  accounts: Account[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedPeriod,
  onSelectPeriod,
  selectedType,
  onSelectType,
  selectedAccountId,
  onSelectAccount,
  selectedCategoryIds,
  onToggleCategory,
  onClearCategories,
  searchQuery,
  onChangeSearchQuery,
  categories,
  accounts,
}) => {
  const { theme } = useTheme();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const PERIODS: { key: TimePeriodFilter; label: string }[] = [
    { key: 'day', label: 'Hari ini' },
    { key: 'week', label: 'Minggu ini' },
    { key: 'month', label: 'Bulan ini' },
    { key: 'year', label: 'Tahun ini' },
    { key: 'all', label: 'Semua' },
  ];

  const TYPES: { key: TransactionType | 'all'; label: string }[] = [
    { key: 'all', label: 'Semua Tipe' },
    { key: 'income', label: 'Pemasukan' },
    { key: 'expense', label: 'Pengeluaran' },
    { key: 'transfer', label: 'Transfer' },
  ];

  const selectedAccountObj = accounts.find((a) => a.id === selectedAccountId);

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: theme.colors.border,
            borderWidth: 2,
          },
        ]}
      >
        <Ionicons name="search" size={18} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Cari transaksi / nominal..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={onChangeSearchQuery}
          style={[styles.searchInput, { color: theme.colors.text }]}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onChangeSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Period Chips Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {PERIODS.map((p) => {
          const isActive = selectedPeriod === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              onPress={() => onSelectPeriod(p.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive ? '#121212' : theme.colors.text,
                    fontWeight: isActive ? '900' : '700',
                  },
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Secondary Filter Buttons: Type, Account, Category */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.chipsRow, { marginTop: 6 }]}
      >
        {/* Type Filter Selector */}
        {TYPES.map((t) => {
          const isTypeActive = selectedType === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              onPress={() => onSelectType(t.key)}
              style={[
                styles.subChip,
                {
                  backgroundColor: isTypeActive
                    ? t.key === 'income'
                      ? theme.colors.income
                      : t.key === 'expense'
                      ? theme.colors.expense
                      : t.key === 'transfer'
                      ? theme.colors.transfer
                      : theme.colors.text
                    : theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text
                style={[
                  styles.subChipText,
                  {
                    color: isTypeActive ? (t.key === 'all' ? '#FFFFFF' : '#121212') : theme.colors.text,
                    fontWeight: isTypeActive ? '900' : '700',
                  },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Account Filter Trigger */}
        <TouchableOpacity
          onPress={() => setShowAccountModal(true)}
          style={[
            styles.filterTriggerBtn,
            {
              backgroundColor: selectedAccountId ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="wallet-outline" size={14} color={theme.colors.text} style={{ marginRight: 4 }} />
          <Text style={[styles.filterTriggerText, { color: theme.colors.text }]}>
            {selectedAccountObj ? selectedAccountObj.name : 'Semua Akun'}
          </Text>
          <Ionicons name="chevron-down" size={12} color={theme.colors.text} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {/* Category Multi-select Filter Trigger */}
        <TouchableOpacity
          onPress={() => setShowCategoryModal(true)}
          style={[
            styles.filterTriggerBtn,
            {
              backgroundColor: selectedCategoryIds.length > 0 ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="grid-outline" size={14} color={theme.colors.text} style={{ marginRight: 4 }} />
          <Text style={[styles.filterTriggerText, { color: theme.colors.text }]}>
            {selectedCategoryIds.length > 0
              ? `${selectedCategoryIds.length} Kategori`
              : 'Semua Kategori'}
          </Text>
          <Ionicons name="chevron-down" size={12} color={theme.colors.text} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* Category Multi-Select Modal */}
      <NeoModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="FILTER KATEGORI"
        subtitle="Pilih satu atau beberapa kategori"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalActionHeader}>
            <TouchableOpacity onPress={onClearCategories} style={styles.clearBtn}>
              <Text style={[styles.clearBtnText, { color: theme.colors.expense }]}>
                Reset (Pilih Semua)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => onToggleCategory(cat.id)}
                  style={[
                    styles.catSelectItem,
                    {
                      backgroundColor: isSelected ? cat.color : theme.colors.surface,
                      borderColor: theme.colors.border,
                      borderWidth: isSelected ? 2.5 : 1.5,
                    },
                  ]}
                >
                  <NeoBadge
                    icon={cat.icon}
                    iconFamily={cat.icon_family}
                    color={isSelected ? '#FFFFFF' : cat.color}
                    size="sm"
                  />
                  <Text
                    style={[
                      styles.catSelectName,
                      { color: theme.colors.text, fontWeight: isSelected ? '900' : '600' },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <NeoButton
            title="TERAPKAN FILTER"
            variant="primary"
            onPress={() => setShowCategoryModal(false)}
            style={{ marginTop: 16 }}
          />
        </View>
      </NeoModal>

      {/* Account Select Modal */}
      <NeoModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title="FILTER AKUN / DOMPET"
        subtitle="Pilih dompet yang ingin dilihat"
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => {
              onSelectAccount(undefined);
              setShowAccountModal(false);
            }}
            style={[
              styles.accSelectItem,
              {
                backgroundColor: !selectedAccountId ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 2,
              },
            ]}
          >
            <Ionicons name="apps-outline" size={20} color="#121212" style={{ marginRight: 10 }} />
            <Text style={[styles.accSelectName, { color: theme.colors.text }]}>Semua Akun</Text>
          </TouchableOpacity>

          {accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id;
            return (
              <TouchableOpacity
                key={acc.id}
                onPress={() => {
                  onSelectAccount(acc.id);
                  setShowAccountModal(false);
                }}
                style={[
                  styles.accSelectItem,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: 2,
                  },
                ]}
              >
                <NeoBadge
                  icon={acc.icon}
                  iconFamily={acc.icon_family}
                  color={acc.color}
                  size="sm"
                />
                <Text
                  style={[
                    styles.accSelectName,
                    { color: theme.colors.text, fontWeight: isSelected ? '900' : '600', marginLeft: 10 },
                  ]}
                >
                  {acc.name} ({acc.type})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </NeoModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
  },
  subChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subChipText: {
    fontSize: 11,
  },
  filterTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  filterTriggerText: {
    fontSize: 11,
    fontWeight: '800',
  },
  modalContent: {
    paddingVertical: 6,
  },
  modalActionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catSelectItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  catSelectName: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  accSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  accSelectName: {
    fontSize: 14,
  },
});
