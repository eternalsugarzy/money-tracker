import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface NeoInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderWidth: theme.neo.borderWidth,
            borderRadius: theme.neo.borderRadiusSm,
            shadowColor: theme.neo.shadowSm.shadowColor,
            shadowOffset: theme.neo.shadowSm.shadowOffset,
            shadowOpacity: theme.neo.shadowSm.shadowOpacity,
            shadowRadius: 0,
            elevation: 2,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.input,
            { color: theme.colors.text },
            leftIcon ? { paddingLeft: 0 } : null,
            rightIcon ? { paddingRight: 0 } : null,
            style,
          ]}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 10,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});
