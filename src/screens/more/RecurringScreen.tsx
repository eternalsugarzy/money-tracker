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
import { NeoBadge } from '../../components/common/NeoBadge';
import { formatCurrency, getTodayDateString } from '../../utils/formatters';
import { RecurringTransaction } from '../../types';
import { deleteRecurring } from '../../database/recurringRepo';
import { createTransaction } from '../../database/transactionRepo';

export const RecurringScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const navigation = useNavigation<any>();
  const { recurring, refreshData } = useAppData();

  const handleCreateFromTemplate = (rec: RecurringTransaction) => {
    Alert.alert(
      language === 'id' ? 'Catat Transaksi Sekarang' : 'Record Transaction Now',
      language === 'id'
        ? `Buat transaksi riil "${rec.note || rec.category_name || 'Transaksi Berulang'}" sebesar ${formatCurrency(rec.amount)} untuk hari ini?`
        : `Create actual transaction "${rec.note || rec.category_name || 'Recurring'}" of ${formatCurrency(rec.amount)} for today?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: language === 'id' ? 'Konfirmasi Catat' : 'Confirm & Record',
          onPress: async () => {
            await createTransaction({
              type: rec.type,
              amount: rec.amount,
              date: getTodayDateString(),
              account_id: rec.account_id,
              to_account_id: rec.to_account_id,
              category_id: rec.category_id,
              note: `[${language === 'id' ? 'Berulang' : 'Recurring'}] ${rec.note || ''}`,
              receipt_images: '[]',
            });
            await refreshData();
            Alert.alert(language === 'id' ? 'Sukses' : 'Success', language === 'id' ? 'Transaksi berhasil dicatat ke dalam database.' : 'Transaction successfully recorded.');
          },
        },
      ]
    );
  };

  const handleDelete = (rec: RecurringTransaction) => {
    Alert.alert(
      language === 'id' ? 'Hapus Template Berulang' : 'Delete Recurring Template',
      language === 'id' ? 'Hapus template transaksi berulang ini?' : 'Delete this recurring template?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteRecurring(rec.id);
            await refreshData();
          },
        },
      ]
    );
  };

  const getIntervalLabel = (interval: string) => {
    switch (interval) {
      case 'daily':
        return language === 'id' ? 'Harian' : 'Daily';
      case 'weekly':
        return language === 'id' ? 'Mingguan' : 'Weekly';
      case 'yearly':
        return language === 'id' ? 'Tahunan' : 'Yearly';
      case 'monthly':
      default:
        return language === 'id' ? 'Bulanan' : 'Monthly';
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t.recurringTitle}</Text>
        <NeoButton
          title="+ TEMPLATE"
          size="sm"
          variant="primary"
          onPress={() => navigation.navigate('RecurringFormModal')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <NeoCard backgroundColor={theme.colors.cardSecondary} style={styles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.infoTitle, { color: theme.colors.text, marginLeft: 6 }]}>
              Sistem Konfirmasi Pengingat
            </Text>
          </View>
          <Text style={[styles.infoDesc, { color: theme.colors.textMuted }]}>
            Transaksi berulang tidak akan dipotong otomatis. Aplikasi akan mengirimkan pengingat notifikasi, lalu Anda dapat meninjau dan menekan tombol konfirmasi.
          </Text>
        </NeoCard>

        {recurring.length === 0 ? (
          <NeoCard style={styles.emptyCard}>
            <Ionicons name="repeat-outline" size={44} color={theme.colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Belum Ada Transaksi Berulang
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
              Buat template untuk tagihan bulanan seperti sewa kost, WiFi, langganan streaming, atau gaji pokok.
            </Text>
            <NeoButton
              title="+ TAMBAH RECURRING PERTAMA"
              variant="primary"
              onPress={() => navigation.navigate('RecurringFormModal')}
              style={{ marginTop: 14 }}
            />
          </NeoCard>
        ) : (
          recurring.map((rec) => {
            const isExpense = rec.type === 'expense';
            const amountColor = isExpense ? theme.colors.expense : theme.colors.income;

            return (
              <NeoCard key={rec.id} style={styles.itemCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.leftHeader}>
                    <NeoBadge
                      icon={rec.category_icon || 'repeat'}
                      iconFamily={rec.category_icon_family || 'Ionicons'}
                      color={rec.category_color || theme.colors.primary}
                      size="md"
                    />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={[styles.itemNote, { color: theme.colors.text }]}>
                        {rec.note || rec.category_name || 'Transaksi Berulang'}
                      </Text>
                      <View style={styles.badgeRow}>
                        <View
                          style={[
                            styles.intervalBadge,
                            {
                              backgroundColor: theme.colors.cardSecondary,
                              borderColor: theme.colors.border,
                            },
                          ]}
                        >
                          <Text style={[styles.intervalText, { color: theme.colors.text }]}>
                            {getIntervalLabel(rec.interval)}
                          </Text>
                        </View>
                        {rec.account_name && (
                          <Text style={[styles.accTag, { color: theme.colors.textMuted }]}>
                            • {rec.account_name}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.amountText, { color: amountColor }]}>
                    {formatCurrency(rec.amount)}
                  </Text>
                </View>

                {/* Bottom Action Row */}
                <View style={styles.actionRow}>
                  <NeoButton
                    title="Catat Sekarang"
                    size="sm"
                    variant="primary"
                    icon={<Ionicons name="checkmark-circle-outline" size={16} color="#121212" />}
                    onPress={() => handleCreateFromTemplate(rec)}
                  />

                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('RecurringFormModal', { editRecurring: rec })}
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
                      onPress={() => handleDelete(rec)}
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
  infoCard: {
    padding: 14,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  infoDesc: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 16,
  },
  itemCard: {
    marginVertical: 6,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemNote: {
    fontSize: 14,
    fontWeight: '900',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  intervalBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  intervalText: {
    fontSize: 10,
    fontWeight: '800',
  },
  accTag: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '900',
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
});
