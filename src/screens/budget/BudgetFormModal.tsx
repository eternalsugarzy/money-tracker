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
import { BudgetPeriodType } from '../../types';
import { createBudget, updateBudget, deleteBudget } from '../../database/budgetRepo';

export const BudgetFormModal: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { categories, refreshData } = useAppData();

  const editBudget = route.params?.editBudget;
  const isEditing = !!editBudget;

  const activeCategories = categories.filter((c) => c.is_archived === 0);

  const [name, setName] = useState<string>(isEditing ? editBudget.name : '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    isEditing ? editBudget.category_id : activeCategories[0]?.id || ''
  );
  const [limitExpression, setLimitExpression] = useState<string>(
    isEditing ? String(editBudget.limit_amount) : ''
  );
  // Default to true: directly show built-in calculator, no phone keyboard
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [periodType, setPeriodType] = useState<BudgetPeriodType>(
    isEditing ? editBudget.period_type : 'monthly'
  );
  const [startDate, setStartDate] = useState<string>(
    isEditing ? editBudget.start_date : getTodayDateString().slice(0, 7) + '-01'
  );
  const [endDate, setEndDate] = useState<string>(
    isEditing && editBudget.end_date ? editBudget.end_date : ''
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Nama Budget Kosong', 'Harap masukkan nama budget (misal: Budget Makan & Kopi).');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Pilih Kategori', 'Harap pilih kategori yang dihubungkan dengan budget ini.');
      return;
    }

    const evalRes = evaluateMathExpression(limitExpression);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Limit Belum Diisi', 'Silakan masukkan limit nominal budget menggunakan kalkulator.');
      return;
    }

    try {
      if (isEditing) {
        await updateBudget(editBudget.id, {
          name: name.trim(),
          category_id: selectedCategoryId,
          limit_amount: evalRes.value,
          period_type: periodType,
          start_date: startDate,
          end_date: endDate || null,
        });
      } else {
        await createBudget({
          name: name.trim(),
          category_id: selectedCategoryId,
          limit_amount: evalRes.value,
          period_type: periodType,
          start_date: startDate,
          end_date: endDate || null,
        });
      }

      await refreshData();
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleDelete = () => {
    if (!editBudget) return;
    Alert.alert('Hapus Budget', `Hapus budget "${editBudget.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteBudget(editBudget.id);
          await refreshData();
          navigation.goBack();
        },
      },
    ]);
  };

  const getComputedDisplayAmount = () => {
    const res = evaluateMathExpression(limitExpression);
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
          {isEditing ? 'EDIT BUDGET' : 'TAMBAH BUDGET BARU'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Manual Budget Name */}
        <NeoCard style={styles.card}>
          <NeoInput
            label="NAMA BUDGET"
            placeholder="Misal: Budget Makan & Kopi, Belanja Supermarket..."
            value={name}
            onChangeText={setName}
          />
        </NeoCard>

        {/* Limit Amount Box with Direct Keypad */}
        <NeoCard style={styles.card}>
          <View style={styles.limitHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              LIMIT NOMINAL ANGGARAN
            </Text>
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
              {limitExpression ? getComputedDisplayAmount() : 'Rp 0'}
            </Text>
            {limitExpression.length > 0 && (
              <Text style={[styles.displayExpression, { color: theme.colors.textMuted }]}>
                = {limitExpression}
              </Text>
            )}
          </TouchableOpacity>

          {/* Keypad */}
          {showCalculator && (
            <View style={styles.calcWrapper}>
              <NeoCalculator
                value={limitExpression}
                onChange={setLimitExpression}
                onDone={() => setShowCalculator(false)}
              />
            </View>
          )}
        </NeoCard>

        {/* Category Picker Grid */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            HUBUNGKAN KE KATEGORI
          </Text>
          <View style={styles.catGrid}>
            {activeCategories.map((cat) => {
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
                      { color: isSelected ? '#121212' : theme.colors.text, fontWeight: isSelected ? '900' : '600' },
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

        {/* Period & Date Settings */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>PERIODE BUDGET</Text>
          <View style={styles.periodRow}>
            <TouchableOpacity
              onPress={() => setPeriodType('monthly')}
              style={[
                styles.periodChoice,
                {
                  backgroundColor: periodType === 'monthly' ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={[styles.periodChoiceText, { fontWeight: periodType === 'monthly' ? '900' : '700' }]}>
                Bulanan (Auto Repeat)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPeriodType('custom')}
              style={[
                styles.periodChoice,
                {
                  backgroundColor: periodType === 'custom' ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={[styles.periodChoiceText, { fontWeight: periodType === 'custom' ? '900' : '700' }]}>
                Custom Tanggal
              </Text>
            </TouchableOpacity>
          </View>

          {/* Start Date */}
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.dateLabel, { color: theme.colors.textMuted }]}>TANGGAL MULAI</Text>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
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
          </View>

          {/* End Date (for custom) */}
          {periodType === 'custom' && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.dateLabel, { color: theme.colors.textMuted }]}>
                TANGGAL BERAKHIR (OPSIONAL)
              </Text>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
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
                  {endDate ? `${formatDateLabel(endDate)} (${endDate})` : 'Tanpa Batas Akhir'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </NeoCard>

        {/* Submit Button */}
        <NeoButton
          title={isEditing ? 'SIMPAN PERUBAHAN' : 'BUAT ANGGARAN SEKARANG'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={{ marginTop: 10 }}
        />

        {/* Delete Button (when editing) */}
        {isEditing && (
          <NeoButton
            title="HAPUS ANGGARAN INI"
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
        visible={showStartDatePicker}
        selectedDate={startDate}
        onSelectDate={setStartDate}
        onClose={() => setShowStartDatePicker(false)}
      />

      <NeoDatePicker
        visible={showEndDatePicker}
        selectedDate={endDate || getTodayDateString()}
        onSelectDate={setEndDate}
        onClose={() => setShowEndDatePicker(false)}
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
  card: {
    padding: 14,
    marginVertical: 6,
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
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catCard: {
    width: '30.8%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  periodChoice: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodChoiceText: {
    fontSize: 12,
    color: '#121212',
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
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
});
