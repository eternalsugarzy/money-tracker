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
  '#2EC4B6', // Turquoise
  '#E71D36', // Coral Red
  '#FF9F1C', // Tangerine
  '#70E000', // Chartreuse
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
      { name: 'beer', family: 'Ionicons', label: 'Minuman Dingin' },
      { name: 'wine', family: 'Ionicons', label: 'Bar & Wine' },
      { name: 'nutrition', family: 'Ionicons', label: 'Buah Segar' },
      { name: 'ice-cream', family: 'Ionicons', label: 'Es Krim' },
      { name: 'fish', family: 'Ionicons', label: 'Seafood' },
      { name: 'egg', family: 'Ionicons', label: 'Sarapan' },
      { name: 'food-croissant', family: 'MaterialCommunityIcons', label: 'Roti & Pastry' },
      { name: 'noodles', family: 'MaterialCommunityIcons', label: 'Mie / Bakso' },
      { name: 'cupcake', family: 'MaterialCommunityIcons', label: 'Kue / Dessert' },
      { name: 'cookie', family: 'MaterialCommunityIcons', label: 'Biskuit / Snack' },
      { name: 'pot-steam', family: 'MaterialCommunityIcons', label: 'Masak Sendiri' },
      { name: 'silverware-fork-knife', family: 'MaterialCommunityIcons', label: 'Makan Siang' },
      { name: 'hamburger', family: 'MaterialCommunityIcons', label: 'Burger' },
      { name: 'popcorn', family: 'MaterialCommunityIcons', label: 'Camilan Nonton' },
      { name: 'bread-slice', family: 'MaterialCommunityIcons', label: 'Roti Tawar' },
      { name: 'glass-cocktail', family: 'MaterialCommunityIcons', label: 'Jus / Mocktail' },
      { name: 'tea', family: 'MaterialCommunityIcons', label: 'Teh Hangat' },
      { name: 'food-drumstick', family: 'MaterialCommunityIcons', label: 'Ayam Goreng' },
      { name: 'fruit-watermelon', family: 'MaterialCommunityIcons', label: 'Semangka / Buah' },
      { name: 'bowl-mix', family: 'MaterialCommunityIcons', label: 'Salad / Sup' },
    ],
  },
  {
    themeId: 'transport',
    themeName: 'Transportasi',
    themeIcon: 'car',
    icons: [
      { name: 'car', family: 'Ionicons', label: 'Mobil' },
      { name: 'bus', family: 'Ionicons', label: 'Bus / Angkot' },
      { name: 'airplane', family: 'Ionicons', label: 'Pesawat' },
      { name: 'bicycle', family: 'Ionicons', label: 'Sepeda' },
      { name: 'train', family: 'Ionicons', label: 'Kereta / KRL' },
      { name: 'boat', family: 'Ionicons', label: 'Kapal Laut' },
      { name: 'subway', family: 'Ionicons', label: 'MRT / LRT' },
      { name: 'walk', family: 'Ionicons', label: 'Jalan Kaki' },
      { name: 'speedometer', family: 'Ionicons', label: 'Kecepatan' },
      { name: 'car-sport', family: 'Ionicons', label: 'Mobil Sport' },
      { name: 'motorbike', family: 'MaterialCommunityIcons', label: 'Motor / Ojol' },
      { name: 'gas-station', family: 'MaterialCommunityIcons', label: 'Bensin / BBM' },
      { name: 'taxi', family: 'MaterialCommunityIcons', label: 'Taksi' },
      { name: 'scooter', family: 'MaterialCommunityIcons', label: 'Skuter Listrik' },
      { name: 'car-wrench', family: 'MaterialCommunityIcons', label: 'Servis Kendaraan' },
      { name: 'parking', family: 'MaterialCommunityIcons', label: 'Parkir' },
      { name: 'car-wash', family: 'MaterialCommunityIcons', label: 'Cuci Mobil/Motor' },
      { name: 'road-variant', family: 'MaterialCommunityIcons', label: 'Tol / Perjalanan' },
      { name: 'oil', family: 'MaterialCommunityIcons', label: 'Ganti Oli' },
      { name: 'tire', family: 'MaterialCommunityIcons', label: 'Ban & Velg' },
    ],
  },
  {
    themeId: 'shopping',
    themeName: 'Belanja & Retail',
    themeIcon: 'cart',
    icons: [
      { name: 'cart', family: 'Ionicons', label: 'Troli Belanja' },
      { name: 'bag-handle', family: 'Ionicons', label: 'Tas Belanja' },
      { name: 'pricetag', family: 'Ionicons', label: 'Diskon' },
      { name: 'gift', family: 'Ionicons', label: 'Kado & Hadiah' },
      { name: 'shirt', family: 'Ionicons', label: 'Pakaian' },
      { name: 'watch', family: 'Ionicons', label: 'Jam Tangan' },
      { name: 'basket', family: 'Ionicons', label: 'Keranjang' },
      { name: 'barcode', family: 'Ionicons', label: 'Scan Belanja' },
      { name: 'glasses', family: 'Ionicons', label: 'Kacamata' },
      { name: 'sparkles', family: 'Ionicons', label: 'Barang Mewah' },
      { name: 'shopping', family: 'MaterialCommunityIcons', label: 'Supermarket' },
      { name: 'storefront', family: 'MaterialCommunityIcons', label: 'Toko Kelontong' },
      { name: 'tshirt-crew', family: 'MaterialCommunityIcons', label: 'Kaos & Baju' },
      { name: 'shoe-sneaker', family: 'MaterialCommunityIcons', label: 'Sepatu' },
      { name: 'shoe-heel', family: 'MaterialCommunityIcons', label: 'Sepatu Hak' },
      { name: 'hanger', family: 'MaterialCommunityIcons', label: 'Outfit' },
      { name: 'diamond-stone', family: 'MaterialCommunityIcons', label: 'Perhiasan' },
      { name: 'lipstick', family: 'MaterialCommunityIcons', label: 'Skincare & Makeup' },
      { name: 'handbag', family: 'MaterialCommunityIcons', label: 'Tas Kulit' },
      { name: 'tag-multiple', family: 'MaterialCommunityIcons', label: 'Promo Spesial' },
      { name: 'sale', family: 'MaterialCommunityIcons', label: 'Flash Sale' },
      { name: 'package-variant-closed', family: 'MaterialCommunityIcons', label: 'Paket / Kurir' },
    ],
  },
  {
    themeId: 'bills',
    themeName: 'Tagihan & Utilitas',
    themeIcon: 'flash',
    icons: [
      { name: 'flash', family: 'Ionicons', label: 'Listrik / PLN' },
      { name: 'water', family: 'Ionicons', label: 'Air / PDAM' },
      { name: 'wifi', family: 'Ionicons', label: 'Internet / Wifi' },
      { name: 'tv', family: 'Ionicons', label: 'TV Kabel' },
      { name: 'home', family: 'Ionicons', label: 'Sewa / Kos' },
      { name: 'key', family: 'Ionicons', label: 'Kunci Rumah' },
      { name: 'build', family: 'Ionicons', label: 'Perbaikan Rumah' },
      { name: 'hammer', family: 'Ionicons', label: 'Renovasi' },
      { name: 'bulb', family: 'Ionicons', label: 'Penerangan' },
      { name: 'flame', family: 'Ionicons', label: 'Gas LPG' },
      { name: 'trash', family: 'Ionicons', label: 'Kebersihan' },
      { name: 'shield-checkmark', family: 'Ionicons', label: 'Iuran Keamanan' },
      { name: 'cellphone', family: 'MaterialCommunityIcons', label: 'Pulsa & Kuota' },
      { name: 'washing-machine', family: 'MaterialCommunityIcons', label: 'Laundry' },
      { name: 'router-wireless', family: 'MaterialCommunityIcons', label: 'Indihome / Biznet' },
      { name: 'air-conditioner', family: 'MaterialCommunityIcons', label: 'Servis AC' },
      { name: 'broom', family: 'MaterialCommunityIcons', label: 'Peralatan Bersih' },
      { name: 'fire-truck', family: 'MaterialCommunityIcons', label: 'Asuransi Properti' },
    ],
  },
  {
    themeId: 'entertainment',
    themeName: 'Hiburan & Hobi',
    themeIcon: 'game-controller',
    icons: [
      { name: 'game-controller', family: 'Ionicons', label: 'Video Game' },
      { name: 'film', family: 'Ionicons', label: 'Bioskop / Film' },
      { name: 'musical-notes', family: 'Ionicons', label: 'Musik & Spotify' },
      { name: 'headset', family: 'Ionicons', label: 'Headphone' },
      { name: 'camera', family: 'Ionicons', label: 'Fotografi' },
      { name: 'videocam', family: 'Ionicons', label: 'Streaming' },
      { name: 'football', family: 'Ionicons', label: 'Sepak Bola' },
      { name: 'basketball', family: 'Ionicons', label: 'Basket' },
      { name: 'tennisball', family: 'Ionicons', label: 'Tenis' },
      { name: 'trophy', family: 'Ionicons', label: 'Turnamen' },
      { name: 'color-palette', family: 'Ionicons', label: 'Melukis / Seni' },
      { name: 'mic', family: 'Ionicons', label: 'Karaoke' },
      { name: 'ticket', family: 'MaterialCommunityIcons', label: 'Tiket Konser' },
      { name: 'cards-playing', family: 'MaterialCommunityIcons', label: 'Board Games' },
      { name: 'dice-5', family: 'MaterialCommunityIcons', label: 'Permainan' },
      { name: 'guitar-acoustic', family: 'MaterialCommunityIcons', label: 'Gitar' },
      { name: 'piano', family: 'MaterialCommunityIcons', label: 'Piano / Musik' },
      { name: 'bowling', family: 'MaterialCommunityIcons', label: 'Bowling' },
      { name: 'party-popper', family: 'MaterialCommunityIcons', label: 'Pesta & Liburan' },
      { name: 'youtube', family: 'MaterialCommunityIcons', label: 'Langganan YouTube' },
      { name: 'netflix', family: 'MaterialCommunityIcons', label: 'Langganan Netflix' },
      { name: 'badminton', family: 'MaterialCommunityIcons', label: 'Badminton' },
      { name: 'billiards', family: 'MaterialCommunityIcons', label: 'Biliar' },
    ],
  },
  {
    themeId: 'health',
    themeName: 'Kesehatan & Olahraga',
    themeIcon: 'medkit',
    icons: [
      { name: 'medkit', family: 'Ionicons', label: 'Kotak P3K' },
      { name: 'bandage', family: 'Ionicons', label: 'Pengobatan' },
      { name: 'fitness', family: 'Ionicons', label: 'Gym & Fitness' },
      { name: 'heart', family: 'Ionicons', label: 'Cek Jantung' },
      { name: 'pulse', family: 'Ionicons', label: 'Kesehatan Umum' },
      { name: 'body', family: 'Ionicons', label: 'Postur & Fisik' },
      { name: 'thermometer', family: 'Ionicons', label: 'Demam / Dokter' },
      { name: 'pill', family: 'MaterialCommunityIcons', label: 'Obat & Vitamin' },
      { name: 'hospital-box', family: 'MaterialCommunityIcons', label: 'Rumah Sakit' },
      { name: 'doctor', family: 'MaterialCommunityIcons', label: 'Konsultasi Dokter' },
      { name: 'needle', family: 'MaterialCommunityIcons', label: 'Vaksin / Suntik' },
      { name: 'tooth', family: 'MaterialCommunityIcons', label: 'Dokter Gigi' },
      { name: 'eye', family: 'MaterialCommunityIcons', label: 'Dokter Mata' },
      { name: 'run', family: 'MaterialCommunityIcons', label: 'Jogging / Lari' },
      { name: 'swim', family: 'MaterialCommunityIcons', label: 'Berenang' },
      { name: 'dumbbell', family: 'MaterialCommunityIcons', label: 'Angkat Beban' },
      { name: 'yoga', family: 'MaterialCommunityIcons', label: 'Yoga & Meditasi' },
      { name: 'emoticon-happy-outline', family: 'MaterialCommunityIcons', label: 'Kesehatan Mental' },
    ],
  },
  {
    themeId: 'education',
    themeName: 'Pendidikan & Karir',
    themeIcon: 'school',
    icons: [
      { name: 'school', family: 'Ionicons', label: 'Sekolah / Kampus' },
      { name: 'book', family: 'Ionicons', label: 'Buku & Majalah' },
      { name: 'briefcase', family: 'Ionicons', label: 'Pekerjaan' },
      { name: 'library', family: 'Ionicons', label: 'Perpustakaan' },
      { name: 'calculator', family: 'Ionicons', label: 'Kalkulator' },
      { name: 'clipboard', family: 'Ionicons', label: 'Tugas / Ujian' },
      { name: 'pencil', family: 'Ionicons', label: 'Alat Tulis' },
      { name: 'attach', family: 'Ionicons', label: 'Berkas' },
      { name: 'document-text', family: 'Ionicons', label: 'Modul / Sertifikat' },
      { name: 'folder', family: 'Ionicons', label: 'Arsip Dokumen' },
      { name: 'notebook', family: 'MaterialCommunityIcons', label: 'Buku Catatan' },
      { name: 'pen', family: 'MaterialCommunityIcons', label: 'Pulpen Mewah' },
      { name: 'certificate', family: 'MaterialCommunityIcons', label: 'Kursus Online' },
      { name: 'desk', family: 'MaterialCommunityIcons', label: 'Meja Kerja' },
      { name: 'backpack', family: 'MaterialCommunityIcons', label: 'Tas Sekolah' },
      { name: 'laptop', family: 'MaterialCommunityIcons', label: 'Laptop & Software' },
      { name: 'presentation', family: 'MaterialCommunityIcons', label: 'Pelatihan / Seminar' },
    ],
  },
  {
    themeId: 'finance',
    themeName: 'Keuangan & Pendapatan',
    themeIcon: 'cash',
    icons: [
      { name: 'cash', family: 'Ionicons', label: 'Uang Tunai' },
      { name: 'wallet', family: 'Ionicons', label: 'Dompet' },
      { name: 'card', family: 'Ionicons', label: 'Kartu Debit/Kredit' },
      { name: 'trending-up', family: 'Ionicons', label: 'Keuntungan Saham' },
      { name: 'trending-down', family: 'Ionicons', label: 'Kerugian' },
      { name: 'stats-chart', family: 'Ionicons', label: 'Analisis Finansial' },
      { name: 'pie-chart', family: 'Ionicons', label: 'Portofolio' },
      { name: 'swap-vertical', family: 'Ionicons', label: 'Mutasi Rekening' },
      { name: 'bank', family: 'MaterialCommunityIcons', label: 'Bank & Bunga' },
      { name: 'piggy-bank', family: 'MaterialCommunityIcons', label: 'Tabungan Celengan' },
      { name: 'finance', family: 'MaterialCommunityIcons', label: 'Pasar Modal' },
      { name: 'gold', family: 'MaterialCommunityIcons', label: 'Emas Logam Mulia' },
      { name: 'currency-usd', family: 'MaterialCommunityIcons', label: 'Valuta Asing' },
      { name: 'bitcoin', family: 'MaterialCommunityIcons', label: 'Kripto' },
      { name: 'safe', family: 'MaterialCommunityIcons', label: 'Brankas' },
      { name: 'hand-coin', family: 'MaterialCommunityIcons', label: 'Gaji & Honor' },
      { name: 'scale-balance', family: 'MaterialCommunityIcons', label: 'Neraca Keuangan' },
    ],
  },
  {
    themeId: 'family',
    themeName: 'Keluarga, Anak & Hewan',
    themeIcon: 'heart',
    icons: [
      { name: 'people', family: 'Ionicons', label: 'Keluarga' },
      { name: 'person', family: 'Ionicons', label: 'Pribadi' },
      { name: 'paw', family: 'Ionicons', label: 'Hewan Peliharaan' },
      { name: 'happy', family: 'Ionicons', label: 'Anak-anak' },
      { name: 'flower', family: 'Ionicons', label: 'Tanaman Hias' },
      { name: 'baby-carriage', family: 'MaterialCommunityIcons', label: 'Perlengkapan Bayi' },
      { name: 'baby-bottle', family: 'MaterialCommunityIcons', label: 'Susu Formula' },
      { name: 'dog', family: 'MaterialCommunityIcons', label: 'Anjing / Vet' },
      { name: 'cat', family: 'MaterialCommunityIcons', label: 'Kucing / Vet' },
      { name: 'teddy-bear', family: 'MaterialCommunityIcons', label: 'Mainan Anak' },
      { name: 'home-heart', family: 'MaterialCommunityIcons', label: 'Orang Tua' },
      { name: 'human-male-female-child', family: 'MaterialCommunityIcons', label: 'Nafkah Keluarga' },
    ],
  },
  {
    themeId: 'social_lifestyle',
    themeName: 'Sosial, Ibadah & Gaya Hidup',
    themeIcon: 'star',
    icons: [
      { name: 'star', family: 'Ionicons', label: 'Favorit' },
      { name: 'globe', family: 'Ionicons', label: 'Traveling' },
      { name: 'chatbubble-ellipses', family: 'Ionicons', label: 'Nongkrong' },
      { name: 'notifications', family: 'Ionicons', label: 'Pengingat' },
      { name: 'ellipsis-horizontal-circle', family: 'Ionicons', label: 'Lain-lain' },
      { name: 'cloud', family: 'Ionicons', label: 'Cloud Storage' },
      { name: 'charity', family: 'MaterialCommunityIcons', label: 'Zakat & Donasi' },
      { name: 'hand-heart', family: 'MaterialCommunityIcons', label: 'Sedekah / Infaq' },
      { name: 'mosque', family: 'MaterialCommunityIcons', label: 'Ibadah / Masjid' },
      { name: 'church', family: 'MaterialCommunityIcons', label: 'Gereja' },
      { name: 'cake-variant', family: 'MaterialCommunityIcons', label: 'Ulang Tahun' },
      { name: 'diamond', family: 'MaterialCommunityIcons', label: 'Gaya Hidup' },
      { name: 'crown', family: 'MaterialCommunityIcons', label: 'VIP / Membership' },
      { name: 'compass', family: 'MaterialCommunityIcons', label: 'Petualangan / Trip' },
    ],
  },
];
