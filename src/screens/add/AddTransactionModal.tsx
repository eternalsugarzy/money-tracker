import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoBadge } from '../../components/common/NeoBadge';
import { NeoCalculator } from '../../components/common/NeoCalculator';
import { NeoDatePicker } from '../../components/common/NeoDatePicker';
import { NeoReceiptPicker } from '../../components/common/NeoReceiptPicker';
import { formatCurrency, formatDateLabel, getTodayDateString } from '../../utils/formatters';
import { evaluateMathExpression } from '../../utils/mathEvaluator';
import { DebtType } from '../../types';
import { createTransaction, updateTransaction } from '../../database/transactionRepo';
import { createDebt } from '../../database/debtRepo';

export const AddTransactionModal: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { accounts, categories, transactions, refreshData } = useAppData();

  const editTx = route.params?.editTransaction;
  const isEditing = !!editTx;

  // 4 Modes: 'expense' | 'income' | 'transfer' | 'debt'
  const [activeTab, setActiveTab] = useState<'expense' | 'income' | 'transfer' | 'debt'>(
    isEditing ? editTx.type : 'expense'
  );

  // Form states
  const [nominalExpression, setNominalExpression] = useState<string>(
    isEditing ? String(editTx.amount) : ''
  );
  // Default to true: directly show built-in NeoCalculator keypad, no phone keyboard
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    isEditing ? editTx.date.slice(0, 10) : getTodayDateString()
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [note, setNote] = useState<string>(isEditing ? editTx.note : '');
  const [receiptImages, setReceiptImages] = useState<string[]>(
    isEditing ? JSON.parse(editTx.receipt_images || '[]') : []
  );

  // Find last used account ID from recent transaction or first available
  const lastUsedAccountId = transactions.length > 0 && transactions[0]?.account_id
    ? transactions[0].account_id
    : accounts[0]?.id || '';

  // Income / Expense specific
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    isEditing && editTx.account_id ? editTx.account_id : lastUsedAccountId
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    isEditing && editTx.category_id
      ? editTx.category_id
      : categories[0]?.id || ''
  );

  // Transfer specific
  const [transferFromId, setTransferFromId] = useState<string>(
    isEditing && editTx.account_id ? editTx.account_id : lastUsedAccountId
  );
  const [transferToId, setTransferToId] = useState<string>(
    isEditing && editTx.to_account_id ? editTx.to_account_id : (accounts[1]?.id || accounts[0]?.id || '')
  );

  // Debt specific
  const [debtPersonName, setDebtPersonName] = useState<string>('');
  const [debtType, setDebtType] = useState<DebtType>('receivable');
  const [debtDueDate, setDebtDueDate] = useState<string>('');
  const [showDueDatePicker, setShowDueDatePicker] = useState<boolean>(false);

  // Update default selected account if accounts/transactions finish loading
  useEffect(() => {
    if (!isEditing && !selectedAccountId && lastUsedAccountId) {
      setSelectedAccountId(lastUsedAccountId);
      setTransferFromId(lastUsedAccountId);
    }
  }, [accounts, transactions]);

  // Categories are now universal (available for expense, income, budget)
  const activeCategories = categories.filter((c) => c.is_archived === 0);
  const activeAccounts = accounts.filter((a) => a.is_archived === 0);

  const handleSave = async () => {
    const evalRes = evaluateMathExpression(nominalExpression);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Nominal Belum Diisi', 'Silakan masukkan nominal transaksi menggunakan kalkulator.');
      return;
    }

    const finalAmount = evalRes.value;

    try {
      if (activeTab === 'debt') {
        if (!debtPersonName.trim()) {
          Alert.alert('Nama Orang Kosong', 'Harap isi nama orang untuk catatan hutang-piutang.');
          return;
        }
        await createDebt({
          person_name: debtPersonName.trim(),
          amount: finalAmount,
          type: debtType,
          date: selectedDate,
          due_date: debtDueDate || null,
          status: 'unpaid',
          note: note.trim(),
          settled_at: null,
          settled_account_id: null,
        });
      } else if (activeTab === 'transfer') {
        if (!transferFromId || !transferToId) {
          Alert.alert('Akun Belum Dipilih', 'Harap pilih akun asal dan akun tujuan transfer.');
          return;
        }
        if (transferFromId === transferToId) {
          Alert.alert('Akun Sama', 'Akun asal dan akun tujuan transfer tidak boleh sama.');
          return;
        }

        if (isEditing) {
          await updateTransaction(editTx.id, {
            type: 'transfer',
            amount: finalAmount,
            date: selectedDate,
            account_id: transferFromId,
            to_account_id: transferToId,
            category_id: null,
            note: note.trim(),
            receipt_images: JSON.stringify(receiptImages),
          });
        } else {
          await createTransaction({
            type: 'transfer',
            amount: finalAmount,
            date: selectedDate,
            account_id: transferFromId,
            to_account_id: transferToId,
            category_id: null,
            note: note.trim(),
            receipt_images: JSON.stringify(receiptImages),
          });
        }
      } else {
        // Income or Expense
        if (!selectedAccountId) {
          Alert.alert('Pilih Akun', 'Harap pilih akun/dompet transaksi.');
          return;
        }
        if (!selectedCategoryId) {
          Alert.alert('Pilih Kategori', 'Harap pilih kategori transaksi.');
          return;
        }

        if (isEditing) {
          await updateTransaction(editTx.id, {
            type: activeTab,
            amount: finalAmount,
            date: selectedDate,
            account_id: selectedAccountId,
            to_account_id: null,
            category_id: selectedCategoryId,
            note: note.trim(),
            receipt_images: JSON.stringify(receiptImages),
          });
        } else {
          await createTransaction({
            type: activeTab,
            amount: finalAmount,
            date: selectedDate,
            account_id: selectedAccountId,
            to_account_id: null,
            category_id: selectedCategoryId,
            note: note.trim(),
            receipt_images: JSON.stringify(receiptImages),
          });
        }
      }

      await refreshData();
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const getComputedDisplayAmount = () => {
    const res = evaluateMathExpression(nominalExpression);
    return res.isValid ? formatCurrency(res.value) : 'Rp 0';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={{ flex: 1 }}
      >
        {/* Modal Header */}
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
            {isEditing ? t.editTxTitle : t.addTxTitle}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
        {/* 4 Big Mode Buttons */}
        {!isEditing && (
          <View style={styles.typeSelectorRow}>
            {/* 1. Pengeluaran */}
            <TouchableOpacity
              onPress={() => setActiveTab('expense')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: activeTab === 'expense' ? theme.colors.expense : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name="arrow-up-circle"
                size={18}
                color={activeTab === 'expense' ? '#FFFFFF' : theme.colors.text}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  { color: activeTab === 'expense' ? '#FFFFFF' : theme.colors.text },
                ]}
                numberOfLines={1}
              >
                {t.expense}
              </Text>
            </TouchableOpacity>

            {/* 2. Pemasukan */}
            <TouchableOpacity
              onPress={() => setActiveTab('income')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: activeTab === 'income' ? theme.colors.income : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name="arrow-down-circle"
                size={18}
                color={activeTab === 'income' ? '#0A3B0A' : theme.colors.text}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  { color: activeTab === 'income' ? '#0A3B0A' : theme.colors.text },
                ]}
                numberOfLines={1}
              >
                {t.income}
              </Text>
            </TouchableOpacity>

            {/* 3. Transfer */}
            <TouchableOpacity
              onPress={() => setActiveTab('transfer')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: activeTab === 'transfer' ? theme.colors.transfer : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name="swap-horizontal"
                size={18}
                color={activeTab === 'transfer' ? '#00363B' : theme.colors.text}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  { color: activeTab === 'transfer' ? '#00363B' : theme.colors.text },
                ]}
                numberOfLines={1}
              >
                {t.transfer}
              </Text>
            </TouchableOpacity>

            {/* 4. Hutang-Piutang */}
            <TouchableOpacity
              onPress={() => setActiveTab('debt')}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: activeTab === 'debt' ? theme.colors.debt : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name="people"
                size={18}
                color={activeTab === 'debt' ? '#FFFFFF' : theme.colors.text}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  { color: activeTab === 'debt' ? '#FFFFFF' : theme.colors.text },
                ]}
                numberOfLines={1}
              >
                {t.debtTab}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nominal Amount Card (Direct Calculator Display) */}
        <NeoCard style={styles.nominalCard}>
          <View style={styles.nominalHeaderRow}>
            <Text style={[styles.nominalLabel, { color: theme.colors.textMuted }]}>
              {language === 'id' ? 'NOMINAL TRANSAKSI' : 'TRANSACTION AMOUNT'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowCalculator(!showCalculator)}
              style={[
                styles.calcToggleBtn,
                {
                  backgroundColor: showCalculator ? theme.colors.primary : theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="calculator" size={16} color={theme.colors.text} />
              <Text style={[styles.calcToggleText, { color: theme.colors.text }]}>
                {showCalculator ? (language === 'id' ? 'Sembunyikan Keypad' : 'Hide Keypad') : (language === 'id' ? 'Tampilkan Keypad' : 'Show Keypad')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Large Touchable Display - Direct Calculator Target */}
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
              {nominalExpression ? getComputedDisplayAmount() : 'Rp 0'}
            </Text>
            {nominalExpression.length > 0 && (
              <Text style={[styles.displayExpression, { color: theme.colors.textMuted }]}>
                = {nominalExpression}
              </Text>
            )}
          </TouchableOpacity>

          {/* Built-in Keypad Directly Rendered */}
          {showCalculator && (
            <View style={styles.calcWrapper}>
              <NeoCalculator
                value={nominalExpression}
                onChange={setNominalExpression}
                onDone={() => setShowCalculator(false)}
              />
            </View>
          )}
        </NeoCard>

        {/* Section: Akun / Dompet (Default to Last Used) */}
        {activeTab !== 'debt' && activeTab !== 'transfer' && (
          <NeoCard style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerLeftGroup}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {t.account.toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.lastUsedBadge,
                    {
                      backgroundColor: theme.colors.cardSecondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.lastUsedBadgeText, { color: theme.colors.text }]}>
                    {language === 'id' ? 'Auto-Pilih' : 'Auto-Selected'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('AccountFormModal')}
                style={styles.addAccountBtn}
              >
                <Text style={[styles.addNewText, { color: theme.colors.text }]}>{t.addAccount}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {activeAccounts.map((acc) => {
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
                    <View style={{ marginLeft: 8 }}>
                      <Text
                        style={[
                          styles.accountChipName,
                          { color: isSelected ? '#121212' : theme.colors.text },
                        ]}
                      >
                        {acc.name}
                      </Text>
                      <Text
                        style={[
                          styles.accountChipBal,
                          { color: isSelected ? '#121212' : theme.colors.textMuted },
                        ]}
                      >
                        {formatCurrency(acc.current_balance)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </NeoCard>
        )}

        {/* Section: Transfer (Asal & Tujuan) */}
        {activeTab === 'transfer' && (
          <NeoCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t.fromAccount.toUpperCase()}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {activeAccounts.map((acc) => {
                const isSelected = transferFromId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => setTransferFromId(acc.id)}
                    style={[
                      styles.accountChip,
                      {
                        backgroundColor: isSelected ? theme.colors.expense : theme.colors.surface,
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
                        styles.accountChipName,
                        { color: isSelected ? '#FFFFFF' : theme.colors.text, marginLeft: 8 },
                      ]}
                    >
                      {acc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 14 }]}>
              {t.toAccount.toUpperCase()}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {activeAccounts.map((acc) => {
                const isSelected = transferToId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => setTransferToId(acc.id)}
                    style={[
                      styles.accountChip,
                      {
                        backgroundColor: isSelected ? theme.colors.income : theme.colors.surface,
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
                        styles.accountChipName,
                        { color: isSelected ? '#0A3B0A' : theme.colors.text, marginLeft: 8 },
                      ]}
                    >
                      {acc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </NeoCard>
        )}

        {/* Section: Universal Kategori Grid (Income & Expense) */}
        {(activeTab === 'expense' || activeTab === 'income') && (
          <NeoCard style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t.selectCatPrompt}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('CategoryFormModal')}>
                <Text style={[styles.addNewText, { color: theme.colors.primary }]}>{t.addCategory}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.catGrid}>
              {activeCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategoryId(cat.id)}
                    style={[
                      styles.catGridItem,
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
                      size="md"
                    />
                    <Text
                      style={[
                        styles.catGridName,
                        { color: isSelected ? '#121212' : theme.colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </NeoCard>
        )}

        {/* Section: Hutang - Piutang Specifics */}
        {activeTab === 'debt' && (
          <NeoCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {language === 'id' ? 'TIPE HUTANG - PIUTANG' : 'DEBT / LOAN TYPE'}
            </Text>
            <View style={styles.debtTypeRow}>
              <TouchableOpacity
                onPress={() => setDebtType('receivable')}
                style={[
                  styles.debtTypeBtn,
                  {
                    backgroundColor: debtType === 'receivable' ? theme.colors.income : theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: debtType === 'receivable' ? 2.5 : 1.5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.debtTypeBtnText,
                    { color: debtType === 'receivable' ? '#0A3B0A' : theme.colors.text },
                  ]}
                >
                  {t.receivableTab}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDebtType('debt')}
                style={[
                  styles.debtTypeBtn,
                  {
                    backgroundColor: debtType === 'debt' ? theme.colors.expense : theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: debtType === 'debt' ? 2.5 : 1.5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.debtTypeBtnText,
                    { color: debtType === 'debt' ? '#FFFFFF' : theme.colors.text },
                  ]}
                >
                  {t.payableTab}
                </Text>
              </TouchableOpacity>
            </View>

            <NeoInput
              label={language === 'id' ? 'NAMA ORANG / PIHAK TERKAIT' : 'PERSON / ENTITY NAME'}
              placeholder={language === 'id' ? 'Misal: Budi, Ani, Bank...' : 'e.g. John, Alice, Bank...'}
              value={debtPersonName}
              onChangeText={setDebtPersonName}
              containerStyle={{ marginTop: 12 }}
            />

            <View style={{ marginTop: 12 }}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {language === 'id' ? 'TENGGAT JATUH TEMPO (OPSIONAL)' : 'DUE DATE (OPTIONAL)'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDueDatePicker(true)}
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
                  {debtDueDate ? formatDateLabel(debtDueDate, language) : (language === 'id' ? 'Tanpa Batas Waktu' : 'No Deadline')}
                </Text>
              </TouchableOpacity>
            </View>
          </NeoCard>
        )}

        {/* Section: Tanggal Transaksi */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {language === 'id' ? 'TANGGAL TRANSAKSI' : 'TRANSACTION DATE'}
          </Text>
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
              {formatDateLabel(selectedDate, language)} ({selectedDate})
            </Text>
          </TouchableOpacity>
        </NeoCard>

        {/* Section: Catatan */}
        <NeoCard style={styles.card}>
          <NeoInput
            label={language === 'id' ? 'CATATAN / KETERANGAN (OPSIONAL)' : 'NOTE (OPTIONAL)'}
            placeholder={language === 'id' ? 'Misal: Makan siang, beli bensin...' : 'e.g. Lunch, groceries, fuel...'}
            value={note}
            onChangeText={setNote}
          />
        </NeoCard>

        {/* Section: Foto Struk Transaksi */}
        <NeoCard style={styles.card}>
          <NeoReceiptPicker receiptImages={receiptImages} onChangeImages={setReceiptImages} />
        </NeoCard>

        {/* Submit Button */}
        <NeoButton
          title={isEditing ? (language === 'id' ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES') : t.saveTransaction}
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={styles.submitBtn}
        />

        <View style={{ height: 60 }} />
      </ScrollView>

        {/* Date Pickers */}
        <NeoDatePicker
          visible={showDatePicker}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onClose={() => setShowDatePicker(false)}
        />

        <NeoDatePicker
          visible={showDueDatePicker}
          selectedDate={debtDueDate || getTodayDateString()}
          onSelectDate={setDebtDueDate}
          onClose={() => setShowDueDatePicker(false)}
        />
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBtnText: {
    fontSize: 9.5,
    fontWeight: '900',
    marginTop: 2,
    textAlign: 'center',
  },
  nominalCard: {
    padding: 14,
    marginVertical: 6,
  },
  nominalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nominalLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  calcToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    gap: 4,
  },
  calcToggleText: {
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
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  displayExpression: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  calcWrapper: {
    marginTop: 6,
  },
  card: {
    padding: 14,
    marginVertical: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  lastUsedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  lastUsedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  addAccountBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#121212',
    backgroundColor: '#FFE600',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  addNewText: {
    fontSize: 10,
    fontWeight: '900',
  },
  chipsScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  accountChipName: {
    fontSize: 12,
    fontWeight: '800',
  },
  accountChipBal: {
    fontSize: 10,
    fontWeight: '600',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  catGridItem: {
    width: '30.8%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catGridName: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  debtTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  debtTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  debtTypeBtnText: {
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 6,
    gap: 8,
  },
  dateBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  submitBtn: {
    marginTop: 14,
  },
});
