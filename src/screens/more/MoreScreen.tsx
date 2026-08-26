import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { formatCurrency } from '../../utils/formatters';

export const MoreScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { accounts, categories, recurring, debts, totalNetWorth } = useAppData();

  const activeAccountsCount = accounts.filter((a) => a.is_archived === 0).length;
  const activeCategoriesCount = categories.filter((c) => c.is_archived === 0).length;
  const unpaidDebtsCount = debts.filter((d) => d.status === 'unpaid').length;
  const activeRecurringCount = recurring.filter((r) => r.is_active === 1).length;

  const MENU_ITEMS = [
    {
      id: 'accounts',
      title: 'Akun & Dompet',
      subtitle: `${activeAccountsCount} akun aktif • Total ${formatCurrency(totalNetWorth)}`,
      icon: 'wallet',
      iconColor: theme.colors.primary,
      screen: 'Accounts',
    },
    {
      id: 'categories',
      title: 'Kategori Keuangan',
      subtitle: `${activeCategoriesCount} kategori aktif (Income & Expense)`,
      icon: 'grid',
      iconColor: theme.colors.income,
      screen: 'Categories',
    },
    {
      id: 'debts',
      title: 'Hutang - Piutang',
      subtitle: `${unpaidDebtsCount} catatan belum lunas`,
      icon: 'people',
      iconColor: theme.colors.debt,
      screen: 'Debts',
    },
    {
      id: 'recurring',
      title: 'Transaksi Berulang (Recurring)',
      subtitle: `${activeRecurringCount} template aktif`,
      icon: 'repeat',
      iconColor: theme.colors.transfer,
      screen: 'Recurring',
    },
    {
      id: 'export',
      title: 'Laporan & Ekspor Data',
      subtitle: 'Ekspor riwayat ke CSV, JSON, & Backup Data',
      icon: 'download',
      iconColor: theme.colors.accent,
      screen: 'ExportReport',
    },
    {
      id: 'settings',
      title: 'Pengaturan & Dark Mode',
      subtitle: 'Notifikasi harian, tema tampilan, data sampel',
      icon: 'settings',
      iconColor: theme.colors.cardSecondary,
      screen: 'Settings',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>MENU LAINNYA</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.screen)}
          >
            <NeoCard style={styles.menuCard}>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: item.iconColor,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons name={item.icon as any} size={24} color="#121212" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuSubtitle, { color: theme.colors.textMuted }]}>
                    {item.subtitle}
                  </Text>
                </View>

                <View
                  style={[
                    styles.arrowBadge,
                    {
                      backgroundColor: theme.colors.cardSecondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons name="chevron-forward" size={16} color={theme.colors.text} />
                </View>
              </View>
            </NeoCard>
          </TouchableOpacity>
        ))}

        {/* App Version Info Card */}
        <NeoCard backgroundColor={theme.colors.cardSecondary} style={styles.aboutCard}>
          <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Money+ iOS Edition</Text>
          <Text style={[styles.aboutDesc, { color: theme.colors.textMuted }]}>
            Desain Neo-Brutalism dengan SQLite Offline Storage, Built-in Calculator, & Multi-Account Management.
          </Text>
          <Text style={[styles.versionText, { color: theme.colors.textMuted }]}>
            Versi 1.0.0 (Expo React Native)
          </Text>
        </NeoCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  menuCard: {
    marginVertical: 6,
    padding: 14,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  menuSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  arrowBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  aboutCard: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  aboutDesc: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 8,
  },
});
