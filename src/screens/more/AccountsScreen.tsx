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
import { formatCurrency } from '../../utils/formatters';
import { Account } from '../../types';
import { deleteAccount } from '../../database/accountRepo';

export const AccountsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { accounts, totalNetWorth, refreshData } = useAppData();
  const [showArchived, setShowArchived] = useState(false);

  const displayedAccounts = showArchived
    ? accounts
    : accounts.filter((a) => a.is_archived === 0);

  const handleDelete = (acc: Account) => {
    Alert.alert(
      'Hapus / Arsipkan Akun',
      `Apakah Anda yakin ingin menghapus akun "${acc.name}"? Jika ada transaksi terkait, akun akan diarsipkan agar data transaksi tetap aman.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus / Arsipkan',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteAccount(acc.id);
            await refreshData();
            if (res.action === 'archived') {
              Alert.alert('Diarsipkan', 'Akun berhasil diarsipkan karena memiliki riwayat transaksi terkait.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Top Header */}
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AKUN & DOMPET</Text>
        <NeoButton
          title="+ AKUN"
          size="sm"
          variant="primary"
          onPress={() => navigation.navigate('AccountFormModal')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Total Balance Card */}
        <NeoCard backgroundColor={theme.colors.primary} style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL KEKAYAAN BERSIH (NET WORTH)</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalNetWorth)}</Text>
          <Text style={styles.totalSub}>Dari {displayedAccounts.length} akun aktif</Text>
        </NeoCard>

        {/* List of Accounts */}
        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            DAFTAR DOMPET / REKENING
          </Text>
          <TouchableOpacity onPress={() => setShowArchived(!showArchived)}>
            <Text style={[styles.archiveToggle, { color: theme.colors.textMuted }]}>
              {showArchived ? 'Sembunyikan Arsip' : 'Tampilkan Arsip'}
            </Text>
          </TouchableOpacity>
        </View>

        {displayedAccounts.map((acc) => (
          <NeoCard key={acc.id} style={styles.accountCard}>
            <View style={styles.accountCardContent}>
              <NeoBadge
                icon={acc.icon}
                iconFamily={acc.icon_family}
                color={acc.color}
                size="lg"
              />

              <View style={styles.accountDetails}>
                <View style={styles.nameRow}>
                  <Text style={[styles.accountName, { color: theme.colors.text }]}>
                    {acc.name}
                  </Text>
                  {acc.is_archived === 1 && (
                    <View
                      style={[
                        styles.archivedBadge,
                        { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border },
                      ]}
                    >
                      <Text style={[styles.archivedText, { color: theme.colors.textMuted }]}>Arsip</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.accountType, { color: theme.colors.textMuted }]}>
                  Tipe: {acc.type}
                </Text>

                <Text style={[styles.accountBalance, { color: theme.colors.text }]}>
                  {formatCurrency(acc.current_balance)}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsColumn}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AccountFormModal', { editAccount: acc })}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons name="pencil" size={16} color="#121212" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(acc)}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      marginTop: 6,
                    },
                  ]}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </NeoCard>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  totalCard: {
    padding: 18,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#121212',
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#121212',
    marginVertical: 6,
  },
  totalSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  archiveToggle: {
    fontSize: 11,
    fontWeight: '800',
  },
  accountCard: {
    marginVertical: 6,
    padding: 12,
  },
  accountCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountDetails: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '900',
  },
  archivedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  archivedText: {
    fontSize: 9,
    fontWeight: '800',
  },
  accountType: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  actionsColumn: {
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
