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
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoIconPicker } from '../../components/common/NeoIconPicker';
import { IconFamily } from '../../types';
import { createCategory, updateCategory } from '../../database/categoryRepo';

export const CategoryFormModal: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { refreshData } = useAppData();

  const editCategory = route.params?.editCategory;
  const isEditing = !!editCategory;

  const [name, setName] = useState<string>(isEditing ? editCategory.name : '');
  const [icon, setIcon] = useState<string>(isEditing ? editCategory.icon : 'restaurant');
  const [iconFamily, setIconFamily] = useState<IconFamily>(
    isEditing ? editCategory.icon_family : 'Ionicons'
  );
  const [color, setColor] = useState<string>(
    isEditing ? editCategory.color : '#FFE600'
  );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Nama Kategori Kosong', 'Harap masukkan nama kategori.');
      return;
    }

    try {
      if (isEditing) {
        await updateCategory(editCategory.id, {
          name: name.trim(),
          type: 'all',
          icon,
          icon_family: iconFamily,
          color,
        });
      } else {
        await createCategory({
          id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: name.trim(),
          type: 'all',
          icon,
          icon_family: iconFamily,
          color,
          is_archived: 0,
        });
      }

      await refreshData();
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.closeBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="close" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {isEditing ? 'EDIT KATEGORI' : 'TAMBAH KATEGORI'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category Name */}
        <NeoCard style={styles.card}>
          <NeoInput
            label="NAMA KATEGORI"
            placeholder="Misal: Makan, Cemilan, Transport, Belanja, Gaji..."
            value={name}
            onChangeText={setName}
          />
        </NeoCard>

        {/* 100+ Icon Picker with Palette */}
        <NeoCard style={styles.card}>
          <NeoIconPicker
            selectedIcon={icon}
            selectedIconFamily={iconFamily}
            selectedColor={color}
            onSelect={(newIcon, newFamily, newColor) => {
              setIcon(newIcon);
              setIconFamily(newFamily);
              setColor(newColor);
            }}
          />
        </NeoCard>

        {/* Submit */}
        <NeoButton
          title={isEditing ? 'SIMPAN PERUBAHAN' : 'SIMPAN KATEGORI'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={{ marginTop: 14 }}
        />
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
  closeBtn: {
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
    paddingBottom: 50,
  },
  card: {
    padding: 14,
    marginVertical: 6,
  },
});
