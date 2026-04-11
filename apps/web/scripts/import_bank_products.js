const XLSX = require('xlsx');
const fs = require('fs');

// ── Read Excel ──
const wb = XLSX.readFile('bankProductData.xlsx');
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1']);

// ── Map institution names → slug IDs ──
const BANK_SLUG_MAP = {
  'Hibret Bank': 'hibret',
  'Wegagen Bank': 'wegagen',
  'Enat Bank': 'enat',
  'Oromia Bank': 'oromia',
  'Cooperative Bank Of Oromia': 'coopbank',
  'Dashen Bank': 'dashen',
  'Berhan Bank': 'berhan',
  'Bank of Abyssinia': 'abyssinia',
  'NIB INTERNATIONAL BANK': 'nib',
  'Tsehay Bank': 'tsehay',
  'Awash International Bank': 'awash',
  'Commercial Bank of Ethiopia': 'cbe',
  'Amhara Bank': 'amhara',
  'Zemen Bank': 'zemen',
  'Bunna Bank': 'bunna',
};

const BANK_LOGO_MAP = {
  'hibret': 'HB', 'wegagen': 'WB', 'enat': 'EN', 'oromia': 'OB',
  'coopbank': 'CO', 'dashen': 'DB', 'berhan': 'BB', 'abyssinia': 'BA',
  'nib': 'NI', 'tsehay': 'TS', 'awash': 'AB', 'cbe': 'CB',
  'amhara': 'AM', 'zemen': 'ZB', 'bunna': 'BN',
};

const BANK_ICON_BG_MAP = {
  'hibret': 'bg-red-50', 'wegagen': 'bg-teal-50', 'enat': 'bg-pink-50', 'oromia': 'bg-amber-50',
  'coopbank': 'bg-lime-50', 'dashen': 'bg-indigo-50', 'berhan': 'bg-blue-50', 'abyssinia': 'bg-emerald-50',
  'nib': 'bg-sky-50', 'tsehay': 'bg-yellow-50', 'awash': 'bg-orange-50', 'cbe': 'bg-purple-50',
  'amhara': 'bg-rose-50', 'zemen': 'bg-cyan-50', 'bunna': 'bg-stone-50',
};

function makeSlug(str) {
  return str.replace(/[\s/()]+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase().replace(/-+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Build products array ──
const products = rows.map((row, idx) => {
  const bankSlug = BANK_SLUG_MAP[row.instituteName] || makeSlug(row.instituteName);
  const productSlug = makeSlug(row.alias || row.productName || `product-${idx}`);
  const id = `${bankSlug}-${productSlug}`;

  const isSaving = row.productType === 'Saving';
  const interestMin = row.interestMin || 0;
  const interestMax = row.interestMax || interestMin;
  const interestDisplay = interestMax > interestMin 
    ? `${interestMin}–${interestMax}%` 
    : `${interestMin}%`;

  // Build details array for card display
  const details = [];
  details.push({ label: 'Interest', value: interestDisplay, positive: interestMin > 0 });
  if (isSaving) {
    if (row.minimumBalance > 0) details.push({ label: 'Min. Balance', value: `${row.minimumBalance.toLocaleString()} ETB` });
    if (row.interestPaymentPeriod) details.push({ label: 'Paid', value: row.interestPaymentPeriod });
  } else {
    if (row.loanAmount > 0) details.push({ label: 'Max Loan', value: `${row.loanAmount.toLocaleString()} ETB` });
    if (row.term > 0) details.push({ label: 'Term', value: `${row.term} months` });
  }
  if (row.digital) details.push({ label: 'Access', value: 'Digital' });

  // Build features array
  const features = [];
  if (row.digital) features.push('Available via digital banking');
  if (row.interestFree) features.push('Interest-free (Sharia-compliant)');
  if (row.genderBased) features.push('Gender-focused financial product');
  if (row.repaymentOptions) features.push(`Repayment: ${row.repaymentOptions}`);
  if (row.repaymentFrequency) features.push(`Repayment frequency: ${row.repaymentFrequency}`);
  if (row.disbursementTime) features.push(`Disbursement: ${row.disbursementTime}`);
  if (row.mandatorySaving) features.push('Mandatory saving required');
  if (isSaving && row.openingBalance > 0) features.push(`Opening balance: ${row.openingBalance.toLocaleString()} ETB`);

  // Build eligibility array
  const eligibility = [];
  if (row.eligibilityCriteria) eligibility.push(row.eligibilityCriteria.trim());
  if (row.creditScoreRequirement > 0) eligibility.push(`Min. credit score: ${row.creditScoreRequirement}`);
  if (row.membershipRequired) eligibility.push('Membership required');

  // Build requirements array
  const requirements = [];
  if (row.collateralRequirements) requirements.push(`Collateral: ${row.collateralRequirements}`);
  if (row.insuranceRequirements) requirements.push(`Insurance: ${row.insuranceRequirements}`);

  // Compute a pseudo match score (featured items get a boost)
  const matchScore = Math.min(99, Math.max(60, 
    70 + (row.isFeatured ? 15 : 0) + (row.digital ? 5 : 0) + (interestMin > 5 ? 5 : 0) + Math.floor(Math.random() * 10)
  ));

  return {
    id,
    category: 'Banks',
    bankId: bankSlug,
    bankName: row.instituteName,
    bankLogo: BANK_LOGO_MAP[bankSlug] || bankSlug.slice(0,2).toUpperCase(),
    bankIconBg: BANK_ICON_BG_MAP[bankSlug] || 'bg-slate-50',
    title: row.productName || row.alias,
    matchScore,
    highlight: row.isFeatured ? 'Featured' : undefined,
    details: details.slice(0, 3), // Max 3 for card display
    description: (row.description || '').slice(0, 200) || `${row.productType} product from ${row.instituteName}.`,
    // Rich fields
    instituteId: bankSlug,
    name: row.productName || row.alias,
    type: row.productType === 'Credit' ? 'Loan' : 'Savings',
    interestRate: interestMin,
    interestMax: interestMax || undefined,
    features: features.length > 0 ? features : undefined,
    eligibility: eligibility.length > 0 ? eligibility : undefined,
    requirements: requirements.length > 0 ? requirements : undefined,
    maxAmount: row.loanAmount > 0 ? row.loanAmount : undefined,
    minBalance: row.minimumBalance > 0 ? row.minimumBalance : undefined,
    term: row.term > 0 ? `${row.term} months` : undefined,
    fees: row.processingFees > 0 ? `${row.processingFees}%` : undefined,
    loanCategory: row.category || undefined,
    href: `/catalogue/${id}`,
    // Extra rich fields
    digital: row.digital || false,
    interestFree: row.interestFree || false,
    genderBased: row.genderBased || false,
    currency: row.currency || 'ETB',
    repaymentFrequency: row.repaymentFrequency || undefined,
    disbursementTime: row.disbursementTime || undefined,
    collateralRequirements: row.collateralRequirements || undefined,
    prepaymentPenalties: row.prepaymentPenalties > 0 ? `${row.prepaymentPenalties}%` : undefined,
    latePaymentPenalties: row.latePaymentPenalties > 0 ? `${row.latePaymentPenalties}%` : undefined,
    insuranceRequirements: row.insuranceRequirements || undefined,
  };
});

console.log(`Parsed ${products.length} bank products from Excel.`);

// ── Write to JSON for later injection ──
fs.writeFileSync('tmp_bank_products.json', JSON.stringify(products, null, 2));
console.log('Written to tmp_bank_products.json');

// ── Now inject into products.ts ──
const productsFile = 'lib/data/products.ts';
let content = fs.readFileSync(productsFile, 'utf-8');

// Find the existing hand-crafted bank products section and the MFI section start
// Strategy: Remove ONLY existing hand-crafted bank entries and BNPL entries (IDs we know),
// then prepend the full Excel dataset

// Find the closing of the array
const arrayEnd = content.lastIndexOf('];');
if (arrayEnd === -1) {
  console.error('Could not find ]; in products.ts');
  process.exit(1);
}

// Find where the MFI products start (they were appended by merge_mfi.js)
// They have instituteId but no bankId pattern
const mfiStart = content.indexOf("id: 'name-loan-0'");
const handCraftedEnd = mfiStart !== -1 
  ? content.lastIndexOf('},', mfiStart) + 2
  : arrayEnd;

// Extract everything before the products array
const typeDefEnd = content.indexOf('export const products: Product[] = [');
const typeSection = content.slice(0, typeDefEnd);

// Extract MFI products section (from mfiStart to arrayEnd)
let mfiSection = '';
if (mfiStart !== -1) {
  // Go back to find the opening { of the first MFI product
  let searchBack = mfiStart;
  while (searchBack > 0 && content[searchBack] !== '{') searchBack--;
  mfiSection = content.slice(searchBack, arrayEnd);
}

// Extract the getProductsByCategory and esxListedBanks exports (after the array)
const afterArray = content.slice(arrayEnd + 2); // After ];

// Build the product entries as TypeScript
const productEntries = products.map(p => {
  const lines = ['  {'];
  lines.push(`    id: ${JSON.stringify(p.id)},`);
  lines.push(`    category: 'Banks',`);
  lines.push(`    bankId: ${JSON.stringify(p.bankId)}, bankName: ${JSON.stringify(p.bankName)},`);
  lines.push(`    bankLogo: ${JSON.stringify(p.bankLogo)}, bankIconBg: ${JSON.stringify(p.bankIconBg)},`);
  lines.push(`    title: ${JSON.stringify(p.title)},`);
  lines.push(`    matchScore: ${p.matchScore},`);
  if (p.highlight) lines.push(`    highlight: ${JSON.stringify(p.highlight)},`);
  lines.push(`    href: ${JSON.stringify(p.href)},`);
  lines.push(`    details: ${JSON.stringify(p.details)},`);
  lines.push(`    description: ${JSON.stringify(p.description)},`);
  lines.push(`    instituteId: ${JSON.stringify(p.instituteId)},`);
  lines.push(`    name: ${JSON.stringify(p.name)},`);
  lines.push(`    type: ${JSON.stringify(p.type)},`);
  lines.push(`    interestRate: ${p.interestRate},`);
  if (p.interestMax) lines.push(`    interestMax: ${p.interestMax},`);
  if (p.features) lines.push(`    features: ${JSON.stringify(p.features)},`);
  if (p.eligibility) lines.push(`    eligibility: ${JSON.stringify(p.eligibility)},`);
  if (p.requirements) lines.push(`    requirements: ${JSON.stringify(p.requirements)},`);
  if (p.maxAmount) lines.push(`    maxAmount: ${p.maxAmount},`);
  if (p.minBalance) lines.push(`    minBalance: ${p.minBalance},`);
  if (p.term) lines.push(`    term: ${JSON.stringify(p.term)},`);
  if (p.fees) lines.push(`    fees: ${JSON.stringify(p.fees)},`);
  if (p.loanCategory) lines.push(`    loanCategory: ${JSON.stringify(p.loanCategory)},`);
  if (p.digital) lines.push(`    digital: true,`);
  if (p.interestFree) lines.push(`    interestFree: true,`);
  if (p.genderBased) lines.push(`    genderBased: true,`);
  if (p.currency !== 'ETB') lines.push(`    currency: ${JSON.stringify(p.currency)},`);
  if (p.repaymentFrequency) lines.push(`    repaymentFrequency: ${JSON.stringify(p.repaymentFrequency)},`);
  if (p.disbursementTime) lines.push(`    disbursementTime: ${JSON.stringify(p.disbursementTime)},`);
  if (p.collateralRequirements) lines.push(`    collateralRequirements: ${JSON.stringify(p.collateralRequirements)},`);
  if (p.prepaymentPenalties) lines.push(`    prepaymentPenalties: ${JSON.stringify(p.prepaymentPenalties)},`);
  if (p.latePaymentPenalties) lines.push(`    latePaymentPenalties: ${JSON.stringify(p.latePaymentPenalties)},`);
  if (p.insuranceRequirements) lines.push(`    insuranceRequirements: ${JSON.stringify(p.insuranceRequirements)},`);
  lines.push('  }');
  return lines.join('\n');
}).join(',\n');

// Reconstruct the file
let newContent = typeSection;
newContent += `export const products: Product[] = [\n`;
newContent += `  // === BANK PRODUCTS (${products.length} from bankProductData.xlsx) ===\n`;
newContent += productEntries;
if (mfiSection) {
  newContent += `,\n\n  // === MFI PRODUCTS (from MFI Excel) ===\n`;
  newContent += mfiSection;
}
newContent += `\n];\n`;
newContent += afterArray;

fs.writeFileSync(productsFile, newContent);
console.log(`Wrote ${productsFile} with ${products.length} bank products` + (mfiSection ? ' + MFI products' : ''));
