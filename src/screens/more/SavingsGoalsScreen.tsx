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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoProgressBar } from '../../components/common/NeoProgressBar';
import { NeoModal } from '../../components/common/NeoModal';
import { NeoCalculator } from '../../components/common/NeoCalculator';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { evaluateMathExpression } from '../../utils/mathEvaluator';

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
  targetDate?: string;
}

const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: 'goal_1',
    title: 'Dana Darurat (6 Bulan)',
    targetAmount: 15000000,
    currentAmount: 8500000,
    emoji: '🛡️',
  },
  {
    id: 'goal_2',
    title: 'Beli iPhone 16 Pro',
    targetAmount: 22000000,
    currentAmount: 14000000,
    emoji: '📱',
  },
  {
    id: 'goal_3',
    title: 'Liburan Akhir Tahun',
    targetAmount: 8000000,
    currentAmount: 5000000,
    emoji: '✈️',
  },
];

export const SavingsGoalsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [goals, setGoals] = useState<SavingsGoal[]>(DEFAULT_GOALS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTargetExpr, setNewTargetExpr] = useState<string>('');
  const [newEmoji, setNewEmoji] = useState<string>('🎯');
  const [savingToGoal, setSavingToGoal] = useState<SavingsGoal | null>(null);
  const [addMoneyExpr, setAddMoneyExpr] = useState<string>('');

  const handleCreateGoal = () => {
    if (!newTitle.trim()) {
      Alert.alert('Nama Kosong', 'Harap masukkan nama target celengan.');
      return;
    }
    const evalRes = evaluateMathExpression(newTargetExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Target Tidak Valid', 'Silakan masukkan target nominal.');
      return;
    }

    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}`,
      title: newTitle.trim(),
      targetAmount: evalRes.value,
      currentAmount: 0,
      emoji: newEmoji,
    };

    setGoals([...goals, newGoal]);
    setNewTitle('');
    setNewTargetExpr('');
    setShowAddModal(false);
    Alert.alert('Sukses', `Target celengan "${newGoal.title}" berhasil dibuat!`);
  };

  const handleDepositMoney = () => {
    if (!savingToGoal) return;
    const evalRes = evaluateMathExpression(addMoneyExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Masukkan nominal tabungan.');
      return;
    }

    setGoals(
      goals.map((g) =>
        g.id === savingToGoal.id
          ? { ...g, currentAmount: g.currentAmount + evalRes.value }
          : g
      )
    );
    setAddMoneyExpr('');
    setSavingToGoal(null);
    Alert.alert('Berhasil Menabung', `Tabungan sebesar ${formatCurrency(evalRes.value)} telah ditambahkan ke ${savingToGoal.title}!`);
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert('Hapus Celengan', 'Hapus target celengan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => setGoals(goals.filter((g) => g.id !== goalId)),
      },
    ]);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          CELENGAN & TARGET IMPIAN
        </Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="add" size={22} color="#121212" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Total Progress Summary Card */}
        <NeoCard backgroundColor={theme.colors.primary} style={styles.grandCard}>
          <Text style={styles.grandLabel}>AKUMULASI CELENGAN IMPIAN</Text>
          <Text style={styles.grandAmount}>{formatCurrency(totalSaved)}</Text>
          <Text style={styles.grandSub}>dari target {formatCurrency(totalTarget)} ({formatPercentage(overallPct)})</Text>
          <View style={{ marginTop: 8 }}>
            <NeoProgressBar percentage={overallPct} height={10} />
          </View>
        </NeoCard>

        {/* Goals List */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 14 }]}>
          DAFTAR TARGET TABUNGAN ({goals.length})
        </Text>

        {goals.map((item) => {
          const pct = item.targetAmount > 0 ? (item.currentAmount / item.targetAmount) * 100 : 0;
          const sisa = Math.max(0, item.targetAmount - item.currentAmount);
          const isDone = item.currentAmount >= item.targetAmount;

          return (
            <NeoCard key={item.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleRow}>
                  <Text style={styles.goalEmoji}>{item.emoji}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={[styles.goalTitle, { color: theme.colors.text }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.goalTarget, { color: theme.colors.textMuted }]}>
                      Target: {formatCurrency(item.targetAmount)}
                    </Text>
                  </View>
                </View>

                {isDone ? (
                  <View
                    style={[
                      styles.doneBadge,
                      { backgroundColor: theme.colors.income, borderColor: theme.colors.border },
                    ]}
                  >
                    <Text style={styles.doneText}>TERCAPAI 🎉</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.expense} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Progress Bar */}
              <View style={{ marginVertical: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={[styles.progressVal, { color: theme.colors.income }]}>
                    {formatCurrency(item.currentAmount)}
                  </Text>
                  <Text style={[styles.progressPct, { color: theme.colors.text }]}>
                    {formatPercentage(pct)}
                  </Text>
                </View>
                <NeoProgressBar percentage={pct} height={8} />
                {!isDone && (
                  <Text style={[styles.sisaText, { color: theme.colors.textMuted }]}>
                    Kurang {formatCurrency(sisa)} lagi
                  </Text>
                )}
              </View>

              {/* Add Money Button */}
              {!isDone && (
                <NeoButton
                  title="+ ISI TABUNGAN"
                  size="sm"
                  variant="primary"
                  onPress={() => setSavingToGoal(item)}
                  style={{ marginTop: 4 }}
                />
              )}
            </NeoCard>
          );
        })}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Modal Add Goal */}
      <NeoModal visible={showAddModal} onClose={() => setShowAddModal(false)} title="TARGET CELENGAN BARU">
        <View style={{ paddingVertical: 10 }}>
          <NeoInput label="NAMA TARGET IMPIAN" placeholder="Misal: Beli Laptop Baru, Liburan..." value={newTitle} onChangeText={setNewTitle} />
          <View style={{ marginVertical: 8 }}>
            <Text style={[styles.modalLabel, { color: theme.colors.text }]}>TARGET NOMINAL</Text>
            <NeoCalculator value={newTargetExpr} onChange={setNewTargetExpr} />
          </View>
          <NeoButton title="BUAT TARGET SEKARANG" variant="primary" onPress={handleCreateGoal} style={{ marginTop: 10 }} />
        </View>
      </NeoModal>

      {/* Modal Deposit Money to Goal */}
      <NeoModal visible={!!savingToGoal} onClose={() => setSavingToGoal(null)} title={`MENABUNG: ${savingToGoal?.title}`}>
        <View style={{ paddingVertical: 10 }}>
          <Text style={[styles.modalLabel, { color: theme.colors.text }]}>NOMINAL YANG DITABUNG</Text>
          <NeoCalculator value={addMoneyExpr} onChange={setAddMoneyExpr} />
          <NeoButton title="SIMPAN TABUNGAN" variant="income" onPress={handleDepositMoney} style={{ marginTop: 10 }} />
        </View>
      </NeoModal>
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
  backBtn: {
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
  grandCard: {
    padding: 16,
    marginBottom: 10,
  },
  grandLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#121212',
  },
  grandAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#121212',
    marginVertical: 4,
  },
  grandSub: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  goalCard: {
    padding: 14,
    marginVertical: 6,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalEmoji: {
    fontSize: 26,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  goalTarget: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  doneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  doneText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0A3B0A',
  },
  deleteBtn: {
    padding: 6,
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '900',
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '900',
  },
  sisaText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
});
