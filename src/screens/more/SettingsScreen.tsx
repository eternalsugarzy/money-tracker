import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { scheduleDailyExpenseReminder, cancelDailyExpenseReminder } from '../../services/notificationService';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigation = useNavigation<any>();
  const { generateSampleData } = useAppData();

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderHour, setReminderHour] = useState(20);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [generating, setGenerating] = useState(false);

  const handleToggleReminder = async (enabled: boolean) => {
    setReminderEnabled(enabled);
    if (enabled) {
      await scheduleDailyExpenseReminder(reminderHour, reminderMinute, true);
      Alert.alert(
        language === 'id' ? 'Pengingat Aktif' : 'Reminder Enabled',
        language === 'id'
          ? `Notifikasi harian dijadwalkan setiap pukul ${String(reminderHour).padStart(2, '0')}:${String(reminderMinute).padStart(2, '0')}.`
          : `Daily notification scheduled at ${String(reminderHour).padStart(2, '0')}:${String(reminderMinute).padStart(2, '0')}.`
      );
    } else {
      await cancelDailyExpenseReminder();
      Alert.alert(
        language === 'id' ? 'Pengingat Dimatikan' : 'Reminder Disabled',
        language === 'id' ? 'Notifikasi pengingat harian telah dinonaktifkan.' : 'Daily reminder notification has been turned off.'
      );
    }
  };

  const handleGenerateSample = async () => {
    Alert.alert(
      language === 'id' ? 'Generate Data Sampel' : 'Generate Sample Data',
      language === 'id'
        ? 'Tambahkan data simulasi transaksi, budget, akun, dan hutang-piutang untuk mencoba seluruh fitur?'
        : 'Add simulated transactions, budgets, accounts, and debts to test all features?',
      [
        { text: language === 'id' ? 'Batal' : 'Cancel', style: 'cancel' },
        {
          text: language === 'id' ? 'Generate Sekarang' : 'Generate Now',
          onPress: async () => {
            setGenerating(true);
            await generateSampleData();
            setGenerating(false);
            Alert.alert(
              language === 'id' ? 'Selesai' : 'Success',
              language === 'id' ? 'Data sampel realistis berhasil dibuat!' : 'Realistic sample data generated successfully!'
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t.settings}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Language Settings */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
          {t.languageSection}
        </Text>
        <NeoCard style={styles.settingCard}>
          <View style={styles.languageOptionsRow}>
            {/* Indonesian Option */}
            <TouchableOpacity
              onPress={() => setLanguage('id')}
              style={[
                styles.langOptionBtn,
                {
                  backgroundColor: language === 'id' ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: language === 'id' ? 2.5 : 1.5,
                },
              ]}
            >
              <Text style={styles.flagEmoji}>🇮🇩</Text>
              <Text
                style={[
                  styles.langOptionText,
                  {
                    color: language === 'id' ? '#121212' : theme.colors.text,
                    fontWeight: language === 'id' ? '900' : '700',
                  },
                ]}
              >
                Bahasa Indonesia
              </Text>
              {language === 'id' && (
                <Ionicons name="checkmark-circle" size={18} color="#121212" style={{ marginLeft: 6 }} />
              )}
            </TouchableOpacity>

            {/* English Option */}
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              style={[
                styles.langOptionBtn,
                {
                  backgroundColor: language === 'en' ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: language === 'en' ? 2.5 : 1.5,
                },
              ]}
            >
              <Text style={styles.flagEmoji}>🇬🇧</Text>
              <Text
                style={[
                  styles.langOptionText,
                  {
                    color: language === 'en' ? '#121212' : theme.colors.text,
                    fontWeight: language === 'en' ? '900' : '700',
                  },
                ]}
              >
                English (US)
              </Text>
              {language === 'en' && (
                <Ionicons name="checkmark-circle" size={18} color="#121212" style={{ marginLeft: 6 }} />
              )}
            </TouchableOpacity>
          </View>
        </NeoCard>

        {/* 2. Appearance Settings */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 14 }]}>
          {t.appearance}
        </Text>
        <NeoCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeftGroup}>
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: theme.colors.primary, borderColor: theme.colors.border },
                ]}
              >
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color="#121212" />
              </View>
              <View style={styles.settingTextCol}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{t.darkMode}</Text>
                <Text style={[styles.settingDesc, { color: theme.colors.textMuted }]}>
                  {t.darkModeSub}
                </Text>
              </View>
            </View>

            <View style={styles.switchWrapper}>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#3A3A3C', true: theme.colors.primary }}
                thumbColor={isDark ? '#121212' : '#FFE600'}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
          </View>
        </NeoCard>

        {/* 3. Notification Settings */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 14 }]}>
          {t.notifications}
        </Text>
        <NeoCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeftGroup}>
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: theme.colors.income, borderColor: theme.colors.border },
                ]}
              >
                <Ionicons name="notifications" size={20} color="#121212" />
              </View>
              <View style={styles.settingTextCol}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  {t.dailyReminder}
                </Text>
                <Text style={[styles.settingDesc, { color: theme.colors.textMuted }]}>
                  {t.dailyReminderSub}
                </Text>
              </View>
            </View>

            <View style={styles.switchWrapper}>
              <Switch
                value={reminderEnabled}
                onValueChange={handleToggleReminder}
                trackColor={{ false: '#3A3A3C', true: theme.colors.income }}
                thumbColor={reminderEnabled ? '#121212' : '#FFFFFF'}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
          </View>
        </NeoCard>

        {/* 4. Demo & Testing Data */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 14 }]}>
          {t.dataManagement}
        </Text>
        <NeoCard style={styles.settingCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: theme.colors.transfer, borderColor: theme.colors.border },
              ]}
            >
              <Ionicons name="sparkles" size={20} color="#121212" />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {t.generateSample}
              </Text>
              <Text style={[styles.settingDesc, { color: theme.colors.textMuted }]}>
                {t.generateSampleSub}
              </Text>
            </View>
          </View>

          <NeoButton
            title={language === 'id' ? 'GENERATE SAMPLE DATA' : 'GENERATE SAMPLE DATA'}
            variant="transfer"
            loading={generating}
            onPress={handleGenerateSample}
          />
        </NeoCard>

        {/* 5. App Info & Copyright */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 14 }]}>
          {t.aboutApp}
        </Text>
        <NeoCard style={styles.settingCard}>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.border,
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                },
              ]}
            >
              <Ionicons name="wallet" size={28} color="#121212" />
            </View>
            <Text style={[styles.appName, { color: theme.colors.text }]}>
              SUGARZY FINANCE TRACKER (SUFIKER+)
            </Text>
            <Text style={[styles.appVersion, { color: theme.colors.textMuted }]}>
              Versi 1.4.0 (Build 2026.08)
            </Text>

            <View
              style={[
                styles.creatorBadge,
                {
                  backgroundColor: theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.creatorText, { color: theme.colors.text }]}>
                {t.createdBy} <Text style={{ fontWeight: '900' }}>Irwan Firmanto</Text> (@eternalsugarzy)
              </Text>
            </View>

            <Text style={[styles.copyrightText, { color: theme.colors.textMuted }]}>
              © 2026 Irwan Firmanto (@eternalsugarzy). {t.rightsReserved}
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  settingCard: {
    padding: 14,
    marginBottom: 6,
  },
  languageOptionsRow: {
    flexDirection: 'column',
    gap: 8,
  },
  langOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  langOptionText: {
    fontSize: 13,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  settingDesc: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 15,
  },
  switchWrapper: {
    paddingLeft: 4,
  },
  appName: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  creatorBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  creatorText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
});
