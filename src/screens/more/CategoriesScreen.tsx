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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoBadge } from '../../components/common/NeoBadge';
import { Category } from '../../types';
import { deleteCategory } from '../../database/categoryRepo';

export const CategoriesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { categories, refreshData } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const displayedCategories = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchived = showArchived ? true : c.is_archived === 0;
    return matchesSearch && matchesArchived;
  });

  const handleDelete = (cat: Category) => {
    Alert.alert(
      'Hapus / Arsipkan Kategori',
      `Apakah Anda yakin ingin menghapus kategori "${cat.name}"? Jika ada transaksi atau budget terkait, kategori akan diarsipkan secara aman.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus / Arsipkan',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteCategory(cat.id);
            await refreshData();
            if (res.action === 'archived') {
              Alert.alert('Diarsipkan', 'Kategori berhasil diarsipkan karena memiliki riwayat transaksi terkait.');
            }
          },
        },
      ]
    );
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>KATEGORI</Text>
        <NeoButton
          title="+ KATEGORI"
          size="sm"
          variant="primary"
          onPress={() => navigation.navigate('CategoryFormModal')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search & Info Bar */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={16} color={theme.colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Cari kategori (Makan, Transport, Gaji...)"
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories Count & Toggle Archive */}
        <View style={styles.metaRow}>
          <Text style={[styles.metaCount, { color: theme.colors.textMuted }]}>
            {displayedCategories.length} Kategori Tersedia (Untuk Pemasukan, Pengeluaran & Budget)
          </Text>
          <TouchableOpacity onPress={() => setShowArchived(!showArchived)}>
            <Text style={[styles.archiveToggleText, { color: theme.colors.textMuted }]}>
              {showArchived ? 'Sembunyikan Arsip' : 'Tampilkan Arsip'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories List */}
        <View style={styles.catGrid}>
          {displayedCategories.map((cat) => (
            <NeoCard key={cat.id} style={styles.catCard}>
              <View style={styles.catContent}>
                <NeoBadge
                  icon={cat.icon}
                  iconFamily={cat.icon_family}
                  color={cat.color}
                  size="md"
                />

                <View style={styles.catInfo}>
                  <Text style={[styles.catName, { color: theme.colors.text }]} numberOfLines={1}>
                    {cat.name}
                  </Text>
                  {cat.is_archived === 1 && (
                    <Text style={[styles.archivedLabel, { color: theme.colors.textMuted }]}>
                      (Diarsipkan)
                    </Text>
                  )}
                </View>

                {/* Edit & Delete Action Buttons */}
                <View style={styles.catActions}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CategoryFormModal', { editCategory: cat })}
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Ionicons name="pencil" size={14} color="#121212" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(cat)}
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        marginLeft: 6,
                      },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={14} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </NeoCard>
          ))}
        </View>

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
  searchRow: {
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    padding: 0,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  metaCount: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  archiveToggleText: {
    fontSize: 11,
    fontWeight: '800',
  },
  catGrid: {
    gap: 4,
  },
  catCard: {
    marginVertical: 3,
    padding: 10,
  },
  catContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catInfo: {
    flex: 1,
    marginLeft: 12,
  },
  catName: {
    fontSize: 14,
    fontWeight: '800',
  },
  archivedLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  catActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
