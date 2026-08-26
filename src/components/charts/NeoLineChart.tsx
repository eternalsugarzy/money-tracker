import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Path, Circle, Line, Rect } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';

export interface TrendDataPoint {
  label: string; // e.g. "Agu 20", "Agu 21", "Agu 22" or "Mei", "Jun", "Jul"
  value: number;
}

interface NeoLineChartProps {
  data: TrendDataPoint[];
  width?: number;
  height?: number;
  lineColor?: string;
}

export const NeoLineChart: React.FC<NeoLineChartProps> = ({
  data,
  width = Dimensions.get('window').width - 72,
  height = 160,
  lineColor,
}) => {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
          Belum ada data trend.
        </Text>
      </View>
    );
  }

  const paddingLeft = 30;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal === minVal ? 1 : maxVal - minVal;

  // Calculate points
  const points = data.map((d, idx) => {
    const x = paddingLeft + (idx / Math.max(1, data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, value: d.value, label: d.label };
  });

  // Construct SVG path
  let pathD = '';
  points.forEach((p, idx) => {
    if (idx === 0) {
      pathD += `M ${p.x} ${p.y}`;
    } else {
      pathD += ` L ${p.x} ${p.y}`;
    }
  });

  const stroke = lineColor || theme.colors.primary;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Background Grid Lines */}
        <Line
          x1={paddingLeft}
          y1={paddingTop}
          x2={width - paddingRight}
          y2={paddingTop}
          stroke={theme.colors.cardSecondary}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <Line
          x1={paddingLeft}
          y1={paddingTop + chartHeight / 2}
          x2={width - paddingRight}
          y2={paddingTop + chartHeight / 2}
          stroke={theme.colors.cardSecondary}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <Line
          x1={paddingLeft}
          y1={paddingTop + chartHeight}
          x2={width - paddingRight}
          y2={paddingTop + chartHeight}
          stroke={theme.colors.border}
          strokeWidth={2}
        />

        {/* Trend Line Path */}
        <Path
          d={pathD}
          fill="none"
          stroke={stroke}
          strokeWidth={3.5}
        />

        {/* Data Point Circles */}
        {points.map((p, idx) => (
          <Circle
            key={`dot_${idx}`}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={stroke}
            stroke={theme.colors.border}
            strokeWidth={2}
          />
        ))}
      </Svg>

      {/* X-Axis Labels */}
      <View style={[styles.labelsRow, { paddingLeft, paddingRight }]}>
        {data.map((d, idx) => (
          <Text
            key={`lbl_${idx}`}
            style={[styles.axisLabel, { color: theme.colors.textMuted }]}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 6,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -8,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
});
