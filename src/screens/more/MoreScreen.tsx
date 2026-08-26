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
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { formatCurrency } from '../../utils/formatters';

export const MoreScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const navigation = useNavigation<any>();
  const { accounts, categories, recurring, debts, totalNetWorth } = useAppData();

  const activeAccountsCount = accounts.filter((a) => a.is_archived === 0).length;
  const activeCategoriesCount = categories.filter((c) => c.is_archived === 0).length;
  const unpaidDebtsCount = debts.filter((d) => d.status === 'unpaid').length;
  const activeRecurringCount = recurring.filter((r) => r.is_active === 1).length;

  const MENU_ITEMS = [
    {
      id: 'analytics',
      title: t.analyticsMenu,
      subtitle: t.analyticsSub,
      icon: 'bar-chart',
      iconColor: theme.colors.primary,
      screen: 'Analytics',
    },
    {
      id: 'savings',
      title: t.savingsMenu,
      subtitle: t.savingsSub,
      icon: 'trophy',
      iconColor: theme.colors.warning,
      screen: 'SavingsGoals',
    },
    {
      id: 'accounts',
      title: t.accountsMenu,
      subtitle: `${activeAccountsCount} ${language === 'id' ? 'akun aktif' : 'active accounts'} • Total ${formatCurrency(totalNetWorth)}`,
      icon: 'wallet',
      iconColor: theme.colors.income,
      screen: 'Accounts',
    },
    {
      id: 'categories',
      title: t.categoriesMenu,
      subtitle: `${activeCategoriesCount} ${language === 'id' ? 'kategori aktif' : 'active categories'}`,
      icon: 'grid',
      iconColor: theme.colors.transfer,
      screen: 'Categories',
    },
    {
      id: 'debts',
      title: t.debtsMenu,
      subtitle: `${unpaidDebtsCount} ${language === 'id' ? 'catatan belum lunas' : 'unsettled records'}`,
      icon: 'people',
      iconColor: theme.colors.debt,
      screen: 'Debts',
    },
    {
      id: 'recurring',
      title: t.recurringMenu,
      subtitle: `${activeRecurringCount} ${language === 'id' ? 'template aktif' : 'active templates'}`,
      icon: 'repeat',
      iconColor: theme.colors.accent,
      screen: 'Recurring',
    },
    {
      id: 'export',
      title: t.exportMenu,
      subtitle: language === 'id' ? 'Ekspor riwayat ke CSV, JSON, & Impor Data Money+' : 'Export history to CSV, JSON, & Import Money+',
      icon: 'download',
      iconColor: theme.colors.expense,
      screen: 'ExportReport',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t.mainMenu}</Text>
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
            SUGARZY FINANCE TRACKER (SUFIKER+)
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
              {t.createdBy} Irwan Firmanto (@eternalsugarzy)
            </Text>
          </View>
          <Text style={[styles.aboutDesc, { color: theme.colors.textMuted }]}>
            {t.aboutDesc}
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
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  menuSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  arrowBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  aboutCard: {
    marginTop: 16,
    alignItems: 'center',
    padding: 18,
  },
  brandIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  creatorChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    marginVertical: 8,
  },
  creatorChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
  },
  aboutDesc: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    marginHorizontal: 10,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
});
