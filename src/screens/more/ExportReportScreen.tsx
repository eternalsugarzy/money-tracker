import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoModal } from '../../components/common/NeoModal';
import { exportTransactionsToCSV, exportFullBackupJSON } from '../../services/exportService';
import { importDataFromMoneyPlus } from '../../services/moneyPlusImportService';

export const ExportReportScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { transactions, accounts, categories, budgets, refreshData } = useAppData();

  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingJSON, setLoadingJSON] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');

  const handleExportCSV = async () => {
    try {
      setLoadingCSV(true);
      await exportTransactionsToCSV();
      Alert.alert('Sukses', 'File CSV transaksi berhasil diekspor dan siap dibagikan.');
    } catch (err: any) {
      Alert.alert('Gagal Ekspor CSV', err.message || 'Terjadi kesalahan');
    } finally {
      setLoadingCSV(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setLoadingJSON(true);
      await exportFullBackupJSON();
      Alert.alert('Sukses', 'File backup JSON berhasil dibuat dan siap disimpan.');
    } catch (err: any) {
      Alert.alert('Gagal Ekspor JSON', err.message || 'Terjadi kesalahan');
    } finally {
      setLoadingJSON(false);
    }
  };

  const handlePickAndImportFile = async () => {
    try {
      setLoadingImport(true);
      const res = await DocumentPicker.getDocumentAsync({
        type: ['text/*', 'application/json', 'text/csv', 'text/comma-separated-values', '*/*'],
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) {
        setLoadingImport(false);
        return;
      }

      const fileUri = res.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      const importResult = await importDataFromMoneyPlus(fileContent);

      if (importResult.success) {
        await refreshData();
        Alert.alert('✅ Impor Berhasil!', importResult.message);
      } else {
        Alert.alert('Gagal Impor', importResult.message);
      }
    } catch (err: any) {
      Alert.alert('Gagal Membaca File', err?.message || 'Terjadi kesalahan saat membaca file');
    } finally {
      setLoadingImport(false);
    }
  };

  const handleImportPastedContent = async () => {
    if (!pastedText.trim()) {
      Alert.alert('Teks Kosong', 'Harap tempel teks CSV atau JSON dari Money+');
      return;
    }
    try {
      setLoadingImport(true);
      const importResult = await importDataFromMoneyPlus(pastedText);

      if (importResult.success) {
        await refreshData();
        setShowPasteModal(false);
        setPastedText('');
        Alert.alert('✅ Impor Berhasil!', importResult.message);
      } else {
        Alert.alert('Gagal Impor', importResult.message);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Gagal memproses data.');
    } finally {
      setLoadingImport(false);
    }
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>LAPORAN & DATA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Data Statistics Card */}
        <NeoCard backgroundColor={theme.colors.primary} style={styles.statsCard}>
          <Text style={styles.statsTitle}>RINGKASAN DATA TERSIMPAN</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Transaksi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{accounts.length}</Text>
              <Text style={styles.statLabel}>Akun Dompet</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{categories.length}</Text>
              <Text style={styles.statLabel}>Kategori</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{budgets.length}</Text>
              <Text style={styles.statLabel}>Budget</Text>
            </View>
          </View>
        </NeoCard>

        {/* 📥 IMPORT DATA SECTION */}
        <NeoCard style={styles.actionCard}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.warning, borderColor: theme.colors.border },
              ]}
            >
              <Ionicons name="file-tray-full" size={24} color="#121212" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Impor Data dari Money+ (CSV / JSON)
              </Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textMuted }]}>
                Pindahkan seluruh data transaksi lamamu dari aplikasi Money+ atau spreadsheet Excel secara otomatis ke SuFiKer+.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <NeoButton
              title="PILIH FILE"
              variant="primary"
              loading={loadingImport}
              icon={<Ionicons name="folder-open" size={16} color="#121212" />}
              onPress={handlePickAndImportFile}
              style={{ flex: 1 }}
            />
            <NeoButton
              title="PASTE TEKS"
              variant="outline"
              icon={<Ionicons name="clipboard-outline" size={16} color={theme.colors.text} />}
              onPress={() => setShowPasteModal(true)}
              style={{ flex: 1 }}
            />
          </View>
        </NeoCard>

        {/* CSV Export Card */}
        <NeoCard style={styles.actionCard}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.income, borderColor: theme.colors.border },
              ]}
            >
              <Ionicons name="document-text" size={24} color="#121212" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Ekspor Transaksi ke CSV (Excel)
              </Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textMuted }]}>
                Ekspor seluruh data transaksi termasuk tanggal, nominal, tipe, kategori, akun, dan catatan ke dalam format CSV spreadsheet.
              </Text>
            </View>
          </View>

          <NeoButton
            title="EKSPOR FILE CSV"
            variant="income"
            loading={loadingCSV}
            onPress={handleExportCSV}
            style={{ marginTop: 14 }}
          />
        </NeoCard>

        {/* Full JSON Backup Card */}
        <NeoCard style={styles.actionCard}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.transfer, borderColor: theme.colors.border },
              ]}
            >
              <Ionicons name="cloud-download" size={24} color="#121212" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Full Backup JSON
              </Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textMuted }]}>
                Buat salinan cadangan lengkap dari seluruh database (Akun, Kategori, Transaksi, Budget, Hutang-Piutang) dalam format JSON terstruktur.
              </Text>
            </View>
          </View>

          <NeoButton
            title="EKSPOR FULL BACKUP JSON"
            variant="transfer"
            loading={loadingJSON}
            onPress={handleExportJSON}
            style={{ marginTop: 14 }}
          />
        </NeoCard>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal Paste CSV/JSON */}
      <NeoModal
        visible={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        title="PASTE DATA MONEY+"
      >
        <View style={{ paddingVertical: 8 }}>
          <Text style={[styles.pasteHint, { color: theme.colors.textMuted }]}>
            Tempelkan isi file CSV atau JSON export dari Money+ di bawah ini:
          </Text>
          <TextInput
            multiline
            numberOfLines={8}
            placeholder="Date,Type,Category,Amount,Account,Note..."
            placeholderTextColor={theme.colors.textMuted}
            value={pastedText}
            onChangeText={setPastedText}
            style={[
              styles.pasteInput,
              {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
          />
          <NeoButton
            title="PROSES IMPOR DATA"
            variant="primary"
            loading={loadingImport}
            onPress={handleImportPastedContent}
            style={{ marginTop: 12 }}
          />
        </View>
      </NeoModal>
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
  statsCard: {
    padding: 16,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#121212',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#121212',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#121212',
    marginTop: 2,
  },
  actionCard: {
    padding: 16,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  actionDesc: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
    lineHeight: 15,
  },
  pasteHint: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  pasteInput: {
    height: 160,
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    textAlignVertical: 'top',
  },
});
