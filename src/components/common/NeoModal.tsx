import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface NeoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerColor?: string;
  children: React.ReactNode;
  scrollable?: boolean;
}

export const NeoModal: React.FC<NeoModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  headerColor,
  children,
  scrollable = true,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: theme.neo.borderWidthThick,
              shadowColor: theme.neo.shadow.shadowColor,
              shadowOffset: theme.neo.shadow.shadowOffset,
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 10,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: headerColor || theme.colors.primary,
                borderBottomColor: theme.colors.border,
                borderBottomWidth: theme.neo.borderWidth,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.colors.primaryText }]}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: theme.colors.primaryText }]}>
                  {subtitle}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <Ionicons name="close" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {scrollable ? (
            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            <View style={styles.body}>{children}</View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  modalContainer: {
    maxHeight: '92%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    opacity: 0.85,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
