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
import { useLanguage } from '../../context/LanguageContext';
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
  const { t, language } = useLanguage();
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
      Alert.alert(language === 'id' ? 'Nama Kosong' : 'Empty Name', language === 'id' ? 'Harap masukkan nama target celengan.' : 'Please enter goal title.');
      return;
    }
    const evalRes = evaluateMathExpression(newTargetExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert(language === 'id' ? 'Target Tidak Valid' : 'Invalid Target', language === 'id' ? 'Silakan masukkan target nominal.' : 'Please enter valid target amount.');
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
    Alert.alert(language === 'id' ? 'Sukses' : 'Success', `Target "${newGoal.title}" ${language === 'id' ? 'berhasil dibuat!' : 'created successfully!'}`);
  };

  const handleDepositMoney = () => {
    if (!savingToGoal) return;
    const evalRes = evaluateMathExpression(addMoneyExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert(language === 'id' ? 'Nominal Tidak Valid' : 'Invalid Amount', language === 'id' ? 'Masukkan nominal tabungan.' : 'Enter valid deposit amount.');
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
    Alert.alert(
      language === 'id' ? 'Berhasil Menabung' : 'Deposit Successful',
      `${formatCurrency(evalRes.value)} ${language === 'id' ? 'telah ditambahkan ke' : 'has been added to'} ${savingToGoal.title}!`
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      language === 'id' ? 'Hapus Celengan' : 'Delete Goal',
      language === 'id' ? 'Hapus target celengan ini?' : 'Delete this savings goal?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: () => setGoals(goals.filter((g) => g.id !== goalId)),
        },
      ]
    );
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
          {t.savingsGoalsTitle}
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
          <Text style={styles.grandLabel}>
            {language === 'id' ? 'AKUMULASI CELENGAN IMPIAN' : 'TOTAL SAVINGS ACCUMULATION'}
          </Text>
          <Text style={styles.grandAmount}>{formatCurrency(totalSaved)}</Text>
          <Text style={styles.grandSub}>
            {language === 'id' ? 'dari target' : 'of target'} {formatCurrency(totalTarget)} ({formatPercentage(overallPct)})
          </Text>
          <View style={{ marginTop: 8 }}>
            <NeoProgressBar percentage={overallPct} height={10} />
          </View>
        </NeoCard>

        {/* Goals List */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 14 }]}>
          {language === 'id' ? 'DAFTAR TARGET TABUNGAN' : 'SAVINGS GOALS LIST'} ({goals.length})
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
                    <Text style={styles.doneBadgeText}>{language === 'id' ? 'TERCAPAI' : 'ACHIEVED'}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(item.id)}
                    style={styles.deleteIconBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={{ marginVertical: 8 }}>
                <NeoProgressBar percentage={pct} height={12} />
              </View>

              <View style={styles.goalBottomRow}>
                <Text style={[styles.goalProgressText, { color: theme.colors.textMuted }]}>
                  {language === 'id' ? 'Terkumpul' : 'Saved'}: {formatCurrency(item.currentAmount)} ({formatPercentage(pct)})
                </Text>
                {!isDone && (
                  <TouchableOpacity
                    onPress={() => setSavingToGoal(item)}
                    style={[
                      styles.addMoneyBtn,
                      { backgroundColor: theme.colors.primary, borderColor: theme.colors.border },
                    ]}
                  >
                    <Ionicons name="wallet-outline" size={13} color="#121212" />
                    <Text style={styles.addMoneyBtnText}>
                      + {language === 'id' ? 'ISI TABUNGAN' : 'ADD SAVINGS'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </NeoCard>
          );
        })}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Modal Add Goal */}
      <NeoModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={language === 'id' ? 'TARGET CELENGAN BARU' : 'NEW SAVINGS GOAL'}
      >
        <View style={{ paddingVertical: 10 }}>
          <NeoInput
            label={language === 'id' ? 'NAMA TARGET IMPIAN' : 'GOAL TITLE'}
            placeholder={language === 'id' ? 'Misal: Beli Laptop Baru, Liburan...' : 'e.g. New Laptop, Vacation...'}
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <View style={{ marginVertical: 8 }}>
            <Text style={[styles.modalLabel, { color: theme.colors.text }]}>
              {language === 'id' ? 'TARGET NOMINAL' : 'TARGET AMOUNT'}
            </Text>
            <NeoCalculator value={newTargetExpr} onChange={setNewTargetExpr} />
          </View>
          <NeoButton
            title={language === 'id' ? 'BUAT TARGET SEKARANG' : 'CREATE GOAL NOW'}
            variant="primary"
            onPress={handleCreateGoal}
            style={{ marginTop: 10 }}
          />
        </View>
      </NeoModal>

      {/* Modal Deposit Money to Goal */}
      <NeoModal
        visible={!!savingToGoal}
        onClose={() => setSavingToGoal(null)}
        title={`${language === 'id' ? 'MENABUNG' : 'DEPOSIT'}: ${savingToGoal?.title}`}
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={[styles.modalLabel, { color: theme.colors.text }]}>
            {language === 'id' ? 'NOMINAL YANG DITABUNG' : 'DEPOSIT AMOUNT'}
          </Text>
          <NeoCalculator value={addMoneyExpr} onChange={setAddMoneyExpr} />
          <NeoButton
            title={language === 'id' ? 'SIMPAN TABUNGAN' : 'SAVE DEPOSIT'}
            variant="income"
            onPress={handleDepositMoney}
            style={{ marginTop: 10 }}
          />
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
  },
  grandCard: {
    padding: 16,
    marginBottom: 12,
  },
  grandLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: 0.5,
  },
  grandAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#121212',
    marginVertical: 4,
  },
  grandSub: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  goalCard: {
    padding: 14,
    marginBottom: 12,
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
    fontSize: 15,
    fontWeight: '800',
  },
  goalTarget: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  doneBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  doneBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0A3B0A',
  },
  deleteIconBtn: {
    padding: 6,
  },
  goalBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  goalProgressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  addMoneyBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#121212',
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
});
