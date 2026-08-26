import { IconFamily } from '../types';

export interface IconItem {
  name: string;
  family: IconFamily;
  label: string;
}

export interface IconCategoryTheme {
  themeId: string;
  themeName: string;
  themeIcon: string;
  icons: IconItem[];
}

export const POP_COLOR_PALETTE = [
  '#FFE600', // Electric Yellow
  '#FF5D8F', // Neon Magenta / Pink
  '#00F0FF', // Cyan / Electric Blue
  '#54E346', // Lime Green
  '#FF7A00', // Vivid Orange
  '#A06CD5', // Electric Purple
  '#FF3366', // Crimson Pop
  '#3A86FF', // Royal Blue
  '#06D6A0', // Teal Mint
  '#8338EC', // Deep Violet
  '#FB5607', // Fire Orange
  '#FFBE0B', // Amber Gold
  '#48CAE4', // Sky Blue
  '#52B788', // Emerald Green
  '#E0AAFF', // Lavender
  '#F72585', // Berry Hot Pink
];

export const ICON_GALLERY_THEMES: IconCategoryTheme[] = [
  {
    themeId: 'food',
    themeName: 'Makanan & Minuman',
    themeIcon: 'restaurant',
    icons: [
      { name: 'restaurant', family: 'Ionicons', label: 'Restoran' },
      { name: 'fast-food', family: 'Ionicons', label: 'Fast Food' },
      { name: 'pizza', family: 'Ionicons', label: 'Pizza' },
      { name: 'cafe', family: 'Ionicons', label: 'Kopi / Cafe' },
      { name: 'beer', family: 'Ionicons', label: 'Minuman' },
      { name: 'wine', family: 'Ionicons', label: 'Bar' },
      { name: 'nutrition', family: 'Ionicons', label: 'Buah & Sayur' },
      { name: 'ice-cream', family: 'Ionicons', label: 'Es Krim' },
      { name: 'food-croissant', family: 'MaterialCommunityIcons', label: 'Roti' },
      { name: 'noodles', family: 'MaterialCommunityIcons', label: 'Mie / Ramen' },
      { name: 'cupcake', family: 'MaterialCommunityIcons', label: 'Kue' },
      { name: 'cookie', family: 'MaterialCommunityIcons', label: 'Camilan' },
      { name: 'pot-steam', family: 'MaterialCommunityIcons', label: 'Masak' },
      { name: 'silverware-fork-knife', family: 'MaterialCommunityIcons', label: 'Makan' },
    ],
  },
  {
    themeId: 'transport',
    themeName: 'Transportasi',
    themeIcon: 'car',
    icons: [
      { name: 'car', family: 'Ionicons', label: 'Mobil' },
      { name: 'car-sport', family: 'Ionicons', label: 'Taksi / Rental' },
      { name: 'bus', family: 'Ionicons', label: 'Bus' },
      { name: 'train', family: 'Ionicons', label: 'Kereta' },
      { name: 'airplane', family: 'Ionicons', label: 'Pesawat' },
      { name: 'boat', family: 'Ionicons', label: 'Kapal' },
      { name: 'bicycle', family: 'Ionicons', label: 'Sepeda' },
      { name: 'walk', family: 'Ionicons', label: 'Jalan Kaki' },
      { name: 'motorbike', family: 'MaterialCommunityIcons', label: 'Motor' },
      { name: 'gas-station', family: 'MaterialCommunityIcons', label: 'Bensin / BBM' },
      { name: 'parking', family: 'MaterialCommunityIcons', label: 'Parkir' },
      { name: 'car-wash', family: 'MaterialCommunityIcons', label: 'Cuci Kendaraan' },
      { name: 'toll', family: 'MaterialCommunityIcons', label: 'Tol' },
      { name: 'oil', family: 'MaterialCommunityIcons', label: 'Oli / Servis' },
    ],
  },
  {
    themeId: 'shopping',
    themeName: 'Belanja & Lifestyle',
    themeIcon: 'cart',
    icons: [
      { name: 'cart', family: 'Ionicons', label: 'Supermarket' },
      { name: 'bag-handle', family: 'Ionicons', label: 'Belanja' },
      { name: 'shirt', family: 'Ionicons', label: 'Pakaian' },
      { name: 'watch', family: 'Ionicons', label: 'Aksesoris' },
      { name: 'glasses', family: 'Ionicons', label: 'Kacamata' },
      { name: 'gift', family: 'Ionicons', label: 'Hadiah' },
      { name: 'pricetag', family: 'Ionicons', label: 'Diskon' },
      { name: 'shoe-heel', family: 'MaterialCommunityIcons', label: 'Sepatu' },
      { name: 'tshirt-crew', family: 'MaterialCommunityIcons', label: 'Kaos' },
      { name: 'lipstick', family: 'MaterialCommunityIcons', label: 'Kosmetik' },
      { name: 'shopping-music', family: 'MaterialCommunityIcons', label: 'Musik' },
      { name: 'diamond-stone', family: 'MaterialCommunityIcons', label: 'Perhiasan' },
      { name: 'store', family: 'MaterialCommunityIcons', label: 'Toko' },
    ],
  },
  {
    themeId: 'bills',
    themeName: 'Tagihan & Utilitas',
    themeIcon: 'receipt',
    icons: [
      { name: 'receipt', family: 'Ionicons', label: 'Tagihan' },
      { name: 'flash', family: 'Ionicons', label: 'Listrik' },
      { name: 'water', family: 'Ionicons', label: 'Air PDAM' },
      { name: 'wifi', family: 'Ionicons', label: 'Internet / WiFi' },
      { name: 'phone-portrait', family: 'Ionicons', label: 'Pulsa / Paket Data' },
      { name: 'tv', family: 'Ionicons', label: 'TV Kabel' },
      { name: 'home', family: 'Ionicons', label: 'Sewa Rumah / Kost' },
      { name: 'flame', family: 'Ionicons', label: 'Gas LPG' },
      { name: 'trash', family: 'Ionicons', label: 'Kebersihan' },
      { name: 'shield-checkmark', family: 'Ionicons', label: 'Asuransi' },
      { name: 'file-document-outline', family: 'MaterialCommunityIcons', label: 'Pajak' },
      { name: 'security', family: 'MaterialCommunityIcons', label: 'Iuran Keamanan' },
    ],
  },
  {
    themeId: 'entertainment',
    themeName: 'Hiburan & Hobi',
    themeIcon: 'game-controller',
    icons: [
      { name: 'game-controller', family: 'Ionicons', label: 'Game' },
      { name: 'film', family: 'Ionicons', label: 'Bioskop' },
      { name: 'musical-notes', family: 'Ionicons', label: 'Konser / Musik' },
      { name: 'camera', family: 'Ionicons', label: 'Fotografi' },
      { name: 'headset', family: 'Ionicons', label: 'Streaming' },
      { name: 'ticket', family: 'Ionicons', label: 'Tiket Rekreasi' },
      { name: 'football', family: 'Ionicons', label: 'Sepakbola' },
      { name: 'book', family: 'Ionicons', label: 'Buku / Komik' },
      { name: 'bowling', family: 'MaterialCommunityIcons', label: 'Bowling' },
      { name: 'palette', family: 'MaterialCommunityIcons', label: 'Seni' },
      { name: 'movie-open', family: 'MaterialCommunityIcons', label: 'Film' },
      { name: 'netflix', family: 'MaterialCommunityIcons', label: 'Langganan' },
    ],
  },
  {
    themeId: 'health',
    themeName: 'Kesehatan & Olahraga',
    themeIcon: 'medkit',
    icons: [
      { name: 'medkit', family: 'Ionicons', label: 'Obat / Apotek' },
      { name: 'fitness', family: 'Ionicons', label: 'Gym / Fitness' },
      { name: 'heart', family: 'Ionicons', label: 'Dokter' },
      { name: 'pulse', family: 'Ionicons', label: 'Pemeriksaan Lab' },
      { name: 'bandage', family: 'Ionicons', label: 'Perawatan' },
      { name: 'barbell', family: 'Ionicons', label: 'Alat Olahraga' },
      { name: 'eye', family: 'Ionicons', label: 'Optik' },
      { name: 'tooth-outline', family: 'MaterialCommunityIcons', label: 'Dokter Gigi' },
      { name: 'hospital-box-outline', family: 'MaterialCommunityIcons', label: 'Rumah Sakit' },
      { name: 'pill', family: 'MaterialCommunityIcons', label: 'Vitamin' },
      { name: 'spa', family: 'MaterialCommunityIcons', label: 'Pijat / Spa' },
      { name: 'run', family: 'MaterialCommunityIcons', label: 'Lari' },
    ],
  },
  {
    themeId: 'education',
    themeName: 'Pendidikan & Karir',
    themeIcon: 'school',
    icons: [
      { name: 'school', family: 'Ionicons', label: 'Sekolah / Kuliah' },
      { name: 'library', family: 'Ionicons', label: 'Perpustakaan' },
      { name: 'briefcase', family: 'Ionicons', label: 'Kantor / Pekerjaan' },
      { name: 'laptop', family: 'Ionicons', label: 'Software / Laptop' },
      { name: 'newspaper', family: 'Ionicons', label: 'Jurnal / Berita' },
      { name: 'pencil', family: 'Ionicons', label: 'Alat Tulis' },
      { name: 'certificate', family: 'MaterialCommunityIcons', label: 'Sertifikasi / Kursus' },
      { name: 'calculator', family: 'MaterialCommunityIcons', label: 'Akuntansi' },
      { name: 'desk', family: 'MaterialCommunityIcons', label: 'Meja Kerja' },
      { name: 'translate', family: 'MaterialCommunityIcons', label: 'Belajar Bahasa' },
    ],
  },
  {
    themeId: 'home',
    themeName: 'Rumah Tangga & Keluarga',
    themeIcon: 'home-outline',
    icons: [
      { name: 'bed', family: 'Ionicons', label: 'Kamar Tidur' },
      { name: 'build', family: 'Ionicons', label: 'Perbaikan Rumah' },
      { name: 'paw', family: 'Ionicons', label: 'Hewan Peliharaan' },
      { name: 'flower', family: 'Ionicons', label: 'Tanaman / Kebun' },
      { name: 'people', family: 'Ionicons', label: 'Keluarga' },
      { name: 'baby-carriage', family: 'MaterialCommunityIcons', label: 'Perlengkapan Bayi' },
      { name: 'washing-machine', family: 'MaterialCommunityIcons', label: 'Laundry' },
      { name: 'broom', family: 'MaterialCommunityIcons', label: 'Pembersih' },
      { name: 'sofa', family: 'MaterialCommunityIcons', label: 'Perabotan' },
      { name: 'hammer-wrench', family: 'MaterialCommunityIcons', label: 'Tukang' },
    ],
  },
  {
    themeId: 'income_finance',
    themeName: 'Pemasukan & Investasi',
    themeIcon: 'cash',
    icons: [
      { name: 'cash', family: 'Ionicons', label: 'Gaji Pokok' },
      { name: 'wallet', family: 'Ionicons', label: 'Dompet / Kas' },
      { name: 'card', family: 'Ionicons', label: 'Bonus / THR' },
      { name: 'trending-up', family: 'Ionicons', label: 'Investasi' },
      { name: 'business', family: 'Ionicons', label: 'Bisnis / Usaha' },
      { name: 'trophy', family: 'Ionicons', label: 'Hadiah / Lomba' },
      { name: 'pie-chart', family: 'Ionicons', label: 'Dividen' },
      { name: 'gold', family: 'MaterialCommunityIcons', label: 'Emas / Logam Mulia' },
      { name: 'bitcoin', family: 'MaterialCommunityIcons', label: 'Kripto' },
      { name: 'chart-line', family: 'MaterialCommunityIcons', label: 'Saham' },
      { name: 'piggy-bank', family: 'MaterialCommunityIcons', label: 'Tabungan' },
      { name: 'hand-coin', family: 'MaterialCommunityIcons', label: 'Royalti' },
      { name: 'cash-refund', family: 'MaterialCommunityIcons', label: 'Cashback' },
    ],
  },
  {
    themeId: 'misc',
    themeName: 'Sosial & Lain-lain',
    themeIcon: 'ellipsis-horizontal-circle',
    icons: [
      { name: 'heart-circle', family: 'Ionicons', label: 'Sedekah / Donasi' },
      { name: 'airplane-outline', family: 'Ionicons', label: 'Liburan' },
      { name: 'help-circle', family: 'Ionicons', label: 'Lain-lain' },
      { name: 'alert-circle', family: 'Ionicons', label: 'Pengeluaran Darurat' },
      { name: 'sparkles', family: 'Ionicons', label: 'Spesial' },
      { name: 'hand-heart', family: 'MaterialCommunityIcons', label: 'Zakat / Amal' },
      { name: 'gift-outline', family: 'MaterialCommunityIcons', label: 'Angpao / THR' },
      { name: 'account-cash', family: 'MaterialCommunityIcons', label: 'Pinjaman' },
      { name: 'swap-horizontal', family: 'Ionicons', label: 'Transfer Saldo' },
    ],
  },
];

export function getAllIcons(): IconItem[] {
  const all: IconItem[] = [];
  ICON_GALLERY_THEMES.forEach((theme) => {
    theme.icons.forEach((icon) => {
      if (!all.some((item) => item.name === icon.name && item.family === icon.family)) {
        all.push(icon);
      }
    });
  });
  return all;
}
