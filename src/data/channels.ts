import { MuxStation } from "../types";

export const CUSTOM_REGIONS = [
  { id: "all", name: "Semua Wilayah" },
  { id: "jabodetabek", name: "DKI Jakarta & Jabodetabek" },
  { id: "jabar", name: "Jawa Barat (Bandung, Bogor, Cirebon)" },
  { id: "jateng", name: "Jawa Tengah (Semarang, Solo, Purwokerto)" },
  { id: "jatim", name: "Jawa Timur (Surabaya, Malang, Jember)" },
  { id: "diy", name: "DIY Yogyakarta" },
  { id: "sumatera", name: "Sumatera (Medan, Palembang, Lampung)" },
  { id: "kalimantan", name: "Kalimantan (Banjarmasin, Pontianak)" },
  { id: "sulawesi", name: "Sulawesi (Makassar, Manado)" },
  { id: "bali-nusra", name: "Bali & Nusa Tenggara" }
];

export const INDONESIA_MUX_STATIONS: MuxStation[] = [
  // JABODETABEK & BANTEN
  {
    id: "jakarta-tvri",
    name: "MUX TVRI Joglo Jakarta",
    operator: "LPP TVRI",
    channelFreq: 39, // UHF Channel 39 (618 MHz)
    city: "Jakarta Barat",
    province: "DKI Jakarta",
    lat: -6.2125,
    lng: 106.7656,
    height: 120,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Jakarta", "TVRI World", "TVRI Sport", "NET TV", "BTV", "Kompas TV"]
  },
  {
    id: "jakarta-rcti",
    name: "MUX RCTI Kebon Jeruk",
    operator: "MNC Group",
    channelFreq: 28, // UHF Channel 28 (530 MHz)
    city: "Jakarta Barat",
    province: "DKI Jakarta",
    lat: -6.1932,
    lng: 106.7628,
    height: 140,
    powerKw: 20,
    channels: ["RCTI", "MNCTV", "GTV", "iNews", "RTV"]
  },
  {
    id: "jakarta-sctv",
    name: "MUX SCTV Kebun Jeruk",
    operator: "Suryacipta Media Investment (Emtek)",
    channelFreq: 24, // UHF Channel 24 (498 MHz)
    city: "Jakarta Barat",
    province: "DKI Jakarta",
    lat: -6.1855,
    lng: 106.7663,
    height: 130,
    powerKw: 15,
    channels: ["SCTV", "Indosiar", "Moji", "Mentari TV", "Metro TV", "Magna Channel", "BN Channel"]
  },
  {
    id: "jakarta-trans",
    name: "MUX Trans Media Mampang",
    operator: "Trans Media / CT Corp",
    channelFreq: 40, // UHF Channel 40 (626 MHz)
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    lat: -6.2415,
    lng: 106.8322,
    height: 110,
    powerKw: 15,
    channels: ["Trans TV", "Trans 7", "CNN Indonesia", "CNBC Indonesia", "antv", "tvOne"]
  },
  {
    id: "jakarta-metrotv",
    name: "MUX Metro TV Kedoya",
    operator: "Media Group",
    channelFreq: 31, // UHF Channel 31 (554 MHz)
    city: "Jakarta Barat",
    province: "DKI Jakarta",
    lat: -6.1664,
    lng: 106.7561,
    height: 100,
    powerKw: 12,
    channels: ["Metro TV", "Magna Channel", "BN Channel", "Garuda TV"]
  },
  {
    id: "banten-tvri",
    name: "MUX TVRI Cilegon Banten",
    operator: "LPP TVRI",
    channelFreq: 32,
    city: "Cilegon",
    province: "Banten",
    lat: -6.0125,
    lng: 106.0139,
    height: 80,
    powerKw: 5,
    channels: ["TVRI Nasional", "TVRI Banten", "Sport TVRI", "NET TV", "Banten TV"]
  },

  // JAWA BARAT
  {
    id: "bandung-tvri",
    name: "MUX TVRI Panyandakan Bandung",
    operator: "LPP TVRI",
    channelFreq: 35, // UHF Channel 35 (586 MHz)
    city: "Bandung",
    province: "Jawa Barat",
    lat: -6.8335,
    lng: 107.6162,
    height: 150,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Jawa Barat", "TVRI World", "TVRI Sport", "NET TV", "BTV"]
  },
  {
    id: "bandung-indosiar",
    name: "MUX Indosiar Bandung",
    operator: "Suryacipta Media Investment",
    channelFreq: 29,
    city: "Bandung",
    province: "Jawa Barat",
    lat: -6.8521,
    lng: 107.6253,
    height: 110,
    powerKw: 15,
    channels: ["SCTV", "Indosiar", "Moji", "Mentari TV", "Metro TV", "Magna Channel", "BN Channel"]
  },
  {
    id: "bandung-metrotv",
    name: "MUX Metro TV Bandung",
    operator: "Media Group Network",
    channelFreq: 32,
    city: "Bandung",
    province: "Jawa Barat",
    lat: -6.8654,
    lng: 107.5951,
    height: 95,
    powerKw: 10,
    channels: ["Metro TV", "Magna Channel", "BN Channel", "Trans TV", "Trans 7"]
  },
  {
    id: "cirebon-tvri",
    name: "MUX TVRI Cirebon",
    operator: "LPP TVRI",
    channelFreq: 29,
    city: "Cirebon",
    province: "Jawa Barat",
    lat: -6.7455,
    lng: 108.5212,
    height: 90,
    powerKw: 5,
    channels: ["TVRI Nasional", "TVRI Jabar", "RTV", "Kompas TV"]
  },

  // JAWA TENGAH
  {
    id: "semarang-tvri",
    name: "MUX TVRI Gombel Semarang",
    operator: "LPP TVRI",
    channelFreq: 30, // UHF Channel 30 (546 MHz)
    city: "Semarang",
    province: "Jawa Tengah",
    lat: -7.0392,
    lng: 110.4278,
    height: 130,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Jawa Tengah", "TVRI World", "TVRI Sport", "NET TV", "BTV"]
  },
  {
    id: "semarang-indosiar",
    name: "MUX Indosiar Semarang",
    operator: "Suryacipta Media Investment",
    channelFreq: 32,
    city: "Semarang",
    province: "Jawa Tengah",
    lat: -7.0253,
    lng: 110.4351,
    height: 110,
    powerKw: 15,
    channels: ["SCTV", "Indosiar", "Moji", "Mentari TV", "Metro TV", "BN Channel"]
  },
  {
    id: "solo-tvri",
    name: "MUX TVRI Pathuk Yogyakarta/Solo",
    operator: "LPP TVRI",
    channelFreq: 29,
    city: "Gunungkidul",
    province: "DIY Yogyakarta",
    lat: -7.8482,
    lng: 110.4965,
    height: 140,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Yogyakarta", "TVRI World", "TVRI Sport", "TATV", "NET TV", "BTV"]
  },
  {
    id: "solo-sctv",
    name: "MUX SCTV Patuk Yogyakarta/Solo",
    operator: "Suryacipta Media Investment",
    channelFreq: 32,
    city: "Gunungkidul",
    province: "DIY Yogyakarta",
    lat: -7.8421,
    lng: 110.4851,
    height: 120,
    powerKw: 15,
    channels: ["SCTV", "Indosiar", "Moji", "Mentari TV", "Metro TV", "Magna Channel"]
  },

  // JAWA TIMUR
  {
    id: "surabaya-tvri",
    name: "MUX TVRI Surabaya",
    operator: "LPP TVRI",
    channelFreq: 35, // UHF Channel 35 (586 MHz)
    city: "Surabaya",
    province: "Jawa Timur",
    lat: -7.2885,
    lng: 112.7915,
    height: 120,
    powerKw: 15,
    channels: ["TVRI Nasional", "TVRI Jawa Timur", "TVRI World", "TVRI Sport", "NET TV", "BTV"]
  },
  {
    id: "surabaya-sctv",
    name: "MUX SCTV Surabaya Sambisari",
    operator: "Suryacipta Media Investment",
    channelFreq: 29,
    city: "Surabaya",
    province: "Jawa Timur",
    lat: -7.2792,
    lng: 112.7225,
    height: 100,
    powerKw: 20,
    channels: ["SCTV", "Indosiar", "Moji", "Mentari TV", "JTV", "Metro TV"]
  },
  {
    id: "surabaya-trans",
    name: "MUX Trans Media Surabaya",
    operator: "Trans Media / CT Corp",
    channelFreq: 41,
    city: "Surabaya",
    province: "Jawa Timur",
    lat: -7.2915,
    lng: 112.7302,
    height: 110,
    powerKw: 15,
    channels: ["Trans TV", "Trans 7", "CNN Indonesia", "CNBC Indonesia", "antv", "tvOne"]
  },
  {
    id: "malang-tvri",
    name: "MUX TVRI Oro-Oro Ombo Malang",
    operator: "LPP TVRI",
    channelFreq: 31,
    city: "Malang",
    province: "Jawa Timur",
    lat: -7.8932,
    lng: 112.5211,
    height: 100,
    powerKw: 8,
    channels: ["TVRI Nasional", "TVRI Jatim", "Malang TV", "Kompas TV"]
  },

  // SUMATERA
  {
    id: "medan-tvri",
    name: "MUX TVRI Medan",
    operator: "LPP TVRI",
    channelFreq: 28,
    city: "Medan",
    province: "Sumatera Utara",
    lat: 3.5935,
    lng: 98.6755,
    height: 110,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Sumatera Utara", "NET TV", "RTV", "Metro TV"]
  },
  {
    id: "medan-rcti",
    name: "MUX RCTI Medan",
    operator: "MNC Group",
    channelFreq: 40,
    city: "Medan",
    province: "Sumatera Utara",
    lat: 3.5852,
    lng: 98.6631,
    height: 100,
    powerKw: 12,
    channels: ["RCTI", "MNCTV", "GTV", "iNews", "Indosiar", "SCTV"]
  },
  {
    id: "palembang-tvri",
    name: "MUX TVRI Palembang",
    operator: "LPP TVRI",
    channelFreq: 29,
    city: "Palembang",
    province: "Sumatera Selatan",
    lat: -2.9782,
    lng: 104.7562,
    height: 100,
    powerKw: 8,
    channels: ["TVRI Nasional", "TVRI Sumatera Selatan", "PalTV", "NET TV"]
  },
  {
    id: "lampung-tvri",
    name: "MUX TVRI Bandar Lampung",
    operator: "LPP TVRI",
    channelFreq: 33,
    city: "Bandar Lampung",
    province: "Lampung",
    lat: -5.4321,
    lng: 105.2632,
    height: 90,
    powerKw: 8,
    channels: ["TVRI Nasional", "TVRI Lampung", "Radar TV", "NET TV"]
  },

  // KALIMANTAN
  {
    id: "banjarmasin-tvri",
    name: "MUX TVRI Banjarmasin",
    operator: "LPP TVRI",
    channelFreq: 30,
    city: "Banjarmasin",
    province: "Kalimantan Selatan",
    lat: -3.3155,
    lng: 114.5925,
    height: 90,
    powerKw: 8,
    channels: ["TVRI Nasional", "TVRI Kalsel", "Duta TV", "Kompas TV"]
  },
  {
    id: "pontianak-tvri",
    name: "MUX TVRI Pontianak",
    operator: "LPP TVRI",
    channelFreq: 29,
    city: "Pontianak",
    province: "Kalimantan Barat",
    lat: -0.0211,
    lng: 109.3421,
    height: 85,
    powerKw: 8,
    channels: ["TVRI Nasional", "TVRI Kalbar", "Ruai TV", "NET TV"]
  },

  // SULAWESI
  {
    id: "makassar-tvri",
    name: "MUX TVRI Makassar",
    operator: "LPP TVRI",
    channelFreq: 28,
    city: "Makassar",
    province: "Sulawesi Selatan",
    lat: -5.1482,
    lng: 119.4325,
    height: 110,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Sulawesi Selatan", "Kompas TV", "NET TV", "Tv Al-Mukmin"]
  },
  {
    id: "manado-tvri",
    name: "MUX TVRI Manado",
    operator: "LPP TVRI",
    channelFreq: 29,
    city: "Manado",
    province: "Sulawesi Utara",
    lat: 1.4821,
    lng: 124.8432,
    height: 90,
    powerKw: 5,
    channels: ["TVRI Nasional", "TVRI Sulut", "Kawanua TV", "RTV"]
  },

  // BALI & NUSRA
  {
    id: "bali-tvri",
    name: "MUX TVRI Bukit Bakung Badung (Denpasar)",
    operator: "LPP TVRI",
    channelFreq: 30,
    city: "Badung / Denpasar",
    province: "Bali",
    lat: -8.8252,
    lng: 115.1555,
    height: 120,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Bali", "TVRI World", "Sport TVRI", "NET TV", "Bali TV"]
  },
  {
    id: "mataram-tvri",
    name: "MUX TVRI Mataram Lombok",
    operator: "LPP TVRI",
    channelFreq: 29,
    city: "Mataram",
    province: "Nusa Tenggara Barat",
    lat: -8.5832,
    lng: 116.1211,
    height: 90,
    powerKw: 8,
    channels: ["TVRI Nasional", "TVRI NTB", "Lombok TV", "NET TV"]
  },
  {
    id: "kupang-tvri",
    name: "MUX TVRI Kupang",
    operator: "LPP TVRI",
    channelFreq: 29,
    city: "Kupang",
    province: "Nusa Tenggara Timur",
    lat: -10.1652,
    lng: 123.6011,
    height: 85,
    powerKw: 5,
    channels: ["TVRI Nasional", "TVRI NTT", "AFB TV", "NET TV"]
  },
  {
    id: "samarinda-tvri",
    name: "MUX TVRI Samarinda Gunung Komeng",
    operator: "LPP TVRI",
    channelFreq: 28,
    city: "Samarinda",
    province: "Kalimantan Timur",
    lat: -0.5015,
    lng: 117.1512,
    height: 100,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Kaltim", "Metro TV", "Indosiar", "SCTV"]
  },
  {
    id: "ambon-tvri",
    name: "MUX TVRI Ambon Bukit Gantungan",
    operator: "LPP TVRI",
    channelFreq: 33,
    city: "Ambon",
    province: "Maluku",
    lat: -3.6922,
    lng: 128.1855,
    height: 90,
    powerKw: 5,
    channels: ["TVRI Nasional", "TVRI Maluku", "Kompas TV", "NET TV"]
  },
  
  // JAMBI
  {
    id: "jambi-tvri",
    name: "MUX TVRI Telanaipura Jambi",
    operator: "LPP TVRI",
    channelFreq: 44, // UHF 44
    city: "Jambi",
    province: "Jambi",
    lat: -1.6192,
    lng: 103.5855,
    height: 100,
    powerKw: 10,
    channels: ["TVRI Nasional", "TVRI Jambi", "TVRI World", "TVRI Sport", "NET TV", "Jek TV", "Jambi TV"]
  },
  {
    id: "jambi-rcti",
    name: "MUX RCTI Jambi",
    operator: "MNC Media",
    channelFreq: 32, // UHF 32
    city: "Jambi",
    province: "Jambi",
    lat: -1.6311,
    lng: 103.5788,
    height: 120,
    powerKw: 5,
    channels: ["RCTI", "MNCTV", "GTV", "iNews"]
  },
  {
    id: "jambi-sctv",
    name: "MUX SCTV Jambi",
    operator: "Surya Citra Media",
    channelFreq: 29, // UHF 29
    city: "Jambi",
    province: "Jambi",
    lat: -1.6360,
    lng: 103.5650,
    height: 120,
    powerKw: 5,
    channels: ["SCTV", "Indosiar", "Moji", "Mentari TV", "Metro TV", "Magna Channel", "BN Channel"]
  },
  {
    id: "jambi-transtv",
    name: "MUX Trans TV Jambi",
    operator: "Trans Media",
    channelFreq: 38, // UHF 38
    city: "Jambi",
    province: "Jambi",
    lat: -1.6148,
    lng: 103.5822,
    height: 100,
    powerKw: 5,
    channels: ["Trans TV", "Trans7", "CNN Indonesia", "CNBC Indonesia", "ANTV", "tvOne"]
  }
];

export const MAJOR_INDONESIAN_CITIES = [
  { name: "Jambi (Kota Jambi)", lat: -1.6018, lng: 103.6181, icon: "🌴" },
  { name: "Jakarta (DKI Jakarta)", lat: -6.1754, lng: 106.8272, icon: "🗼" },
  { name: "Bandung (Jawa Barat)", lat: -6.9175, lng: 107.6191, icon: "☕" },
  { name: "Semarang (Jawa Tengah)", lat: -7.0051, lng: 110.4381, icon: "⛪" },
  { name: "Yogyakarta (DIY)", lat: -7.7956, lng: 110.3695, icon: "🕌" },
  { name: "Surabaya (Jawa Timur)", lat: -7.2575, lng: 112.7521, icon: "🦈" },
  { name: "Medan (Sumatera Utara)", lat: 3.5952, lng: 98.6722, icon: "🏢" },
  { name: "Palembang (Sumatera Selatan)", lat: -2.9909, lng: 104.7567, icon: "🌉" },
  { name: "Bandar Lampung (Lampung)", lat: -5.3971, lng: 105.2668, icon: "🐘" },
  { name: "Banjarmasin (Kalimantan Selatan)", lat: -3.3186, lng: 114.5944, icon: "🛶" },
  { name: "Samarinda (Kalimantan Timur)", lat: -0.5021, lng: 117.1536, icon: "🌳" },
  { name: "Pontianak (Kalimantan Barat)", lat: -0.0263, lng: 109.3425, icon: "☀️" },
  { name: "Makassar (Sulawesi Selatan)", lat: -5.1477, lng: 119.4327, icon: "🌇" },
  { name: "Manado (Sulawesi Utara)", lat: 1.4748, lng: 124.8428, icon: "🐟" },
  { name: "Denpasar (Bali)", lat: -8.6705, lng: 115.2126, icon: "🏄" },
  { name: "Mataram (Lombok / NTB)", lat: -8.5833, lng: 116.1167, icon: "🌶️" },
  { name: "Kupang (NTT)", lat: -10.1772, lng: 123.6078, icon: "🌅" },
  { name: "Serang (Banten)", lat: -6.1153, lng: 106.1542, icon: "🧱" },
  { name: "Ambon (Maluku)", lat: -3.6954, lng: 128.1814, icon: "🐚" }
];
