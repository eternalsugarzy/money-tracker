import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoModal } from '../../components/common/NeoModal';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoCalculator } from '../../components/common/NeoCalculator';
import { QuickShortcut } from '../../types';
import { insertShortcut, updateShortcut, deleteShortcut } from '../../database/shortcutRepo';
import { formatCurrency } from '../../utils/formatters';
import { evaluateMathExpression } from '../../utils/mathEvaluator';

const POPULAR_EMOJIS = ['☕', '🍽️', '⛽', '🛒', '🚕', '💊', '🎬', '🎮', '⚡', '💰', '🎁', '🏋️', '🥐', '🍔', '🚌', '🛵'];

interface QuickShortcutsModalProps {
  visible: boolean;
  onClose: () => void;
  shortcuts: QuickShortcut[];
  onRefresh: () => void;
}

export const QuickShortcutsModal: React.FC<QuickShortcutsModalProps> = ({
  visible,
  onClose,
  shortcuts,
  onRefresh,
}) => {
  const { theme } = useTheme();
  const { categories, accounts } = useAppData();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [emoji, setEmoji] = useState<string>('⚡');
  const [amountExpr, setAmountExpr] = useState<string>('');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedAccId, setSelectedAccId] = useState<string | null>(null);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setEmoji('⚡');
    setAmountExpr('');
    setSelectedCatId(categories[0]?.id || null);
    setSelectedAccId(accounts[0]?.id || null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleOpenEdit = (sc: QuickShortcut) => {
    setEditingId(sc.id);
    setTitle(sc.title);
    setEmoji(sc.emoji);
    setAmountExpr(String(sc.amount));
    setSelectedCatId(sc.category_id || categories[0]?.id || null);
    setSelectedAccId(sc.account_id || accounts[0]?.id || null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Nama Kosong', 'Harap masukkan nama shortcut.');
      return;
    }
    const evalRes = evaluateMathExpression(amountExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Harap masukkan nominal transaksi.');
      return;
    }

    try {
      if (editingId) {
        await updateShortcut(editingId, {
          title: title.trim(),
          emoji,
          amount: evalRes.value,
          category_id: selectedCatId,
          account_id: selectedAccId,
          type: 'expense',
        });
      } else {
        await insertShortcut({
          title: title.trim(),
          emoji,
          amount: evalRes.value,
          category_id: selectedCatId,
          account_id: selectedAccId,
          type: 'expense',
        });
      }
      onRefresh();
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', 'Gagal menyimpan shortcut.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Hapus Shortcut', `Hapus shortcut "${name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteShortcut(id);
          onRefresh();
        },
      },
    ]);
  };

  return (
    <NeoModal
      visible={visible}
      onClose={() => {
        setIsEditing(false);
        onClose();
      }}
      title={isEditing ? (editingId ? 'EDIT CATAT CEPAT' : 'TAMBAH CATAT CEPAT') : 'KELOLA CATAT CEPAT'}
    >
      {isEditing ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
          {/* Emoji Picker */}
          <Text style={[styles.label, { color: theme.colors.text }]}>PILIH EMOJI / ICON</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
            {POPULAR_EMOJIS.map((em) => (
              <TouchableOpacity
                key={em}
                onPress={() => setEmoji(em)}
                style={[
                  styles.emojiBtn,
                  {
                    backgroundColor: emoji === em ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderWidth: emoji === em ? 2.5 : 1.5,
                  },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{em}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Title */}
          <NeoInput
            label="NAMA TRANSAKSI"
            placeholder="Misal: Kopi Susu, Bensin, Parkir..."
            value={title}
            onChangeText={setTitle}
            containerStyle={{ marginTop: 10 }}
          />

          {/* Category Selector */}
          <Text style={[styles.label, { color: theme.colors.text, marginTop: 12 }]}>KATEGORI</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {categories.map((c) => {
              const isSelected = selectedCatId === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelectedCatId(c.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                      borderWidth: isSelected ? 2 : 1.5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? '#121212' : theme.colors.text, fontWeight: isSelected ? '900' : '600' },
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Amount Keypad */}
          <Text style={[styles.label, { color: theme.colors.text, marginTop: 12 }]}>NOMINAL PENGELUARAN</Text>
          <NeoCalculator value={amountExpr} onChange={setAmountExpr} />

          {/* Save & Cancel Action */}
          <View style={styles.modalBtnRow}>
            <NeoButton
              title="Batal"
              variant="outline"
              size="md"
              onPress={() => setIsEditing(false)}
              style={{ flex: 1 }}
            />
            <NeoButton
              title="Simpan Shortcut"
              variant="primary"
              size="md"
              onPress={handleSave}
              style={{ flex: 1.5 }}
            />
          </View>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
          <NeoButton
            title="+ TAMBAH SHORTCUT BARU"
            variant="primary"
            onPress={handleOpenAdd}
            style={{ marginBottom: 12 }}
          />

          {shortcuts.map((sc) => (
            <NeoCard key={sc.id} style={styles.shortcutCard}>
              <View style={styles.shortcutRow}>
                <Text style={styles.scEmoji}>{sc.emoji}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.scTitle, { color: theme.colors.text }]}>{sc.title}</Text>
                  <Text style={[styles.scAmount, { color: theme.colors.expense }]}>
                    {formatCurrency(sc.amount)} {sc.category_name ? `• ${sc.category_name}` : ''}
                  </Text>
                </View>

                {/* Edit & Delete Action Buttons */}
                <View style={styles.scActions}>
                  <TouchableOpacity
                    onPress={() => handleOpenEdit(sc)}
                    style={[
                      styles.actionBtn,
                      { backgroundColor: theme.colors.primary, borderColor: theme.colors.border },
                    ]}
                  >
                    <Ionicons name="pencil" size={14} color="#121212" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(sc.id, sc.title)}
                    style={[
                      styles.actionBtn,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginLeft: 6 },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={14} color={theme.colors.expense} />
                  </TouchableOpacity>
                </View>
              </View>
            </NeoCard>
          ))}
        </ScrollView>
      )}
    </NeoModal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  emojiRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  chipText: {
    fontSize: 11,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 10,
  },
  shortcutCard: {
    marginVertical: 4,
    padding: 10,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scEmoji: {
    fontSize: 24,
  },
  scTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  scAmount: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  scActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
