import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
import { createRecurring, updateRecurring } from '../../database/recurringRepo';

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
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    isEditing && editRecurring.account_id ? editRecurring.account_id : accounts[0]?.id || ''
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    isEditing && editRecurring.category_id
      ? editRecurring.category_id
      : categories.find((c) => c.type === (type === 'income' ? 'income' : 'expense'))?.id || ''
  );
  const [interval, setInterval] = useState<RecurringInterval>(
    isEditing ? editRecurring.interval : 'monthly'
  );
  const [note, setNote] = useState<string>(isEditing ? editRecurring.note : '');
  const [startDate, setStartDate] = useState<string>(
    isEditing ? editRecurring.start_date : getTodayDateString()
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const filteredCategories = categories.filter(
    (c) => c.is_archived === 0 && (type === 'income' ? c.type === 'income' : c.type === 'expense')
  );

  const handleSave = async () => {
    const evalRes = evaluateMathExpression(amountExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Silakan masukkan nominal transaksi yang valid.');
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

  const INTERVALS: { key: RecurringInterval; label: string }[] = [
    { key: 'daily', label: 'Harian' },
    { key: 'weekly', label: 'Mingguan' },
    { key: 'monthly', label: 'Bulanan' },
    { key: 'yearly', label: 'Tahunan' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
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

        {/* Nominal Amount Box */}
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
                {showCalculator ? 'Tutup' : 'Kalkulator'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountInputRow}>
            <Text style={[styles.rpPrefix, { color: theme.colors.text }]}>Rp</Text>
            <NeoInput
              placeholder="0 (misal: 150000)"
              value={amountExpr}
              onChangeText={setAmountExpr}
              keyboardType="numeric"
              style={{ fontSize: 20, fontWeight: '900' }}
              containerStyle={{ flex: 1, marginVertical: 0 }}
            />
          </View>
        </NeoCard>

        {/* Calculator */}
        {showCalculator && (
          <NeoCalculator
            initialValue={amountExpr}
            onConfirm={(val) => {
              setAmountExpr(String(val));
              setShowCalculator(false);
            }}
          />
        )}

        {/* Note / Label */}
        <NeoCard style={styles.card}>
          <NeoInput
            label="NAMA / DESKRIPSI TEMPLATE"
            placeholder="Misal: Tagihan WiFi Indihome, Bayar Kost, Gaji Bulanan..."
            value={note}
            onChangeText={setNote}
          />
        </NeoCard>

        {/* Interval Selector */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>INTERVAL PENGULANGAN</Text>
          <View style={styles.intervalGrid}>
            {INTERVALS.map((inv) => {
              const isSelected = interval === inv.key;
              return (
                <TouchableOpacity
                  key={inv.key}
                  onPress={() => setInterval(inv.key)}
                  style={[
                    styles.intervalBtn,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                      borderWidth: isSelected ? 2.5 : 1.5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.intervalBtnText,
                      { color: '#121212', fontWeight: isSelected ? '900' : '700' },
                    ]}
                  >
                    {inv.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </NeoCard>

        {/* Account & Category */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>AKUN DEFAULT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {accounts.filter((a) => a.is_archived === 0).map((acc) => {
              const isSelected = selectedAccountId === acc.id;
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => setSelectedAccountId(acc.id)}
                  style={[
                    styles.accountChip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <NeoBadge icon={acc.icon} color={acc.color} size="sm" noShadow />
                  <Text style={[styles.chipTitle, { color: theme.colors.text }]}>{acc.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>KATEGORI</Text>
          <View style={styles.catGrid}>
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  style={[
                    styles.catCard,
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
                      styles.catName,
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
        </NeoCard>

        {/* Start Date */}
        <NeoCard style={styles.card}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.fieldSelector}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>TANGGAL MULAI</Text>
            <View
              style={[
                styles.selectorBox,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="calendar" size={18} color={theme.colors.text} />
              <Text style={[styles.selectorBoxText, { color: theme.colors.text }]}>
                {formatDateLabel(startDate)} ({startDate})
              </Text>
            </View>
          </TouchableOpacity>
        </NeoCard>

        <NeoButton
          title={isEditing ? 'SIMPAN PERUBAHAN' : 'SIMPAN TEMPLATE'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={{ marginTop: 14 }}
        />
      </ScrollView>

      <NeoDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={startDate}
        onSelectDate={setStartDate}
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
    paddingBottom: 50,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '900',
  },
  card: {
    padding: 14,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 11,
    fontWeight: '800',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rpPrefix: {
    fontSize: 22,
    fontWeight: '900',
    marginRight: 8,
  },
  intervalGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  intervalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  intervalBtnText: {
    fontSize: 11,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  chipTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  catName: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  fieldSelector: {
    marginTop: 2,
  },
  selectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  selectorBoxText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
