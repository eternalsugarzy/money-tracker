import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export type ButtonVariant = 'primary' | 'income' | 'expense' | 'transfer' | 'debt' | 'dark' | 'outline';

interface NeoButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: theme.colors.primary, text: theme.colors.primaryText };
      case 'income':
        return { bg: theme.colors.income, text: theme.colors.incomeText };
      case 'expense':
        return { bg: theme.colors.expense, text: '#FFFFFF' };
      case 'transfer':
        return { bg: theme.colors.transfer, text: theme.colors.transferText };
      case 'debt':
        return { bg: theme.colors.debt, text: '#FFFFFF' };
      case 'dark':
        return { bg: theme.colors.border, text: '#FFFFFF' };
      case 'outline':
      default:
        return { bg: theme.colors.surface, text: theme.colors.text };
    }
  };

  const { bg, text } = getVariantStyles();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12, fontSize: 13, minHeight: 36 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18, minHeight: 56 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 18, fontSize: 15, minHeight: 48 };
    }
  };

  const sizeStyle = getSizeStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? '#CCCCCC' : bg,
          borderColor: theme.colors.border,
          borderWidth: theme.neo.borderWidth,
          borderRadius: theme.neo.borderRadiusSm,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          minHeight: sizeStyle.minHeight,
          width: fullWidth ? '100%' : undefined,
          transform: [
            { translateX: pressed || isPressed ? 3 : 0 },
            { translateY: pressed || isPressed ? 3 : 0 },
          ],
        },
        pressed || isPressed
          ? {
              shadowColor: theme.neo.shadowPressed.shadowColor,
              shadowOffset: theme.neo.shadowPressed.shadowOffset,
              shadowOpacity: theme.neo.shadowPressed.shadowOpacity,
              shadowRadius: 0,
              elevation: 1,
            }
          : {
              shadowColor: theme.neo.shadow.shadowColor,
              shadowOffset: theme.neo.shadow.shadowOffset,
              shadowOpacity: theme.neo.shadow.shadowOpacity,
              shadowRadius: 0,
              elevation: 4,
            },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={text} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title ? (
            <Text
              style={[
                styles.text,
                { color: disabled ? '#888888' : text, fontSize: sizeStyle.fontSize },
                textStyle,
              ]}
            >
              {title}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
