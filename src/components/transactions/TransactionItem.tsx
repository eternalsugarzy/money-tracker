import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDateLabel } from '../../utils/formatters';
import { NeoBadge } from '../common/NeoBadge';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (tx: Transaction) => void;
  onDelete?: (tx: Transaction) => void;
  onEdit?: (tx: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  onDelete,
  onEdit,
}) => {
  const { theme } = useTheme();

  const isIncome = transaction.type === 'income';
  const isExpense = transaction.type === 'expense';
  const isTransfer = transaction.type === 'transfer';

  const amountColor = isIncome
    ? theme.colors.income
    : isExpense
    ? theme.colors.expense
    : theme.colors.transfer;

  const sign = isIncome ? '+' : isExpense ? '-' : '↔';

  const hasReceipts =
    transaction.receipt_images &&
    JSON.parse(transaction.receipt_images || '[]').length > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(transaction)}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 2,
          borderRadius: theme.neo.borderRadiusSm,
          shadowColor: theme.neo.shadowSm.shadowColor,
          shadowOffset: theme.neo.shadowSm.shadowOffset,
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 2,
        },
      ]}
    >
      {/* Left Icon Badge */}
      <View style={styles.leftSection}>
        {isTransfer ? (
          <NeoBadge
            icon="swap-horizontal"
            iconFamily="Ionicons"
            color={theme.colors.transfer}
            size="md"
          />
        ) : (
          <NeoBadge
            icon={transaction.category_icon || 'help-circle'}
            iconFamily={transaction.category_icon_family || 'Ionicons'}
            color={transaction.category_color || theme.colors.primary}
            size="md"
          />
        )}

        {/* Title and Notes */}
        <View style={styles.infoSection}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {isTransfer
              ? `Transfer: ${transaction.account_name || 'Akun'} → ${transaction.to_account_name || 'Tujuan'}`
              : transaction.category_name || 'Lain-lain'}
          </Text>

          <View style={styles.metaRow}>
            {/* Account Tag */}
            {!isTransfer && transaction.account_name && (
              <View
                style={[
                  styles.accountTag,
                  {
                    backgroundColor: theme.colors.cardSecondary,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.accountTagText, { color: theme.colors.textMuted }]}>
                  {transaction.account_name}
                </Text>
              </View>
            )}

            {/* Note */}
            {transaction.note ? (
              <Text
                style={[styles.noteText, { color: theme.colors.textMuted }]}
                numberOfLines={1}
              >
                {transaction.note}
              </Text>
            ) : null}

            {/* Receipt attachment indicator */}
            {hasReceipts && (
              <Ionicons
                name="receipt-outline"
                size={14}
                color={theme.colors.primaryText}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
      </View>

      {/* Right: Amount & Quick Action */}
      <View style={styles.rightSection}>
        <Text style={[styles.amountText, { color: amountColor }]}>
          {sign} {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoSection: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 4,
  },
  accountTag: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderRadius: 4,
  },
  accountTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noteText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
