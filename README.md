# 💰 SUFIKER+ (Sugarzy Finance Tracker) — iOS Edition

> **Aplikasi Mobile iOS Pencatatan & Pengelolaan Keuangan Pribadi dengan Desain Neo-Brutalism, Built-in Calculator, Multi-Account, Offline SQLite, & Dukungan Multi-Bahasa (ID/EN).**  
> **Versi: 1.5.0 (Latest Release)**  
> **Dibuat dengan ❤️ oleh Irwan Firmanto ([@eternalsugarzy](https://github.com/eternalsugarzy))**

---

## 🎨 Tampilan & Desain Neo-Brutalism
- **Solid Black Borders (2.5px)** pada seluruh kartu, input, keypad, dan tombol.
- **Hard Drop Shadows** tajam tanpa blur (`offset: 4, 4`).
- **Palet Warna Pop Kontras Tinggi**: *Electric Yellow* (`#FFE600`), *Neon Pink* (`#FF5D8F`), *Lime Green* (`#54E346`), *Cyan/Blue* (`#00F0FF`), *Vivid Orange* (`#FF7A00`), dan *Purple* (`#A06CD5`).
- **Animasi Taktil (Tactile Press-Down)** mekanis saat tombol ditekan.
- **Dukungan Penuh Dark Mode & Light Mode** kontras tinggi yang tajam dan nyaman dibaca.
- **Dioptimalkan Khusus untuk iPhone 16** (Dynamic Island, Safe Area Insets, dan Tap Targets standar Apple).

---

## ✨ Fitur-Fitur Utama (Versi 1.5.0)

1. **🌐 Pilihan Bahasa (Bilingual Localization - ID & EN)**:
   - Pengaturan bahasa bilingual di Menu Pengaturan: **🇮🇩 Bahasa Indonesia** dan **🇬🇧 English (US)**.
   - Seluruh tab, label ringkasan, tombol, dan status finansial beradaptasi secara instan.

2. **Dashboard Beranda (Home)**:
   - **Sembunyikan Saldo (Hide/Show Balance)**: Tombol ikon mata (👁️) untuk menyembunyikan/menampilkan total saldo bersih dan nominal akun.
   - **Skor Kesehatan Finansial (Financial Health Score)**: Perhitungan rasio tabungan otomatis (*Savings Rate*) dengan status 🟢 *Sehat Finansial*, 🟡 *Cukup Stabil*, atau 🔴 *Waspada*.
   - **Peringatan Budget Pintar**: Peringatan otomatis jika kategori pengeluaran mencapai ≥80% dari anggaran bulanan.
   - **⚡ Catat Cepat 1-Tap Instan (Quick-Add Shortcuts)**: Tombol preset instan (☕ Kopi Rp 25rb, 🍽️ Makan Siang Rp 35rb, ⛽ Bensin Rp 50rb, 🛒 Belanja Rp 100rb) untuk langsung mencatat transaksi ke database SQLite dalam 1 ketukan tanpa modal konfirmasi.
   - **CRUD Penuh Shortcut Catat Cepat**: Tambah shortcut baru, pilih emoji kustom, ubah nominal kalkulator, edit, dan hapus shortcut.
   - **Grafik Donut Interaktif**: Pilihan toggle dinamis antara **🔴 Pengeluaran** dan **🟢 Pemasukan** per kategori.
   - **5 Transaksi Terbaru**: Sinkronisasi riwayat real-time dengan tombol "Lihat Semua >" ke tab Transaksi.

3. **📊 Statistik & Trend Keuangan Lengkap (Menu Khusus)**:
   - Layar khusus analitik di Menu Lainnya (`AnalyticsScreen`).
   - Ringkasan Arus Kas Masuk vs Keluar per Hari, Minggu, Bulan, dan Tahun.
   - **Grafik Garis Tren 6 Bulan (`NeoLineChart`)**: Visualisasi surplus/defisit bulanan secara historis.
   - **Peringkat Kategori & Progress Bar**: Ranking kategori pengeluaran & pemasukan terbesar beserta persentase kontribusi.

4. **🎯 Celengan & Target Impian (Savings Goals / Wishlist)**:
   - Fitur penetapan target tabungan (Dana Darurat, Gadget Baru, Liburan).
   - Indikator pencapaian visual (*Progress Bar*).
   - Fitur "Isi Tabungan" terintegrasi langsung dengan kalkulator *built-in*.

5. **📥 Impor Data dari Money+ (CSV / JSON)**:
   - Pindahkan seluruh data riwayat transaksi lama dari aplikasi Money+ atau spreadsheet Excel ke SuFiKer+.
   - Mendukung pemilihan file dokumen (.csv / .json) serta modal tempel teks manual.

6. **Konsistensi Built-in NeoCalculator di Seluruh Input Angka**:
   - Seluruh input nominal uang (**Catat Transaksi**, **Budget**, **Tambah Dompet/Akun**, **Transaksi Berulang**, **Hutang-Piutang**, dan **Celengan**) langsung terintegrasi dengan keypad kalkulator built-in tanpa membuka keyboard ponsel.
   - Mendukung operasi matematika langsung (`+`, `-`, `×`, `÷`) dan preset cepat (`+10rb`, `+50rb`, `+100rb`, `+500rb`).

7. **Tab Transaksi Terpadu (1 Card Per Hari)**:
   - Seluruh transaksi dalam 1 hari digabung ke dalam **1 Solid Neo-Brutalist Card** per tanggal.
   - Header Card menampilkan: `Hari, Tanggal Lengkap` (misal: *Rabu, 26 Agustus 2026*), Total Masuk, Total Keluar, dan Badge Selisih Net.
   - Filter Bar minimalis dan sleek dengan pencarian cepat, filter periode instan, dan drawer filter lanjutan.

8. **➕ Catat Transaksi (Center Raised FAB)**:
   - 4 Pilihan Mode: **Pengeluaran**, **Pemasukan**, **Transfer Saldo**, **Hutang-Piutang**.
   - **Default Dompet Otomatis**: Memilih akun/dompet yang terakhir digunakan secara otomatis.
   - **Kategori Universal**: Kategori fleksibel dapat digunakan untuk pemasukan, pengeluaran, maupun budget.
   - **Lampiran Foto Struk**: Kamera dan galeri foto dengan thumbnail strip dan zoom preview (`expo-image-picker`).

9. **Anggaran / Budgeting**:
   - Budget independen dengan nama kustom terhubung ke kategori.
   - Sinkronisasi pengeluaran riil otomatis.
   - Progress bar 3 warna (🟢 <80%, 🟡 80-100%, 🔴 >100% Over Budget).

10. **Manajemen Akun & Dompet**:
    - Tambah dompet tanpa batas (Cash, Bank, E-Wallet, Kartu Kredit, Investasi).
    - Proteksi arsip (*soft-delete*) jika akun sudah memiliki riwayat transaksi.

11. **Galeri 250+ Icon & Kategori**:
    - 250+ icon (Ionicons & MaterialCommunityIcons) terbagi dalam 10 tema (Makanan, Transportasi, Belanja, Tagihan, Hiburan, Kesehatan, Pendidikan, Finansial, Keluarga, Gaya Hidup).

12. **Hutang & Piutang**:
    - Catatan Utang dan Piutang dengan pengingat jatuh tempo.
    - Alur "Tandai Lunas" dengan opsi otomatis mencatat transaksi ke akun terpilih.

13. **Transaksi Berulang (Recurring)**:
    - Template pengeluaran/pemasukan rutin (Harian, Mingguan, Bulanan, Tahunan).
    - Notifikasi pengingat jatuh tempo.

14. **Ekspor & Backup**:
    - Ekspor riwayat transaksi ke **CSV (Excel)**.
    - Backup lengkap ke format **JSON** dengan native share sheet (`expo-sharing`).

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React Native 0.81 (Expo SDK 54)
- **Bahasa**: TypeScript
- **Database Lokal**: `expo-sqlite` (SQLite 3 dengan WAL Mode)
- **Navigasi**: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- **Charts**: `react-native-svg`
- **Media & File**: `expo-image-picker`, `expo-file-system`, `expo-sharing`, `expo-document-picker`
- **Notifikasi**: `expo-notifications`
- **Icons**: `@expo/vector-icons` (Ionicons & MaterialCommunityIcons)

---

## 🚀 Cara Menjalankan Aplikasi

1. Clone repositori:
   ```bash
   git clone https://github.com/eternalsugarzy/money-tracker.git
   cd money-tracker
   ```
2. Install dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Jalankan server Expo:
   ```bash
   npm start
   ```
4. Buka aplikasi **Expo Go** di iPhone, lalu scan QR Code yang muncul di terminal.

---

## 📄 Lisensi & Hak Cipta

© 2026 **Irwan Firmanto** ([@eternalsugarzy](https://github.com/eternalsugarzy)). All rights reserved.
