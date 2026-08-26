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
import { formatDateLabel } from '../../utils/formatters';

interface FilterBarProps {
  selectedPeriod: TimePeriodFilter;
  onSelectPeriod: (period: TimePeriodFilter) => void;
  startDate?: string;
  endDate?: string;
  onSelectDateRange?: (startDate: string, endDate: string) => void;
  selectedType: TransactionType | 'all';
  onSelectType: (type: TransactionType | 'all') => void;
  selectedAccountId?: string;
  onSelectAccount(accId?: string): void;
  selectedCategoryIds: string[];
  onToggleCategory(catId: string): void;
  onClearCategories(): void;
  searchQuery: string;
  onChangeSearchQuery(query: string): void;
  categories: Category[];
  accounts: Account[];
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedPeriod,
  onSelectPeriod,
  startDate,
  endDate,
  onSelectDateRange,
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

  // Custom Date Range Modal State
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<string>(
    startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
  );
  const [tempEndDate, setTempEndDate] = useState<string>(
    endDate || new Date().toISOString().slice(0, 10)
  );
  const [activeDateTarget, setActiveDateTarget] = useState<'start' | 'end'>('start');

  // Calendar View Month & Year Navigation
  const now = new Date();
  const [calYear, setCalYear] = useState<number>(now.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(now.getMonth());

  const monthNames = language === 'id' ? MONTH_NAMES_ID : MONTH_NAMES_EN;

  const PERIODS: { key: TimePeriodFilter; label: string }[] = [
    { key: 'day', label: t.day },
    { key: 'week', label: t.week },
    { key: 'month', label: t.month },
    { key: 'year', label: t.year },
    { key: 'all', label: t.all },
    {
      key: 'custom',
      label:
        selectedPeriod === 'custom' && startDate && endDate
          ? `📅 ${startDate.slice(5).replace('-', '/')} - ${endDate.slice(5).replace('-', '/')}`
          : (language === 'id' ? '📅 Rentang Tgl' : '📅 Date Range'),
    },
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

  const handlePeriodPress = (periodKey: TimePeriodFilter) => {
    if (periodKey === 'custom') {
      // Sync initial calendar view to current tempStartDate
      const cur = new Date(tempStartDate || new Date());
      if (!isNaN(cur.getTime())) {
        setCalYear(cur.getFullYear());
        setCalMonth(cur.getMonth());
      }
      setShowDateRangeModal(true);
    } else {
      onSelectPeriod(periodKey);
    }
  };

  const handleApplyCustomDateRange = () => {
    let finalStart = tempStartDate;
    let finalEnd = tempEndDate;
    if (finalStart > finalEnd) {
      // Swap if user selected start date after end date
      const tmp = finalStart;
      finalStart = finalEnd;
      finalEnd = tmp;
    }

    if (onSelectDateRange) {
      onSelectDateRange(finalStart, finalEnd);
    } else {
      onSelectPeriod('custom');
    }
    setShowDateRangeModal(false);
  };

  const handleResetDateRange = () => {
    onSelectPeriod('month');
    const firstDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
    const todayStr = new Date().toISOString().slice(0, 10);
    setTempStartDate(firstDayThisMonth);
    setTempEndDate(todayStr);
    setCalYear(new Date().getFullYear());
    setCalMonth(new Date().getMonth());
    if (onSelectDateRange) {
      onSelectDateRange(firstDayThisMonth, todayStr);
    }
    setShowDateRangeModal(false);
  };

  const handlePresetDateRange = (preset: '7days' | '30days' | 'thisMonth' | 'lastMonth' | 'thisYear') => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (preset === '7days') {
      const past7 = new Date();
      past7.setDate(today.getDate() - 6);
      const start = past7.toISOString().slice(0, 10);
      setTempStartDate(start);
      setTempEndDate(todayStr);
      setCalYear(past7.getFullYear());
      setCalMonth(past7.getMonth());
    } else if (preset === '30days') {
      const past30 = new Date();
      past30.setDate(today.getDate() - 29);
      const start = past30.toISOString().slice(0, 10);
      setTempStartDate(start);
      setTempEndDate(todayStr);
      setCalYear(past30.getFullYear());
      setCalMonth(past30.getMonth());
    } else if (preset === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const start = firstDay.toISOString().slice(0, 10);
      setTempStartDate(start);
      setTempEndDate(todayStr);
      setCalYear(today.getFullYear());
      setCalMonth(today.getMonth());
    } else if (preset === 'lastMonth') {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      setTempStartDate(firstDayLastMonth.toISOString().slice(0, 10));
      setTempEndDate(lastDayLastMonth.toISOString().slice(0, 10));
      setCalYear(firstDayLastMonth.getFullYear());
      setCalMonth(firstDayLastMonth.getMonth());
    } else if (preset === 'thisYear') {
      const firstDayYear = new Date(today.getFullYear(), 0, 1);
      setTempStartDate(firstDayYear.toISOString().slice(0, 10));
      setTempEndDate(todayStr);
      setCalYear(today.getFullYear());
      setCalMonth(0);
    }
  };

  const handlePrevCalMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextCalMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const handleDaySelect = (dayNumber: number) => {
    const yStr = calYear.toString();
    const mStr = String(calMonth + 1).padStart(2, '0');
    const dStr = String(dayNumber).padStart(2, '0');
    const formattedDate = `${yStr}-${mStr}-${dStr}`;

    if (activeDateTarget === 'start') {
      setTempStartDate(formattedDate);
      // Auto move focus to End date if end date is before new start date
      if (formattedDate > tempEndDate) {
        setTempEndDate(formattedDate);
      }
      setActiveDateTarget('end');
    } else {
      if (formattedDate < tempStartDate) {
        setTempStartDate(formattedDate);
      } else {
        setTempEndDate(formattedDate);
      }
    }
  };

  const handleResetFilters = () => {
    onSelectType('all');
    onSelectAccount(undefined);
    onClearCategories();
    onChangeSearchQuery('');
  };

  // Calendar geometry calculations
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0 = Sunday

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
              onPress={() => handlePeriodPress(p.key)}
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

      {/* Active Custom Date Range Indicator Banner */}
      {selectedPeriod === 'custom' && startDate && endDate && (
        <View
          style={[
            styles.customRangeBanner,
            {
              backgroundColor: theme.colors.cardSecondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              const cur = new Date(startDate);
              if (!isNaN(cur.getTime())) {
                setCalYear(cur.getFullYear());
                setCalMonth(cur.getMonth());
              }
              setShowDateRangeModal(true);
            }}
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          >
            <Ionicons name="calendar" size={14} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.customRangeText, { color: theme.colors.text }]} numberOfLines={1}>
              {language === 'id' ? 'Rentang' : 'Range'}: {startDate} s/d {endDate}
            </Text>
            <Text style={[styles.customRangeEdit, { color: theme.colors.primary }]}>
              {language === 'id' ? ' (Ubah)' : ' (Edit)'}
            </Text>
          </TouchableOpacity>

          {/* Quick Reset Button back to Default (Month) */}
          <TouchableOpacity
            onPress={handleResetDateRange}
            style={[
              styles.resetBannerBtn,
              { backgroundColor: theme.colors.expense, borderColor: theme.colors.border },
            ]}
          >
            <Ionicons name="close-circle" size={13} color="#FFFFFF" style={{ marginRight: 3 }} />
            <Text style={styles.resetBannerBtnText}>
              {language === 'id' ? 'Reset' : 'Reset'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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

      {/* Integrated Single-Modal Custom Date Range Picker */}
      <NeoModal
        visible={showDateRangeModal}
        onClose={() => setShowDateRangeModal(false)}
        title={language === 'id' ? 'RENTANG TANGGAL KUSTOM' : 'CUSTOM DATE RANGE'}
        subtitle={language === 'id' ? 'Pilih tanggal awal dan akhir transaksi' : 'Select start and end dates'}
      >
        <View style={styles.modalContent}>
          {/* Quick Presets */}
          <Text style={[styles.presetTitle, { color: theme.colors.textMuted }]}>
            {language === 'id' ? 'PILIHAN CEPAT (PRESET):' : 'QUICK PRESETS:'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            <TouchableOpacity
              onPress={() => handlePresetDateRange('7days')}
              style={[styles.presetChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.presetChipText, { color: theme.colors.text }]}>⚡ 7 Hari</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePresetDateRange('30days')}
              style={[styles.presetChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.presetChipText, { color: theme.colors.text }]}>⚡ 30 Hari</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePresetDateRange('thisMonth')}
              style={[styles.presetChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.presetChipText, { color: theme.colors.text }]}>
                {language === 'id' ? 'Bulan Ini' : 'This Month'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePresetDateRange('lastMonth')}
              style={[styles.presetChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.presetChipText, { color: theme.colors.text }]}>
                {language === 'id' ? 'Bulan Lalu' : 'Last Month'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePresetDateRange('thisYear')}
              style={[styles.presetChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.presetChipText, { color: theme.colors.text }]}>
                {language === 'id' ? 'Tahun Ini' : 'This Year'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Start Date vs End Date Target Selector Tabs */}
          <View style={styles.rangeBoxesRow}>
            {/* Start Date Target Tab */}
            <TouchableOpacity
              onPress={() => setActiveDateTarget('start')}
              style={[
                styles.rangeDateTab,
                {
                  backgroundColor: activeDateTarget === 'start' ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: activeDateTarget === 'start' ? 2 : 1.5,
                },
              ]}
            >
              <Text style={[styles.rangeBoxLabel, { color: activeDateTarget === 'start' ? '#121212' : theme.colors.textMuted }]}>
                {language === 'id' ? '1. DARI TANGGAL' : '1. START DATE'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons
                  name="calendar"
                  size={14}
                  color={activeDateTarget === 'start' ? '#121212' : theme.colors.text}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.rangeDateText, { color: activeDateTarget === 'start' ? '#121212' : theme.colors.text }]} numberOfLines={1}>
                  {tempStartDate}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.rangeArrow}>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />
            </View>

            {/* End Date Target Tab */}
            <TouchableOpacity
              onPress={() => setActiveDateTarget('end')}
              style={[
                styles.rangeDateTab,
                {
                  backgroundColor: activeDateTarget === 'end' ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: activeDateTarget === 'end' ? 2 : 1.5,
                },
              ]}
            >
              <Text style={[styles.rangeBoxLabel, { color: activeDateTarget === 'end' ? '#121212' : theme.colors.textMuted }]}>
                {language === 'id' ? '2. SAMPAI TANGGAL' : '2. END DATE'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons
                  name="calendar"
                  size={14}
                  color={activeDateTarget === 'end' ? '#121212' : theme.colors.text}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.rangeDateText, { color: activeDateTarget === 'end' ? '#121212' : theme.colors.text }]} numberOfLines={1}>
                  {tempEndDate}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Embedded Calendar Grid */}
          <View
            style={[
              styles.calendarContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {/* Month & Year Navigator */}
            <View style={styles.calNavHeader}>
              <TouchableOpacity onPress={handlePrevCalMonth} style={styles.calNavBtn}>
                <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.calNavTitle, { color: theme.colors.text }]}>
                {monthNames[calMonth]} {calYear}
              </Text>
              <TouchableOpacity onPress={handleNextCalMonth} style={styles.calNavBtn}>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Day Names Row */}
            <View style={styles.dayNamesRow}>
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                <Text
                  key={d}
                  style={[
                    styles.dayNameText,
                    { color: i === 0 ? theme.colors.expense : theme.colors.textMuted },
                  ]}
                >
                  {d}
                </Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <View key={`empty_${idx}`} style={styles.dayCell} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const mStr = String(calMonth + 1).padStart(2, '0');
                const dStr = String(dayNum).padStart(2, '0');
                const cellDate = `${calYear}-${mStr}-${dStr}`;

                const isStart = cellDate === tempStartDate;
                const isEnd = cellDate === tempEndDate;
                const isInRange = cellDate > tempStartDate && cellDate < tempEndDate;

                return (
                  <TouchableOpacity
                    key={`day_${dayNum}`}
                    onPress={() => handleDaySelect(dayNum)}
                    style={[
                      styles.dayCell,
                      isStart && [
                        styles.selectedDayCell,
                        {
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.border,
                          borderWidth: 1.5,
                        },
                      ],
                      isEnd && [
                        styles.selectedDayCell,
                        {
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.border,
                          borderWidth: 1.5,
                        },
                      ],
                      isInRange && [
                        styles.inRangeDayCell,
                        {
                          backgroundColor: theme.isDark ? '#2A2A1A' : '#FFF9C4',
                        },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: (isStart || isEnd) ? '#121212' : theme.colors.text,
                          fontWeight: (isStart || isEnd) ? '900' : isInRange ? '800' : '600',
                        },
                      ]}
                    >
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Buttons: Reset & Apply */}
          <View style={styles.dateModalActionRow}>
            <NeoButton
              title={language === 'id' ? 'RESET KE BULAN INI' : 'RESET TO THIS MONTH'}
              variant="outline"
              size="sm"
              onPress={handleResetDateRange}
              style={{ flex: 1, marginRight: 8 }}
            />
            <NeoButton
              title={language === 'id' ? 'TERAPKAN' : 'APPLY'}
              variant="primary"
              size="sm"
              onPress={handleApplyCustomDateRange}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </NeoModal>

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
  customRangeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  customRangeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  customRangeEdit: {
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 6,
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
    paddingHorizontal: 2,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  typeChipText: {
    fontSize: 9.5,
    fontWeight: '900',
    textAlign: 'center',
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
    fontSize: 10.5,
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
    paddingVertical: 4,
  },
  presetTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    marginRight: 6,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  rangeBoxesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
  },
  rangeDateTab: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rangeBoxLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rangeDateText: {
    fontSize: 12,
    fontWeight: '800',
  },
  rangeArrow: {
    paddingTop: 8,
  },
  calendarContainer: {
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 8,
  },
  calNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calNavTitle: {
    fontSize: 12,
    fontWeight: '900',
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayNameText: {
    width: 32,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
    borderRadius: 6,
  },
  selectedDayCell: {
    borderRadius: 6,
  },
  inRangeDayCell: {
    borderRadius: 2,
  },
  dayText: {
    fontSize: 11,
  },
  modalScroll: {
    maxHeight: 320,
  },
  catGridModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  catModalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: '48%',
  },
  catModalName: {
    fontSize: 11,
    marginLeft: 6,
    flex: 1,
  },
  modalActionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  accountModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  accountModalText: {
    fontSize: 13,
  },
  resetBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    marginLeft: 6,
  },
  resetBannerBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dateModalActionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
});
