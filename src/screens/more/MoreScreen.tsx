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
      id: 'analytics',
      title: 'Statistik & Trend Keuangan',
      subtitle: 'Analisis visual pemasukan, pengeluaran, perbandingan & tren saldo',
      icon: 'bar-chart',
      iconColor: theme.colors.primary,
      screen: 'Analytics',
    },
    {
      id: 'savings',
      title: 'Celengan & Target Impian',
      subtitle: 'Simpan dan pantau progress tabungan tujuanmu',
      icon: 'trophy',
      iconColor: theme.colors.warning,
      screen: 'SavingsGoals',
    },
    {
      id: 'accounts',
      title: 'Akun & Dompet',
      subtitle: `${activeAccountsCount} akun aktif • Total ${formatCurrency(totalNetWorth)}`,
      icon: 'wallet',
      iconColor: theme.colors.income,
      screen: 'Accounts',
    },
    {
      id: 'categories',
      title: 'Kategori Keuangan',
      subtitle: `${activeCategoriesCount} kategori aktif (Universal)`,
      icon: 'grid',
      iconColor: theme.colors.transfer,
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
      iconColor: theme.colors.accent,
      screen: 'Recurring',
    },
    {
      id: 'export',
      title: 'Laporan & Ekspor Data',
      subtitle: 'Ekspor riwayat ke CSV, JSON, & Backup Data',
      icon: 'download',
      iconColor: theme.colors.expense,
      screen: 'ExportReport',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>MENU UTAMA</Text>
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

        {/* App Branding & Creator Info Card */}
        <NeoCard backgroundColor={theme.colors.cardSecondary} style={styles.aboutCard}>
          <View style={styles.brandIconBadge}>
            <Ionicons name="wallet" size={26} color="#121212" />
          </View>
          <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>
            Sugarzy Finance Tracker (SuFiKer+)
          </Text>
          <View
            style={[
              styles.creatorChip,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={styles.creatorChipText}>
              Dibuat oleh Irwan Firmanto (@eternalsugarzy)
            </Text>
          </View>
          <Text style={[styles.aboutDesc, { color: theme.colors.textMuted }]}>
            Aplikasi Pencatatan Keuangan iOS dengan Desain Neo-Brutalism, Built-in Calculator, Multi-Account & Offline SQLite.
          </Text>
          <Text style={[styles.versionText, { color: theme.colors.textMuted }]}>
            Versi 1.4.0 (iOS Edition) • © 2026 Irwan Firmanto (@eternalsugarzy)
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
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  menuCard: {
    marginVertical: 5,
    padding: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  menuSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  arrowBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  aboutCard: {
    marginTop: 20,
    padding: 18,
    alignItems: 'center',
  },
  brandIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FFE600',
    borderWidth: 2.5,
    borderColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  creatorChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    marginVertical: 8,
  },
  creatorChipText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#121212',
  },
  aboutDesc: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },
});
