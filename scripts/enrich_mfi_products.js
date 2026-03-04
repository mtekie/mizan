const fs = require('fs');
const path = require('path');

// Paths
const productsPath = path.join(__dirname, '../lib/data/products.ts');
const banksPath = path.join(__dirname, '../lib/data/banks.ts');

// Read files
let productsContent = fs.readFileSync(productsPath, 'utf8');
const banksContent = fs.readFileSync(banksPath, 'utf8');

// Parse banks
const banksMatch = banksContent.match(/export const banks: Bank\[\] = \[([\s\S]*?)\];/);
const bankMap = {};
if (banksMatch) {
    const bankEntries = banksMatch[1].split('\n  {').filter(s => s.trim().length > 0);
    bankEntries.forEach(entry => {
        const idMatch = entry.match(/id:\s*'([^']+)'/);
        const nameMatch = entry.match(/name:\s*"([^"]+)"/) || entry.match(/name:\s*'([^']+)'/);
        const logoMatch = entry.match(/logo:\s*'([^']+)'/);
        const colorMatch = entry.match(/color:\s*'([^']+)'/);
        if (idMatch && nameMatch) {
            bankMap[idMatch[1]] = {
                name: nameMatch[1],
                logo: logoMatch ? logoMatch[1] : idMatch[1].slice(0, 2).toUpperCase(),
                color: colorMatch ? colorMatch[1] : 'bg-slate-100'
            };
        }
    });
}

// Extract entries
const arrayStartMarker = 'export const products: Product[] = [';
const arrayStart = productsContent.indexOf(arrayStartMarker);
// Find the last ]; that closes the products array (before imports)
const entriesMatch = productsContent.match(/export const products: Product\[\] = \[([\s\S]*?)\];/);
if (!entriesMatch) {
    console.error("Could not find products array structure");
    process.exit(1);
}

const entriesRaw = entriesMatch[1];
const header = productsContent.slice(0, arrayStart + arrayStartMarker.length);
const footer = '\n];\n\nimport { allDirectoryProducts } from \'./directory\';\n\n// Merge all products into a single exported array\nexport const allProducts: Product[] = [...products, ...allDirectoryProducts];\n\nexport const getProductsByCategory = (category: string) => {\n  if (category === \'All\' || category === \'Browse All\') return allProducts;\n  return allProducts.filter(p => p.category === category);\n};\n';

const entries = entriesRaw.match(/\{[\s\S]*?\}/g) || [];
console.log(`Processing ${entries.length} entries.`);

const updatedEntries = entries.map(entry => {
    // Detect if it's already enriched correctly
    if (entry.includes("category: 'Banks'")) return entry;

    const instituteIdMatch = entry.match(/instituteId:\s*'([^']+)'/);
    if (!instituteIdMatch) return entry;

    const rawId = instituteIdMatch[1];
    const instituteId = rawId.replace('-', '');
    const bank = bankMap[instituteId] || bankMap[rawId];

    if (!bank) return entry;

    let enriched = entry;

    // Fix category
    if (!enriched.includes('category:')) {
        enriched = enriched.replace('{', `{\n    category: 'MFIs',`);
    } else if (enriched.includes("category: 'All'")) {
        enriched = enriched.replace("category: 'All'", "category: 'MFIs'");
    }

    // Standardize bank fields
    if (!enriched.includes('bankId:')) {
        enriched = enriched.replace('category:', `bankId: '${instituteId}',\n    category:`);
    }
    if (!enriched.includes('bankName:')) {
        enriched = enriched.replace('bankId:', `bankName: "${bank.name}",\n    bankId:`);
    }
    if (!enriched.includes('bankLogo:')) {
        enriched = enriched.replace('bankName:', `bankLogo: "${bank.logo}",\n    bankName:`);
    }
    if (!enriched.includes('bankIconBg:')) {
        enriched = enriched.replace('bankLogo:', `bankIconBg: "${bank.color || 'bg-slate-50'}",\n    bankLogo:`);
    }

    // Fix title/matchScore/href/details
    const nameMatch = entry.match(/name:\s*"([^"]+)"/);
    if (nameMatch && !enriched.includes('title:')) {
        enriched = enriched.replace('bankIconBg:', `title: "${nameMatch[1]}",\n    bankIconBg:`);
    }

    if (!enriched.includes('matchScore:')) {
        const score = 60 + Math.floor(Math.random() * 30);
        enriched = enriched.replace('title:', `matchScore: ${score},\n    title:`);
    }

    const idMatch = entry.match(/id:\s*'([^']+)'/);
    if (idMatch && !enriched.includes('href:')) {
        enriched = enriched.replace('matchScore:', `href: '/catalogue/${idMatch[1]}',\n    matchScore:`);
    }

    if (!enriched.includes('details:')) {
        const rateMatch = entry.match(/interestRate:\s*([\d.]+)/);
        let displayRate = '15%';
        if (rateMatch) {
            const num = parseFloat(rateMatch[1]);
            // Logic: if < 1 (e.g. 0.15), multiply by 100. If >= 1 (e.g. 12 or 3032), use as is but cap for display if crazy.
            if (num < 1) displayRate = (num * 100).toFixed(0) + '%';
            else if (num > 100) displayRate = 'Variable';
            else displayRate = num.toFixed(0) + '%';
        }
        enriched = enriched.replace('href:', `details: [{ label: 'Interest', value: '${displayRate}', positive: true }],\n    href:`);
    } else {
        // Fix existing bad details from previous run
        enriched = enriched.replace(/value: '(\d+)%', positive: true/g, (match, p1) => {
            const num = parseInt(p1);
            if (num > 100) return "value: 'Variable', positive: true";
            return match;
        });
    }

    return enriched;
});

fs.writeFileSync(productsPath, header + '\n  ' + updatedEntries.join(',\n  ') + footer);
console.log("MFI products enriched and structure repaired!");
