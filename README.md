# 💰 Sugarzy Finance Tracker (SuFiKer+) — iOS Edition

> **Aplikasi Mobile iOS Pencatatan & Pengelolaan Keuangan Pribadi dengan Desain Neo-Brutalism, Built-in Calculator, & Local SQLite Database.**  
> **Versi: 1.3.0 (Latest Release)**  
> **Dibuat dengan ❤️ oleh Muhammad ([@eternalsugarzy](https://github.com/eternalsugarzy))**

---

## 🎨 Tampilan & Desain Neo-Brutalism
- **Solid Black Borders (2.5px)** pada seluruh kartu, input, keypad, dan tombol.
- **Hard Drop Shadows** tajam tanpa blur (`offset: 4, 4`).
- **Palet Warna Pop Kontras Tinggi**: *Electric Yellow* (`#FFE600`), *Neon Pink* (`#FF5D8F`), *Lime Green* (`#54E346`), *Cyan/Blue* (`#00F0FF`), *Vivid Orange* (`#FF7A00`), dan *Purple* (`#A06CD5`).
- **Animasi Taktil (Tactile Press-Down)** mekanis saat tombol ditekan.
- **Dukungan Dark Mode** Neo-Brutalism kontras tinggi.
- **Dioptimalkan Khusus untuk iPhone 16** (Dynamic Island, Safe Area Insets, dan Tap Targets standar Apple).

---

## ✨ Fitur-Fitur Utama

1. **Dashboard Beranda (Home)**:
   - Total Saldo Bersih (*Net Worth*) dari akumulasi seluruh akun/dompet.
   - Tombol Pengaturan Akses Cepat via ikon Gear (`⚙️`) di kanan atas.
   - Kartu ringkasan Pemasukan & Pengeluaran (Filter: Hari ini, Minggu ini, Bulan ini).
   - Donut Pie Chart pengeluaran per kategori (`react-native-svg`) dengan legend dan persentase.
   - Grafik garis tren saldo bulanan (*Net Worth Trend*).
   - Daftar 5 transaksi terbaru yang reaktif secara real-time.

2. **Konsistensi Built-in NeoCalculator di Seluruh Input Angka**:
   - Seluruh input nominal uang (**Catat Transaksi**, **Budget**, **Tambah Dompet/Akun**, **Transaksi Berulang**, dan **Hutang-Piutang**) langsung terintegrasi dengan keypad kalkulator built-in tanpa membuka keyboard ponsel.
   - Mendukung operasi matematika langsung (`+`, `-`, `×`, `÷`) dan preset cepat (`+10rb`, `+50rb`, `+100rb`, `+500rb`).

3. **Tab Transaksi Terpadu (1 Card Per Hari)**:
   - Seluruh transaksi dalam 1 hari digabung ke dalam **1 Solid Neo-Brutalist Card** per tanggal.
   - Header Card menampilkan: `Hari, Tanggal Lengkap` (misal: *Rabu, 26 Agustus 2026* / *Hari Ini • 26 Agu 2026*), Total Masuk, Total Keluar, dan Badge Selisih Net.
   - Filter Bar minimalis dan sleek dengan pencarian cepat, filter periode instan, dan drawer filter lanjutan (Tipe, Dompet, Kategori).

4. **➕ Catat Transaksi (Center Raised FAB)**:
   - 4 Pilihan Mode: **Pengeluaran**, **Pemasukan**, **Transfer Saldo**, **Hutang-Piutang**.
   - **Default Dompet Otomatis**: Memilih akun/dompet yang terakhir digunakan secara otomatis.
   - **Kategori Universal**: Kategori fleksibel dapat digunakan untuk pemasukan, pengeluaran, maupun budget.
   - **Lampiran Foto Struk**: Kamera dan galeri foto dengan thumbnail strip dan zoom preview (`expo-image-picker`).

5. **Anggaran / Budgeting**:
   - Budget independen dengan nama kustom terhubung ke kategori.
   - Sinkronisasi pengeluaran riil otomatis.
   - Progress bar 3 warna (🟢 <80%, 🟡 80-100%, 🔴 >100% Over Budget).

6. **Manajemen Akun & Dompet**:
   - Tambah dompet tanpa batas (Cash, Bank, E-Wallet, Kartu Kredit, Investasi).
   - Proteksi arsip (*soft-delete*) jika akun sudah memiliki riwayat transaksi.

7. **Galeri 250+ Icon & Kategori**:
   - 250+ icon (Ionicons & MaterialCommunityIcons) terbagi dalam 10 tema (Makanan, Transportasi, Belanja, Tagihan, Hiburan, Kesehatan, Pendidikan, Finansial, Keluarga, Gaya Hidup).

8. **Hutang & Piutang**:
   - Catatan Utang dan Piutang dengan pengingat jatuh tempo.
   - Alur "Tandai Lunas" dengan opsi otomatis mencatat transaksi ke akun terpilih.

9. **Transaksi Berulang (Recurring)**:
   - Template pengeluaran/pemasukan rutin (Harian, Mingguan, Bulanan, Tahunan).
   - Notifikasi pengingat jatuh tempo.

10. **Ekspor & Backup**:
    - Ekspor riwayat transaksi ke **CSV (Excel)**.
    - Backup lengkap ke format **JSON** dengan native share sheet (`expo-sharing`).

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React Native 0.81 (Expo SDK 54)
- **Bahasa**: TypeScript
- **Database Lokal**: `expo-sqlite` (SQLite 3 dengan WAL Mode)
- **Navigasi**: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- **Charts**: `react-native-svg`
- **Media & File**: `expo-image-picker`, `expo-file-system`, `expo-sharing`
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

## 📄 Hak Cipta & Lisensi

**© 2026 Muhammad ([@eternalsugarzy](https://github.com/eternalsugarzy))**. All rights reserved.  
Dibuat untuk keperluan pencatatan dan pengelolaan keuangan pribadi modern dengan estetika Neo-Brutalism.
