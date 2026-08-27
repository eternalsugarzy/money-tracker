import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t, language } = useLanguage();
  const { categories, accounts } = useAppData();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [emoji, setEmoji] = useState<string>('⚡');
  const [amountExpr, setAmountExpr] = useState<string>('');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedAccId, setSelectedAccId] = useState<string | null>(null);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');

  const activeCategories = categories.filter((c) => c.is_archived === 0);
  const selectedCategory = activeCategories.find((c) => c.id === selectedCatId) || activeCategories[0];

  const displayedCategories = categorySearchQuery.trim()
    ? activeCategories.filter((c) =>
        c.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
      )
    : activeCategories;

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setEmoji('⚡');
    setAmountExpr('');
    setSelectedCatId(categories[0]?.id || null);
    setSelectedAccId(accounts[0]?.id || null);
    setIsCategoryDropdownOpen(false);
    setCategorySearchQuery('');
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
      Alert.alert(language === 'id' ? 'Nama Kosong' : 'Empty Name', language === 'id' ? 'Harap masukkan nama shortcut.' : 'Please enter shortcut name.');
      return;
    }
    const evalRes = evaluateMathExpression(amountExpr);
    if (!evalRes.isValid || evalRes.value <= 0) {
      Alert.alert(language === 'id' ? 'Nominal Tidak Valid' : 'Invalid Amount', language === 'id' ? 'Harap masukkan nominal transaksi.' : 'Please enter valid amount.');
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
      resetForm();
    } catch (err: any) {
      Alert.alert(language === 'id' ? 'Gagal' : 'Failed', err.message || 'Error saving shortcut');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      language === 'id' ? 'Hapus Shortcut' : 'Delete Shortcut',
      language === 'id' ? `Hapus shortcut "${name}"?` : `Delete shortcut "${name}"?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteShortcut(id);
            onRefresh();
          },
        },
      ]
    );
  };

  return (
    <NeoModal
      visible={visible}
      onClose={() => {
        setIsEditing(false);
        onClose();
      }}
      title={
        isEditing
          ? editingId
            ? (language === 'id' ? 'EDIT CATAT CEPAT' : 'EDIT QUICK SHORTCUT')
            : (language === 'id' ? 'TAMBAH CATAT CEPAT' : 'ADD QUICK SHORTCUT')
          : (language === 'id' ? 'KELOLA CATAT CEPAT' : 'MANAGE QUICK SHORTCUTS')
      }
    >
      {isEditing ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
          {/* Emoji Picker */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {language === 'id' ? 'PILIH EMOJI / ICON' : 'CHOOSE EMOJI / ICON'}
          </Text>
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
            label={language === 'id' ? 'NAMA TRANSAKSI' : 'TRANSACTION NAME'}
            placeholder={language === 'id' ? 'Misal: Kopi Susu, Bensin, Parkir...' : 'e.g. Coffee, Fuel, Parking...'}
            value={title}
            onChangeText={setTitle}
            containerStyle={{ marginTop: 10 }}
          />

          {/* Category Selector */}
          <View style={{ marginTop: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.label, { color: theme.colors.text, marginBottom: 0 }]}>{t.category.toUpperCase()}</Text>
            <TouchableOpacity
              onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                borderWidth: 1.5,
                backgroundColor: isCategoryDropdownOpen ? theme.colors.primary : theme.colors.cardSecondary,
                borderColor: theme.colors.border,
                gap: 4,
              }}
            >
              <Ionicons
                name={isCategoryDropdownOpen ? 'chevron-up' : 'grid-outline'}
                size={14}
                color={theme.colors.text}
              />
              <Text style={{ fontSize: 10, fontWeight: '800', color: theme.colors.text }}>
                {isCategoryDropdownOpen ? 'Tutup Daftar' : `Buka Dropdown (${activeCategories.length})`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected Category Trigger Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            style={[
              styles.selectedCatBanner,
              {
                backgroundColor: selectedCategory ? selectedCategory.color : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.selectedCatLeft}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={(selectedCategory?.icon || 'pricetag') as any} size={20} color={selectedCategory?.color || theme.colors.primary} />
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.selectedCatSub}>Kategori Terpilih:</Text>
                <Text style={styles.selectedCatName} numberOfLines={1}>
                  {selectedCategory ? selectedCategory.name : 'Pilih Kategori'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.dropdownBadge,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name={isCategoryDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.colors.text}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.dropdownBadgeText, { color: theme.colors.text }]}>
                {isCategoryDropdownOpen ? 'Tutup' : 'Ubah'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Quick Horizontal Scroll when collapsed */}
          {!isCategoryDropdownOpen && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {activeCategories.map((c) => {
                const isSelected = selectedCatId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedCatId(c.id)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? c.color : theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderWidth: isSelected ? 2.5 : 1.5,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#FFFFFF' : theme.colors.text, fontWeight: isSelected ? '900' : '600' },
                      ]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Dropdown Content: Search Box + 3-Column Grid */}
          {isCategoryDropdownOpen && (
            <View style={styles.dropdownContentWrapper}>
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: theme.colors.inputBg,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons name="search" size={16} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
                <TextInput
                  placeholder="Cari kategori..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={categorySearchQuery}
                  onChangeText={setCategorySearchQuery}
                  style={[styles.searchInput, { color: theme.colors.text }]}
                />
                {categorySearchQuery ? (
                  <TouchableOpacity onPress={() => setCategorySearchQuery('')}>
                    <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.catGrid}>
                {displayedCategories.map((cat) => {
                  const isSelected = selectedCatId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCatId(cat.id)}
                      style={[
                        styles.catGridItem,
                        {
                          backgroundColor: isSelected ? cat.color : theme.colors.surface,
                          borderColor: theme.colors.border,
                          borderWidth: isSelected ? 2.5 : 1.5,
                        },
                      ]}
                    >
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isSelected ? '#FFFFFF' : cat.color, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={cat.icon as any} size={20} color={isSelected ? cat.color : '#FFFFFF'} />
                      </View>
                      <Text
                        style={[
                          styles.catGridName,
                          {
                            color: isSelected ? '#121212' : theme.colors.text,
                            fontWeight: isSelected ? '900' : '600',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Amount Keypad */}
          <Text style={[styles.label, { color: theme.colors.text, marginTop: 12 }]}>
            {language === 'id' ? 'NOMINAL PENGELUARAN' : 'EXPENSE AMOUNT'}
          </Text>
          <NeoCalculator value={amountExpr} onChange={setAmountExpr} />

          {/* Save & Cancel Action */}
          <View style={styles.modalBtnRow}>
            <NeoButton
              title={t.cancel}
              variant="outline"
              size="md"
              onPress={() => setIsEditing(false)}
              style={{ flex: 1 }}
            />
            <NeoButton
              title={language === 'id' ? 'Simpan Shortcut' : 'Save Shortcut'}
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
            title={`+ ${language === 'id' ? 'TAMBAH SHORTCUT BARU' : 'ADD NEW SHORTCUT'}`}
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
  selectedCatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10,
  },
  selectedCatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCatSub: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 2,
  },
  selectedCatName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#121212',
  },
  dropdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  dropdownBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  dropdownContentWrapper: {
    marginTop: 6,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catGridItem: {
    width: '30.8%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catGridName: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
});
