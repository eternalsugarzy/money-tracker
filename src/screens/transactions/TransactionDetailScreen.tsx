import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoBadge } from '../../components/common/NeoBadge';
import { formatCurrency, formatFullDate } from '../../utils/formatters';
import { Transaction } from '../../types';
import { getTransactionById, deleteTransaction } from '../../database/transactionRepo';

export const TransactionDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { refreshData } = useAppData();

  const transactionId = route.params?.transactionId;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!transactionId) return;
    const tx = await getTransactionById(transactionId);
    setTransaction(tx);
  };

  useEffect(() => {
    fetchDetail();
  }, [transactionId]);

  if (!transaction) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t.txDetailTitle}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === 'income';
  const isExpense = transaction.type === 'expense';
  const isTransfer = transaction.type === 'transfer';

  const typeColor = isIncome
    ? theme.colors.income
    : isExpense
    ? theme.colors.expense
    : theme.colors.transfer;

  const typeLabel = isIncome ? t.income : isExpense ? t.expense : t.transfer;

  const receiptImages: string[] = JSON.parse(transaction.receipt_images || '[]');

  const handleDelete = () => {
    Alert.alert(
      language === 'id' ? 'Hapus Transaksi' : 'Delete Transaction',
      t.deleteTxConfirm,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transaction.id);
            await refreshData();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddModal', { editTransaction: transaction });
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>DETAIL TRANSAKSI</Text>
        <TouchableOpacity
          onPress={handleEdit}
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="pencil" size={18} color="#121212" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Amount Card */}
        <NeoCard
          backgroundColor={typeColor}
          style={styles.mainCard}
        >
          <View style={styles.typeBadgeRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{typeLabel}</Text>
            </View>
          </View>

          <Text style={styles.amountDisplay}>
            {formatCurrency(transaction.amount)}
          </Text>

          <Text style={styles.dateDisplay}>
            {formatFullDate(transaction.date, language)}
          </Text>
        </NeoCard>

        {/* Info Grid */}
        <NeoCard style={styles.infoCard}>
          {/* Category (if not transfer) */}
          {!isTransfer && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t.category}</Text>
              <View style={styles.infoValueRow}>
                <NeoBadge
                  icon={transaction.category_icon || 'help-circle'}
                  iconFamily={transaction.category_icon_family || 'Ionicons'}
                  color={transaction.category_color || theme.colors.primary}
                  size="sm"
                />
                <Text style={[styles.infoValueText, { color: theme.colors.text, marginLeft: 8 }]}>
                  {transaction.category_name || (language === 'id' ? 'Lain-lain' : 'Others')}
                </Text>
              </View>
            </View>
          )}

          {/* Account Source */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>
              {isTransfer ? t.fromAccount : t.account}
            </Text>
            <View style={styles.infoValueRow}>
              <NeoBadge
                icon={transaction.account_icon || 'wallet'}
                color={transaction.account_color || theme.colors.surface}
                size="sm"
              />
              <Text style={[styles.infoValueText, { color: theme.colors.text, marginLeft: 8 }]}>
                {transaction.account_name || (language === 'id' ? 'Akun Utama' : 'Main Account')}
              </Text>
            </View>
          </View>

          {/* Transfer Destination */}
          {isTransfer && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t.toAccount}</Text>
              <View style={styles.infoValueRow}>
                <NeoBadge icon="arrow-forward" color={theme.colors.transfer} size="sm" />
                <Text style={[styles.infoValueText, { color: theme.colors.text, marginLeft: 8 }]}>
                  {transaction.to_account_name || (language === 'id' ? 'Akun Tujuan' : 'Destination Account')}
                </Text>
              </View>
            </View>
          )}

          {/* Notes */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t.note}</Text>
            <Text style={[styles.infoValueText, { color: theme.colors.text, flex: 1, textAlign: 'right' }]}>
              {transaction.note || '-'}
            </Text>
          </View>

          {/* Created Timestamp */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>
              {language === 'id' ? 'DICATAT PADA' : 'RECORDED AT'}
            </Text>
            <Text style={[styles.infoTimestamp, { color: theme.colors.textMuted }]}>
              {new Date(transaction.created_at).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
            </Text>
          </View>
        </NeoCard>

        {/* Receipt Photos */}
        {receiptImages.length > 0 && (
          <NeoCard style={styles.receiptCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {language === 'id' ? 'FOTO STRUK' : 'RECEIPT PHOTOS'} ({receiptImages.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {receiptImages.map((uri, idx) => (
                <TouchableOpacity
                  key={`rcpt_${idx}`}
                  onPress={() => setPreviewImage(uri)}
                  style={[styles.receiptThumbWrapper, { borderColor: theme.colors.border }]}
                >
                  <Image source={{ uri }} style={styles.receiptThumb} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </NeoCard>
        )}

        {/* Action Buttons */}
        <View style={styles.actionBtnRow}>
          <NeoButton
            title="EDIT TRANSAKSI"
            variant="primary"
            icon={<Ionicons name="pencil" size={18} color="#121212" />}
            onPress={handleEdit}
            style={{ flex: 1, marginRight: 8 }}
          />

          <NeoButton
            title="HAPUS"
            variant="expense"
            icon={<Ionicons name="trash-outline" size={18} color="#FFFFFF" />}
            onPress={handleDelete}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </ScrollView>

      {/* Full Preview Image Modal */}
      <Modal
        visible={!!previewImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.previewBackdrop}>
          <TouchableOpacity onPress={() => setPreviewImage(null)} style={styles.previewCloseBtn}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          {previewImage && (
            <Image source={{ uri: previewImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
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
  mainCard: {
    padding: 20,
    alignItems: 'center',
  },
  typeBadgeRow: {
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: '#121212',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  amountDisplay: {
    fontSize: 32,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: 0.5,
  },
  dateDisplay: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
    marginTop: 6,
  },
  infoCard: {
    marginTop: 14,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValueText: {
    fontSize: 14,
    fontWeight: '800',
  },
  infoTimestamp: {
    fontSize: 12,
    fontWeight: '600',
  },
  receiptCard: {
    marginTop: 14,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  receiptThumbWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    marginRight: 10,
  },
  receiptThumb: {
    width: '100%',
    height: '100%',
  },
  actionBtnRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
});
