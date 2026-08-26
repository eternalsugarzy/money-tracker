// Seed data generated directly from user Money+ authentic backup
export interface SeedTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  account_id: string;
  to_account_id: string | null;
  category_id: string | null;
  note: string;
}

export const SEED_ACCOUNTS = [
  {
    "id": "acc_bri",
    "name": "BRI",
    "type": "Bank",
    "initial_balance": 0,
    "current_balance": 1920000,
    "icon": "card",
    "icon_family": "Ionicons",
    "color": "#00529C"
  },
  {
    "id": "acc_cash",
    "name": "UANG CASH",
    "type": "Cash",
    "initial_balance": 0,
    "current_balance": 24000,
    "icon": "cash",
    "icon_family": "Ionicons",
    "color": "#54E346"
  },
  {
    "id": "acc_seabank",
    "name": "Sea Bank",
    "type": "Bank",
    "initial_balance": 0,
    "current_balance": 0,
    "icon": "wallet",
    "icon_family": "Ionicons",
    "color": "#FF5722"
  }
];

export const SEED_CATEGORIES = [
  {
    "id": "cat_makan",
    "name": "Food (Makanan)",
    "type": "expense",
    "icon": "restaurant",
    "color": "#FF5D8F"
  },
  {
    "id": "cat_cemilan",
    "name": "Cemal Cemil",
    "type": "expense",
    "icon": "pizza",
    "color": "#FF9E00"
  },
  {
    "id": "cat_nongkrong",
    "name": "Nongkrongs",
    "type": "expense",
    "icon": "cafe",
    "color": "#FF7A00"
  },
  {
    "id": "cat_parkir",
    "name": "Ojol, Parkir",
    "type": "expense",
    "icon": "car",
    "color": "#00F0FF"
  },
  {
    "id": "cat_bahan_makan",
    "name": "Foodstuffs (Bahan Makanan)",
    "type": "expense",
    "icon": "basket",
    "color": "#52B788"
  },
  {
    "id": "cat_rumah",
    "name": "House needs (Kost & Rumah)",
    "type": "expense",
    "icon": "home",
    "color": "#3A86FF"
  },
  {
    "id": "cat_bensin",
    "name": "Bensin",
    "type": "expense",
    "icon": "speedometer",
    "color": "#FFE600"
  },
  {
    "id": "cat_olahraga",
    "name": "Olahraga",
    "type": "expense",
    "icon": "football",
    "color": "#54E346"
  },
  {
    "id": "cat_motor",
    "name": "Perawatan Motor",
    "type": "expense",
    "icon": "construct",
    "color": "#8338EC"
  },
  {
    "id": "cat_trinity_exp",
    "name": "TRINITY SCENT (Modal)",
    "type": "expense",
    "icon": "sparkles",
    "color": "#D90429"
  },
  {
    "id": "cat_trinity_inc",
    "name": "Trinity Scents (Penjualan)",
    "type": "income",
    "icon": "sparkles",
    "color": "#D90429"
  },
  {
    "id": "cat_random",
    "name": "Random Stuff",
    "type": "expense",
    "icon": "cube",
    "color": "#A06CD5"
  },
  {
    "id": "cat_hiburan",
    "name": "Hiburan & Rekreasi",
    "type": "expense",
    "icon": "game-controller",
    "color": "#A06CD5"
  },
  {
    "id": "cat_pet",
    "name": "Hewan Peliharaan (Pet)",
    "type": "expense",
    "icon": "paw",
    "color": "#FF9E00"
  },
  {
    "id": "cat_komunikasi",
    "name": "Komunikasi & Pulsa",
    "type": "expense",
    "icon": "phone-portrait",
    "color": "#00F0FF"
  },
  {
    "id": "cat_pendidikan",
    "name": "Pendidikan (Kuliah & Wisuda)",
    "type": "expense",
    "icon": "school",
    "color": "#3A86FF"
  },
  {
    "id": "cat_perawatan",
    "name": "Perawatan Diri & Parfum",
    "type": "expense",
    "icon": "flower",
    "color": "#FF3366"
  },
  {
    "id": "cat_tagihan",
    "name": "Pajak & Tagihan",
    "type": "expense",
    "icon": "receipt",
    "color": "#6C757D"
  },
  {
    "id": "cat_pakaian",
    "name": "Pakaian & Fashion",
    "type": "expense",
    "icon": "shirt",
    "color": "#FF5D8F"
  },
  {
    "id": "cat_hadiah",
    "name": "Hadiah & Donasi",
    "type": "expense",
    "icon": "gift",
    "color": "#FF7A00"
  },
  {
    "id": "cat_travel",
    "name": "Perjalanan & Travel",
    "type": "expense",
    "icon": "airplane",
    "color": "#00B4D8"
  },
  {
    "id": "cat_ortu",
    "name": "Mingguan Ortu",
    "type": "income",
    "icon": "cash",
    "color": "#54E346"
  },
  {
    "id": "cat_bonus",
    "name": "Bonus",
    "type": "income",
    "icon": "trophy",
    "color": "#FFE600"
  },
  {
    "id": "cat_freelance",
    "name": "Part-time Job",
    "type": "income",
    "icon": "briefcase",
    "color": "#00F0FF"
  },
  {
    "id": "cat_lainnya",
    "name": "Lain-lain",
    "type": "all",
    "icon": "ellipsis-horizontal-circle",
    "color": "#8338EC"
  }
];

export const SEED_TRANSACTIONS: SeedTransaction[] = [
  {
    "id": "tx_mp_1",
    "date": "2026-01-06",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_2",
    "date": "2026-01-06",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tengah hari coffee"
  },
  {
    "id": "tx_mp_3",
    "date": "2026-01-06",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "basedata.wage"
  },
  {
    "id": "tx_mp_4",
    "date": "2026-01-06",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_5",
    "date": "2026-01-06",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur"
  },
  {
    "id": "tx_mp_6",
    "date": "2026-01-06",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "mentos"
  },
  {
    "id": "tx_mp_7",
    "date": "2026-01-07",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "isi ulang galon"
  },
  {
    "id": "tx_mp_8",
    "date": "2026-01-07",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "chicken pok pok"
  },
  {
    "id": "tx_mp_9",
    "date": "2026-01-07",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "mentos"
  },
  {
    "id": "tx_mp_10",
    "date": "2026-01-07",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_11",
    "date": "2026-01-07",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_12",
    "date": "2026-01-07",
    "type": "expense",
    "amount": 22000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "nordu coffee"
  },
  {
    "id": "tx_mp_13",
    "date": "2026-01-07",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_14",
    "date": "2026-01-08",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_15",
    "date": "2026-01-08",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_hiburan",
    "note": "domino"
  },
  {
    "id": "tx_mp_16",
    "date": "2026-01-09",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "wet food"
  },
  {
    "id": "tx_mp_17",
    "date": "2026-01-09",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol pemko"
  },
  {
    "id": "tx_mp_18",
    "date": "2026-01-09",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol goreng"
  },
  {
    "id": "tx_mp_19",
    "date": "2026-01-09",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "minum"
  },
  {
    "id": "tx_mp_20",
    "date": "2026-01-09",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "basedata.wage"
  },
  {
    "id": "tx_mp_21",
    "date": "2026-01-10",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_22",
    "date": "2026-01-10",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek hksn"
  },
  {
    "id": "tx_mp_23",
    "date": "2026-01-10",
    "type": "expense",
    "amount": 34000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur, beras, mie instant"
  },
  {
    "id": "tx_mp_24",
    "date": "2026-01-10",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "soto ayam cak hari"
  },
  {
    "id": "tx_mp_25",
    "date": "2026-01-11",
    "type": "expense",
    "amount": 16000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol goreng gatsu"
  },
  {
    "id": "tx_mp_26",
    "date": "2026-01-12",
    "type": "income",
    "amount": 400000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "basedata.wage"
  },
  {
    "id": "tx_mp_27",
    "date": "2026-01-12",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "tempered glass, case"
  },
  {
    "id": "tx_mp_28",
    "date": "2026-01-12",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_29",
    "date": "2026-01-12",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_30",
    "date": "2026-01-12",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_31",
    "date": "2026-01-12",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_32",
    "date": "2026-01-12",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_33",
    "date": "2026-01-13",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pukis laba laba"
  },
  {
    "id": "tx_mp_34",
    "date": "2026-01-13",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tengah hari coffee"
  },
  {
    "id": "tx_mp_35",
    "date": "2026-01-13",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_36",
    "date": "2026-01-13",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie gacoan"
  },
  {
    "id": "tx_mp_37",
    "date": "2026-01-13",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_38",
    "date": "2026-01-14",
    "type": "expense",
    "amount": 7000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pukis laba laba"
  },
  {
    "id": "tx_mp_39",
    "date": "2026-01-14",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es sirup jumbo"
  },
  {
    "id": "tx_mp_40",
    "date": "2026-01-15",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_41",
    "date": "2026-01-15",
    "type": "expense",
    "amount": 39000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur, minyak, kecap"
  },
  {
    "id": "tx_mp_42",
    "date": "2026-01-15",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "gas portable"
  },
  {
    "id": "tx_mp_43",
    "date": "2026-01-16",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tengah hari coffee"
  },
  {
    "id": "tx_mp_44",
    "date": "2026-01-16",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_45",
    "date": "2026-01-16",
    "type": "expense",
    "amount": 22000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_46",
    "date": "2026-01-16",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_47",
    "date": "2026-01-17",
    "type": "income",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_48",
    "date": "2026-01-18",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_49",
    "date": "2026-01-18",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "seblak nr sabila"
  },
  {
    "id": "tx_mp_50",
    "date": "2026-01-18",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_51",
    "date": "2026-01-18",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pendidikan",
    "note": "print"
  },
  {
    "id": "tx_mp_52",
    "date": "2026-01-18",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur, tempe, bawang"
  },
  {
    "id": "tx_mp_53",
    "date": "2026-01-18",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "beras"
  },
  {
    "id": "tx_mp_61",
    "date": "2026-01-18",
    "type": "expense",
    "amount": 33000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "circle k"
  },
  {
    "id": "tx_mp_54",
    "date": "2026-01-19",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "wifi kos"
  },
  {
    "id": "tx_mp_55",
    "date": "2026-01-19",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_random",
    "note": "kapitan"
  },
  {
    "id": "tx_mp_56",
    "date": "2026-01-19",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_57",
    "date": "2026-01-19",
    "type": "expense",
    "amount": 1000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "es batu"
  },
  {
    "id": "tx_mp_58",
    "date": "2026-01-19",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_59",
    "date": "2026-01-19",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_60",
    "date": "2026-01-19",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol goreng gatsu"
  },
  {
    "id": "tx_mp_67",
    "date": "2026-01-20",
    "type": "income",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_62",
    "date": "2026-01-21",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "bengbeng"
  },
  {
    "id": "tx_mp_63",
    "date": "2026-01-21",
    "type": "expense",
    "amount": 9000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_olahraga",
    "note": "badminton"
  },
  {
    "id": "tx_mp_64",
    "date": "2026-01-21",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "es batu"
  },
  {
    "id": "tx_mp_68",
    "date": "2026-01-21",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_69",
    "date": "2026-01-21",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "potong rambut"
  },
  {
    "id": "tx_mp_70",
    "date": "2026-01-21",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_71",
    "date": "2026-01-21",
    "type": "expense",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hiburan",
    "note": "tiket konser"
  },
  {
    "id": "tx_mp_65",
    "date": "2026-01-22",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tengah hari coffee"
  },
  {
    "id": "tx_mp_66",
    "date": "2026-01-22",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_72",
    "date": "2026-01-22",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_73",
    "date": "2026-01-22",
    "type": "expense",
    "amount": 16000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi goreng cah solo"
  },
  {
    "id": "tx_mp_74",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek hksn"
  },
  {
    "id": "tx_mp_75",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_76",
    "date": "2026-01-23",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_77",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hiburan",
    "note": "konser"
  },
  {
    "id": "tx_mp_78",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "pulsa"
  },
  {
    "id": "tx_mp_79",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_80",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "donasi"
  },
  {
    "id": "tx_mp_81",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi kuning handil bakti"
  },
  {
    "id": "tx_mp_82",
    "date": "2026-01-23",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "bengbeng"
  },
  {
    "id": "tx_mp_84",
    "date": "2026-01-24",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur, mie"
  },
  {
    "id": "tx_mp_85",
    "date": "2026-01-24",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "batagor"
  },
  {
    "id": "tx_mp_86",
    "date": "2026-01-24",
    "type": "expense",
    "amount": 1000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "es batu"
  },
  {
    "id": "tx_mp_87",
    "date": "2026-01-24",
    "type": "expense",
    "amount": 45000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi kuning handil bakti"
  },
  {
    "id": "tx_mp_88",
    "date": "2026-01-24",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "shopee"
  },
  {
    "id": "tx_mp_89",
    "date": "2026-01-24",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_90",
    "date": "2026-01-24",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_91",
    "date": "2026-01-26",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "wet food, dry food"
  },
  {
    "id": "tx_mp_92",
    "date": "2026-01-26",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "cemilan random"
  },
  {
    "id": "tx_mp_93",
    "date": "2026-01-27",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_94",
    "date": "2026-01-27",
    "type": "expense",
    "amount": 12000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek midodari"
  },
  {
    "id": "tx_mp_95",
    "date": "2026-01-28",
    "type": "expense",
    "amount": 23000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "paijo"
  },
  {
    "id": "tx_mp_96",
    "date": "2026-01-28",
    "type": "expense",
    "amount": 19000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "cemilan anugerah"
  },
  {
    "id": "tx_mp_97",
    "date": "2026-01-28",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_98",
    "date": "2026-01-28",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "es batu"
  },
  {
    "id": "tx_mp_99",
    "date": "2026-01-29",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tengah hari coffee"
  },
  {
    "id": "tx_mp_100",
    "date": "2026-01-29",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_101",
    "date": "2026-01-29",
    "type": "expense",
    "amount": 11000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "laundry"
  },
  {
    "id": "tx_mp_102",
    "date": "2026-01-29",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol"
  },
  {
    "id": "tx_mp_103",
    "date": "2026-01-30",
    "type": "expense",
    "amount": 40000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "paijo"
  },
  {
    "id": "tx_mp_111",
    "date": "2026-01-30",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek midodari"
  },
  {
    "id": "tx_mp_113",
    "date": "2026-01-30",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_bonus",
    "note": "basedata.bonus"
  },
  {
    "id": "tx_mp_104",
    "date": "2026-01-31",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_105",
    "date": "2026-01-31",
    "type": "expense",
    "amount": 29000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur, beras"
  },
  {
    "id": "tx_mp_106",
    "date": "2026-01-31",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_107",
    "date": "2026-01-31",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "utang yopi"
  },
  {
    "id": "tx_mp_108",
    "date": "2026-01-31",
    "type": "expense",
    "amount": 46000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bebek sinjay"
  },
  {
    "id": "tx_mp_109",
    "date": "2026-01-31",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_110",
    "date": "2026-01-31",
    "type": "income",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_117",
    "date": "2026-01-31",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "angkringan lc"
  },
  {
    "id": "tx_mp_118",
    "date": "2026-01-31",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_112",
    "date": "2026-02-01",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_114",
    "date": "2026-02-01",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_115",
    "date": "2026-02-01",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "gas portable"
  },
  {
    "id": "tx_mp_116",
    "date": "2026-02-01",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek midodari"
  },
  {
    "id": "tx_mp_119",
    "date": "2026-02-02",
    "type": "income",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_bonus",
    "note": "piutang"
  },
  {
    "id": "tx_mp_120",
    "date": "2026-02-02",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_121",
    "date": "2026-02-02",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "kubiek coffee"
  },
  {
    "id": "tx_mp_122",
    "date": "2026-02-02",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_123",
    "date": "2026-02-02",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_124",
    "date": "2026-02-02",
    "type": "expense",
    "amount": 40000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bebek sinjay"
  },
  {
    "id": "tx_mp_125",
    "date": "2026-02-02",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_126",
    "date": "2026-02-02",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_127",
    "date": "2026-02-02",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "kopi kenangan"
  },
  {
    "id": "tx_mp_128",
    "date": "2026-02-02",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "tissue"
  },
  {
    "id": "tx_mp_129",
    "date": "2026-02-04",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "rehat kopi"
  },
  {
    "id": "tx_mp_130",
    "date": "2026-02-04",
    "type": "expense",
    "amount": 16000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "pasir"
  },
  {
    "id": "tx_mp_131",
    "date": "2026-02-04",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol pemko"
  },
  {
    "id": "tx_mp_132",
    "date": "2026-02-04",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "isi ulang galon"
  },
  {
    "id": "tx_mp_133",
    "date": "2026-02-05",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_134",
    "date": "2026-02-05",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "modal"
  },
  {
    "id": "tx_mp_135",
    "date": "2026-02-05",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_136",
    "date": "2026-02-05",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tengah hari coffee"
  },
  {
    "id": "tx_mp_137",
    "date": "2026-02-05",
    "type": "expense",
    "amount": 1000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_138",
    "date": "2026-02-05",
    "type": "expense",
    "amount": 75000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mcdonalds"
  },
  {
    "id": "tx_mp_139",
    "date": "2026-02-05",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_cash",
    "to_account_id": "acc_bri",
    "category_id": null,
    "note": "BRI"
  },
  {
    "id": "tx_mp_143",
    "date": "2026-02-05",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_144",
    "date": "2026-02-05",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_145",
    "date": "2026-02-05",
    "type": "expense",
    "amount": 13000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi goreng cah solo"
  },
  {
    "id": "tx_mp_140",
    "date": "2026-02-06",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_141",
    "date": "2026-02-06",
    "type": "expense",
    "amount": 26000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "modal"
  },
  {
    "id": "tx_mp_142",
    "date": "2026-02-06",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_146",
    "date": "2026-02-06",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol"
  },
  {
    "id": "tx_mp_147",
    "date": "2026-02-06",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "angkringan pak lik"
  },
  {
    "id": "tx_mp_148",
    "date": "2026-02-06",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "angkringan pak lik"
  },
  {
    "id": "tx_mp_149",
    "date": "2026-02-06",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_180",
    "date": "2026-02-06",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_150",
    "date": "2026-02-07",
    "type": "expense",
    "amount": 22000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol pemko"
  },
  {
    "id": "tx_mp_151",
    "date": "2026-02-09",
    "type": "transfer",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_152",
    "date": "2026-02-09",
    "type": "income",
    "amount": 600000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_153",
    "date": "2026-02-09",
    "type": "expense",
    "amount": 80000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "pasir, dry food, vitamin"
  },
  {
    "id": "tx_mp_154",
    "date": "2026-02-09",
    "type": "expense",
    "amount": 37000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "kopi kenangan"
  },
  {
    "id": "tx_mp_155",
    "date": "2026-02-09",
    "type": "expense",
    "amount": 7000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pukis"
  },
  {
    "id": "tx_mp_156",
    "date": "2026-02-09",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_157",
    "date": "2026-02-10",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "x banner"
  },
  {
    "id": "tx_mp_158",
    "date": "2026-02-10",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_159",
    "date": "2026-02-10",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_160",
    "date": "2026-02-10",
    "type": "expense",
    "amount": 102000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "gultik metro"
  },
  {
    "id": "tx_mp_161",
    "date": "2026-02-10",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_162",
    "date": "2026-02-11",
    "type": "expense",
    "amount": 23000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur, beras"
  },
  {
    "id": "tx_mp_163",
    "date": "2026-02-11",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_164",
    "date": "2026-02-11",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_165",
    "date": "2026-02-11",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_166",
    "date": "2026-02-12",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "meja"
  },
  {
    "id": "tx_mp_167",
    "date": "2026-02-12",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "dua asa coffee"
  },
  {
    "id": "tx_mp_168",
    "date": "2026-02-12",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_169",
    "date": "2026-02-12",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_170",
    "date": "2026-02-12",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "mie"
  },
  {
    "id": "tx_mp_171",
    "date": "2026-02-12",
    "type": "expense",
    "amount": 13000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "gorengan"
  },
  {
    "id": "tx_mp_172",
    "date": "2026-02-13",
    "type": "expense",
    "amount": 13000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "angkringan pak lik"
  },
  {
    "id": "tx_mp_173",
    "date": "2026-02-13",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_174",
    "date": "2026-02-14",
    "type": "expense",
    "amount": 33000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_175",
    "date": "2026-02-14",
    "type": "income",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_176",
    "date": "2026-02-14",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_177",
    "date": "2026-02-14",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_178",
    "date": "2026-02-14",
    "type": "expense",
    "amount": 55000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie gacoan"
  },
  {
    "id": "tx_mp_179",
    "date": "2026-02-15",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_181",
    "date": "2026-02-15",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek midodari"
  },
  {
    "id": "tx_mp_182",
    "date": "2026-02-15",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "isi ulang galon"
  },
  {
    "id": "tx_mp_183",
    "date": "2026-02-15",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_184",
    "date": "2026-02-15",
    "type": "expense",
    "amount": 60000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "pasir, dry food, dry treats"
  },
  {
    "id": "tx_mp_185",
    "date": "2026-02-15",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_186",
    "date": "2026-02-15",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "btapas self service"
  },
  {
    "id": "tx_mp_187",
    "date": "2026-02-16",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_188",
    "date": "2026-02-16",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "spidol"
  },
  {
    "id": "tx_mp_189",
    "date": "2026-02-16",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_190",
    "date": "2026-02-16",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_191",
    "date": "2026-02-16",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "sprite"
  },
  {
    "id": "tx_mp_192",
    "date": "2026-02-16",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "gorengan"
  },
  {
    "id": "tx_mp_193",
    "date": "2026-02-16",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "klepon"
  },
  {
    "id": "tx_mp_194",
    "date": "2026-02-16",
    "type": "expense",
    "amount": 66000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie ayam pak jangkung surabaya"
  },
  {
    "id": "tx_mp_195",
    "date": "2026-02-16",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_196",
    "date": "2026-02-17",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tengah hari coffee"
  },
  {
    "id": "tx_mp_197",
    "date": "2026-02-17",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_198",
    "date": "2026-02-17",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek hksn"
  },
  {
    "id": "tx_mp_199",
    "date": "2026-02-17",
    "type": "expense",
    "amount": 38000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "wet food"
  },
  {
    "id": "tx_mp_200",
    "date": "2026-02-17",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_201",
    "date": "2026-02-17",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_207",
    "date": "2026-02-17",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_208",
    "date": "2026-02-17",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_209",
    "date": "2026-02-17",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol idm kayutangi"
  },
  {
    "id": "tx_mp_210",
    "date": "2026-02-17",
    "type": "income",
    "amount": 475000,
    "account_id": "acc_seabank",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_202",
    "date": "2026-02-18",
    "type": "expense",
    "amount": 32000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "vitamin"
  },
  {
    "id": "tx_mp_203",
    "date": "2026-02-18",
    "type": "expense",
    "amount": 38000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "soto banjar mama sultan"
  },
  {
    "id": "tx_mp_204",
    "date": "2026-02-18",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_205",
    "date": "2026-02-18",
    "type": "expense",
    "amount": 46000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pendidikan",
    "note": "print"
  },
  {
    "id": "tx_mp_206",
    "date": "2026-02-18",
    "type": "expense",
    "amount": 28000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "nordu coffee"
  },
  {
    "id": "tx_mp_211",
    "date": "2026-02-19",
    "type": "expense",
    "amount": 175000,
    "account_id": "acc_seabank",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "shopee"
  },
  {
    "id": "tx_mp_212",
    "date": "2026-02-19",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_seabank",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "rabenshi"
  },
  {
    "id": "tx_mp_213",
    "date": "2026-02-19",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_214",
    "date": "2026-02-19",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_seabank",
    "category_id": null,
    "note": "Sea Bank"
  },
  {
    "id": "tx_mp_215",
    "date": "2026-02-19",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_216",
    "date": "2026-02-19",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_seabank",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "pulsa"
  },
  {
    "id": "tx_mp_217",
    "date": "2026-02-19",
    "type": "expense",
    "amount": 14000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "tepi kopi"
  },
  {
    "id": "tx_mp_218",
    "date": "2026-02-20",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bfc fried chicken"
  },
  {
    "id": "tx_mp_219",
    "date": "2026-02-21",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_220",
    "date": "2026-02-21",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_221",
    "date": "2026-02-21",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bfc fried chicken"
  },
  {
    "id": "tx_mp_222",
    "date": "2026-02-21",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_223",
    "date": "2026-02-21",
    "type": "expense",
    "amount": 14000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "saos sambel tomat"
  },
  {
    "id": "tx_mp_224",
    "date": "2026-02-22",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_225",
    "date": "2026-02-22",
    "type": "transfer",
    "amount": 50000,
    "account_id": "acc_seabank",
    "to_account_id": "acc_bri",
    "category_id": null,
    "note": "BRI"
  },
  {
    "id": "tx_mp_226",
    "date": "2026-02-22",
    "type": "expense",
    "amount": 12000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "kentuki"
  },
  {
    "id": "tx_mp_227",
    "date": "2026-02-22",
    "type": "expense",
    "amount": 19000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "gas portable"
  },
  {
    "id": "tx_mp_228",
    "date": "2026-02-22",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "gorengan"
  },
  {
    "id": "tx_mp_229",
    "date": "2026-02-23",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es buah"
  },
  {
    "id": "tx_mp_230",
    "date": "2026-02-23",
    "type": "expense",
    "amount": 7000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "gorengan"
  },
  {
    "id": "tx_mp_231",
    "date": "2026-02-23",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_232",
    "date": "2026-02-23",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "sog coffee"
  },
  {
    "id": "tx_mp_233",
    "date": "2026-02-23",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_bonus",
    "note": "basedata.bonus"
  },
  {
    "id": "tx_mp_234",
    "date": "2026-02-23",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_235",
    "date": "2026-02-23",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bebek sinjay"
  },
  {
    "id": "tx_mp_236",
    "date": "2026-02-24",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_seabank",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "TRINITY SCENT"
  },
  {
    "id": "tx_mp_237",
    "date": "2026-02-24",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "nordu coffee"
  },
  {
    "id": "tx_mp_238",
    "date": "2026-02-24",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_239",
    "date": "2026-02-25",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_240",
    "date": "2026-02-25",
    "type": "transfer",
    "amount": 700000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_241",
    "date": "2026-02-25",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_242",
    "date": "2026-02-25",
    "type": "expense",
    "amount": 750000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kost"
  },
  {
    "id": "tx_mp_243",
    "date": "2026-02-25",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_244",
    "date": "2026-02-25",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "kentuki"
  },
  {
    "id": "tx_mp_245",
    "date": "2026-02-25",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "saos sambel"
  },
  {
    "id": "tx_mp_248",
    "date": "2026-02-25",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_246",
    "date": "2026-02-26",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "lalapan si doel"
  },
  {
    "id": "tx_mp_247",
    "date": "2026-02-26",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_249",
    "date": "2026-02-28",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "basedata.tax"
  },
  {
    "id": "tx_mp_250",
    "date": "2026-02-28",
    "type": "expense",
    "amount": 40000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan kula kita"
  },
  {
    "id": "tx_mp_251",
    "date": "2026-02-28",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_252",
    "date": "2026-02-28",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie goreng"
  },
  {
    "id": "tx_mp_253",
    "date": "2026-02-28",
    "type": "expense",
    "amount": 13000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "\\telur, mie\\"
  },
  {
    "id": "tx_mp_254",
    "date": "2026-03-01",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_255",
    "date": "2026-03-01",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_256",
    "date": "2026-03-01",
    "type": "expense",
    "amount": 33000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "\\print, laminate, label\\"
  },
  {
    "id": "tx_mp_257",
    "date": "2026-03-01",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kursi lipat"
  },
  {
    "id": "tx_mp_258",
    "date": "2026-03-01",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_259",
    "date": "2026-03-01",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "lalapan putri kartini"
  },
  {
    "id": "tx_mp_260",
    "date": "2026-03-01",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_264",
    "date": "2026-03-01",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kursi lipat"
  },
  {
    "id": "tx_mp_261",
    "date": "2026-03-02",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "TRINITY SCENT"
  },
  {
    "id": "tx_mp_262",
    "date": "2026-03-02",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "point coffee"
  },
  {
    "id": "tx_mp_263",
    "date": "2026-03-02",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "TRINITY SCENT"
  },
  {
    "id": "tx_mp_266",
    "date": "2026-03-03",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_267",
    "date": "2026-03-03",
    "type": "expense",
    "amount": 26000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "shampoo makarizo"
  },
  {
    "id": "tx_mp_268",
    "date": "2026-03-03",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_269",
    "date": "2026-03-03",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "milo es"
  },
  {
    "id": "tx_mp_270",
    "date": "2026-03-04",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "basedata.tax"
  },
  {
    "id": "tx_mp_271",
    "date": "2026-03-04",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_272",
    "date": "2026-03-04",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "tahu krispi"
  },
  {
    "id": "tx_mp_273",
    "date": "2026-03-04",
    "type": "expense",
    "amount": 12000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_274",
    "date": "2026-03-04",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_275",
    "date": "2026-03-04",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_276",
    "date": "2026-03-04",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_277",
    "date": "2026-03-04",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_278",
    "date": "2026-03-06",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_279",
    "date": "2026-03-08",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_280",
    "date": "2026-03-08",
    "type": "expense",
    "amount": 45000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_motor",
    "note": "kampas rem"
  },
  {
    "id": "tx_mp_281",
    "date": "2026-03-08",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_282",
    "date": "2026-03-08",
    "type": "expense",
    "amount": 21000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_283",
    "date": "2026-03-08",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol goreng"
  },
  {
    "id": "tx_mp_284",
    "date": "2026-03-08",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "pulsa"
  },
  {
    "id": "tx_mp_290",
    "date": "2026-03-09",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_285",
    "date": "2026-03-10",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_286",
    "date": "2026-03-10",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_287",
    "date": "2026-03-10",
    "type": "expense",
    "amount": 16000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek midodari"
  },
  {
    "id": "tx_mp_288",
    "date": "2026-03-10",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_289",
    "date": "2026-03-10",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "mangkupi"
  },
  {
    "id": "tx_mp_291",
    "date": "2026-03-11",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_hiburan",
    "note": "timezone"
  },
  {
    "id": "tx_mp_292",
    "date": "2026-03-11",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_293",
    "date": "2026-03-11",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_294",
    "date": "2026-03-11",
    "type": "expense",
    "amount": 58000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "arunika coffee"
  },
  {
    "id": "tx_mp_295",
    "date": "2026-03-11",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_296",
    "date": "2026-03-11",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "potong rambut"
  },
  {
    "id": "tx_mp_297",
    "date": "2026-03-11",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_298",
    "date": "2026-03-12",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_299",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 45000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_300",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_301",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_302",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_303",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "icloud+"
  },
  {
    "id": "tx_mp_304",
    "date": "2026-03-12",
    "type": "income",
    "amount": 900000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_305",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "takoyaki"
  },
  {
    "id": "tx_mp_306",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_307",
    "date": "2026-03-12",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_308",
    "date": "2026-03-12",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "minus"
  },
  {
    "id": "tx_mp_309",
    "date": "2026-03-13",
    "type": "expense",
    "amount": 45000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "TRINITY SCENT"
  },
  {
    "id": "tx_mp_310",
    "date": "2026-03-13",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "milo es"
  },
  {
    "id": "tx_mp_311",
    "date": "2026-03-14",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_312",
    "date": "2026-03-14",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek"
  },
  {
    "id": "tx_mp_313",
    "date": "2026-03-14",
    "type": "expense",
    "amount": 7000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es"
  },
  {
    "id": "tx_mp_314",
    "date": "2026-03-14",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_315",
    "date": "2026-03-15",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_trinity_exp",
    "note": "TRINITY SCENT"
  },
  {
    "id": "tx_mp_316",
    "date": "2026-03-15",
    "type": "expense",
    "amount": 28000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "salsa"
  },
  {
    "id": "tx_mp_317",
    "date": "2026-03-16",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek"
  },
  {
    "id": "tx_mp_318",
    "date": "2026-03-16",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_322",
    "date": "2026-03-16",
    "type": "income",
    "amount": 650000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_319",
    "date": "2026-03-17",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "grooming"
  },
  {
    "id": "tx_mp_320",
    "date": "2026-03-17",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_321",
    "date": "2026-03-17",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tanjak coffee"
  },
  {
    "id": "tx_mp_326",
    "date": "2026-03-19",
    "type": "income",
    "amount": 500000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_inc",
    "note": "Trinity Scents"
  },
  {
    "id": "tx_mp_323",
    "date": "2026-03-20",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_324",
    "date": "2026-03-20",
    "type": "income",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_325",
    "date": "2026-03-20",
    "type": "expense",
    "amount": 65000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_327",
    "date": "2026-03-21",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bonus",
    "note": "basedata.bonus"
  },
  {
    "id": "tx_mp_328",
    "date": "2026-03-21",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_332",
    "date": "2026-03-22",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_329",
    "date": "2026-03-23",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "shopee"
  },
  {
    "id": "tx_mp_330",
    "date": "2026-03-23",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_331",
    "date": "2026-03-23",
    "type": "expense",
    "amount": 55000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_333",
    "date": "2026-03-24",
    "type": "income",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_334",
    "date": "2026-03-24",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "point coffee indomaret"
  },
  {
    "id": "tx_mp_335",
    "date": "2026-03-24",
    "type": "expense",
    "amount": 32000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_336",
    "date": "2026-03-25",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_337",
    "date": "2026-03-25",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_338",
    "date": "2026-03-26",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek"
  },
  {
    "id": "tx_mp_339",
    "date": "2026-03-26",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_340",
    "date": "2026-03-26",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_341",
    "date": "2026-03-26",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "pulsa"
  },
  {
    "id": "tx_mp_342",
    "date": "2026-03-27",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "roti bakar"
  },
  {
    "id": "tx_mp_343",
    "date": "2026-03-27",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "extrajoss susu"
  },
  {
    "id": "tx_mp_347",
    "date": "2026-03-27",
    "type": "expense",
    "amount": 35000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_348",
    "date": "2026-03-27",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol charlie 0km Pelaihari"
  },
  {
    "id": "tx_mp_344",
    "date": "2026-03-28",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_345",
    "date": "2026-03-28",
    "type": "expense",
    "amount": 33000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie gacoan"
  },
  {
    "id": "tx_mp_346",
    "date": "2026-03-28",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air es"
  },
  {
    "id": "tx_mp_349",
    "date": "2026-03-28",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_350",
    "date": "2026-03-28",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "lalapan wm andalan"
  },
  {
    "id": "tx_mp_351",
    "date": "2026-03-30",
    "type": "expense",
    "amount": 60000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_352",
    "date": "2026-03-30",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_353",
    "date": "2026-03-30",
    "type": "expense",
    "amount": 29000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "angkringan kala senja"
  },
  {
    "id": "tx_mp_354",
    "date": "2026-03-31",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_355",
    "date": "2026-03-31",
    "type": "income",
    "amount": 1200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_inc",
    "note": "Trinity Scents"
  },
  {
    "id": "tx_mp_356",
    "date": "2026-04-01",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "sempol"
  },
  {
    "id": "tx_mp_357",
    "date": "2026-04-01",
    "type": "expense",
    "amount": 12000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek"
  },
  {
    "id": "tx_mp_358",
    "date": "2026-04-01",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_motor",
    "note": "baterai"
  },
  {
    "id": "tx_mp_359",
    "date": "2026-04-01",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_360",
    "date": "2026-04-01",
    "type": "expense",
    "amount": 26000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_361",
    "date": "2026-04-02",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_362",
    "date": "2026-04-02",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_365",
    "date": "2026-04-02",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_363",
    "date": "2026-04-03",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_364",
    "date": "2026-04-03",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_366",
    "date": "2026-04-04",
    "type": "transfer",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_367",
    "date": "2026-04-04",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_368",
    "date": "2026-04-04",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman charlie"
  },
  {
    "id": "tx_mp_369",
    "date": "2026-04-05",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_370",
    "date": "2026-04-05",
    "type": "income",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_371",
    "date": "2026-04-05",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "risoles jumbo"
  },
  {
    "id": "tx_mp_372",
    "date": "2026-04-06",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "milo es"
  },
  {
    "id": "tx_mp_373",
    "date": "2026-04-06",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_374",
    "date": "2026-04-06",
    "type": "expense",
    "amount": 800000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kost"
  },
  {
    "id": "tx_mp_375",
    "date": "2026-04-06",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol kuah rth"
  },
  {
    "id": "tx_mp_376",
    "date": "2026-04-07",
    "type": "expense",
    "amount": 48000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "pal 21 coffee"
  },
  {
    "id": "tx_mp_377",
    "date": "2026-04-07",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "alfamart"
  },
  {
    "id": "tx_mp_378",
    "date": "2026-04-07",
    "type": "expense",
    "amount": 32000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_379",
    "date": "2026-04-08",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_380",
    "date": "2026-04-08",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "sempol"
  },
  {
    "id": "tx_mp_381",
    "date": "2026-04-08",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "jeruk es"
  },
  {
    "id": "tx_mp_382",
    "date": "2026-04-08",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_383",
    "date": "2026-04-09",
    "type": "expense",
    "amount": 45000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_384",
    "date": "2026-04-09",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "risoles jumbo"
  },
  {
    "id": "tx_mp_385",
    "date": "2026-04-09",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "icloud+"
  },
  {
    "id": "tx_mp_386",
    "date": "2026-04-10",
    "type": "income",
    "amount": 800000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_387",
    "date": "2026-04-10",
    "type": "expense",
    "amount": 14000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ebot"
  },
  {
    "id": "tx_mp_388",
    "date": "2026-04-11",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "basedata.beautify"
  },
  {
    "id": "tx_mp_389",
    "date": "2026-04-11",
    "type": "transfer",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_390",
    "date": "2026-04-11",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek"
  },
  {
    "id": "tx_mp_391",
    "date": "2026-04-11",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air es"
  },
  {
    "id": "tx_mp_392",
    "date": "2026-04-13",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_393",
    "date": "2026-04-13",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman charlie"
  },
  {
    "id": "tx_mp_394",
    "date": "2026-04-13",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_395",
    "date": "2026-04-13",
    "type": "expense",
    "amount": 80000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_396",
    "date": "2026-04-16",
    "type": "expense",
    "amount": 23000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman charlie"
  },
  {
    "id": "tx_mp_397",
    "date": "2026-04-18",
    "type": "expense",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_398",
    "date": "2026-04-19",
    "type": "transfer",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_399",
    "date": "2026-04-19",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tanjak coffee"
  },
  {
    "id": "tx_mp_400",
    "date": "2026-04-21",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_401",
    "date": "2026-04-21",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "Cemal Cemil"
  },
  {
    "id": "tx_mp_402",
    "date": "2026-04-21",
    "type": "expense",
    "amount": 22000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_403",
    "date": "2026-04-21",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_404",
    "date": "2026-04-21",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_405",
    "date": "2026-04-21",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "potong rambut"
  },
  {
    "id": "tx_mp_406",
    "date": "2026-04-22",
    "type": "expense",
    "amount": 32000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "decant parfum"
  },
  {
    "id": "tx_mp_407",
    "date": "2026-04-22",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_408",
    "date": "2026-04-22",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_409",
    "date": "2026-04-22",
    "type": "expense",
    "amount": 40000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pendidikan",
    "note": "print"
  },
  {
    "id": "tx_mp_410",
    "date": "2026-04-22",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "paijo"
  },
  {
    "id": "tx_mp_411",
    "date": "2026-04-22",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur"
  },
  {
    "id": "tx_mp_412",
    "date": "2026-04-23",
    "type": "income",
    "amount": 1000000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_413",
    "date": "2026-04-23",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "royal k bbq"
  },
  {
    "id": "tx_mp_414",
    "date": "2026-04-23",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "101 coffee"
  },
  {
    "id": "tx_mp_420",
    "date": "2026-04-23",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi kuning handil bakti"
  },
  {
    "id": "tx_mp_421",
    "date": "2026-04-23",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "alfamart"
  },
  {
    "id": "tx_mp_415",
    "date": "2026-04-24",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_416",
    "date": "2026-04-24",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "pal 21 coffee"
  },
  {
    "id": "tx_mp_417",
    "date": "2026-04-24",
    "type": "expense",
    "amount": 400000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_418",
    "date": "2026-04-24",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol 1991"
  },
  {
    "id": "tx_mp_419",
    "date": "2026-04-24",
    "type": "expense",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_422",
    "date": "2026-04-24",
    "type": "expense",
    "amount": 800000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kost"
  },
  {
    "id": "tx_mp_424",
    "date": "2026-04-26",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_inc",
    "note": "Trinity Scents"
  },
  {
    "id": "tx_mp_425",
    "date": "2026-04-26",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_trinity_inc",
    "note": "Trinity Scents"
  },
  {
    "id": "tx_mp_426",
    "date": "2026-04-26",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tanjak coffee"
  },
  {
    "id": "tx_mp_427",
    "date": "2026-04-26",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tanjak coffee"
  },
  {
    "id": "tx_mp_423",
    "date": "2026-04-27",
    "type": "income",
    "amount": 350000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_428",
    "date": "2026-04-28",
    "type": "expense",
    "amount": 35000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_429",
    "date": "2026-04-28",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "extrajoss susu"
  },
  {
    "id": "tx_mp_430",
    "date": "2026-04-29",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman charlie"
  },
  {
    "id": "tx_mp_431",
    "date": "2026-04-30",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie gacoan"
  },
  {
    "id": "tx_mp_432",
    "date": "2026-04-30",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "makmoer bersama coffee"
  },
  {
    "id": "tx_mp_433",
    "date": "2026-04-30",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "basedata.tax"
  },
  {
    "id": "tx_mp_436",
    "date": "2026-04-30",
    "type": "expense",
    "amount": 55000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "ayam"
  },
  {
    "id": "tx_mp_434",
    "date": "2026-05-01",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "batagor"
  },
  {
    "id": "tx_mp_435",
    "date": "2026-05-01",
    "type": "expense",
    "amount": 7000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "jeruk es"
  },
  {
    "id": "tx_mp_437",
    "date": "2026-05-02",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "dancow coklat es"
  },
  {
    "id": "tx_mp_438",
    "date": "2026-05-03",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_439",
    "date": "2026-05-03",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_440",
    "date": "2026-05-04",
    "type": "income",
    "amount": 650000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_441",
    "date": "2026-05-04",
    "type": "expense",
    "amount": 400000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sushi tei"
  },
  {
    "id": "tx_mp_442",
    "date": "2026-05-05",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "basedata.beautify"
  },
  {
    "id": "tx_mp_443",
    "date": "2026-05-05",
    "type": "expense",
    "amount": 55000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "soto ayam cak ipul"
  },
  {
    "id": "tx_mp_444",
    "date": "2026-05-05",
    "type": "expense",
    "amount": 55000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie gacoan"
  },
  {
    "id": "tx_mp_445",
    "date": "2026-05-06",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek solo"
  },
  {
    "id": "tx_mp_446",
    "date": "2026-05-06",
    "type": "transfer",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_447",
    "date": "2026-05-06",
    "type": "expense",
    "amount": 138000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "angkringan pak lik"
  },
  {
    "id": "tx_mp_448",
    "date": "2026-05-06",
    "type": "expense",
    "amount": 75000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_449",
    "date": "2026-05-07",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "seblak nr sabila"
  },
  {
    "id": "tx_mp_450",
    "date": "2026-05-07",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es teh jumbo"
  },
  {
    "id": "tx_mp_451",
    "date": "2026-05-07",
    "type": "expense",
    "amount": 12000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es doger"
  },
  {
    "id": "tx_mp_452",
    "date": "2026-05-07",
    "type": "transfer",
    "amount": 400000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_453",
    "date": "2026-05-07",
    "type": "expense",
    "amount": 46000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sate ayam"
  },
  {
    "id": "tx_mp_454",
    "date": "2026-05-07",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_455",
    "date": "2026-05-07",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_456",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 32000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pisang kipas bati-bati"
  },
  {
    "id": "tx_mp_457",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_458",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "alfamart"
  },
  {
    "id": "tx_mp_459",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "Ojol, Parkir"
  },
  {
    "id": "tx_mp_460",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "basreng basah"
  },
  {
    "id": "tx_mp_461",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 58000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan protoroyo"
  },
  {
    "id": "tx_mp_462",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_travel",
    "note": "jas hujan"
  },
  {
    "id": "tx_mp_463",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "alfamart"
  },
  {
    "id": "tx_mp_464",
    "date": "2026-05-08",
    "type": "expense",
    "amount": 35000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_466",
    "date": "2026-05-09",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_465",
    "date": "2026-05-10",
    "type": "expense",
    "amount": 13000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol pemko"
  },
  {
    "id": "tx_mp_467",
    "date": "2026-05-10",
    "type": "expense",
    "amount": 40000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "chikuro duta mall"
  },
  {
    "id": "tx_mp_468",
    "date": "2026-05-10",
    "type": "expense",
    "amount": 70000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "mae coffee"
  },
  {
    "id": "tx_mp_469",
    "date": "2026-05-13",
    "type": "expense",
    "amount": 40000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_470",
    "date": "2026-05-14",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_471",
    "date": "2026-05-14",
    "type": "income",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_472",
    "date": "2026-05-14",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_473",
    "date": "2026-05-14",
    "type": "expense",
    "amount": 12000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman charlie"
  },
  {
    "id": "tx_mp_474",
    "date": "2026-05-17",
    "type": "expense",
    "amount": 26000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "depot soloraya"
  },
  {
    "id": "tx_mp_475",
    "date": "2026-05-17",
    "type": "income",
    "amount": 450000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_476",
    "date": "2026-05-17",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "neir coffee"
  },
  {
    "id": "tx_mp_477",
    "date": "2026-05-18",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol pasar parabola"
  },
  {
    "id": "tx_mp_478",
    "date": "2026-05-18",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_479",
    "date": "2026-05-29",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "Cemal Cemil"
  },
  {
    "id": "tx_mp_481",
    "date": "2026-05-30",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_480",
    "date": "2026-05-31",
    "type": "income",
    "amount": 1550000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_inc",
    "note": "Trinity Scents"
  },
  {
    "id": "tx_mp_482",
    "date": "2026-06-01",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "risoles jumbo"
  },
  {
    "id": "tx_mp_483",
    "date": "2026-06-01",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "pulsa"
  },
  {
    "id": "tx_mp_484",
    "date": "2026-06-01",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tanjak coffee"
  },
  {
    "id": "tx_mp_485",
    "date": "2026-06-01",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek jawara"
  },
  {
    "id": "tx_mp_487",
    "date": "2026-06-02",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sate ayam"
  },
  {
    "id": "tx_mp_488",
    "date": "2026-06-02",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pisang keju h kadap"
  },
  {
    "id": "tx_mp_486",
    "date": "2026-06-03",
    "type": "expense",
    "amount": 52000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_489",
    "date": "2026-06-03",
    "type": "income",
    "amount": 650000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_bonus",
    "note": "basedata.bonus"
  },
  {
    "id": "tx_mp_490",
    "date": "2026-06-04",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "wet food"
  },
  {
    "id": "tx_mp_491",
    "date": "2026-06-04",
    "type": "expense",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "royal k bbq"
  },
  {
    "id": "tx_mp_492",
    "date": "2026-06-04",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "potong rambut"
  },
  {
    "id": "tx_mp_498",
    "date": "2026-06-04",
    "type": "income",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_493",
    "date": "2026-06-05",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_494",
    "date": "2026-06-05",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "101 coffee"
  },
  {
    "id": "tx_mp_495",
    "date": "2026-06-05",
    "type": "expense",
    "amount": 14000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "cendana"
  },
  {
    "id": "tx_mp_496",
    "date": "2026-06-05",
    "type": "expense",
    "amount": 26000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "depot soloraya"
  },
  {
    "id": "tx_mp_497",
    "date": "2026-06-05",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_503",
    "date": "2026-06-05",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_499",
    "date": "2026-06-05",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "basedata.dress"
  },
  {
    "id": "tx_mp_500",
    "date": "2026-06-06",
    "type": "transfer",
    "amount": 850000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_501",
    "date": "2026-06-06",
    "type": "expense",
    "amount": 800000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kost"
  },
  {
    "id": "tx_mp_502",
    "date": "2026-06-06",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sate ayam"
  },
  {
    "id": "tx_mp_504",
    "date": "2026-06-07",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek jawara"
  },
  {
    "id": "tx_mp_505",
    "date": "2026-06-07",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol bri adul"
  },
  {
    "id": "tx_mp_506",
    "date": "2026-06-07",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol kuah rth"
  },
  {
    "id": "tx_mp_507",
    "date": "2026-06-08",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_508",
    "date": "2026-06-08",
    "type": "expense",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "jersey timnas away"
  },
  {
    "id": "tx_mp_513",
    "date": "2026-06-09",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "pondok jus chua"
  },
  {
    "id": "tx_mp_509",
    "date": "2026-06-10",
    "type": "transfer",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_510",
    "date": "2026-06-10",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_511",
    "date": "2026-06-10",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_512",
    "date": "2026-06-10",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie ayam rth hasan basri"
  },
  {
    "id": "tx_mp_514",
    "date": "2026-06-10",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "dryfood"
  },
  {
    "id": "tx_mp_515",
    "date": "2026-06-10",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "icloud+"
  },
  {
    "id": "tx_mp_516",
    "date": "2026-06-11",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_517",
    "date": "2026-06-12",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_518",
    "date": "2026-06-12",
    "type": "transfer",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_519",
    "date": "2026-06-12",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_520",
    "date": "2026-06-13",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_521",
    "date": "2026-06-15",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman charlie"
  },
  {
    "id": "tx_mp_523",
    "date": "2026-06-20",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_524",
    "date": "2026-06-20",
    "type": "expense",
    "amount": 23000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi goreng cah solo"
  },
  {
    "id": "tx_mp_522",
    "date": "2026-06-21",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_525",
    "date": "2026-06-22",
    "type": "expense",
    "amount": 16000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "cendana"
  },
  {
    "id": "tx_mp_526",
    "date": "2026-06-22",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bebek sinjay"
  },
  {
    "id": "tx_mp_527",
    "date": "2026-06-22",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_528",
    "date": "2026-06-22",
    "type": "expense",
    "amount": 33000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "lalapan random"
  },
  {
    "id": "tx_mp_529",
    "date": "2026-06-22",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_530",
    "date": "2026-06-24",
    "type": "expense",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_532",
    "date": "2026-06-24",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_531",
    "date": "2026-06-25",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tusuk coffee"
  },
  {
    "id": "tx_mp_533",
    "date": "2026-06-29",
    "type": "income",
    "amount": 750000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_534",
    "date": "2026-06-30",
    "type": "income",
    "amount": 950000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_bonus",
    "note": "basedata.bonus"
  },
  {
    "id": "tx_mp_535",
    "date": "2026-06-30",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bonus",
    "note": "basedata.bonus"
  },
  {
    "id": "tx_mp_536",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 62000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "lalapan sarang halang"
  },
  {
    "id": "tx_mp_537",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 26000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kelistrikan"
  },
  {
    "id": "tx_mp_538",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 60000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "rak serbaguna"
  },
  {
    "id": "tx_mp_539",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "alfamart"
  },
  {
    "id": "tx_mp_540",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "sempol"
  },
  {
    "id": "tx_mp_541",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "rak parfum"
  },
  {
    "id": "tx_mp_542",
    "date": "2026-06-30",
    "type": "income",
    "amount": 1300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_inc",
    "note": "Trinity Scents"
  },
  {
    "id": "tx_mp_544",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "minum"
  },
  {
    "id": "tx_mp_545",
    "date": "2026-06-30",
    "type": "expense",
    "amount": 29000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "angkringan rth hasan basri"
  },
  {
    "id": "tx_mp_543",
    "date": "2026-07-01",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "sempol"
  },
  {
    "id": "tx_mp_546",
    "date": "2026-07-02",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "jeans rockmaker"
  },
  {
    "id": "tx_mp_547",
    "date": "2026-07-02",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "sempol"
  },
  {
    "id": "tx_mp_548",
    "date": "2026-07-03",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_549",
    "date": "2026-07-04",
    "type": "expense",
    "amount": 29000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "basedata.beautify"
  },
  {
    "id": "tx_mp_550",
    "date": "2026-07-05",
    "type": "expense",
    "amount": 400000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "perfume"
  },
  {
    "id": "tx_mp_551",
    "date": "2026-07-07",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_552",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 28000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "soto ayam cak ipul"
  },
  {
    "id": "tx_mp_553",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_554",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pisang keju kai ikin"
  },
  {
    "id": "tx_mp_555",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_motor",
    "note": "tambah angin"
  },
  {
    "id": "tx_mp_556",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_557",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_558",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 350000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pendidikan",
    "note": "claude AI"
  },
  {
    "id": "tx_mp_559",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "handbag"
  },
  {
    "id": "tx_mp_560",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "house shine coffee"
  },
  {
    "id": "tx_mp_561",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_562",
    "date": "2026-07-07",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "risoles bunda mts"
  },
  {
    "id": "tx_mp_566",
    "date": "2026-07-08",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hiburan",
    "note": "game"
  },
  {
    "id": "tx_mp_563",
    "date": "2026-07-09",
    "type": "income",
    "amount": 500000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_564",
    "date": "2026-07-09",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_565",
    "date": "2026-07-09",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_569",
    "date": "2026-07-09",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "cermin standing"
  },
  {
    "id": "tx_mp_567",
    "date": "2026-07-10",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_freelance",
    "note": "basedata.parttime_job"
  },
  {
    "id": "tx_mp_568",
    "date": "2026-07-10",
    "type": "expense",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "berobat leo"
  },
  {
    "id": "tx_mp_570",
    "date": "2026-07-12",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_571",
    "date": "2026-07-18",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_572",
    "date": "2026-07-20",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "wifi kost"
  },
  {
    "id": "tx_mp_573",
    "date": "2026-07-20",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_574",
    "date": "2026-07-20",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sate ayam"
  },
  {
    "id": "tx_mp_575",
    "date": "2026-07-20",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur"
  },
  {
    "id": "tx_mp_576",
    "date": "2026-07-20",
    "type": "expense",
    "amount": 28000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "kentuki"
  },
  {
    "id": "tx_mp_577",
    "date": "2026-07-21",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi padang"
  },
  {
    "id": "tx_mp_578",
    "date": "2026-07-21",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_579",
    "date": "2026-07-21",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_580",
    "date": "2026-07-21",
    "type": "expense",
    "amount": 42000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nona merawa"
  },
  {
    "id": "tx_mp_581",
    "date": "2026-07-22",
    "type": "expense",
    "amount": 21000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "cendana"
  },
  {
    "id": "tx_mp_582",
    "date": "2026-07-22",
    "type": "expense",
    "amount": 29000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "kuroba coffee"
  },
  {
    "id": "tx_mp_583",
    "date": "2026-07-22",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_584",
    "date": "2026-07-22",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_perawatan",
    "note": "\\shampoo makarizo, deodorant, salsa hair serum\\"
  },
  {
    "id": "tx_mp_585",
    "date": "2026-07-22",
    "type": "expense",
    "amount": 11000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bobby fried chicken"
  },
  {
    "id": "tx_mp_586",
    "date": "2026-07-22",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_587",
    "date": "2026-07-22",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_588",
    "date": "2026-07-23",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "kuota"
  },
  {
    "id": "tx_mp_589",
    "date": "2026-07-23",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hiburan",
    "note": "tiket film"
  },
  {
    "id": "tx_mp_590",
    "date": "2026-07-23",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "la majesty coffee"
  },
  {
    "id": "tx_mp_591",
    "date": "2026-07-23",
    "type": "expense",
    "amount": 1000000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "sepatu"
  },
  {
    "id": "tx_mp_592",
    "date": "2026-07-23",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_593",
    "date": "2026-07-23",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "mie ayam surya"
  },
  {
    "id": "tx_mp_594",
    "date": "2026-07-24",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ags"
  },
  {
    "id": "tx_mp_595",
    "date": "2026-07-24",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pisang keju kai ikin"
  },
  {
    "id": "tx_mp_596",
    "date": "2026-07-27",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol paman nduts"
  },
  {
    "id": "tx_mp_597",
    "date": "2026-07-29",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_598",
    "date": "2026-07-29",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ags"
  },
  {
    "id": "tx_mp_599",
    "date": "2026-07-29",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_600",
    "date": "2026-07-30",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_601",
    "date": "2026-07-30",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "depot soloraya"
  },
  {
    "id": "tx_mp_602",
    "date": "2026-07-30",
    "type": "expense",
    "amount": 35000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_603",
    "date": "2026-07-30",
    "type": "income",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_605",
    "date": "2026-07-30",
    "type": "transfer",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_606",
    "date": "2026-07-30",
    "type": "expense",
    "amount": 130000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "laponda"
  },
  {
    "id": "tx_mp_607",
    "date": "2026-07-30",
    "type": "expense",
    "amount": 60000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "arunika coffee"
  },
  {
    "id": "tx_mp_608",
    "date": "2026-07-30",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "jinak coffee"
  },
  {
    "id": "tx_mp_609",
    "date": "2026-07-30",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_604",
    "date": "2026-07-31",
    "type": "income",
    "amount": 1500000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_trinity_inc",
    "note": "Trinity Scents"
  },
  {
    "id": "tx_mp_610",
    "date": "2026-07-31",
    "type": "expense",
    "amount": 300000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "running shoes"
  },
  {
    "id": "tx_mp_611",
    "date": "2026-08-01",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "running belt"
  },
  {
    "id": "tx_mp_612",
    "date": "2026-08-01",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hadiah",
    "note": "basedata.gift"
  },
  {
    "id": "tx_mp_613",
    "date": "2026-08-01",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hadiah",
    "note": "basedata.gift"
  },
  {
    "id": "tx_mp_614",
    "date": "2026-08-02",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "running clothes"
  },
  {
    "id": "tx_mp_615",
    "date": "2026-08-04",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_616",
    "date": "2026-08-04",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_617",
    "date": "2026-08-04",
    "type": "expense",
    "amount": 78000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "glow"
  },
  {
    "id": "tx_mp_618",
    "date": "2026-08-04",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "gorengan"
  },
  {
    "id": "tx_mp_619",
    "date": "2026-08-05",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_620",
    "date": "2026-08-05",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_pakaian",
    "note": "jahitan"
  },
  {
    "id": "tx_mp_621",
    "date": "2026-08-05",
    "type": "expense",
    "amount": 13000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "cendana"
  },
  {
    "id": "tx_mp_622",
    "date": "2026-08-05",
    "type": "expense",
    "amount": 6000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "es doger"
  },
  {
    "id": "tx_mp_623",
    "date": "2026-08-06",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "bakaran"
  },
  {
    "id": "tx_mp_624",
    "date": "2026-08-06",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek midodari"
  },
  {
    "id": "tx_mp_625",
    "date": "2026-08-07",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "aygor"
  },
  {
    "id": "tx_mp_626",
    "date": "2026-08-07",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_627",
    "date": "2026-08-07",
    "type": "expense",
    "amount": 14000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "nasi goreng"
  },
  {
    "id": "tx_mp_628",
    "date": "2026-08-08",
    "type": "transfer",
    "amount": 900000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_629",
    "date": "2026-08-08",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sate ayam"
  },
  {
    "id": "tx_mp_630",
    "date": "2026-08-08",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "telur"
  },
  {
    "id": "tx_mp_631",
    "date": "2026-08-08",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_632",
    "date": "2026-08-09",
    "type": "expense",
    "amount": 800000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "kost"
  },
  {
    "id": "tx_mp_633",
    "date": "2026-08-09",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "cendana"
  },
  {
    "id": "tx_mp_634",
    "date": "2026-08-09",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_motor",
    "note": "cuci motor"
  },
  {
    "id": "tx_mp_635",
    "date": "2026-08-09",
    "type": "expense",
    "amount": 11000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "milo es"
  },
  {
    "id": "tx_mp_636",
    "date": "2026-08-10",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "rocket chicken"
  },
  {
    "id": "tx_mp_637",
    "date": "2026-08-10",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "gas portable"
  },
  {
    "id": "tx_mp_638",
    "date": "2026-08-10",
    "type": "expense",
    "amount": 13000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "Cemal Cemil"
  },
  {
    "id": "tx_mp_639",
    "date": "2026-08-11",
    "type": "income",
    "amount": 400000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_640",
    "date": "2026-08-11",
    "type": "income",
    "amount": 350000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_641",
    "date": "2026-08-11",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_642",
    "date": "2026-08-11",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_643",
    "date": "2026-08-11",
    "type": "expense",
    "amount": 26000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "soto ayam cak ipul"
  },
  {
    "id": "tx_mp_644",
    "date": "2026-08-11",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bfc fried chicken"
  },
  {
    "id": "tx_mp_645",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_komunikasi",
    "note": "icloud+"
  },
  {
    "id": "tx_mp_646",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_647",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_648",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bebek sinjay"
  },
  {
    "id": "tx_mp_649",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 17000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "laundry"
  },
  {
    "id": "tx_mp_650",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "isi ulang galon"
  },
  {
    "id": "tx_mp_654",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 59000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam ganje"
  },
  {
    "id": "tx_mp_655",
    "date": "2026-08-12",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "minum"
  },
  {
    "id": "tx_mp_651",
    "date": "2026-08-13",
    "type": "expense",
    "amount": 40000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "kedai bunda"
  },
  {
    "id": "tx_mp_652",
    "date": "2026-08-13",
    "type": "expense",
    "amount": 46000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_653",
    "date": "2026-08-13",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_656",
    "date": "2026-08-14",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "Cemal Cemil"
  },
  {
    "id": "tx_mp_657",
    "date": "2026-08-14",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_658",
    "date": "2026-08-14",
    "type": "expense",
    "amount": 28000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "toko kopi jaya"
  },
  {
    "id": "tx_mp_659",
    "date": "2026-08-14",
    "type": "expense",
    "amount": 4000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_660",
    "date": "2026-08-14",
    "type": "expense",
    "amount": 21000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "bpjs"
  },
  {
    "id": "tx_mp_661",
    "date": "2026-08-14",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "kayutangi"
  },
  {
    "id": "tx_mp_662",
    "date": "2026-08-14",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "gojek"
  },
  {
    "id": "tx_mp_663",
    "date": "2026-08-15",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_664",
    "date": "2026-08-15",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "alfamart"
  },
  {
    "id": "tx_mp_665",
    "date": "2026-08-15",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_666",
    "date": "2026-08-15",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hadiah",
    "note": "basedata.gift"
  },
  {
    "id": "tx_mp_667",
    "date": "2026-08-15",
    "type": "income",
    "amount": 900000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_668",
    "date": "2026-08-16",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "nordu coffee"
  },
  {
    "id": "tx_mp_669",
    "date": "2026-08-16",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_670",
    "date": "2026-08-16",
    "type": "expense",
    "amount": 7000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol"
  },
  {
    "id": "tx_mp_676",
    "date": "2026-08-16",
    "type": "expense",
    "amount": 600000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_hadiah",
    "note": "basedata.gift"
  },
  {
    "id": "tx_mp_671",
    "date": "2026-08-17",
    "type": "expense",
    "amount": 27000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "aiakawa coffee"
  },
  {
    "id": "tx_mp_672",
    "date": "2026-08-17",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_673",
    "date": "2026-08-17",
    "type": "expense",
    "amount": 15000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "richesee chicken"
  },
  {
    "id": "tx_mp_674",
    "date": "2026-08-17",
    "type": "expense",
    "amount": 16000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "cendana"
  },
  {
    "id": "tx_mp_675",
    "date": "2026-08-17",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "richesee chicken"
  },
  {
    "id": "tx_mp_681",
    "date": "2026-08-17",
    "type": "expense",
    "amount": 16000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "ayam geprek midodari"
  },
  {
    "id": "tx_mp_677",
    "date": "2026-08-18",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_678",
    "date": "2026-08-18",
    "type": "expense",
    "amount": 150000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pendidikan",
    "note": "print"
  },
  {
    "id": "tx_mp_679",
    "date": "2026-08-18",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sate ayam"
  },
  {
    "id": "tx_mp_680",
    "date": "2026-08-18",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek"
  },
  {
    "id": "tx_mp_688",
    "date": "2026-08-18",
    "type": "income",
    "amount": 250000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_682",
    "date": "2026-08-19",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_683",
    "date": "2026-08-19",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "sate ayam"
  },
  {
    "id": "tx_mp_684",
    "date": "2026-08-19",
    "type": "expense",
    "amount": 12000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "roti pisang"
  },
  {
    "id": "tx_mp_685",
    "date": "2026-08-19",
    "type": "expense",
    "amount": 24000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_687",
    "date": "2026-08-20",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_689",
    "date": "2026-08-20",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "depot soloraya"
  },
  {
    "id": "tx_mp_690",
    "date": "2026-08-20",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "morrow coffee"
  },
  {
    "id": "tx_mp_691",
    "date": "2026-08-20",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_692",
    "date": "2026-08-20",
    "type": "expense",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "royal k bbq"
  },
  {
    "id": "tx_mp_693",
    "date": "2026-08-20",
    "type": "expense",
    "amount": 50000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "chikuro duta mall"
  },
  {
    "id": "tx_mp_694",
    "date": "2026-08-21",
    "type": "expense",
    "amount": 14000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "cendana"
  },
  {
    "id": "tx_mp_695",
    "date": "2026-08-21",
    "type": "expense",
    "amount": 42000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "tusuk coffee"
  },
  {
    "id": "tx_mp_696",
    "date": "2026-08-21",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_697",
    "date": "2026-08-21",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_698",
    "date": "2026-08-21",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol"
  },
  {
    "id": "tx_mp_699",
    "date": "2026-08-21",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_700",
    "date": "2026-08-22",
    "type": "expense",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pet",
    "note": "basedata.pet"
  },
  {
    "id": "tx_mp_701",
    "date": "2026-08-22",
    "type": "expense",
    "amount": 45000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "mie"
  },
  {
    "id": "tx_mp_702",
    "date": "2026-08-22",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_makan",
    "note": "depot soloraya"
  },
  {
    "id": "tx_mp_703",
    "date": "2026-08-23",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_704",
    "date": "2026-08-23",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "1815 coffee"
  },
  {
    "id": "tx_mp_705",
    "date": "2026-08-23",
    "type": "expense",
    "amount": 55000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bensin",
    "note": "Bensin"
  },
  {
    "id": "tx_mp_706",
    "date": "2026-08-23",
    "type": "expense",
    "amount": 25000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_bahan_makan",
    "note": "\\telur, beras\\"
  },
  {
    "id": "tx_mp_707",
    "date": "2026-08-23",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol bakar"
  },
  {
    "id": "tx_mp_708",
    "date": "2026-08-23",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_709",
    "date": "2026-08-23",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "basedata.tax"
  },
  {
    "id": "tx_mp_710",
    "date": "2026-08-23",
    "type": "income",
    "amount": 2800000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  },
  {
    "id": "tx_mp_711",
    "date": "2026-08-24",
    "type": "expense",
    "amount": 2200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_pendidikan",
    "note": "yudisium wisuda"
  },
  {
    "id": "tx_mp_712",
    "date": "2026-08-25",
    "type": "transfer",
    "amount": 100000,
    "account_id": "acc_bri",
    "to_account_id": "acc_cash",
    "category_id": null,
    "note": "UANG CASH"
  },
  {
    "id": "tx_mp_713",
    "date": "2026-08-25",
    "type": "expense",
    "amount": 8000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pempek hksn"
  },
  {
    "id": "tx_mp_714",
    "date": "2026-08-25",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "indomaret"
  },
  {
    "id": "tx_mp_715",
    "date": "2026-08-25",
    "type": "expense",
    "amount": 3000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_rumah",
    "note": "isi ulang galon"
  },
  {
    "id": "tx_mp_716",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 22000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_nongkrong",
    "note": "101 coffee"
  },
  {
    "id": "tx_mp_717",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_718",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 2000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_parkir",
    "note": "\\Ojol, Parkir\\"
  },
  {
    "id": "tx_mp_719",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "air mineral"
  },
  {
    "id": "tx_mp_720",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 10000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "pentol"
  },
  {
    "id": "tx_mp_721",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 18000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "tahu baso"
  },
  {
    "id": "tx_mp_722",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 30000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_cemilan",
    "note": "amelia bakery"
  },
  {
    "id": "tx_mp_723",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 20000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_random",
    "note": "Random Stuff"
  },
  {
    "id": "tx_mp_724",
    "date": "2026-08-26",
    "type": "expense",
    "amount": 5000,
    "account_id": "acc_cash",
    "to_account_id": null,
    "category_id": "cat_tagihan",
    "note": "basedata.tax"
  },
  {
    "id": "tx_mp_725",
    "date": "2026-08-26",
    "type": "income",
    "amount": 200000,
    "account_id": "acc_bri",
    "to_account_id": null,
    "category_id": "cat_ortu",
    "note": "Mingguan Ortu"
  }
];
