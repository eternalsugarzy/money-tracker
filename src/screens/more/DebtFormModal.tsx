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
import { NeoCalculator } from '../../components/common/NeoCalculator';
import { NeoDatePicker } from '../../components/common/NeoDatePicker';
import { formatCurrency, formatDateLabel, getTodayDateString } from '../../utils/formatters';
import { evaluateMathExpression } from '../../utils/mathEvaluator';
import { DebtType } from '../../types';
import { createDebt, updateDebt, deleteDebt } from '../../database/debtRepo';

export const DebtFormModal: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { refreshData } = useAppData();

  const editDebt = route.params?.editDebt;
  const defaultType = route.params?.defaultType || 'receivable';
  const isEditing = !!editDebt;

  const [type, setType] = useState<DebtType>(isEditing ? editDebt.type : defaultType);
  const [personName, setPersonName] = useState<string>(isEditing ? editDebt.person_name : '');
  const [amountExpr, setAmountExpr] = useState<string>(isEditing ? String(editDebt.amount) : '');
  // Default to true: directly show built-in calculator, no phone keyboard
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [date, setDate] = useState<string>(isEditing ? editDebt.date : getTodayDateString());
  const [dueDate, setDueDate] = useState<string>(isEditing && editDebt.due_date ? editDebt.due_date : '');
  const [note, setNote] = useState<string>(isEditing ? editDebt.note : '');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState<boolean>(false);

  const handleSave = async () => {
    if (!personName.trim()) {
      Alert.alert('Nama Kosong', 'Harap masukkan nama orang.');
      return;
    }

    const evalRes = evaluateMathExpression(amountExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Silakan masukkan nominal hutang/piutang via kalkulator.');
      return;
    }

    try {
      if (isEditing) {
        await updateDebt(editDebt.id, {
          type,
          person_name: personName.trim(),
          amount: evalRes.value,
          date,
          due_date: dueDate || null,
          note: note.trim(),
        });
      } else {
        await createDebt({
          type,
          person_name: personName.trim(),
          amount: evalRes.value,
          date,
          due_date: dueDate || null,
          status: 'unpaid',
          note: note.trim(),
          settled_at: null,
          settled_account_id: null,
        });
      }

      await refreshData();
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleDelete = () => {
    if (!editDebt) return;
    Alert.alert('Hapus Catatan', `Hapus catatan hutang/piutang ini?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteDebt(editDebt.id);
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
          {isEditing ? 'EDIT HUTANG / PIUTANG' : 'CATAT HUTANG / PIUTANG'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type Toggle */}
        <View style={styles.typeRow}>
          <TouchableOpacity
            onPress={() => setType('receivable')}
            style={[
              styles.typeBtn,
              {
                backgroundColor: type === 'receivable' ? theme.colors.income : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: type === 'receivable' ? 2.5 : 1.5,
              },
            ]}
          >
            <Text
              style={[
                styles.typeBtnText,
                { color: type === 'receivable' ? '#0A3B0A' : theme.colors.text },
              ]}
            >
              Piutang (Saya Meminjamkan)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setType('debt')}
            style={[
              styles.typeBtn,
              {
                backgroundColor: type === 'debt' ? theme.colors.debt : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: type === 'debt' ? 2.5 : 1.5,
              },
            ]}
          >
            <Text
              style={[
                styles.typeBtnText,
                { color: type === 'debt' ? '#FFFFFF' : theme.colors.text },
              ]}
            >
              Utang (Saya Berhutang)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Person Name */}
        <NeoCard style={styles.card}>
          <NeoInput
            label="NAMA ORANG / PIHAK TERKAIT"
            placeholder="Misal: Budi Santoso, Rina, Mas Kevin..."
            value={personName}
            onChangeText={setPersonName}
          />
        </NeoCard>

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

        {/* Dates & Notes */}
        <NeoCard style={styles.card}>
          {/* Tanggal Pinjam */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.fieldSelector}
          >
            <View style={styles.fieldLeft}>
              <Ionicons name="calendar" size={18} color={theme.colors.primary} />
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Tanggal Pinjam</Text>
            </View>
            <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
              {formatDateLabel(date)} ({date})
            </Text>
          </TouchableOpacity>

          {/* Tanggal Jatuh Tempo */}
          <TouchableOpacity
            onPress={() => setShowDueDatePicker(true)}
            style={[styles.fieldSelector, { marginTop: 10 }]}
          >
            <View style={styles.fieldLeft}>
              <Ionicons name="alarm" size={18} color={theme.colors.debt} />
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Jatuh Tempo (Opsional)</Text>
            </View>
            <Text style={[styles.fieldValue, { color: dueDate ? theme.colors.text : theme.colors.textMuted }]}>
              {dueDate ? `${formatDateLabel(dueDate)} (${dueDate})` : 'Belum Ditentukan'}
            </Text>
          </TouchableOpacity>

          {dueDate ? (
            <TouchableOpacity onPress={() => setDueDate('')} style={{ marginTop: 4, alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: theme.colors.expense, fontWeight: '800' }}>Hapus Jatuh Tempo</Text>
            </TouchableOpacity>
          ) : null}
        </NeoCard>

        {/* Note */}
        <NeoCard style={styles.card}>
          <NeoInput
            label="CATATAN / KEPERLUAN"
            placeholder="Misal: Pinjaman beli motor, talangan makan siang..."
            value={note}
            onChangeText={setNote}
          />
        </NeoCard>

        {/* Save Button */}
        <NeoButton
          title={isEditing ? 'SIMPAN PERUBAHAN' : 'CATAT SEKARANG'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={{ marginTop: 10 }}
        />

        {/* Delete Button (when editing) */}
        {isEditing && (
          <NeoButton
            title="HAPUS CATATAN INI"
            variant="expense"
            size="md"
            onPress={handleDelete}
            style={{ marginTop: 8 }}
          />
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Date Pickers */}
      <NeoDatePicker
        visible={showDatePicker}
        selectedDate={date}
        onSelectDate={setDate}
        onClose={() => setShowDatePicker(false)}
      />

      <NeoDatePicker
        visible={showDueDatePicker}
        selectedDate={dueDate || getTodayDateString()}
        onSelectDate={setDueDate}
        onClose={() => setShowDueDatePicker(false)}
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
    paddingBottom: 40,
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
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
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
  fieldSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
