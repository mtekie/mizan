export type Bank = {
  id: string;
  name: string;
  nameAmh?: string;
  shortCode?: string;
  type: 'Commercial Bank' | 'Development Bank' | 'MFI' | 'Mobile Wallet' | 'Insurance' | 'SACCO' | 'Microfinance';
  color?: string;        // Tailwind bg color class
  textColor?: string;    // Tailwind text color class
  founded?: number;
  description: string;
  esxListed?: boolean;
  esxSymbol?: string;
  esxPrice?: number;
  esxChange?: number;   // % e.g. +1.2 means +1.2%
  logo?: string;         // two-letter abbrev used as placeholder

  // MFI fields extracted from Excel
  established?: number;
  branches?: number;
  tier?: string;
  website?: string;
};

export const banks: Bank[] = [
  {
    id: 'cbe', name: 'Commercial Bank of Ethiopia', nameAmh: 'የኢትዮጵያ ንግድ ባንክ',
    shortCode: 'CBE', type: 'Commercial Bank', color: 'bg-[#68246D]', textColor: 'text-white',
    founded: 1942, esxListed: true, esxSymbol: 'CBE', esxPrice: 110.00, esxChange: 0.0,
    logo: 'CB', description: "Ethiopia's largest state-owned commercial bank with over 1,800 branches.",
  },
  {
    id: 'awash', name: 'Awash Bank', nameAmh: 'አዋሽ ባንክ',
    shortCode: 'AB', type: 'Commercial Bank', color: 'bg-orange-600', textColor: 'text-white',
    founded: 1994, esxListed: true, esxSymbol: 'AWASH', esxPrice: 320.80, esxChange: -0.5,
    logo: 'AB', description: "Pioneer private bank in Ethiopia, known for competitive savings rates.",
  },
  {
    id: 'dashen', name: 'Dashen Bank', nameAmh: 'ዳሽን ባንክ',
    shortCode: 'DB', type: 'Commercial Bank', color: 'bg-indigo-700', textColor: 'text-white',
    founded: 1995, esxListed: true, esxSymbol: 'DASHEN', esxPrice: 202.10, esxChange: 0.8,
    logo: 'DB', description: "A leading private bank, known for digital innovation and diaspora services.",
  },
  {
    id: 'abyssinia', name: 'Bank of Abyssinia', nameAmh: 'አቢሲኒያ ባንክ',
    shortCode: 'BOA', type: 'Commercial Bank', color: 'bg-emerald-700', textColor: 'text-white',
    founded: 1996, esxListed: true, esxSymbol: 'BOA', esxPrice: 88.40, esxChange: 3.1,
    logo: 'BA', description: "One of Ethiopia's oldest private banks with a wide corporate client base.",
  },
  {
    id: 'nib', name: 'Nib International Bank', nameAmh: 'ኒብ ኢንተርናሽናል ባንክ',
    shortCode: 'NIB', type: 'Commercial Bank', color: 'bg-sky-700', textColor: 'text-white',
    founded: 1999, esxListed: true, esxSymbol: 'NIB', esxPrice: 156.20, esxChange: 0.8,
    logo: 'NI', description: "International-focused bank with strong foreign exchange capabilities.",
  },
  {
    id: 'hibret', name: 'Hibret Bank', nameAmh: 'ህብረት ባንክ',
    shortCode: 'HB', type: 'Commercial Bank', color: 'bg-blue-800', textColor: 'text-white',
    founded: 1998, esxListed: false,
    logo: 'HB', description: "United Bank — one of Ethiopia's established private commercial banks.",
  },
  {
    id: 'ethiotelecom', name: 'Ethio Telecom', nameAmh: 'ኢትዮ ቴሌኮም',
    shortCode: 'ETHIO', type: 'Mobile Wallet', color: 'bg-cyan-600', textColor: 'text-white',
    founded: 1894, esxListed: true, esxSymbol: 'ETHIO', esxPrice: 245.50, esxChange: 1.2,
    logo: 'ET', description: "Ethiopia's national telecom provider. Operates Telebirr, the leading mobile money platform.",
  },
  {
    id: 'nyala', name: 'Nyala Insurance', nameAmh: 'ኒያላ ኢንሹራንስ',
    shortCode: 'NI', type: 'Insurance', color: 'bg-purple-700', textColor: 'text-white',
    founded: 1995, esxListed: false,
    logo: 'NY', description: "A leading general insurance company in Ethiopia offering life and property coverage.",
  },
  {
    id: 'eeal', name: 'Ethiopian Airlines', nameAmh: 'ኢትዮጵያ አየር መንናገዶ',
    shortCode: 'EAL', type: 'Commercial Bank', color: 'bg-yellow-600', textColor: 'text-slate-900',
    founded: 1945, esxListed: false, // Upcoming IPO
    logo: 'EA', description: "Africa's largest airline group — anticipated ESX IPO will be a landmark listing.",
  },
  // === Banks from bankProductData.xlsx ===
  {
    id: 'wegagen', name: 'Wegagen Bank', nameAmh: 'ወጋገን ባንክ',
    shortCode: 'WB', type: 'Commercial Bank', color: 'bg-teal-600', textColor: 'text-white',
    founded: 1997, esxListed: false,
    logo: 'WB', description: 'A prominent Ethiopian private bank known for its strong digital banking initiatives and extensive branch network.',
  },
  {
    id: 'enat', name: 'Enat Bank', nameAmh: 'እናት ባንክ',
    shortCode: 'EN', type: 'Commercial Bank', color: 'bg-pink-600', textColor: 'text-white',
    founded: 2013, esxListed: false,
    logo: 'EN', description: "Ethiopia's first women-focused bank, championing inclusive and gender-responsive banking.",
  },
  {
    id: 'oromia', name: 'Oromia Bank', nameAmh: 'ኦሮሚያ ባንክ',
    shortCode: 'OB', type: 'Commercial Bank', color: 'bg-amber-600', textColor: 'text-white',
    founded: 2008, esxListed: false,
    logo: 'OB', description: 'One of the fastest growing private banks in Ethiopia with strong agricultural and regional banking focus.',
  },
  {
    id: 'coopbank', name: 'Cooperative Bank of Oromia', nameAmh: 'የኦሮሚያ ኅብረት ስራ ባንክ',
    shortCode: 'CO', type: 'Commercial Bank', color: 'bg-lime-600', textColor: 'text-white',
    founded: 2005, esxListed: false,
    logo: 'CO', description: 'A leading bank for cooperative societies offering interest-free and conventional banking.',
  },
  {
    id: 'tsehay', name: 'Tsehay Bank', nameAmh: 'ፀሐይ ባንክ',
    shortCode: 'TS', type: 'Commercial Bank', color: 'bg-yellow-500', textColor: 'text-slate-900',
    founded: 2022, esxListed: false,
    logo: 'TS', description: 'A new-generation bank focused on digital-first banking and customer-centric financial products.',
  },
  {
    id: 'amhara', name: 'Amhara Bank', nameAmh: 'አማራ ባንክ',
    shortCode: 'AM', type: 'Commercial Bank', color: 'bg-rose-600', textColor: 'text-white',
    founded: 2021, esxListed: false,
    logo: 'AM', description: 'A modern commercial bank serving the Amhara region and beyond with innovative products.',
  },
  {
    id: 'zemen', name: 'Zemen Bank', nameAmh: 'ዘመን ባንክ',
    shortCode: 'ZB', type: 'Commercial Bank', color: 'bg-cyan-600', textColor: 'text-white',
    founded: 2009, esxListed: false,
    logo: 'ZB', description: "Ethiopia's first cashierless bank, pioneering relationship banking and premium services.",
  },
  {
    id: 'bunna', name: 'Bunna Bank', nameAmh: 'ቡና ባንክ',
    shortCode: 'BN', type: 'Commercial Bank', color: 'bg-stone-600', textColor: 'text-white',
    founded: 2009, esxListed: false,
    logo: 'BN', description: 'A solid Ethiopian private bank with a growing regional presence and diverse product portfolio.',
  },
  // === Insurance Companies ===
  {
    id: 'ethiolife', name: 'Ethio Life & General Insurance', nameAmh: 'ኢትዮ ላይፍ',
    shortCode: 'EL', type: 'Insurance', color: 'bg-green-700', textColor: 'text-white',
    founded: 2008, esxListed: false,
    logo: 'EL', description: 'Leading Ethiopian insurer offering life, health, motor, and property insurance products.',
  },
  {
    id: 'united-insurance', name: 'United Insurance', nameAmh: 'ዩናይትድ ኢንሹራንስ',
    shortCode: 'UI', type: 'Insurance', color: 'bg-blue-700', textColor: 'text-white',
    founded: 1994, esxListed: false,
    logo: 'UI', description: 'One of Ethiopia\'s largest general insurance companies with nationwide coverage.',
  },
  {
    id: 'awash-insurance', name: 'Awash Insurance', nameAmh: 'አዋሽ ኢንሹራንስ',
    shortCode: 'AI', type: 'Insurance', color: 'bg-orange-700', textColor: 'text-white',
    founded: 1994, esxListed: false,
    logo: 'AI', description: 'Comprehensive insurance solutions backed by one of Ethiopia\'s strongest brands.',
  },
  {
    id: 'nib-insurance', name: 'NIB Insurance', nameAmh: 'ኒብ ኢንሹራንስ',
    shortCode: 'NB', type: 'Insurance', color: 'bg-sky-700', textColor: 'text-white',
    founded: 2002, esxListed: false,
    logo: 'NB', description: 'Specialized insurer with strong engineering and construction risk coverage.',
  },
  // === BNPL Merchants ===
  {
    id: 'safari-bnpl', name: 'Safari Electronics BNPL', type: 'Commercial Bank',
    shortCode: 'SF', color: 'bg-yellow-600', textColor: 'text-slate-900',
    logo: 'SF', description: 'Electronics retailer partnering with Mizan to offer buy-now-pay-later on phones and laptops.',
  },
  {
    id: 'marathon-bnpl', name: 'Marathon Furniture BNPL', type: 'Commercial Bank',
    shortCode: 'MF', color: 'bg-stone-700', textColor: 'text-white',
    logo: 'MF', description: 'Ethiopian furniture manufacturer offering installment purchasing plans.',
  },
  // === SACCOs / Equb ===
  {
    id: 'equb-digital', name: 'Mizan Digital Equb', type: 'SACCO',
    shortCode: 'EQ', color: 'bg-amber-600', textColor: 'text-white',
    logo: 'EQ', description: 'Digital platform for traditional Ethiopian Equb rotating savings circles, powered by Mizan trust scores.',
  },
  {
    id: 'sacco-coop', name: 'Addis SACCO Union', type: 'SACCO',
    shortCode: 'SU', color: 'bg-lime-700', textColor: 'text-white',
    logo: 'SU', description: 'Federation of savings and credit cooperatives serving Addis Ababa neighborhoods.',
  },
  {
    id: 'acsi',
    name: "ACSI Microfinance",
    type: 'Microfinance',
    color: 'bg-slate-700', textColor: 'text-white',
    logo: 'AC',
    established: 1990,
    branches: 12430,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Amhara.",
    website: 'https://acsi.mfi.et'
  },
  {
    id: 'adcsi',
    name: "ADCSI Microfinance",
    type: 'Microfinance',
    color: 'bg-blue-800', textColor: 'text-white',
    logo: 'AD',
    established: 1990,
    branches: 1223,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://adcsi.mfi.et'
  },
  {
    id: 'aggar',
    name: "Aggar Microfinance",
    type: 'Microfinance',
    color: 'bg-emerald-700', textColor: 'text-white',
    logo: 'AG',
    established: 1990,
    branches: 297,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://aggar.mfi.et'
  },
  {
    id: 'avfs',
    name: "AVFS Microfinance",
    type: 'Microfinance',
    color: 'bg-teal-700', textColor: 'text-white',
    logo: 'AV',
    established: 1990,
    branches: 70,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://avfs.mfi.et'
  },
  {
    id: 'benshangul',
    name: "Benshangul Microfinance",
    type: 'Microfinance',
    color: 'bg-indigo-800', textColor: 'text-white',
    logo: 'BE',
    established: 1990,
    branches: 199,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Benishangul Gumuz.",
    website: 'https://benshangul.mfi.et'
  },
  {
    id: 'bussa-gonofa',
    name: "Bussa Gonofa Microfinance",
    type: 'Microfinance',
    color: 'bg-purple-800', textColor: 'text-white',
    logo: 'BU',
    established: 1990,
    branches: 690,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://bussagonofa.mfi.et'
  },
  {
    id: 'decsi',
    name: "DECSI Microfinance",
    type: 'Microfinance',
    color: 'bg-cyan-800', textColor: 'text-white',
    logo: 'DE',
    established: 1990,
    branches: 3440,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Tigray.",
    website: 'https://decsi.mfi.et'
  },
  {
    id: 'dire-',
    name: "Dire  Microfinance",
    type: 'Microfinance',
    color: 'bg-sky-800', textColor: 'text-white',
    logo: 'DI',
    established: 1990,
    branches: 214,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Dire Dawa.",
    website: 'https://dire.mfi.et'
  },
  {
    id: 'digaf',
    name: "Digaf Microfinance",
    type: 'Microfinance',
    color: 'bg-rose-800', textColor: 'text-white',
    logo: 'DI',
    established: 1990,
    branches: 10,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://digaf.mfi.et'
  },
  {
    id: 'eshet',
    name: "Eshet Microfinance",
    type: 'Microfinance',
    color: 'bg-fuchsia-800', textColor: 'text-white',
    logo: 'ES',
    established: 1990,
    branches: 246,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://eshet.mfi.et'
  },
  {
    id: 'gasha',
    name: "Gasha Microfinance",
    type: 'Microfinance',
    color: 'bg-slate-700', textColor: 'text-white',
    logo: 'GA',
    established: 1990,
    branches: 99,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://gasha.mfi.et'
  },
  {
    id: 'harbu',
    name: "Harbu Microfinance",
    type: 'Microfinance',
    color: 'bg-blue-800', textColor: 'text-white',
    logo: 'HA',
    established: 1990,
    branches: 314,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://harbu.mfi.et'
  },
  {
    id: 'letta-one',
    name: "Letta/ one Microfinance",
    type: 'Microfinance',
    color: 'bg-emerald-700', textColor: 'text-white',
    logo: 'LE',
    established: 1990,
    branches: 12,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://lettaone.mfi.et'
  },
  {
    id: 'meklit',
    name: "Meklit Microfinance",
    type: 'Microfinance',
    color: 'bg-teal-700', textColor: 'text-white',
    logo: 'ME',
    established: 1990,
    branches: 251,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://meklit.mfi.et'
  },
  {
    id: 'metemamen',
    name: "Metemamen Microfinance",
    type: 'Microfinance',
    color: 'bg-indigo-800', textColor: 'text-white',
    logo: 'ME',
    established: 1990,
    branches: 250,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://metemamen.mfi.et'
  },
  {
    id: 'ocssco-siinqee-bank',
    name: "Ocssco/ Siinqee Bank Microfinance",
    type: 'Microfinance',
    color: 'bg-purple-800', textColor: 'text-white',
    logo: 'OC',
    established: 1990,
    branches: 6017,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://ocsscosiinqeebank.mfi.et'
  },
  {
    id: 'omo',
    name: "Omo Microfinance",
    type: 'Microfinance',
    color: 'bg-cyan-800', textColor: 'text-white',
    logo: 'OM',
    established: 1990,
    branches: 6401,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in SNNPRS.",
    website: 'https://omo.mfi.et'
  },
  {
    id: 'peace',
    name: "PEACE Microfinance",
    type: 'Microfinance',
    color: 'bg-sky-800', textColor: 'text-white',
    logo: 'PE',
    established: 1990,
    branches: 327,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://peace.mfi.et'
  },
  {
    id: 'liyu',
    name: "Liyu Microfinance",
    type: 'Microfinance',
    color: 'bg-rose-800', textColor: 'text-white',
    logo: 'LI',
    established: 1990,
    branches: 322,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://liyu.mfi.et'
  },
  {
    id: '-kendil',
    name: " Kendil Microfinance",
    type: 'Microfinance',
    color: 'bg-fuchsia-800', textColor: 'text-white',
    logo: '-K',
    established: 1990,
    branches: 61,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Oromia.",
    website: 'https://kendil.mfi.et'
  },
  {
    id: 'sidama',
    name: "Sidama Microfinance",
    type: 'Microfinance',
    color: 'bg-slate-700', textColor: 'text-white',
    logo: 'SI',
    established: 1990,
    branches: 389,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Sidama.",
    website: 'https://sidama.mfi.et'
  },
  {
    id: 'wasasa',
    name: "Wasasa Microfinance",
    type: 'Microfinance',
    color: 'bg-blue-800', textColor: 'text-white',
    logo: 'WA',
    established: 1990,
    branches: 455,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Oromia.",
    website: 'https://wasasa.mfi.et'
  },
  {
    id: 'vision-fund-',
    name: "Vision Fund  Microfinance",
    type: 'Microfinance',
    color: 'bg-emerald-700', textColor: 'text-white',
    logo: 'VI',
    established: 1990,
    branches: 1609,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://visionfund.mfi.et'
  },
  {
    id: 'harar',
    name: "Harar Microfinance",
    type: 'Microfinance',
    color: 'bg-teal-700', textColor: 'text-white',
    logo: 'HA',
    established: 1990,
    branches: 38,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Harer.",
    website: 'https://harar.mfi.et'
  },
  {
    id: 'lefayeda',
    name: "Lefayeda Microfinance",
    type: 'Microfinance',
    color: 'bg-indigo-800', textColor: 'text-white',
    logo: 'LE',
    established: 1990,
    branches: 41,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://lefayeda.mfi.et'
  },
  {
    id: 'dynamic',
    name: "Dynamic Microfinance",
    type: 'Microfinance',
    color: 'bg-purple-800', textColor: 'text-white',
    logo: 'DY',
    established: 1990,
    branches: 181,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://dynamic.mfi.et'
  },
  {
    id: 'gambella-mfi',
    name: "Gambella MFI Microfinance",
    type: 'Microfinance',
    color: 'bg-cyan-800', textColor: 'text-white',
    logo: 'GA',
    established: 1990,
    branches: 1,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in .",
    website: 'https://gambellamfi.mfi.et'
  },
  {
    id: 'tesfa-',
    name: "Tesfa  Microfinance",
    type: 'Microfinance',
    color: 'bg-sky-800', textColor: 'text-white',
    logo: 'TE',
    established: 1990,
    branches: 12,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://tesfa.mfi.et'
  },
  {
    id: 'somali',
    name: "Somali Microfinance",
    type: 'Microfinance',
    color: 'bg-rose-800', textColor: 'text-white',
    logo: 'SO',
    established: 1990,
    branches: 480,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Somali.",
    website: 'https://somali.mfi.et'
  },
  {
    id: 'lideta-',
    name: "Lideta  Microfinance",
    type: 'Microfinance',
    color: 'bg-fuchsia-800', textColor: 'text-white',
    logo: 'LI',
    established: 1990,
    branches: 82,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Tigray.",
    website: 'https://lideta.mfi.et'
  },
  {
    id: 'nisir-',
    name: "Nisir  Microfinance",
    type: 'Microfinance',
    color: 'bg-slate-700', textColor: 'text-white',
    logo: 'NI',
    established: 1990,
    branches: 114,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in A.A.",
    website: 'https://nisir.mfi.et'
  },
  {
    id: 'afar-',
    name: "Afar  Microfinance",
    type: 'Microfinance',
    color: 'bg-blue-800', textColor: 'text-white',
    logo: 'AF',
    established: 1990,
    branches: 105,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Afar.",
    website: 'https://afar.mfi.et'
  },
  {
    id: 'adeday',
    name: "Adeday Microfinance",
    type: 'Microfinance',
    color: 'bg-emerald-700', textColor: 'text-white',
    logo: 'AD',
    established: 1990,
    branches: 100,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Tigray.",
    website: 'https://adeday.mfi.et'
  },
  {
    id: 'debo',
    name: "Debo Microfinance",
    type: 'Microfinance',
    color: 'bg-teal-700', textColor: 'text-white',
    logo: 'DE',
    established: 1990,
    branches: 56,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in A.A.",
    website: 'https://debo.mfi.et'
  },
  {
    id: 'yemiserach',
    name: "Yemiserach Microfinance",
    type: 'Microfinance',
    color: 'bg-indigo-800', textColor: 'text-white',
    logo: 'YE',
    established: 1990,
    branches: 61,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in A.A.",
    website: 'https://yemiserach.mfi.et'
  },
  {
    id: 'rays',
    name: "Rays Microfinance",
    type: 'Microfinance',
    color: 'bg-purple-800', textColor: 'text-white',
    logo: 'RA',
    established: 1990,
    branches: 112,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in A.A.",
    website: 'https://rays.mfi.et'
  },
  {
    id: 'sheger',
    name: "Sheger Microfinance",
    type: 'Microfinance',
    color: 'bg-cyan-800', textColor: 'text-white',
    logo: 'SH',
    established: 1990,
    branches: 35,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in A.A.",
    website: 'https://sheger.mfi.et'
  },
  {
    id: 'grand-',
    name: "Grand  Microfinance",
    type: 'Microfinance',
    color: 'bg-sky-800', textColor: 'text-white',
    logo: 'GR',
    established: 1990,
    branches: 58,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in AA.",
    website: 'https://grand.mfi.et'
  },
  {
    id: 'kershi',
    name: "Kershi Microfinance",
    type: 'Microfinance',
    color: 'bg-rose-800', textColor: 'text-white',
    logo: 'KE',
    established: 1990,
    branches: 53,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Oromia.",
    website: 'https://kershi.mfi.et'
  },
  {
    id: 'yegna-',
    name: "Yegna  Microfinance",
    type: 'Microfinance',
    color: 'bg-fuchsia-800', textColor: 'text-white',
    logo: 'YE',
    established: 1990,
    branches: 114,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in A.A.",
    website: 'https://yegna.mfi.et'
  },
  {
    id: 'sahal',
    name: "Sahal Microfinance",
    type: 'Microfinance',
    color: 'bg-slate-700', textColor: 'text-white',
    logo: 'SA',
    established: 1990,
    branches: 31,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Somali.",
    website: 'https://sahal.mfi.et'
  },
  {
    id: 'tana-',
    name: "Tana  Microfinance",
    type: 'Microfinance',
    color: 'bg-blue-800', textColor: 'text-white',
    logo: 'TA',
    established: 1990,
    branches: 53,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Amhara / Bahirdar.",
    website: 'https://tana.mfi.et'
  },
  {
    id: 'elsabi',
    name: "Elsabi Microfinance",
    type: 'Microfinance',
    color: 'bg-emerald-700', textColor: 'text-white',
    logo: 'EL',
    established: 1990,
    branches: 32,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://elsabi.mfi.et'
  },
  {
    id: 'neo-',
    name: "NEO  Microfinance",
    type: 'Microfinance',
    color: 'bg-teal-700', textColor: 'text-white',
    logo: 'NE',
    established: 1990,
    branches: 10,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://neo.mfi.et'
  },
  {
    id: 'meba',
    name: "Meba Microfinance",
    type: 'Microfinance',
    color: 'bg-indigo-800', textColor: 'text-white',
    logo: 'ME',
    established: 1990,
    branches: 15,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://meba.mfi.et'
  },
  {
    id: 'aboll-bunna',
    name: "Aboll Bunna Microfinance",
    type: 'Microfinance',
    color: 'bg-purple-800', textColor: 'text-white',
    logo: 'AB',
    established: 1990,
    branches: 16,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://abollbunna.mfi.et'
  },
  {
    id: 'success-',
    name: "SUCCESS  Microfinance",
    type: 'Microfinance',
    color: 'bg-cyan-800', textColor: 'text-white',
    logo: 'SU',
    established: 1990,
    branches: 15,
    tier: 'Tier 3',
    description: "A microfinance institution headquartered in Addis Ababa.",
    website: 'https://success.mfi.et'
  }
];
export const esxListedBanks = banks.filter(b => b.esxListed);
