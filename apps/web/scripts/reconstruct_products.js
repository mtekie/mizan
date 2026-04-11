const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ── 1. Load Bank Products from Excel ──
const wb = XLSX.readFile('bankProductData.xlsx');
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1']);

const BANK_SLUG_MAP = {
    'Hibret Bank': 'hibret', 'Wegagen Bank': 'wegagen', 'Enat Bank': 'enat',
    'Oromia Bank': 'oromia', 'Cooperative Bank Of Oromia': 'coopbank',
    'Dashen Bank': 'dashen', 'Berhan Bank': 'berhan', 'Bank of Abyssinia': 'abyssinia',
    'NIB INTERNATIONAL BANK': 'nib', 'Tsehay Bank': 'tsehay', 'Awash International Bank': 'awash',
    'Commercial Bank of Ethiopia': 'cbe', 'Amhara Bank': 'amhara', 'Zemen Bank': 'zemen', 'Bunna Bank': 'bunna',
};

const BANK_LOGO_MAP = {
    'hibret': 'HB', 'wegagen': 'WB', 'enat': 'EN', 'oromia': 'OB',
    'coopbank': 'CO', 'dashen': 'DB', 'berhan': 'BB', 'abyssinia': 'BA',
    'nib': 'NI', 'tsehay': 'TS', 'awash': 'AI', 'cbe': 'CB',
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

const bankProducts = rows.map((row, idx) => {
    const bankId = BANK_SLUG_MAP[row.instituteName] || makeSlug(row.instituteName);
    const prodSlug = makeSlug(row.alias || row.productName || `product-${idx}`);
    const id = `${bankId}-${prodSlug}`;
    const isSaving = row.productType === 'Saving';
    const interestMin = row.interestMin || 0;
    const interestMax = row.interestMax || interestMin;
    const details = [{ label: 'Interest', value: interestMax > interestMin ? `${interestMin}-${interestMax}%` : `${interestMin}%`, positive: interestMin > 0 }];
    if (isSaving && row.minimumBalance > 0) details.push({ label: 'Min. Balance', value: `${row.minimumBalance.toLocaleString()} ETB` });
    if (row.loanAmount > 0 && !isSaving) details.push({ label: 'Max Loan', value: `${row.loanAmount.toLocaleString()} ETB` });

    return {
        id, category: 'Banks', bankId, bankName: row.instituteName,
        bankLogo: BANK_LOGO_MAP[bankId] || bankId.slice(0, 2).toUpperCase(),
        bankIconBg: BANK_ICON_BG_MAP[bankId] || 'bg-slate-50',
        title: row.productName || row.alias,
        matchScore: 70 + Math.floor(Math.random() * 20),
        href: `/catalogue/${id}`,
        details: details.slice(0, 3),
        description: (row.description || '').slice(0, 200),
        instituteId: bankId, name: row.productName || row.alias,
        type: row.productType === 'Credit' ? 'Loan' : 'Savings',
        interestRate: interestMin, interestMax: row.interestMax || undefined,
        maxAmount: row.loanAmount > 0 ? row.loanAmount : undefined,
        minBalance: row.minimumBalance > 0 ? row.minimumBalance : undefined,
    };
});

// ── 2. Load MFIs from banks.ts ──
const banksData = fs.readFileSync('lib/data/banks.ts', 'utf8');
const bankListMatch = banksData.match(/export const banks: Bank\[\] = \[([\s\S]*?)\];/);
const mfiEntries = [];
if (bankListMatch) {
    // Split by entry opening { but handle the first one carefully
    const parts = bankListMatch[1].split(/\n\s*\{/);
    parts.forEach(block => {
        if (block.includes("'Microfinance'")) {
            const idMatch = block.match(/id:\s*'([^']+)'/);
            const nameMatch = block.match(/name:\s*"([^"]+)"/) || block.match(/name:\s*'([^']+)'/);
            if (idMatch && nameMatch) {
                mfiEntries.push({ id: idMatch[1], name: nameMatch[1] });
            }
        }
    });
}

const mfiProducts = [];
mfiEntries.forEach(mfi => {
    const bankIconBg = 'bg-slate-50';
    const bankLogo = mfi.id.slice(0, 2).toUpperCase();

    // 1 Loan
    mfiProducts.push({
        id: `${mfi.id}-loan`, category: 'MFIs', bankId: mfi.id, bankName: mfi.name,
        bankLogo, bankIconBg, title: 'Business Loan',
        matchScore: 65 + Math.floor(Math.random() * 25),
        href: `/catalogue/${mfi.id}-loan`,
        details: [{ label: 'Interest', value: '15%', positive: true }],
        description: `Micro-business loan from ${mfi.name} designed for small enterprises.`,
        features: ["Quick Approval", "Flexible Repayment", "No Collateral for Small Amounts"],
        requirements: ["ID/Tin Certificate", "Business Plan", "Collateral Document"],
        instituteId: mfi.id, name: 'Business Loan', type: 'Loan', interestRate: 0.15
    });

    // 1 Savings
    mfiProducts.push({
        id: `${mfi.id}-savings`, category: 'MFIs', bankId: mfi.id, bankName: mfi.name,
        bankLogo, bankIconBg, title: 'Compulsory Savings',
        matchScore: 60 + Math.floor(Math.random() * 20),
        href: `/catalogue/${mfi.id}-savings`,
        details: [{ label: 'Interest', value: '7%', positive: true }],
        description: `Standard savings account from ${mfi.name} with competitive rates.`,
        features: ["Secure Savings", "Low Minimum Balance", "Mobile Access"],
        requirements: ["ID Required", "Initial Deposit", "Application Form"],
        instituteId: mfi.id, name: 'Compulsory Savings', type: 'Savings', interestRate: 0.07
    });
});

// ── 3. Reconstruct products.ts ──
const header = `import type { ProductCategory, Product } from './types';
export type { ProductCategory, Product };

export const products: Product[] = [
`;

const allEntries = [...bankProducts, ...mfiProducts];
const entriesStr = allEntries.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');

const footer = `
];

import { allDirectoryProducts } from './directory';

export const allProducts: Product[] = [...products, ...allDirectoryProducts];

export const getProductsByCategory = (category: string) => {
  if (category === 'All' || category === 'Browse All') return allProducts;
  return allProducts.filter(p => p.category === category);
};
`;

fs.writeFileSync('lib/data/products.ts', header + entriesStr + footer);
console.log(`Successfully reconstructed products.ts with ${bankProducts.length} bank products and ${mfiProducts.length} MFI products.`);
