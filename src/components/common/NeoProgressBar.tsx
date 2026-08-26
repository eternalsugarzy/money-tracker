import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface NeoProgressBarProps {
  percentage: number; // e.g. 75, 95, 120
  height?: number;
  showLabel?: boolean;
}

export const NeoProgressBar: React.FC<NeoProgressBarProps> = ({
  percentage,
  height = 14,
  showLabel = false,
}) => {
  const { theme } = useTheme();
  const clamped = Math.max(0, Math.min(percentage, 100));

  const getBarColor = () => {
    if (percentage > 100) return theme.colors.expense; // Red / Hot Pink (>100%)
    if (percentage >= 80) return theme.colors.warning; // Yellow (80-100%)
    return theme.colors.income; // Green (<80%)
  };

  const barColor = getBarColor();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.colors.cardSecondary,
            borderColor: theme.colors.border,
            borderWidth: 2,
            borderRadius: theme.neo.borderRadiusSm,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={[styles.labelText, { color: barColor }]}>
            {percentage}% {percentage > 100 ? '(Over Budget!)' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
