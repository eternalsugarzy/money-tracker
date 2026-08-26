import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface NeoCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderColor?: string;
  shadowOffset?: { width: number; height: number };
  noShadow?: boolean;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  style,
  backgroundColor,
  borderColor,
  shadowOffset,
  noShadow = false,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: backgroundColor || theme.colors.card,
          borderColor: borderColor || theme.colors.border,
          borderWidth: theme.neo.borderWidth,
          borderRadius: theme.neo.borderRadius,
        },
        !noShadow && {
          shadowColor: theme.neo.shadow.shadowColor,
          shadowOffset: shadowOffset || theme.neo.shadow.shadowOffset,
          shadowOpacity: theme.neo.shadow.shadowOpacity,
          shadowRadius: theme.neo.shadow.shadowRadius,
          elevation: theme.neo.shadow.elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 6,
  },
});
