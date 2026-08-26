import React, { useState, useEffect, useCallback } from 'react';
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
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoProgressBar } from '../../components/common/NeoProgressBar';
import { NeoModal } from '../../components/common/NeoModal';
import { NeoCalculator } from '../../components/common/NeoCalculator';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { evaluateMathExpression } from '../../utils/mathEvaluator';
import { SavingsGoal } from '../../types';
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  depositToGoal,
  seedDefaultGoalsIfEmpty,
} from '../../database/goalRepo';

const EMOJI_OPTIONS = ['🎯', '🛡️', '📱', '✈️', '💻', '🚗', '🏠', '💍', '🎓', '🏖️', '🎁', '💰'];

export const SavingsGoalsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const navigation = useNavigation<any>();

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTargetExpr, setNewTargetExpr] = useState<string>('');
  const [newEmoji, setNewEmoji] = useState<string>('🎯');

  // Edit Modal state
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editTargetExpr, setEditTargetExpr] = useState<string>('');
  const [editEmoji, setEditEmoji] = useState<string>('🎯');

  // Deposit Modal state
  const [savingToGoal, setSavingToGoal] = useState<SavingsGoal | null>(null);
  const [addMoneyExpr, setAddMoneyExpr] = useState<string>('');

  const loadGoalsData = useCallback(async () => {
    try {
      setLoading(true);
      await seedDefaultGoalsIfEmpty();
      const rows = await getAllGoals();
      setGoals(rows);
    } catch (err) {
      console.error('Error loading savings goals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoalsData();
  }, [loadGoalsData]);

  const handleCreateGoal = async () => {
    if (!newTitle.trim()) {
      Alert.alert(
        language === 'id' ? 'Nama Kosong' : 'Empty Name',
        language === 'id' ? 'Harap masukkan nama target celengan.' : 'Please enter goal title.'
      );
      return;
    }
    const evalRes = evaluateMathExpression(newTargetExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert(
        language === 'id' ? 'Target Tidak Valid' : 'Invalid Target',
        language === 'id' ? 'Silakan masukkan target nominal yang valid.' : 'Please enter a valid target amount.'
      );
      return;
    }

    try {
      await createGoal({
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: newTitle.trim(),
        target_amount: evalRes.value,
        current_amount: 0,
        emoji: newEmoji,
        target_date: null,
      });

      setNewTitle('');
      setNewTargetExpr('');
      setShowAddModal(false);
      await loadGoalsData();
      Alert.alert(
        language === 'id' ? 'Sukses' : 'Success',
        language === 'id' ? 'Target impian berhasil dibuat!' : 'Savings goal created successfully!'
      );
    } catch (err: any) {
      Alert.alert(language === 'id' ? 'Gagal' : 'Error', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleOpenEdit = (goal: SavingsGoal) => {
    setEditGoal(goal);
    setEditTitle(goal.title);
    setEditTargetExpr(String(goal.target_amount));
    setEditEmoji(goal.emoji);
  };

  const handleUpdateGoal = async () => {
    if (!editGoal) return;
    if (!editTitle.trim()) {
      Alert.alert(
        language === 'id' ? 'Nama Kosong' : 'Empty Name',
        language === 'id' ? 'Harap masukkan nama target celengan.' : 'Please enter goal title.'
      );
      return;
    }
    const evalRes = evaluateMathExpression(editTargetExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert(
        language === 'id' ? 'Target Tidak Valid' : 'Invalid Target',
        language === 'id' ? 'Silakan masukkan target nominal yang valid.' : 'Please enter valid target amount.'
      );
      return;
    }

    try {
      await updateGoal(editGoal.id, {
        title: editTitle.trim(),
        target_amount: evalRes.value,
        emoji: editEmoji,
      });

      setEditGoal(null);
      await loadGoalsData();
      Alert.alert(
        language === 'id' ? 'Sukses' : 'Success',
        language === 'id' ? 'Perubahan target berhasil disimpan!' : 'Goal updated successfully!'
      );
    } catch (err: any) {
      Alert.alert(language === 'id' ? 'Gagal' : 'Error', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleDepositMoney = async () => {
    if (!savingToGoal) return;
    const evalRes = evaluateMathExpression(addMoneyExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert(
        language === 'id' ? 'Nominal Tidak Valid' : 'Invalid Amount',
        language === 'id' ? 'Masukkan nominal tabungan yang valid.' : 'Enter valid deposit amount.'
      );
      return;
    }

    try {
      await depositToGoal(savingToGoal.id, evalRes.value);
      setAddMoneyExpr('');
      const targetName = savingToGoal.title;
      setSavingToGoal(null);
      await loadGoalsData();
      Alert.alert(
        language === 'id' ? 'Berhasil Menabung' : 'Deposit Successful',
        `${formatCurrency(evalRes.value)} ${language === 'id' ? 'telah ditambahkan ke' : 'has been added to'} ${targetName}!`
      );
    } catch (err: any) {
      Alert.alert(language === 'id' ? 'Gagal' : 'Error', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleDeleteGoal = (goal: SavingsGoal) => {
    Alert.alert(
      language === 'id' ? 'Hapus Celengan' : 'Delete Goal',
      language === 'id'
        ? `Hapus target impian "${goal.title}" secara permanen?`
        : `Permanently delete savings goal "${goal.title}"?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(goal.id);
              await loadGoalsData();
              Alert.alert(
                language === 'id' ? 'Berhasil Dihapus' : 'Deleted',
                language === 'id' ? 'Target celengan berhasil dihapus.' : 'Savings goal deleted.'
              );
            } catch (err: any) {
              Alert.alert(language === 'id' ? 'Gagal' : 'Error', err.message || 'Gagal menghapus target.');
            }
          },
        },
      ]
    );
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
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
          <Ionicons name="add" size={24} color="#121212" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Grand Total Savings Progress Card */}
        <NeoCard backgroundColor={theme.colors.primary} style={styles.grandCard}>
          <View style={styles.grandTopRow}>
            <View>
              <Text style={styles.grandLabel}>
                {language === 'id' ? 'TOTAL DANA TERKUMPUL' : 'TOTAL SAVED FUNDS'}
              </Text>
              <Text style={styles.grandAmount}>{formatCurrency(totalSaved)}</Text>
            </View>
            <View style={styles.pctBadge}>
              <Text style={styles.pctBadgeText}>{formatPercentage(overallPct)}</Text>
            </View>
          </View>
          <Text style={styles.grandSub}>
            {language === 'id' ? 'Dari total seluruh target impian:' : 'From total dream goals:'} {formatCurrency(totalTarget)}
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
          const pct = item.target_amount > 0 ? (item.current_amount / item.target_amount) * 100 : 0;
          const isDone = item.current_amount >= item.target_amount;

          return (
            <NeoCard key={item.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleRow}>
                  <Text style={styles.goalEmoji}>{item.emoji}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={[styles.goalTitle, { color: theme.colors.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.goalTarget, { color: theme.colors.textMuted }]}>
                      Target: {formatCurrency(item.target_amount)}
                    </Text>
                  </View>
                </View>

                {/* Status and Action Buttons */}
                <View style={styles.actionRow}>
                  {isDone && (
                    <View
                      style={[
                        styles.doneBadge,
                        { backgroundColor: theme.colors.income, borderColor: theme.colors.border },
                      ]}
                    >
                      <Text style={styles.doneBadgeText}>{language === 'id' ? 'TERCAPAI' : 'ACHIEVED'}</Text>
                    </View>
                  )}

                  {/* Edit Button */}
                  <TouchableOpacity
                    onPress={() => handleOpenEdit(item)}
                    style={[
                      styles.actionIconBtn,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                    ]}
                  >
                    <Ionicons name="pencil" size={14} color={theme.colors.text} />
                  </TouchableOpacity>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(item)}
                    style={[
                      styles.actionIconBtn,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={14} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginVertical: 8 }}>
                <NeoProgressBar percentage={pct} height={12} />
              </View>

              <View style={styles.goalBottomRow}>
                <Text style={[styles.goalProgressText, { color: theme.colors.textMuted }]}>
                  {language === 'id' ? 'Terkumpul' : 'Saved'}: {formatCurrency(item.current_amount)} ({formatPercentage(pct)})
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

          {/* Emoji Selection */}
          <Text style={[styles.modalLabel, { color: theme.colors.text, marginTop: 8 }]}>
            {language === 'id' ? 'PILIH IKON EMOJI' : 'SELECT EMOJI'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
            {EMOJI_OPTIONS.map((em) => (
              <TouchableOpacity
                key={em}
                onPress={() => setNewEmoji(em)}
                style={[
                  styles.emojiChip,
                  {
                    backgroundColor: newEmoji === em ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.emojiText}>{em}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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

      {/* Modal Edit Goal */}
      <NeoModal
        visible={!!editGoal}
        onClose={() => setEditGoal(null)}
        title={language === 'id' ? 'EDIT TARGET CELENGAN' : 'EDIT SAVINGS GOAL'}
      >
        <View style={{ paddingVertical: 10 }}>
          <NeoInput
            label={language === 'id' ? 'NAMA TARGET IMPIAN' : 'GOAL TITLE'}
            placeholder={language === 'id' ? 'Misal: Beli Laptop Baru...' : 'e.g. New Laptop...'}
            value={editTitle}
            onChangeText={setEditTitle}
          />

          {/* Emoji Selection */}
          <Text style={[styles.modalLabel, { color: theme.colors.text, marginTop: 8 }]}>
            {language === 'id' ? 'PILIH IKON EMOJI' : 'SELECT EMOJI'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
            {EMOJI_OPTIONS.map((em) => (
              <TouchableOpacity
                key={em}
                onPress={() => setEditEmoji(em)}
                style={[
                  styles.emojiChip,
                  {
                    backgroundColor: editEmoji === em ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.emojiText}>{em}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ marginVertical: 8 }}>
            <Text style={[styles.modalLabel, { color: theme.colors.text }]}>
              {language === 'id' ? 'TARGET NOMINAL' : 'TARGET AMOUNT'}
            </Text>
            <NeoCalculator value={editTargetExpr} onChange={setEditTargetExpr} />
          </View>
          <NeoButton
            title={language === 'id' ? 'SIMPAN PERUBAHAN' : 'SAVE CHANGES'}
            variant="primary"
            onPress={handleUpdateGoal}
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
            style={{ marginTop: 14 }}
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
    borderRadius: 10,
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
    marginBottom: 8,
  },
  grandTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  grandLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: 0.5,
  },
  grandAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#121212',
    marginVertical: 4,
  },
  grandSub: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)',
  },
  pctBadge: {
    backgroundColor: '#121212',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pctBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 13,
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
    fontSize: 14,
    fontWeight: '800',
  },
  goalTarget: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  doneBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0A3B0A',
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  goalProgressText: {
    fontSize: 11,
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
    fontSize: 10,
    fontWeight: '900',
    color: '#121212',
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  emojiRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  emojiChip: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  emojiText: {
    fontSize: 18,
  },
});
