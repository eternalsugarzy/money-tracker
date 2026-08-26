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
import { NeoBadge } from '../../components/common/NeoBadge';
import { NeoModal } from '../../components/common/NeoModal';
import { formatCurrency, formatDateLabel, getTodayDateString } from '../../utils/formatters';
import { Debt, DebtType, Account } from '../../types';
import { deleteDebt, settleDebt } from '../../database/debtRepo';

export const DebtsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { debts, accounts, refreshData } = useAppData();

  const [activeTab, setActiveTab] = useState<DebtType>('receivable'); // 'receivable' (Piutang) or 'debt' (Utang)
  const [settlingDebt, setSettlingDebt] = useState<Debt | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [createAutoTx, setCreateAutoTx] = useState<boolean>(true);

  const displayedDebts = debts.filter((d) => d.type === activeTab);
  const unpaidCount = displayedDebts.filter((d) => d.status === 'unpaid').length;
  const totalUnpaidAmount = displayedDebts
    .filter((d) => d.status === 'unpaid')
    .reduce((s, d) => s + d.amount, 0);

  const handleDelete = (debt: Debt) => {
    Alert.alert('Hapus Catatan', `Hapus catatan untuk "${debt.person_name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteDebt(debt.id);
          await refreshData();
        },
      },
    ]);
  };

  const handleConfirmSettlement = async () => {
    if (!settlingDebt) return;
    try {
      await settleDebt(settlingDebt.id, {
        createTx: createAutoTx,
        accountId: createAutoTx ? selectedAccountId : undefined,
        settledDate: getTodayDateString(),
      });
      await refreshData();
      setSettlingDebt(null);
      Alert.alert('Sukses', 'Status berhasil diubah menjadi LUNAS.');
    } catch (err: any) {
      Alert.alert('Gagal', err.message || 'Terjadi kesalahan');
    }
  };

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>HUTANG - PIUTANG</Text>
        <NeoButton
          title="+ CATAT"
          size="sm"
          variant="primary"
          onPress={() => navigation.navigate('DebtFormModal', { defaultType: activeTab })}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Total Summary Card */}
        <NeoCard
          backgroundColor={activeTab === 'receivable' ? theme.colors.income : theme.colors.debt}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryLabel}>
            {activeTab === 'receivable'
              ? 'TOTAL PIUTANG BELUM DIBAYAR KE SAYA'
              : 'TOTAL SAYA BERHUTANG KE ORANG'}
          </Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalUnpaidAmount)}</Text>
          <Text style={styles.summarySub}>{unpaidCount} catatan belum lunas</Text>
        </NeoCard>

        {/* Tab Selector: Piutang vs Utang */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('receivable')}
            style={[
              styles.tabBtn,
              {
                backgroundColor: activeTab === 'receivable' ? theme.colors.income : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'receivable' ? '#0A3B0A' : theme.colors.text,
                  fontWeight: activeTab === 'receivable' ? '900' : '700',
                },
              ]}
            >
              Piutang (Saya Beri Pinjaman)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('debt')}
            style={[
              styles.tabBtn,
              {
                backgroundColor: activeTab === 'debt' ? theme.colors.debt : theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'debt' ? '#FFFFFF' : theme.colors.text,
                  fontWeight: activeTab === 'debt' ? '900' : '700',
                },
              ]}
            >
              Utang (Saya Meminjam)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Debts List */}
        {displayedDebts.length === 0 ? (
          <NeoCard style={styles.emptyCard}>
            <Ionicons name="people-outline" size={44} color={theme.colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Tidak Ada Catatan {activeTab === 'receivable' ? 'Piutang' : 'Utang'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
              {activeTab === 'receivable'
                ? 'Catat uang yang dipinjam oleh teman atau keluarga agar tidak lupa.'
                : 'Catat pinjaman atau talangan dari orang lain.'}
            </Text>
            <NeoButton
              title="+ TAMBAH CATATAN"
              variant="primary"
              onPress={() => navigation.navigate('DebtFormModal', { defaultType: activeTab })}
              style={{ marginTop: 14 }}
            />
          </NeoCard>
        ) : (
          displayedDebts.map((item) => {
            const isPaid = item.status === 'paid';
            return (
              <NeoCard key={item.id} style={styles.debtCard}>
                <View style={styles.debtHeader}>
                  <View style={styles.debtHeaderLeft}>
                    <NeoBadge
                      icon="person"
                      color={isPaid ? theme.colors.cardSecondary : activeTab === 'receivable' ? theme.colors.income : theme.colors.debt}
                      size="md"
                    />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={[styles.personName, { color: theme.colors.text }]}>
                        {item.person_name}
                      </Text>
                      <Text style={[styles.dateText, { color: theme.colors.textMuted }]}>
                        Tanggal: {formatDateLabel(item.date)}
                        {item.due_date ? ` • Jatuh tempo: ${formatDateLabel(item.due_date)}` : ''}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.debtAmount,
                      {
                        color: isPaid
                          ? theme.colors.textMuted
                          : activeTab === 'receivable'
                          ? theme.colors.income
                          : theme.colors.debt,
                        textDecorationLine: isPaid ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {formatCurrency(item.amount)}
                  </Text>
                </View>

                {item.note ? (
                  <Text style={[styles.noteText, { color: theme.colors.text }]}>
                    Catatan: {item.note}
                  </Text>
                ) : null}

                {/* Status & Action Row */}
                <View style={styles.actionRow}>
                  {isPaid ? (
                    <View
                      style={[
                        styles.paidBadge,
                        {
                          backgroundColor: theme.colors.cardSecondary,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Ionicons name="checkmark-circle" size={14} color={theme.colors.income} />
                      <Text style={[styles.paidText, { color: theme.colors.text }]}>
                        LUNAS {item.settled_at ? `(${item.settled_at})` : ''}
                      </Text>
                    </View>
                  ) : (
                    <NeoButton
                      title="Tandai Lunas"
                      size="sm"
                      variant="primary"
                      icon={<Ionicons name="checkmark-done" size={16} color="#121212" />}
                      onPress={() => setSettlingDebt(item)}
                    />
                  )}

                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('DebtFormModal', { editDebt: item })}
                      style={[
                        styles.iconBtn,
                        {
                          backgroundColor: theme.colors.surface,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Ionicons name="pencil" size={16} color={theme.colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(item)}
                      style={[
                        styles.iconBtn,
                        {
                          backgroundColor: theme.colors.surface,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </NeoCard>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Settle Debt Modal Dialog */}
      <NeoModal
        visible={!!settlingDebt}
        onClose={() => setSettlingDebt(null)}
        title="KONFIRMASI PELUNASAN"
        subtitle={`Pelunasan untuk ${settlingDebt?.person_name}`}
      >
        {settlingDebt && (
          <View style={{ paddingVertical: 6 }}>
            <Text style={[styles.settleInfo, { color: theme.colors.text }]}>
              Nominal: <Text style={{ fontWeight: '900' }}>{formatCurrency(settlingDebt.amount)}</Text>
            </Text>

            {/* Toggle Auto Create Transaction */}
            <TouchableOpacity
              onPress={() => setCreateAutoTx(!createAutoTx)}
              style={[
                styles.toggleTxBox,
                {
                  backgroundColor: createAutoTx ? theme.colors.primary : theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <Ionicons
                name={createAutoTx ? 'checkbox' : 'square-outline'}
                size={20}
                color="#121212"
              />
              <Text style={styles.toggleTxText}>
                {settlingDebt.type === 'receivable'
                  ? 'Otomatis buat transaksi Pemasukan (Income)'
                  : 'Otomatis buat transaksi Pengeluaran (Expense)'}
              </Text>
            </TouchableOpacity>

            {createAutoTx && (
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.selectAccLabel, { color: theme.colors.text }]}>
                  {settlingDebt.type === 'receivable' ? 'MASUK KE AKUN' : 'DIBAYAR DARI AKUN'}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
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
                        <Text style={[styles.chipTitle, { color: theme.colors.text }]}>
                          {acc.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <NeoButton
              title="SIMPAN STATUS LUNAS"
              variant="income"
              size="lg"
              onPress={handleConfirmSettlement}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
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
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    padding: 18,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#121212',
  },
  summaryAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#121212',
    marginVertical: 6,
  },
  summarySub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 11,
  },
  debtCard: {
    marginVertical: 6,
    padding: 14,
  },
  debtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debtHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  personName: {
    fontSize: 15,
    fontWeight: '900',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: '900',
  },
  noteText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  paidText: {
    fontSize: 11,
    fontWeight: '800',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  settleInfo: {
    fontSize: 15,
    marginBottom: 12,
  },
  toggleTxBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  toggleTxText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#121212',
    flex: 1,
  },
  selectAccLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
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
});
