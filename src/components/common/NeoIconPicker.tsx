import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import {
  ICON_GALLERY_THEMES,
  POP_COLOR_PALETTE,
  IconItem,
} from '../../utils/iconGallery';
import { IconFamily } from '../../types';

interface NeoIconPickerProps {
  selectedIcon: string;
  selectedIconFamily: IconFamily;
  selectedColor: string;
  onSelect: (icon: string, family: IconFamily, color: string) => void;
}

export const NeoIconPicker: React.FC<NeoIconPickerProps> = ({
  selectedIcon,
  selectedIconFamily,
  selectedColor,
  onSelect,
}) => {
  const { theme } = useTheme();
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    for (const th of ICON_GALLERY_THEMES) {
      if (th.icons.some(ic => ic.name === selectedIcon && ic.family === selectedIconFamily)) {
        return th.themeId;
      }
    }
    return ICON_GALLERY_THEMES[0].themeId;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeColor, setActiveColor] = useState<string>(selectedColor || POP_COLOR_PALETTE[0]);

  const activeThemeObj = ICON_GALLERY_THEMES.find((t) => t.themeId === selectedThemeId);

  const displayedIcons = searchQuery.trim()
    ? ICON_GALLERY_THEMES.flatMap((t) => t.icons).filter((ic) =>
        ic.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ic.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeThemeObj?.icons || [];

  const handleIconPress = (icon: IconItem) => {
    onSelect(icon.name, icon.family, activeColor);
  };

  const handleColorPress = (color: string) => {
    setActiveColor(color);
    onSelect(selectedIcon, selectedIconFamily, color);
  };

  const renderIconGlyph = (name: string, family: IconFamily, size: number = 24, color: string = '#121212') => {
    if (family === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    }
    return <Ionicons name={name as any} size={size} color={color} />;
  };

  return (
    <View style={styles.container}>
      {/* Current Icon Preview */}
      <View style={styles.currentIconRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0, marginRight: 12 }]}>
          PREVIEW ICON:
        </Text>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: activeColor,
              borderColor: theme.colors.border,
              borderWidth: 2,
              width: 48,
              height: 48,
              marginBottom: 0,
              shadowColor: theme.neo.shadowSm.shadowColor,
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 2,
            },
          ]}
        >
          {renderIconGlyph(selectedIcon, selectedIconFamily, 26, '#121212')}
        </View>
      </View>

      {/* Color Palette Selector */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        PILIH WARNA KATEGORI
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.colorPaletteRow}
      >
        {POP_COLOR_PALETTE.map((color) => {
          const isSelected = activeColor === color;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => handleColorPress(color)}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: color,
                  borderColor: theme.colors.border,
                  borderWidth: isSelected ? 3 : 2,
                  transform: [{ scale: isSelected ? 1.15 : 1 }],
                },
              ]}
            >
              {isSelected && <Ionicons name="checkmark" size={16} color="#121212" />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Search Icons */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: theme.colors.border,
            borderWidth: 2,
          },
        ]}
      >
        <Ionicons name="search" size={18} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Cari nama icon..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.colors.text }]}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Theme Tabs (if not searching) */}
      {!searchQuery && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.themeTabsRow}
        >
          {ICON_GALLERY_THEMES.map((th) => {
            const isTabActive = th.themeId === selectedThemeId;
            return (
              <TouchableOpacity
                key={th.themeId}
                onPress={() => setSelectedThemeId(th.themeId)}
                style={[
                  styles.themeTab,
                  {
                    backgroundColor: isTabActive ? theme.colors.primary : theme.colors.cardSecondary,
                    borderColor: theme.colors.border,
                    borderWidth: 2,
                  },
                ]}
              >
                <Ionicons
                  name={th.themeIcon as any}
                  size={14}
                  color={isTabActive ? '#121212' : theme.colors.text}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.themeTabText,
                    {
                      color: isTabActive ? '#121212' : theme.colors.text,
                      fontWeight: isTabActive ? '900' : '700',
                    },
                  ]}
                >
                  {th.themeName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Icons Grid */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 12 }]}>
        PILIH ICON ({displayedIcons.length} pilihan)
      </Text>
      <View style={styles.gridContainer}>
        {displayedIcons.map((ic, idx) => {
          const isSelected = selectedIcon === ic.name && selectedIconFamily === ic.family;
          return (
            <TouchableOpacity
              key={`${ic.family}_${ic.name}_${idx}`}
              onPress={() => handleIconPress(ic)}
              activeOpacity={0.7}
              style={[
                styles.iconBox,
                {
                  backgroundColor: isSelected ? activeColor : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: isSelected ? 2.5 : 1.5,
                  shadowColor: isSelected ? theme.neo.shadowSm.shadowColor : 'transparent',
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  elevation: isSelected ? 3 : 0,
                },
              ]}
            >
              {renderIconGlyph(
                ic.name,
                ic.family,
                26,
                isSelected ? '#121212' : theme.colors.text
              )}
              <Text
                style={[
                  styles.iconLabel,
                  { color: theme.colors.text, fontWeight: isSelected ? '900' : '600' },
                ]}
                numberOfLines={1}
              >
                {ic.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  currentIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  colorPaletteRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 2,
    marginBottom: 12,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  themeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  themeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  themeTabText: {
    fontSize: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 6,
  },
  iconBox: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
