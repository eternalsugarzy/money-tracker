import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, G, Path, Circle } from 'react-native-svg';
import { CategorySpendingSummary } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { NeoBadge } from '../common/NeoBadge';

interface NeoPieChartProps {
  data: CategorySpendingSummary[];
  size?: number;
}

export const NeoPieChart: React.FC<NeoPieChartProps> = ({
  data,
  size = Dimensions.get('window').width - 72,
}) => {
  const { theme } = useTheme();

  const totalSpent = data.reduce((sum, item) => sum + item.totalSpent, 0);

  if (!data || data.length === 0 || totalSpent === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
          Belum ada data pengeluaran pada periode ini.
        </Text>
      </View>
    );
  }

  const radius = size / 2 - 10;
  const center = size / 2;
  const innerRadius = radius * 0.58; // Donut hole

  // Helper to convert polar to cartesian coordinates
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  // Helper to create SVG donut arc path
  const createDonutSlice = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    // Avoid full 360 circle glitch
    const adjustedEnd = endAngle - startAngle >= 360 ? startAngle + 359.99 : endAngle;

    const startOuter = polarToCartesian(center, center, outerR, adjustedEnd);
    const endOuter = polarToCartesian(center, center, outerR, startAngle);
    const startInner = polarToCartesian(center, center, innerR, startAngle);
    const endInner = polarToCartesian(center, center, innerR, adjustedEnd);

    const largeArcFlag = adjustedEnd - startAngle <= 180 ? '0' : '1';

    return [
      'M', startOuter.x, startOuter.y,
      'A', outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', startInner.x, startInner.y,
      'A', innerR, innerR, 0, largeArcFlag, 1, endInner.x, endInner.y,
      'Z',
    ].join(' ');
  };

  let currentAngle = 0;
  const slices = data.map((item) => {
    const angle = (item.totalSpent / totalSpent) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    return {
      ...item,
      path: createDonutSlice(startAngle, endAngle, radius, innerRadius),
      color: item.categoryColor,
    };
  });

  return (
    <View style={styles.container}>
      {/* Donut Chart SVG */}
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((slice, idx) => (
              <Path
                key={`slice_${slice.categoryId}_${idx}`}
                d={slice.path}
                fill={slice.color}
                stroke={theme.colors.border}
                strokeWidth={2.5}
              />
            ))}
          </G>
        </Svg>

        {/* Center Label in Donut */}
        <View style={[styles.centerOverlay, { width: innerRadius * 2 - 10, height: innerRadius * 2 - 10 }]}>
          <Text style={[styles.centerLabel, { color: theme.colors.textMuted }]}>
            TOTAL
          </Text>
          <Text style={[styles.centerTotal, { color: theme.colors.text }]} numberOfLines={1}>
            {formatCurrency(totalSpent)}
          </Text>
        </View>
      </View>

      {/* Legend / Breakdown List */}
      <View style={styles.legendContainer}>
        {data.map((item) => (
          <View
            key={item.categoryId}
            style={[
              styles.legendRow,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <View style={styles.legendLeft}>
              <NeoBadge
                icon={item.categoryIcon}
                iconFamily={item.categoryIconFamily}
                color={item.categoryColor}
                size="sm"
              />
              <View style={styles.legendInfo}>
                <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                  {item.categoryName}
                </Text>
                <Text style={[styles.txCount, { color: theme.colors.textMuted }]}>
                  {item.transactionCount} transaksi
                </Text>
              </View>
            </View>

            <View style={styles.legendRight}>
              <Text style={[styles.amountText, { color: theme.colors.text }]}>
                {formatCurrency(item.totalSpent)}
              </Text>
              <View
                style={[
                  styles.pctBadge,
                  {
                    backgroundColor: item.categoryColor,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.pctText}>{formatPercentage(item.percentage)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  centerTotal: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2,
  },
  legendContainer: {
    width: '100%',
    marginTop: 12,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendInfo: {
    marginLeft: 10,
    flex: 1,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '800',
  },
  txCount: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
  },
  pctBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderRadius: 6,
    marginTop: 2,
  },
  pctText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#121212',
  },
});
