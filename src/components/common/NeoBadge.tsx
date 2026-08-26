import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { IconFamily } from '../../types';

interface NeoBadgeProps {
  icon?: string;
  iconFamily?: IconFamily;
  label?: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'pill';
  style?: StyleProp<ViewStyle>;
  noShadow?: boolean;
}

export const NeoBadge: React.FC<NeoBadgeProps> = ({
  icon,
  iconFamily = 'Ionicons',
  label,
  color,
  textColor,
  size = 'md',
  shape = 'square',
  style,
  noShadow = false,
}) => {
  const { theme } = useTheme();
  const badgeColor = color || theme.colors.primary;

  const getDimensionStyles = () => {
    switch (size) {
      case 'sm':
        return {
          boxSize: 28,
          iconSize: 14,
          fontSize: 11,
          paddingH: 6,
          paddingV: 3,
        };
      case 'lg':
        return {
          boxSize: 48,
          iconSize: 26,
          fontSize: 15,
          paddingH: 14,
          paddingV: 8,
        };
      case 'md':
      default:
        return {
          boxSize: 38,
          iconSize: 20,
          fontSize: 13,
          paddingH: 10,
          paddingV: 6,
        };
    }
  };

  const dim = getDimensionStyles();
  const isOnlyIcon = !label && icon;

  const renderIcon = () => {
    if (!icon) return null;
    const iconColor = textColor || '#121212';
    if (iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={icon as any} size={dim.iconSize} color={iconColor} />;
    }
    return <Ionicons name={icon as any} size={dim.iconSize} color={iconColor} />;
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeColor,
          borderColor: theme.colors.border,
          borderWidth: 2,
          borderRadius: shape === 'pill' ? 999 : theme.neo.borderRadiusSm,
        },
        isOnlyIcon
          ? { width: dim.boxSize, height: dim.boxSize, justifyContent: 'center', alignItems: 'center' }
          : { paddingHorizontal: dim.paddingH, paddingVertical: dim.paddingV },
        !noShadow && {
          shadowColor: theme.neo.shadowSm.shadowColor,
          shadowOffset: theme.neo.shadowSm.shadowOffset,
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 2,
        },
        style,
      ]}
    >
      {renderIcon()}
      {label ? (
        <Text
          style={[
            styles.label,
            {
              color: textColor || '#121212',
              fontSize: dim.fontSize,
              marginLeft: icon ? 6 : 0,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
