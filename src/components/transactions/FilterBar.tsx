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
import { useLanguage } from '../../context/LanguageContext';
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
  const { t, language } = useLanguage();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAdvanceFilters, setShowAdvanceFilters] = useState(false);

  const PERIODS: { key: TimePeriodFilter; label: string }[] = [
    { key: 'day', label: t.day },
    { key: 'week', label: t.week },
    { key: 'month', label: t.month },
    { key: 'year', label: t.year },
    { key: 'all', label: t.all },
  ];

  const TYPES: { key: TransactionType | 'all'; label: string; icon: string; color: string }[] = [
    { key: 'all', label: t.all, icon: 'apps', color: theme.colors.cardSecondary },
    { key: 'income', label: language === 'id' ? 'Masuk' : 'Income', icon: 'arrow-down', color: theme.colors.income },
    { key: 'expense', label: language === 'id' ? 'Keluar' : 'Expense', icon: 'arrow-up', color: theme.colors.expense },
    { key: 'transfer', label: 'Transfer', icon: 'swap-horizontal', color: theme.colors.transfer },
  ];

  const selectedAccountObj = accounts.find((a) => a.id === selectedAccountId);
  const hasActiveExtraFilters =
    selectedType !== 'all' || !!selectedAccountId || selectedCategoryIds.length > 0;

  const handleResetFilters = () => {
    onSelectType('all');
    onSelectAccount(undefined);
    onClearCategories();
    onChangeSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {/* Search Input Row */}
      <View style={styles.topSearchRow}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="search" size={16} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
          <TextInput
            placeholder={t.searchPlaceholder}
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

        {/* Filter Toggle Button */}
        <TouchableOpacity
          onPress={() => setShowAdvanceFilters(!showAdvanceFilters)}
          style={[
            styles.filterToggleBtn,
            {
              backgroundColor: hasActiveExtraFilters ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name={showAdvanceFilters ? 'options' : 'options-outline'}
            size={18}
            color={hasActiveExtraFilters ? '#121212' : theme.colors.text}
          />
          {hasActiveExtraFilters && (
            <View style={styles.activeFilterDot} />
          )}
        </TouchableOpacity>
      </View>

      {/* Period Chips (Row 1) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.periodRow}
      >
        {PERIODS.map((p) => {
          const isActive = selectedPeriod === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              onPress={() => onSelectPeriod(p.key)}
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

      {/* Extra Filters Drawer / Bar (Collapsible or Shown when toggled/active) */}
      {showAdvanceFilters && (
        <View
          style={[
            styles.extraFilterBox,
            {
              backgroundColor: theme.colors.cardSecondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Transaction Type Row */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterMiniTitle, { color: theme.colors.textMuted }]}>
              {language === 'id' ? 'TIPE TRANSAKSI:' : 'TRANSACTION TYPE:'}
            </Text>
            <View style={styles.typeButtonsRow}>
              {TYPES.map((t) => {
                const isSelected = selectedType === t.key;
                return (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => onSelectType(t.key)}
                    style={[
                      styles.typeChipBtn,
                      {
                        backgroundColor: isSelected ? t.color : theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    <Ionicons
                      name={t.icon as any}
                      size={11}
                      color={isSelected ? '#121212' : theme.colors.text}
                      style={{ marginRight: 3 }}
                    />
                    <Text
                      style={[
                        styles.typeChipText,
                        {
                          color: isSelected ? '#121212' : theme.colors.text,
                          fontWeight: isSelected ? '900' : '600',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Account & Category Picker Buttons */}
          <View style={styles.pickerButtonsRow}>
            {/* Account Trigger */}
            <TouchableOpacity
              onPress={() => setShowAccountModal(true)}
              style={[
                styles.selectTriggerBtn,
                {
                  backgroundColor: selectedAccountId ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="wallet-outline" size={13} color={theme.colors.text} />
              <Text
                style={[
                  styles.selectTriggerText,
                  { color: theme.colors.text },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedAccountObj ? selectedAccountObj.name : (language === 'id' ? 'Semua Dompet' : 'All Wallets')}
              </Text>
              <Ionicons name="chevron-down" size={12} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Category Trigger */}
            <TouchableOpacity
              onPress={() => setShowCategoryModal(true)}
              style={[
                styles.selectTriggerBtn,
                {
                  backgroundColor: selectedCategoryIds.length > 0 ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="grid-outline" size={13} color={theme.colors.text} />
              <Text
                style={[
                  styles.selectTriggerText,
                  { color: theme.colors.text },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedCategoryIds.length > 0
                  ? (language === 'id' ? `${selectedCategoryIds.length} Kategori` : `${selectedCategoryIds.length} Categories`)
                  : (language === 'id' ? 'Semua Kategori' : 'All Categories')}
              </Text>
              <Ionicons name="chevron-down" size={12} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Reset Button */}
            {hasActiveExtraFilters && (
              <TouchableOpacity
                onPress={handleResetFilters}
                style={[
                  styles.resetBtn,
                  {
                    backgroundColor: theme.colors.expense,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons name="refresh" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Category Multi-Select Modal */}
      <NeoModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="FILTER KATEGORI"
      >
        <View style={styles.modalContent}>
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.catGridModal}>
              {categories
                .filter((c) => c.is_archived === 0)
                .map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => onToggleCategory(cat.id)}
                      style={[
                        styles.catModalCard,
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
                          styles.catModalName,
                          {
                            color: isSelected ? '#121212' : theme.colors.text,
                            fontWeight: isSelected ? '900' : '600',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </ScrollView>

          <View style={styles.modalActionRow}>
            <NeoButton
              title="RESET"
              variant="outline"
              size="sm"
              onPress={onClearCategories}
              style={{ flex: 1, marginRight: 8 }}
            />
            <NeoButton
              title="TERAPKAN"
              variant="primary"
              size="sm"
              onPress={() => setShowCategoryModal(false)}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </NeoModal>

      {/* Account Select Modal */}
      <NeoModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title="FILTER DOMPET / AKUN"
      >
        <View style={styles.modalContent}>
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => {
                onSelectAccount(undefined);
                setShowAccountModal(false);
              }}
              style={[
                styles.accountModalItem,
                {
                  backgroundColor: !selectedAccountId ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.accountModalText,
                  { color: '#121212', fontWeight: !selectedAccountId ? '900' : '600' },
                ]}
              >
                Semua Dompet / Akun
              </Text>
              {!selectedAccountId && <Ionicons name="checkmark-circle" size={18} color="#121212" />}
            </TouchableOpacity>

            {accounts
              .filter((a) => a.is_archived === 0)
              .map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => {
                      onSelectAccount(acc.id);
                      setShowAccountModal(false);
                    }}
                    style={[
                      styles.accountModalItem,
                      {
                        backgroundColor: isSelected ? acc.color : theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderWidth: isSelected ? 2.5 : 1.5,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <NeoBadge
                        icon={acc.icon}
                        iconFamily={acc.icon_family}
                        color={isSelected ? '#FFFFFF' : acc.color}
                        size="sm"
                      />
                      <Text
                        style={[
                          styles.accountModalText,
                          {
                            color: isSelected ? '#121212' : theme.colors.text,
                            fontWeight: isSelected ? '900' : '600',
                            marginLeft: 10,
                          },
                        ]}
                      >
                        {acc.name}
                      </Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color="#121212" />}
                  </TouchableOpacity>
                );
              })}
          </ScrollView>

          <NeoButton
            title="TUTUP"
            variant="outline"
            size="sm"
            onPress={() => setShowAccountModal(false)}
            style={{ marginTop: 10 }}
          />
        </View>
      </NeoModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  topSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    padding: 0,
  },
  filterToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeFilterDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF3366',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
  },
  periodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodChipText: {
    fontSize: 11,
  },
  extraFilterBox: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    marginBottom: 6,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterMiniTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  typeButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typeChipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeChipText: {
    fontSize: 10,
  },
  pickerButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  selectTriggerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  selectTriggerText: {
    fontSize: 11,
    fontWeight: '800',
    flex: 1,
    marginHorizontal: 4,
  },
  resetBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    paddingTop: 8,
  },
  modalScroll: {
    maxHeight: 340,
  },
  catGridModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 10,
  },
  catModalCard: {
    width: '30.5%',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catModalName: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  modalActionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  accountModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginVertical: 4,
  },
  accountModalText: {
    fontSize: 13,
  },
});
