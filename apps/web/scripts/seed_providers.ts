/**
 * Seed Providers — Imports institutions from banks.ts into Provider table
 * Run: npx tsx scripts/seed_providers.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map Tailwind classes to hex colors
const twToHex: Record<string, string> = {
  'bg-[#68246D]': '#68246D',
  'bg-orange-600': '#EA580C', 'bg-indigo-700': '#4338CA', 'bg-emerald-700': '#047857',
  'bg-sky-700': '#0369A1', 'bg-blue-800': '#1E40AF', 'bg-cyan-600': '#0891B2',
  'bg-purple-700': '#7E22CE', 'bg-yellow-600': '#CA8A04', 'bg-teal-600': '#0D9488',
  'bg-pink-600': '#DB2777', 'bg-amber-600': '#D97706', 'bg-lime-600': '#65A30D',
  'bg-yellow-500': '#EAB308', 'bg-rose-600': '#E11D48', 'bg-cyan-600': '#0891B2',
  'bg-stone-600': '#57534E', 'bg-green-700': '#15803D', 'bg-blue-700': '#1D4ED8',
  'bg-orange-700': '#C2410C', 'bg-sky-700': '#0369A1',
  'bg-slate-700': '#334155', 'bg-emerald-700': '#047857', 'bg-teal-700': '#0F766E',
  'bg-indigo-800': '#3730A3', 'bg-purple-800': '#6B21A8', 'bg-cyan-800': '#155E75',
  'bg-sky-800': '#075985', 'bg-rose-800': '#9F1239', 'bg-fuchsia-800': '#86198F',
  'bg-blue-800': '#1E40AF', 'bg-lime-700': '#4D7C0F', 'bg-stone-700': '#44403C',
};

function mapProviderType(bankType: string): string {
  const map: Record<string, string> = {
    'Commercial Bank': 'BANK', 'Development Bank': 'BANK',
    'MFI': 'MFI', 'Microfinance': 'MFI',
    'Mobile Wallet': 'WALLET', 'Insurance': 'INSURANCE',
    'SACCO': 'SACCO',
  };
  return map[bankType] || 'BANK';
}

// All institutions from banks.ts
const providers = [
  // === Commercial Banks ===
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', nameAmh: 'የኢትዮጵያ ንግድ ባንክ', shortCode: 'CBE', type: 'Commercial Bank', color: 'bg-[#68246D]', founded: 1942, esxListed: true, esxSymbol: 'CBE', description: "Ethiopia's largest state-owned commercial bank with over 1,800 branches.", logo: 'CB' },
  { id: 'awash', name: 'Awash Bank', nameAmh: 'አዋሽ ባንክ', shortCode: 'AB', type: 'Commercial Bank', color: 'bg-orange-600', founded: 1994, esxListed: true, esxSymbol: 'AWASH', description: "Pioneer private bank in Ethiopia.", logo: 'AB' },
  { id: 'dashen', name: 'Dashen Bank', nameAmh: 'ዳሽን ባንክ', shortCode: 'DB', type: 'Commercial Bank', color: 'bg-indigo-700', founded: 1995, esxListed: true, esxSymbol: 'DASHEN', description: "Leading private bank, known for digital innovation.", logo: 'DB' },
  { id: 'abyssinia', name: 'Bank of Abyssinia', nameAmh: 'አቢሲኒያ ባንክ', shortCode: 'BOA', type: 'Commercial Bank', color: 'bg-emerald-700', founded: 1996, esxListed: true, esxSymbol: 'BOA', description: "One of Ethiopia's oldest private banks.", logo: 'BA' },
  { id: 'nib', name: 'Nib International Bank', nameAmh: 'ኒብ ኢንተርናሽናል ባንክ', shortCode: 'NIB', type: 'Commercial Bank', color: 'bg-sky-700', founded: 1999, esxListed: true, esxSymbol: 'NIB', description: "International-focused bank.", logo: 'NI' },
  { id: 'hibret', name: 'Hibret Bank', nameAmh: 'ህብረት ባንክ', shortCode: 'HB', type: 'Commercial Bank', color: 'bg-blue-800', founded: 1998, description: "One of Ethiopia's established private commercial banks.", logo: 'HB' },
  { id: 'wegagen', name: 'Wegagen Bank', nameAmh: 'ወጋገን ባንክ', shortCode: 'WB', type: 'Commercial Bank', color: 'bg-teal-600', founded: 1997, description: 'Strong digital banking initiatives.', logo: 'WB' },
  { id: 'enat', name: 'Enat Bank', nameAmh: 'እናት ባንክ', shortCode: 'EN', type: 'Commercial Bank', color: 'bg-pink-600', founded: 2013, description: "Ethiopia's first women-focused bank.", logo: 'EN' },
  { id: 'oromia', name: 'Oromia Bank', nameAmh: 'ኦሮሚያ ባንክ', shortCode: 'OB', type: 'Commercial Bank', color: 'bg-amber-600', founded: 2008, description: 'Fast growing with agricultural focus.', logo: 'OB' },
  { id: 'coopbank', name: 'Cooperative Bank of Oromia', nameAmh: 'የኦሮሚያ ኅብረት ስራ ባንክ', shortCode: 'CO', type: 'Commercial Bank', color: 'bg-lime-600', founded: 2005, description: 'Interest-free and conventional banking.', logo: 'CO' },
  { id: 'tsehay', name: 'Tsehay Bank', nameAmh: 'ፀሐይ ባንክ', shortCode: 'TS', type: 'Commercial Bank', color: 'bg-yellow-500', founded: 2022, description: 'Digital-first banking.', logo: 'TS' },
  { id: 'amhara', name: 'Amhara Bank', nameAmh: 'አማራ ባንክ', shortCode: 'AM', type: 'Commercial Bank', color: 'bg-rose-600', founded: 2021, description: 'Modern commercial bank.', logo: 'AM' },
  { id: 'zemen', name: 'Zemen Bank', nameAmh: 'ዘመን ባንክ', shortCode: 'ZB', type: 'Commercial Bank', color: 'bg-cyan-600', founded: 2009, description: "Ethiopia's first cashierless bank.", logo: 'ZB' },
  { id: 'bunna', name: 'Bunna Bank', nameAmh: 'ቡና ባንክ', shortCode: 'BN', type: 'Commercial Bank', color: 'bg-stone-600', founded: 2009, description: 'Growing regional presence.', logo: 'BN' },
  { id: 'berhan', name: 'Berhan Bank', nameAmh: 'ብርሃን ባንክ', shortCode: 'BB', type: 'Commercial Bank', color: 'bg-blue-800', founded: 2010, description: 'Growing Ethiopian private bank.', logo: 'BB' },
  // === Wallet ===
  { id: 'ethiotelecom', name: 'Ethio Telecom (Telebirr)', nameAmh: 'ኢትዮ ቴሌኮም', shortCode: 'ETHIO', type: 'Mobile Wallet', color: 'bg-cyan-600', founded: 1894, esxListed: true, esxSymbol: 'ETHIO', description: "Operates Telebirr, the leading mobile money platform.", logo: 'ET' },
  // === Insurance ===
  { id: 'nyala', name: 'Nyala Insurance', nameAmh: 'ኒያላ ኢንሹራንስ', shortCode: 'NI', type: 'Insurance', color: 'bg-purple-700', founded: 1995, description: 'Leading general insurance company.', logo: 'NY' },
  { id: 'ethiolife', name: 'Ethio Life & General Insurance', nameAmh: 'ኢትዮ ላይፍ', shortCode: 'EL', type: 'Insurance', color: 'bg-green-700', founded: 2008, description: 'Life, health, motor, and property insurance.', logo: 'EL' },
  { id: 'united-insurance', name: 'United Insurance', nameAmh: 'ዩናይትድ ኢንሹራንስ', shortCode: 'UI', type: 'Insurance', color: 'bg-blue-700', founded: 1994, description: "One of Ethiopia's largest general insurers.", logo: 'UI' },
  { id: 'awash-insurance', name: 'Awash Insurance', nameAmh: 'አዋሽ ኢንሹራንስ', shortCode: 'AI', type: 'Insurance', color: 'bg-orange-700', founded: 1994, description: 'Comprehensive insurance solutions.', logo: 'AI' },
  { id: 'nib-insurance', name: 'NIB Insurance', nameAmh: 'ኒብ ኢንሹራንስ', shortCode: 'NB', type: 'Insurance', color: 'bg-sky-700', founded: 2002, description: 'Engineering and construction risk coverage.', logo: 'NB' },
  // === BNPL Merchants ===
  { id: 'safari-bnpl', name: 'Safari Electronics', shortCode: 'SF', type: 'SACCO', color: 'bg-yellow-600', description: 'Electronics retailer with BNPL.', logo: 'SF' },
  { id: 'marathon-bnpl', name: 'Marathon Furniture', shortCode: 'MF', type: 'SACCO', color: 'bg-stone-700', description: 'Furniture manufacturer with installment plans.', logo: 'MF' },
  // === SACCOs ===
  { id: 'equb-digital', name: 'Mizan Digital Equb', shortCode: 'EQ', type: 'SACCO', color: 'bg-amber-600', description: 'Digital rotating savings circles.', logo: 'EQ' },
  { id: 'sacco-coop', name: 'Addis SACCO Union', shortCode: 'SU', type: 'SACCO', color: 'bg-lime-700', description: 'Federation of savings and credit cooperatives.', logo: 'SU' },
];

// MFI providers — extracted from banks.ts MFI entries
const mfiProviders = [
  { id: 'acsi', name: 'ACSI Microfinance', branches: 12430, tier: 'Tier 3', headquarters: 'Amhara', website: 'https://acsi.mfi.et' },
  { id: 'adcsi', name: 'ADCSI Microfinance', branches: 1223, tier: 'Tier 3', headquarters: 'Addis Ababa', website: 'https://adcsi.mfi.et' },
  { id: 'aggar', name: 'Aggar Microfinance', branches: 297, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'avfs', name: 'AVFS Microfinance', branches: 70, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'benshangul', name: 'Benshangul Microfinance', branches: 199, tier: 'Tier 3', headquarters: 'Benishangul Gumuz' },
  { id: 'bussa-gonofa', name: 'Bussa Gonofa Microfinance', branches: 690, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'decsi', name: 'DECSI Microfinance', branches: 3440, tier: 'Tier 3', headquarters: 'Tigray' },
  { id: 'dire', name: 'Dire Microfinance', branches: 214, tier: 'Tier 3', headquarters: 'Dire Dawa' },
  { id: 'digaf', name: 'Digaf Microfinance', branches: 10, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'eshet', name: 'Eshet Microfinance', branches: 246, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'gasha', name: 'Gasha Microfinance', branches: 99, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'harbu', name: 'Harbu Microfinance', branches: 314, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'letta-one', name: 'Letta/One Microfinance', branches: 12, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'meklit', name: 'Meklit Microfinance', branches: 251, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'metemamen', name: 'Metemamen Microfinance', branches: 250, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'ocssco', name: 'OCSSCO/Siinqee Bank', branches: 6017, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'omo', name: 'Omo Microfinance', branches: 6401, tier: 'Tier 3', headquarters: 'SNNPRS' },
  { id: 'peace', name: 'PEACE Microfinance', branches: 327, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'liyu', name: 'Liyu Microfinance', branches: 322, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'kendil', name: 'Kendil Microfinance', branches: 61, tier: 'Tier 3', headquarters: 'Oromia' },
  { id: 'sidama', name: 'Sidama Microfinance', branches: 389, tier: 'Tier 3', headquarters: 'Sidama' },
  { id: 'wasasa', name: 'Wasasa Microfinance', branches: 455, tier: 'Tier 3', headquarters: 'Oromia' },
  { id: 'vision-fund', name: 'Vision Fund Microfinance', branches: 1609, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'harar', name: 'Harar Microfinance', branches: 38, tier: 'Tier 3', headquarters: 'Harer' },
  { id: 'lefayeda', name: 'Lefayeda Microfinance', branches: 41, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'dynamic', name: 'Dynamic Microfinance', branches: 181, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'gambella-mfi', name: 'Gambella MFI', branches: 1, tier: 'Tier 3', headquarters: 'Gambella' },
  { id: 'tesfa', name: 'Tesfa Microfinance', branches: 12, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'somali', name: 'Somali Microfinance', branches: 480, tier: 'Tier 3', headquarters: 'Somali' },
  { id: 'lideta', name: 'Lideta Microfinance', branches: 82, tier: 'Tier 3', headquarters: 'Tigray' },
  { id: 'nisir', name: 'Nisir Microfinance', branches: 114, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'afar', name: 'Afar Microfinance', branches: 105, tier: 'Tier 3', headquarters: 'Afar' },
  { id: 'adeday', name: 'Adeday Microfinance', branches: 100, tier: 'Tier 3', headquarters: 'Tigray' },
  { id: 'debo', name: 'Debo Microfinance', branches: 56, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'yemiserach', name: 'Yemiserach Microfinance', branches: 61, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'rays', name: 'Rays Microfinance', branches: 112, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'sheger', name: 'Sheger Microfinance', branches: 35, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'grand', name: 'Grand Microfinance', branches: 58, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'kershi', name: 'Kershi Microfinance', branches: 53, tier: 'Tier 3', headquarters: 'Oromia' },
  { id: 'yegna', name: 'Yegna Microfinance', branches: 114, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'sahal', name: 'Sahal Microfinance', branches: 31, tier: 'Tier 3', headquarters: 'Somali' },
  { id: 'tana', name: 'Tana Microfinance', branches: 53, tier: 'Tier 3', headquarters: 'Amhara' },
  { id: 'elsabi', name: 'Elsabi Microfinance', branches: 32, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'neo', name: 'NEO Microfinance', branches: 10, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'meba', name: 'Meba Microfinance', branches: 15, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'aboll-bunna', name: 'Aboll Bunna Microfinance', branches: 16, tier: 'Tier 3', headquarters: 'Addis Ababa' },
  { id: 'success', name: 'SUCCESS Microfinance', branches: 15, tier: 'Tier 3', headquarters: 'Addis Ababa' },
];

const mfiColors = [
  '#334155', '#1E40AF', '#047857', '#0F766E', '#3730A3',
  '#6B21A8', '#155E75', '#075985', '#9F1239', '#86198F',
];

async function main() {
  console.log('🏦 Seeding providers...');

  // Upsert main providers (banks, insurance, wallets, SACCOs)
  for (const p of providers) {
    const hex = twToHex[p.color] || '#334155';
    await prisma.provider.upsert({
      where: { slug: p.id },
      update: {},
      create: {
        slug: p.id,
        name: p.name,
        nameAmh: p.nameAmh,
        shortCode: p.shortCode || p.logo,
        type: mapProviderType(p.type),
        brandColor: hex,
        description: p.description,
        founded: p.founded,
        esxListed: p.esxListed || false,
        esxSymbol: p.esxSymbol,
        isVerified: true,
      },
    });
  }
  console.log(`  ✅ ${providers.length} main providers seeded`);

  // Upsert MFI providers
  for (let i = 0; i < mfiProviders.length; i++) {
    const m = mfiProviders[i];
    await prisma.provider.upsert({
      where: { slug: m.id },
      update: {},
      create: {
        slug: m.id,
        name: m.name,
        shortCode: m.id.slice(0, 2).toUpperCase(),
        type: 'MFI',
        tier: m.tier,
        branches: m.branches,
        headquarters: m.headquarters,
        website: m.website,
        brandColor: mfiColors[i % mfiColors.length],
        description: `Microfinance institution headquartered in ${m.headquarters || 'Ethiopia'}.`,
        isVerified: false, // Data quality needs review
      },
    });
  }
  console.log(`  ✅ ${mfiProviders.length} MFI providers seeded`);
  console.log(`  📊 Total: ${providers.length + mfiProviders.length} providers`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
