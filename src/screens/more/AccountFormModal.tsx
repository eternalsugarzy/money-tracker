import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';
import { NeoIconPicker } from '../../components/common/NeoIconPicker';
import { NeoCalculator } from '../../components/common/NeoCalculator';
import { formatCurrency } from '../../utils/formatters';
import { evaluateMathExpression } from '../../utils/mathEvaluator';
import { AccountType, IconFamily } from '../../types';
import { createAccount, updateAccount } from '../../database/accountRepo';

export const AccountFormModal: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { refreshData } = useAppData();

  const editAccount = route.params?.editAccount;
  const isEditing = !!editAccount;

  const ACCOUNT_TYPES: AccountType[] = ['Cash', 'Bank', 'E-Wallet', 'Credit Card', 'Investment', 'Other'];

  const [name, setName] = useState<string>(isEditing ? editAccount.name : '');
  const [type, setType] = useState<AccountType>(isEditing ? editAccount.type : 'Bank');
  const [initialBalanceExpr, setInitialBalanceExpr] = useState<string>(
    isEditing ? String(editAccount.initial_balance) : '0'
  );
  // Default to true: directly show built-in calculator, no phone keyboard
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [icon, setIcon] = useState<string>(isEditing ? editAccount.icon : 'wallet');
  const [iconFamily, setIconFamily] = useState<IconFamily>(
    isEditing ? editAccount.icon_family : 'Ionicons'
  );
  const [color, setColor] = useState<string>(isEditing ? editAccount.color : theme.colors.primary);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Nama Akun Kosong', 'Harap masukkan nama akun/dompet (misal: Rekening BCA).');
      return;
    }

    const evalRes = evaluateMathExpression(initialBalanceExpr);
    const balanceNum = evalRes.isValid ? evalRes.value : 0;

    try {
      if (isEditing) {
        await updateAccount(editAccount.id, {
          name: name.trim(),
          type,
          initial_balance: balanceNum,
          icon,
          icon_family: iconFamily,
          color,
        });
      } else {
        await createAccount({
          id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: name.trim(),
          type,
          initial_balance: balanceNum,
          icon,
          icon_family: iconFamily,
          color,
          is_archived: 0,
        });
      }

      await refreshData();
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const getComputedDisplayAmount = () => {
    const res = evaluateMathExpression(initialBalanceExpr);
    return res.isValid ? formatCurrency(res.value) : 'Rp 0';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.closeBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="close" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {isEditing ? 'EDIT DOMPET / AKUN' : 'TAMBAH DOMPET / AKUN'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Account Name */}
        <NeoCard style={styles.card}>
          <NeoInput
            label="NAMA DOMPET / AKUN"
            placeholder="Misal: Dompet Utama, Rekening BCA, GoPay..."
            value={name}
            onChangeText={setName}
          />
        </NeoCard>

        {/* Initial Balance with Direct Calculator */}
        <NeoCard style={styles.card}>
          <View style={styles.limitHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              SALDO AWAL
            </Text>
            <TouchableOpacity
              onPress={() => setShowCalculator(!showCalculator)}
              style={[
                styles.calcBtn,
                {
                  backgroundColor: showCalculator ? theme.colors.primary : theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons name="calculator" size={14} color={theme.colors.text} />
              <Text style={[styles.calcBtnText, { color: theme.colors.text }]}>
                {showCalculator ? 'Sembunyikan Keypad' : 'Buka Keypad'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Touchable Display Box */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setShowCalculator(true)}
            style={[
              styles.displayBox,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.displayAmount, { color: theme.colors.text }]}>
              {initialBalanceExpr ? getComputedDisplayAmount() : 'Rp 0'}
            </Text>
            {initialBalanceExpr.length > 0 && (
              <Text style={[styles.displayExpression, { color: theme.colors.textMuted }]}>
                = {initialBalanceExpr}
              </Text>
            )}
          </TouchableOpacity>

          {/* Built-in Keypad */}
          {showCalculator && (
            <View style={styles.calcWrapper}>
              <NeoCalculator
                value={initialBalanceExpr}
                onChange={setInitialBalanceExpr}
                onDone={() => setShowCalculator(false)}
              />
            </View>
          )}
        </NeoCard>

        {/* Account Type Selector */}
        <NeoCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>TIPE AKUN</Text>
          <View style={styles.typeGrid}>
            {ACCOUNT_TYPES.map((t) => {
              const isSelected = type === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                      borderWidth: isSelected ? 2.5 : 1.5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      { color: '#121212', fontWeight: isSelected ? '900' : '600' },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </NeoCard>

        {/* Icon & Color Picker */}
        <NeoCard style={styles.card}>
          <NeoIconPicker
            selectedIcon={icon}
            selectedIconFamily={iconFamily}
            selectedColor={color}
            onSelect={(newIcon, newFamily, newColor) => {
              setIcon(newIcon);
              setIconFamily(newFamily);
              setColor(newColor);
            }}
          />
        </NeoCard>

        {/* Save Button */}
        <NeoButton
          title={isEditing ? 'SIMPAN PERUBAHAN' : 'SIMPAN AKUN BARU'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          style={{ marginTop: 10 }}
        />

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 14,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    gap: 4,
  },
  calcBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  displayBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  displayAmount: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  displayExpression: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  calcWrapper: {
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  typeChipText: {
    fontSize: 12,
  },
});
