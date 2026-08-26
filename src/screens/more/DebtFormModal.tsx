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
import { createDebt, updateDebt } from '../../database/debtRepo';

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
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
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
      Alert.alert('Nominal Tidak Valid', 'Silakan masukkan nominal hutang/piutang yang valid.');
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
          {isEditing ? 'EDIT CATATAN' : 'CATAT HUTANG - PIUTANG'}
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
            label="NAMA ORANG"
            placeholder="Misal: Budi Santoso, Rina..."
            value={personName}
            onChangeText={setPersonName}
          />
        </NeoCard>

        {/* Nominal Amount Box with Calculator */}
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
              placeholder="0 (misal: 250000)"
              value={amountExpr}
              onChangeText={setAmountExpr}
              keyboardType="numeric"
              style={{ fontSize: 20, fontWeight: '900' }}
              containerStyle={{ flex: 1, marginVertical: 0 }}
            />
          </View>
        </NeoCard>

        {/* Calculator Keypad */}
        {showCalculator && (
          <NeoCalculator
            initialValue={amountExpr}
            onConfirm={(val) => {
              setAmountExpr(String(val));
              setShowCalculator(false);
            }}
          />
        )}

        {/* Dates & Notes */}
        <NeoCard style={styles.card}>
          {/* Tanggal Pinjam */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.fieldSelector}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>TANGGAL TRANSAKSI</Text>
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
                {formatDateLabel(date)} ({date})
              </Text>
            </View>
          </TouchableOpacity>

          {/* Jatuh Tempo */}
          <TouchableOpacity
            onPress={() => setShowDueDatePicker(true)}
            style={[styles.fieldSelector, { marginTop: 12 }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              TANGGAL JATUH TEMPO (OPSIONAL)
            </Text>
            <View
              style={[
                styles.selectorBox,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="alarm-outline" size={18} color={theme.colors.text} />
              <Text style={[styles.selectorBoxText, { color: theme.colors.text }]}>
                {dueDate ? `${formatDateLabel(dueDate)} (${dueDate})` : 'Tidak ada batas waktu'}
              </Text>
              {dueDate ? (
                <TouchableOpacity onPress={() => setDueDate('')}>
                  <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>

          {/* Catatan */}
          <NeoInput
            label="CATATAN / KEPERLUAN"
            placeholder="Misal: Pinjam untuk servis motor, talangan tiket bioskop..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
            containerStyle={{ marginTop: 12 }}
          />
        </NeoCard>

        {/* Submit Button */}
        <NeoButton
          title={isEditing ? 'SIMPAN PERUBAHAN' : 'SIMPAN CATATAN'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={{ marginTop: 14 }}
        />
      </ScrollView>

      <NeoDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={date}
        onSelectDate={setDate}
      />

      <NeoDatePicker
        visible={showDueDatePicker}
        onClose={() => setShowDueDatePicker(false)}
        selectedDate={dueDate || date}
        onSelectDate={setDueDate}
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
    fontSize: 11,
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
    flex: 1,
  },
});
