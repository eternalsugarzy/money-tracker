import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { NeoButton } from './NeoButton';

interface NeoReceiptPickerProps {
  receiptImages: string[]; // array of file URIs
  onChangeImages: (images: string[]) => void;
}

export const NeoReceiptPicker: React.FC<NeoReceiptPickerProps> = ({
  receiptImages,
  onChangeImages,
}) => {
  const { theme } = useTheme();
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin Ditolak', 'Aplikasi butuh izin galeri untuk memilih foto struk.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map((a) => a.uri);
        onChangeImages([...receiptImages, ...newUris]);
      }
    } catch (err) {
      console.warn('Error picking image:', err);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin Ditolak', 'Aplikasi butuh izin kamera untuk memotret struk.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUri = result.assets[0].uri;
        onChangeImages([...receiptImages, newUri]);
      }
    } catch (err) {
      console.warn('Error taking photo:', err);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = receiptImages.filter((_, idx) => idx !== indexToRemove);
    onChangeImages(updated);
    if (selectedPreviewImage) {
      setSelectedPreviewImage(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>
        FOTO STRUK TRANSAKSI (OPSIONAL)
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageScrollRow}
      >
        {/* Add from Gallery Button */}
        <TouchableOpacity
          onPress={handlePickFromGallery}
          style={[
            styles.addBtn,
            {
              backgroundColor: theme.colors.cardSecondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="images-outline" size={24} color={theme.colors.text} />
          <Text style={[styles.addBtnText, { color: theme.colors.text }]}>Galeri</Text>
        </TouchableOpacity>

        {/* Add from Camera Button */}
        <TouchableOpacity
          onPress={handleTakePhoto}
          style={[
            styles.addBtn,
            {
              backgroundColor: theme.colors.cardSecondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="camera-outline" size={24} color={theme.colors.text} />
          <Text style={[styles.addBtnText, { color: theme.colors.text }]}>Kamera</Text>
        </TouchableOpacity>

        {/* Attached Thumbnails */}
        {receiptImages.map((uri, idx) => (
          <View key={`${uri}_${idx}`} style={styles.thumbnailWrapper}>
            <TouchableOpacity
              onPress={() => setSelectedPreviewImage(uri)}
              activeOpacity={0.8}
              style={[
                styles.thumbnailBox,
                { borderColor: theme.colors.border },
              ]}
            >
              <Image source={{ uri }} style={styles.thumbnailImage} resizeMode="cover" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleRemoveImage(idx)}
              style={[
                styles.removeBadge,
                {
                  backgroundColor: theme.colors.danger,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Full-Screen Preview Modal */}
      <Modal
        visible={!!selectedPreviewImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPreviewImage(null)}
      >
        <View style={styles.previewBackdrop}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              onPress={() => setSelectedPreviewImage(null)}
              style={styles.previewCloseBtn}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {selectedPreviewImage && (
            <Image
              source={{ uri: selectedPreviewImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.previewFooter}>
            <NeoButton
              title="TUTUP"
              variant="outline"
              onPress={() => setSelectedPreviewImage(null)}
              style={{ width: 140 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  imageScrollRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  addBtn: {
    width: 78,
    height: 78,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnailBox: {
    width: 78,
    height: 78,
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  previewHeader: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  previewCloseBtn: {
    padding: 10,
  },
  fullImage: {
    flex: 1,
    width: '100%',
  },
  previewFooter: {
    alignItems: 'center',
  },
});
