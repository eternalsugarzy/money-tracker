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
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { scheduleDailyExpenseReminder, cancelDailyExpenseReminder } from '../../services/notificationService';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
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
      Alert.alert('Pengingat Aktif', `Notifikasi harian dijadwalkan setiap pukul ${String(reminderHour).padStart(2, '0')}:${String(reminderMinute).padStart(2, '0')}.`);
    } else {
      await cancelDailyExpenseReminder();
      Alert.alert('Pengingat Dimatikan', 'Notifikasi pengingat harian telah dinonaktifkan.');
    }
  };

  const handleGenerateSample = async () => {
    Alert.alert(
      'Generate Data Sampel',
      'Tambahkan data simulasi transaksi, budget, akun, dan hutang-piutang untuk mencoba seluruh fitur?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Generate Sekarang',
          onPress: async () => {
            setGenerating(true);
            await generateSampleData();
            setGenerating(false);
            Alert.alert('Selesai', 'Data sampel realistis berhasil dibuat!');
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>PENGATURAN</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Appearance Settings */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>TAMPILAN</Text>
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
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Mode Gelap (Dark Mode)</Text>
                <Text style={[styles.settingDesc, { color: theme.colors.textMuted }]}>
                  {isDark ? 'Tema Neo-Brutalism Gelap aktif' : 'Tema Neo-Brutalism Terang aktif'}
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

        {/* Notification Settings */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 14 }]}>
          NOTIFIKASI PENGINGAT
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
                  Pengingat Catat Harian
                </Text>
                <Text style={[styles.settingDesc, { color: theme.colors.textMuted }]}>
                  Pukul {String(reminderHour).padStart(2, '0')}:{String(reminderMinute).padStart(2, '0')} setiap malam
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

        {/* Demo & Testing Data */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 14 }]}>
          DATA & DEMO
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
                Isi Data Simulasi Cepat
              </Text>
              <Text style={[styles.settingDesc, { color: theme.colors.textMuted }]}>
                Tambahkan contoh transaksi, budget makan, dan hutang-piutang untuk melihat grafik secara langsung.
              </Text>
            </View>
          </View>

          <NeoButton
            title="GENERATE SAMPLE DATA"
            variant="transfer"
            loading={generating}
            onPress={handleGenerateSample}
          />
        </NeoCard>

        {/* App Info & Copyright */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, marginTop: 14 }]}>
          TENTANG APLIKASI
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
              Sugarzy Finance Tracker (SuFiKer+)
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
                Dibuat dengan ❤️ oleh <Text style={{ fontWeight: '900' }}>Irwan Firmanto</Text> (@eternalsugarzy)
              </Text>
            </View>

            <Text style={[styles.copyrightText, { color: theme.colors.textMuted }]}>
              © 2026 Irwan Firmanto (@eternalsugarzy). All rights reserved.
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
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  settingCard: {
    padding: 14,
    marginVertical: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  settingLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  settingTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  switchWrapper: {
    flexShrink: 0,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  settingDesc: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  appName: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  creatorBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    marginTop: 12,
    alignItems: 'center',
  },
  creatorText: {
    fontSize: 12,
    fontWeight: '700',
  },
  copyrightText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
  },
});
