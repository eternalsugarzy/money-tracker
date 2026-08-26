import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { evaluateMathExpression } from '../../utils/mathEvaluator';
import { formatCurrency } from '../../utils/formatters';

export interface NeoCalculatorProps {
  value?: string;
  onChange?: (val: string) => void;
  initialValue?: number | string;
  onConfirm?: (finalValue: number) => void;
  onCancel?: () => void;
  onDone?: () => void;
}

export const NeoCalculator: React.FC<NeoCalculatorProps> = ({
  value,
  onChange,
  initialValue = 0,
  onConfirm,
  onCancel,
  onDone,
}) => {
  const { theme } = useTheme();
  const [internalExpression, setInternalExpression] = useState<string>(
    value !== undefined ? value : initialValue ? String(initialValue) : ''
  );
  const [liveResult, setLiveResult] = useState<number>(0);

  const currentExpr = value !== undefined ? value : internalExpression;

  const updateExpr = (newExpr: string) => {
    if (onChange) {
      onChange(newExpr);
    } else {
      setInternalExpression(newExpr);
    }
  };

  useEffect(() => {
    if (!currentExpr || currentExpr.trim() === '') {
      setLiveResult(0);
      return;
    }
    const evalRes = evaluateMathExpression(currentExpr);
    if (evalRes.isValid) {
      setLiveResult(evalRes.value);
    }
  }, [currentExpr]);

  const handleKeyPress = (key: string) => {
    if (key === 'C') {
      updateExpr('');
      setLiveResult(0);
    } else if (key === 'DEL') {
      updateExpr(currentExpr.slice(0, -1));
    } else if (key === '=') {
      const evalRes = evaluateMathExpression(currentExpr);
      if (evalRes.isValid) {
        updateExpr(String(evalRes.value));
        setLiveResult(evalRes.value);
      }
    } else if (key === 'OK') {
      const evalRes = evaluateMathExpression(currentExpr);
      const val = evalRes.isValid ? evalRes.value : liveResult;
      if (onConfirm) onConfirm(val);
      if (onDone) onDone();
    } else {
      updateExpr(currentExpr + key);
    }
  };

  const handleQuickAdd = (amount: number) => {
    const evalRes = evaluateMathExpression(currentExpr);
    const currentVal = evalRes.isValid ? evalRes.value : 0;
    const newVal = currentVal + amount;
    updateExpr(String(newVal));
    setLiveResult(newVal);
  };

  const renderKey = (
    label: string,
    keyVal: string,
    options?: {
      flex?: number;
      bg?: string;
      textColor?: string;
      isIcon?: boolean;
      iconName?: string;
      isBold?: boolean;
    }
  ) => {
    const bg = options?.bg || theme.colors.surface;
    const textColor = options?.textColor || theme.colors.text;

    return (
      <TouchableOpacity
        key={keyVal}
        onPress={() => handleKeyPress(keyVal)}
        activeOpacity={0.7}
        style={[
          styles.keyBtn,
          {
            flex: options?.flex || 1,
            backgroundColor: bg,
            borderColor: theme.colors.border,
            borderWidth: 2,
            shadowColor: theme.neo.shadowSm.shadowColor,
            shadowOffset: theme.neo.shadowSm.shadowOffset,
            shadowOpacity: theme.neo.shadowSm.shadowOpacity,
            shadowRadius: theme.neo.shadowSm.shadowRadius,
          },
        ]}
      >
        {options?.isIcon && options?.iconName ? (
          <Ionicons name={options.iconName as any} size={20} color={textColor} />
        ) : (
          <Text
            style={[
              styles.keyText,
              {
                color: textColor,
                fontWeight: options?.isBold ? '900' : '700',
              },
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Quick Add Preset Bar */}
      <View style={styles.quickAddRow}>
        <TouchableOpacity
          style={[styles.quickAddBtn, { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border }]}
          onPress={() => handleQuickAdd(10000)}
        >
          <Text style={[styles.quickAddText, { color: theme.colors.text }]}>+10rb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAddBtn, { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border }]}
          onPress={() => handleQuickAdd(50000)}
        >
          <Text style={[styles.quickAddText, { color: theme.colors.text }]}>+50rb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAddBtn, { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border }]}
          onPress={() => handleQuickAdd(100000)}
        >
          <Text style={[styles.quickAddText, { color: theme.colors.text }]}>+100rb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAddBtn, { backgroundColor: theme.colors.cardSecondary, borderColor: theme.colors.border }]}
          onPress={() => handleQuickAdd(500000)}
        >
          <Text style={[styles.quickAddText, { color: theme.colors.text }]}>+500rb</Text>
        </TouchableOpacity>
      </View>

      {/* Calculator Keypad Grid */}
      <View style={styles.keypadGrid}>
        {/* Row 1 */}
        <View style={styles.row}>
          {renderKey('C', 'C', { bg: theme.colors.cardSecondary, isBold: true })}
          {renderKey('÷', '/', { bg: theme.colors.cardSecondary, isBold: true })}
          {renderKey('×', '*', { bg: theme.colors.cardSecondary, isBold: true })}
          {renderKey('DEL', 'DEL', {
            bg: theme.colors.cardSecondary,
            isIcon: true,
            iconName: 'backspace-outline',
          })}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderKey('7', '7')}
          {renderKey('8', '8')}
          {renderKey('9', '9')}
          {renderKey('-', '-', { bg: theme.colors.cardSecondary, isBold: true })}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderKey('4', '4')}
          {renderKey('5', '5')}
          {renderKey('6', '6')}
          {renderKey('+', '+', { bg: theme.colors.cardSecondary, isBold: true })}
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          {renderKey('1', '1')}
          {renderKey('2', '2')}
          {renderKey('3', '3')}
          {renderKey('=', '=', { bg: theme.colors.transfer, isBold: true, textColor: '#00363B' })}
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          {renderKey('0', '0')}
          {renderKey('000', '000')}
          {renderKey('.', '.')}
          {renderKey('OK', 'OK', {
            bg: theme.colors.primary,
            isBold: true,
            textColor: '#121212',
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  quickAddRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  quickAddBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddText: {
    fontSize: 11,
    fontWeight: '800',
  },
  keypadGrid: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  keyBtn: {
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 17,
  },
});
