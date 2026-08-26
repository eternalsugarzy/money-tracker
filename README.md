# 💰 Money+ — iOS Personal Finance Tracker (Neo-Brutalism)

> **Aplikasi Mobile iOS Pencatatan Keuangan Pribadi dengan Desain Neo-Brutalism & Local SQLite Database.**  
> **Versi: 1.1.0**  
> **Dibuat dengan ❤️ oleh Muhammad ([@eternalsugarzy](https://github.com/eternalsugarzy))**

---

## 🎨 Tampilan & Desain Neo-Brutalism
- **Solid Black Borders (2.5px)** pada seluruh kartu, input, dan tombol.
- **Hard Drop Shadows** tajam tanpa blur (`offset: 4, 4`).
- **Palet Warna Pop Kontras Tinggi**: *Electric Yellow* (`#FFE600`), *Neon Pink* (`#FF5D8F`), *Lime Green* (`#54E346`), *Cyan/Blue* (`#00F0FF`), *Vivid Orange* (`#FF7A00`), dan *Purple* (`#A06CD5`).
- **Animasi Taktil (Tactile Press-Down)** mekanis saat tombol ditekan.
- **Dukungan Dark Mode** Neo-Brutalism kontras tinggi.
- **Dioptimalkan Khusus untuk iPhone 16** (Dynamic Island, Safe Area Insets, dan Tap Targets standar Apple).

---

## ✨ Fitur-Fitur Utama

1. **Dashboard Beranda (Home)**:
   - Total Saldo Bersih (*Net Worth*) dari akumulasi seluruh akun/dompet.
   - Kartu ringkasan Pemasukan & Pengeluaran (Filter: Hari ini, Minggu ini, Bulan ini).
   - Donut Pie Chart pengeluaran per kategori (`react-native-svg`) dengan legend dan persentase.
   - Grafik garis tren saldo bulanan (*Net Worth Trend*).
   - Daftar 5 transaksi terbaru.

2. **Transaksi & Filter Multi-Kriteria**:
   - Filter periode instan (Hari Ini, Minggu Ini, Bulan Ini, Tahun Ini, Semua).
   - Filter multi-kategori, akun dompet, dan tipe transaksi.
   - Fitur pencarian catatan dan nominal.
   - Pengelompokan transaksi per tanggal (Hari ini, Kemarin, dsb) dengan subtotal harian.

3. **➕ Catat Transaksi (Center Raised FAB)**:
   - 4 Pilihan Mode: **Pengeluaran**, **Pemasukan**, **Transfer Saldo**, **Hutang-Piutang**.
   - **Kalkulator Built-in Otomatis**: Input nominal langsung menampilkan keypad kalkulator bawaan tanpa membuka keyboard HP. Mendukung operasi matematika (`+`, `-`, `*`, `/`) dan preset cepat (`+10rb`, `+50rb`, `+100rb`, `+500rb`).
   - **Default Dompet Otomatis**: Memilih akun/dompet yang terakhir digunakan secara otomatis.
   - **Kategori Universal**: Kategori fleksibel dapat digunakan untuk pemasukan, pengeluaran, maupun budget.
   - **Lampiran Foto Struk**: Kamera dan galeri foto dengan thumbnail strip dan zoom preview (`expo-image-picker`).

4. **Anggaran / Budgeting**:
   - Budget independen dengan nama kustom terhubung ke kategori.
   - Sinkronisasi pengeluaran riil otomatis.
   - Progress bar 3 warna (🟢 <80%, 🟡 80-100%, 🔴 >100% Over Budget).
   - Riwayat performa budget bulan-bulan sebelumnya.

5. **Manajemen Akun & Dompet**:
   - Tambah dompet tanpa batas (Cash, Bank, E-Wallet, Kartu Kredit, Investasi).
   - Proteksi arsip (*soft-delete*) jika akun sudah memiliki riwayat transaksi.

6. **Galeri 100+ Icon & Kategori**:
   - Kategori default umum: *Makan*, *Cemilan & Kopi*, *Transport*, *Belanja*, *Tagihan & Listrik*, *Hiburan & Hobi*, *Kesehatan*, *Pendidikan*, *Gaji*, *Bonus*, *Investasi*, dll.
   - Pemilih icon dengan 100+ icon (Ionicons & MaterialCommunityIcons) terbagi dalam 10 tema dan 16 warna pop.

7. **Hutang & Piutang**:
   - Catatan Utang (saya meminjam) dan Piutang (orang meminjam).
   - Pengingat tanggal jatuh tempo.
   - Alur "Tandai Lunas" dengan opsi otomatis mencatat transaksi pemasukan/pengeluaran ke akun terpilih.

8. **Transaksi Berulang (Recurring)**:
   - Template pengeluaran/pemasukan rutin (Harian, Mingguan, Bulanan, Tahunan).
   - Notifikasi pengingat jatuh tempo dengan konfirmasi catat manual.

9. **Ekspor & Backup**:
   - Ekspor riwayat transaksi ke **CSV (Excel)**.
   - Backup lengkap ke format **JSON** dengan native share sheet (`expo-sharing`).

10. **Pengaturan & Notifikasi**:
    - Pengingat harian catat keuangan setiap pukul 20:00 (`expo-notifications`).
    - Generator data sampel simulasi realistis (*Demo Mode*).

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
