import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoBadge } from '../../components/common/NeoBadge';
import { NeoCalculator } from '../../components/common/NeoCalculator';
import { NeoDatePicker } from '../../components/common/NeoDatePicker';
import { formatCurrency, formatDateLabel, getTodayDateString } from '../../utils/formatters';
import { evaluateMathExpression } from '../../utils/mathEvaluator';
import { RecurringInterval, TransactionType } from '../../types';
import { createRecurring, updateRecurring, deleteRecurring } from '../../database/recurringRepo';

export const RecurringFormModal: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { accounts, categories, refreshData } = useAppData();

  const editRecurring = route.params?.editRecurring;
  const isEditing = !!editRecurring;

  const [type, setType] = useState<TransactionType>(
    isEditing ? editRecurring.type : 'expense'
  );
  const [amountExpr, setAmountExpr] = useState<string>(
    isEditing ? String(editRecurring.amount) : ''
  );
  // Default to true: directly show built-in calculator, no phone keyboard
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    isEditing && editRecurring.account_id ? editRecurring.account_id : accounts[0]?.id || ''
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    isEditing && editRecurring.category_id
      ? editRecurring.category_id
      : categories[0]?.id || ''
  );
  const [interval, setInterval] = useState<RecurringInterval>(
    isEditing ? editRecurring.interval : 'monthly'
  );
  const [note, setNote] = useState<string>(isEditing ? editRecurring.note : '');
  const [startDate, setStartDate] = useState<string>(
    isEditing ? editRecurring.start_date : getTodayDateString()
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Dropdown & Search state for categories
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');

  const activeCategories = categories.filter((c) => c.is_archived === 0);
  const selectedCategory = activeCategories.find((c) => c.id === selectedCategoryId) || activeCategories[0];

  const displayedCategories = categorySearchQuery.trim()
    ? activeCategories.filter((c) =>
        c.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
      )
    : activeCategories;

  const handleSave = async () => {
    const evalRes = evaluateMathExpression(amountExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Silakan masukkan nominal transaksi yang valid via kalkulator.');
      return;
    }

    try {
      if (isEditing) {
        await updateRecurring(editRecurring.id, {
          type,
          amount: evalRes.value,
          account_id: selectedAccountId,
          category_id: selectedCategoryId || null,
          note: note.trim(),
          interval,
          start_date: startDate,
        });
      } else {
        await createRecurring({
          type,
          amount: evalRes.value,
          account_id: selectedAccountId,
          to_account_id: null,
          category_id: selectedCategoryId || null,
          note: note.trim(),
          interval,
          start_date: startDate,
          end_date: null,
          last_prompted_date: null,
          is_active: 1,
        });
      }

      await refreshData();
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleDelete = () => {
    if (!editRecurring) return;
    Alert.alert('Hapus Recurring', 'Hapus pengingat transaksi berulang ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteRecurring(editRecurring.id);
          await refreshData();
          navigation.goBack();
        },
      },
    ]);
  };

  const getComputedDisplayAmount = () => {
    const res = evaluateMathExpression(amountExpr);
    return res.isValid ? formatCurrency(res.value) : 'Rp 0';
  };

  const INTERVALS: { key: RecurringInterval; label: string }[] = [
    { key: 'daily', label: 'Harian' },
    { key: 'weekly', label: 'Mingguan' },
    { key: 'monthly', label: 'Bulanan' },
    { key: 'yearly', label: 'Tahunan' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.closeBtn,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons name="close" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isEditing ? 'EDIT RECURRING' : 'TAMBAH RECURRING'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Type Choice */}
          <View style={styles.typeRow}>
            <TouchableOpacity
              onPress={() => setType('expense')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: type === 'expense' ? theme.colors.expense : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: type === 'expense' ? 2.5 : 1.5,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  { color: type === 'expense' ? '#FFFFFF' : theme.colors.text },
                ]}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setType('income')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: type === 'income' ? theme.colors.income : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: type === 'income' ? 2.5 : 1.5,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  { color: type === 'income' ? '#0A3B0A' : theme.colors.text },
                ]}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nominal Amount Box with Direct Calculator */}
          <NeoCard style={styles.card}>
            <View style={styles.limitHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>NOMINAL</Text>
              <TouchableOpacity
                onPress={() => setShowCalculator(!showCalculator)}
                style={[
                  styles.calcBtn,
                  {
                    backgroundColor: showCalculator ? theme.colors.primary : theme.colors.cardSecondary,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons name="calculator" size={14} color={theme.colors.text} />
                <Text style={[styles.calcBtnText, { color: theme.colors.text }]}>
                  {showCalculator ? 'Sembunyikan Keypad' : 'Buka Keypad'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Large Touchable Display */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowCalculator(true)}
              style={[
                styles.displayBox,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.displayAmount, { color: theme.colors.text }]}>
                {amountExpr ? getComputedDisplayAmount() : 'Rp 0'}
              </Text>
              {amountExpr.length > 0 && (
                <Text style={[styles.displayExpression, { color: theme.colors.textMuted }]}>
                  = {amountExpr}
                </Text>
              )}
            </TouchableOpacity>

            {/* Keypad */}
            {showCalculator && (
              <View style={styles.calcWrapper}>
                <NeoCalculator
                  value={amountExpr}
                  onChange={setAmountExpr}
                  onDone={() => setShowCalculator(false)}
                />
              </View>
            )}
          </NeoCard>

          {/* Interval Selector */}
          <NeoCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>FREKUENSI RUTIN</Text>
            <View style={styles.intervalGrid}>
              {INTERVALS.map((item) => {
                const isSelected = interval === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setInterval(item.key)}
                    style={[
                      styles.intervalChip,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderWidth: isSelected ? 2.5 : 1.5,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.intervalChipText,
                        { color: '#121212', fontWeight: isSelected ? '900' : '600' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </NeoCard>

          {/* Start Date */}
          <NeoCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>TANGGAL MULAI</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.dateBtn,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="calendar-outline" size={18} color={theme.colors.text} />
              <Text style={[styles.dateBtnText, { color: theme.colors.text }]}>
                {formatDateLabel(startDate)} ({startDate})
              </Text>
            </TouchableOpacity>
          </NeoCard>

          {/* Wallet Account */}
          <NeoCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>DOMPET / AKUN</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {accounts.filter((a) => a.is_archived === 0).map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => setSelectedAccountId(acc.id)}
                    style={[
                      styles.accountChip,
                      {
                        backgroundColor: isSelected ? acc.color : theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderWidth: isSelected ? 2.5 : 1.5,
                      },
                    ]}
                  >
                    <NeoBadge
                      icon={acc.icon}
                      iconFamily={acc.icon_family}
                      color={isSelected ? '#FFFFFF' : acc.color}
                      size="sm"
                    />
                    <Text
                      style={[
                        styles.accountChipText,
                        { color: isSelected ? '#121212' : theme.colors.text, fontWeight: isSelected ? '900' : '600' },
                      ]}
                    >
                      {acc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </NeoCard>

          {/* Category Picker: Dropdown & Full Category Grid */}
          <NeoCard style={styles.card}>
            <View style={styles.limitHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>KATEGORI</Text>
              <TouchableOpacity
                onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                style={[
                  styles.calcBtn,
                  {
                    backgroundColor: isCategoryDropdownOpen ? theme.colors.primary : theme.colors.cardSecondary,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={isCategoryDropdownOpen ? 'chevron-up' : 'grid-outline'}
                  size={14}
                  color={theme.colors.text}
                />
                <Text style={[styles.calcBtnText, { color: theme.colors.text }]}>
                  {isCategoryDropdownOpen ? 'Tutup Daftar' : `Buka Dropdown (${activeCategories.length})`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Selected Category Trigger Card */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              style={[
                styles.selectedCatBanner,
                {
                  backgroundColor: selectedCategory ? selectedCategory.color : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.selectedCatLeft}>
                {selectedCategory && (
                  <NeoBadge
                    icon={selectedCategory.icon}
                    iconFamily={selectedCategory.icon_family}
                    color="#FFFFFF"
                    size="md"
                  />
                )}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.selectedCatSub}>Kategori Terpilih:</Text>
                  <Text style={styles.selectedCatName} numberOfLines={1}>
                    {selectedCategory ? selectedCategory.name : 'Pilih Kategori'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.dropdownBadge,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={isCategoryDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={theme.colors.text}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.dropdownBadgeText, { color: theme.colors.text }]}>
                  {isCategoryDropdownOpen ? 'Tutup' : 'Ubah'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Quick Horizontal Scroll when collapsed */}
            {!isCategoryDropdownOpen && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {activeCategories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategoryId(cat.id)}
                      style={[
                        styles.accountChip,
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
                          styles.accountChipText,
                          { color: isSelected ? '#121212' : theme.colors.text, fontWeight: isSelected ? '900' : '600' },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Dropdown Content: Search Box + 3-Column Grid */}
            {isCategoryDropdownOpen && (
              <View style={styles.dropdownContentWrapper}>
                {/* Search Bar */}
                <View
                  style={[
                    styles.searchBox,
                    {
                      backgroundColor: theme.colors.inputBg,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons name="search" size={16} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
                  <TextInput
                    placeholder="Cari kategori..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={categorySearchQuery}
                    onChangeText={setCategorySearchQuery}
                    style={[styles.searchInput, { color: theme.colors.text }]}
                  />
                  {categorySearchQuery ? (
                    <TouchableOpacity onPress={() => setCategorySearchQuery('')}>
                      <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* 3-Column Full Category Grid */}
                <View style={styles.catGrid}>
                  {displayedCategories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => {
                          setSelectedCategoryId(cat.id);
                        }}
                        style={[
                          styles.catGridItem,
                          {
                            backgroundColor: isSelected ? cat.color : theme.colors.surface,
                            borderColor: theme.colors.border,
                            borderWidth: isSelected ? 2.5 : 1.5,
                            shadowColor: isSelected ? theme.neo.shadowSm.shadowColor : 'transparent',
                            shadowOffset: { width: 2, height: 2 },
                            shadowOpacity: isSelected ? 1 : 0,
                            shadowRadius: 0,
                            elevation: isSelected ? 3 : 0,
                          },
                        ]}
                      >
                        <NeoBadge
                          icon={cat.icon}
                          iconFamily={cat.icon_family}
                          color={isSelected ? '#FFFFFF' : cat.color}
                          size="md"
                        />
                        <Text
                          style={[
                            styles.catGridName,
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

                {/* Add Category Button Shortcut */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('CategoryFormModal')}
                  style={[
                    styles.addCatBtn,
                    {
                      backgroundColor: theme.colors.cardSecondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons name="add-circle" size={18} color={theme.colors.text} />
                  <Text style={[styles.addCatBtnText, { color: theme.colors.text }]}>
                    + Buat Kategori Baru
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </NeoCard>

          {/* Note Input */}
          <NeoCard style={styles.card}>
            <NeoInput
              label="CATATAN / KETERANGAN"
              placeholder="Misal: Tagihan Wifi Indihome, Spotify..."
              value={note}
              onChangeText={setNote}
            />
          </NeoCard>

          {/* Save Button */}
          <NeoButton
            title={isEditing ? 'SIMPAN PERUBAHAN' : 'BUAT TRANSAKSI BERULANG'}
            variant="primary"
            size="lg"
            onPress={handleSave}
            style={{ marginTop: 10 }}
          />

          {/* Delete Button (when editing) */}
          {isEditing && (
            <NeoButton
              title="HAPUS RECURRING INI"
              variant="expense"
              size="md"
              onPress={handleDelete}
              style={{ marginTop: 8 }}
            />
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      <NeoDatePicker
        visible={showDatePicker}
        selectedDate={startDate}
        onSelectDate={setStartDate}
        onClose={() => setShowDatePicker(false)}
      />
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
  closeBtn: {
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
    paddingBottom: 220,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '900',
  },
  card: {
    padding: 14,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    gap: 4,
  },
  calcBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  displayBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  displayAmount: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  displayExpression: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  calcWrapper: {
    marginTop: 4,
  },
  intervalGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  intervalChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intervalChipText: {
    fontSize: 11,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  dateBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  chipsScroll: {
    flexDirection: 'row',
    marginTop: 8,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  accountChipText: {
    fontSize: 12,
    marginLeft: 6,
  },
  selectedCatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  selectedCatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCatSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#121212',
    opacity: 0.75,
    textTransform: 'uppercase',
  },
  selectedCatName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#121212',
    marginTop: 1,
  },
  dropdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  dropdownBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  dropdownContentWrapper: {
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  catGridItem: {
    width: '31.8%',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  catGridName: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  addCatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    marginTop: 8,
    gap: 6,
  },
  addCatBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
