const fs = require('fs');

try {
    const mfiInsts = JSON.parse(fs.readFileSync('tmp_mfi_institutions.json', 'utf8'));
    const mfiProds = JSON.parse(fs.readFileSync('tmp_mfi_products.json', 'utf8'));

    // Update Banks/MFIs
    let banksFile = fs.readFileSync('lib/data/banks.ts', 'utf8');
    const insertIndex = banksFile.lastIndexOf('];');

    if (insertIndex !== -1) {
        const newInstsStr = mfiInsts.map(inst => `  {
    id: '${inst.id}',
    name: "${inst.name.replace(/"/g, '\\"')}",
    type: '${inst.type}',
    established: ${inst.established},
    branches: ${inst.branches},
    tier: '${inst.tier}',
    description: "${inst.description.replace(/"/g, '\\"')}",
    website: '${inst.website}'
  }`).join(',\n');

        // Check if we already merged to avoid duplicates
        if (!banksFile.includes('acsi-microfinance')) {
            banksFile = banksFile.slice(0, insertIndex) + ',\n' + newInstsStr + '\n];\n';
            fs.writeFileSync('lib/data/banks.ts', banksFile);
            console.log('Added MFIs to banks.ts');
        } else {
            console.log('MFIs already exist in banks.ts');
        }
    }

    // Update Products
    let prodsFile = fs.readFileSync('lib/data/products.ts', 'utf8');
    const prodsInsertIndex = prodsFile.lastIndexOf('];');

    if (prodsInsertIndex !== -1) {
        const newProdsStr = mfiProds.map(prod => {
            let fields = `    id: '${prod.id}',
    instituteId: '${prod.instituteId}',
    name: "${prod.name.replace(/"/g, '\\"')}",
    type: '${prod.type}',
    interestRate: ${prod.interestRate},
    description: "${prod.description.replace(/"/g, '\\"')}",
    features: ${JSON.stringify(prod.features)},
    eligibility: ${JSON.stringify(prod.eligibility)},
    requirements: ${JSON.stringify(prod.requirements)}`;

            if (prod.type === 'Loan') {
                fields += `,\n    maxAmount: ${prod.maxAmount},
    term: '${prod.term}',
    fees: '${prod.fees}',
    loanCategory: '${prod.loanCategory}'`;
            } else {
                fields += `,\n    minBalance: ${prod.minBalance}`;
            }

            return `  {\n${fields}\n  }`;
        }).join(',\n');

        // Check if merged
        if (!prodsFile.includes('acsi-loan-0')) {
            prodsFile = prodsFile.slice(0, prodsInsertIndex) + ',\n' + newProdsStr + '\n];\n';
            fs.writeFileSync('lib/data/products.ts', prodsFile);
            console.log('Added MFI products to products.ts');
        } else {
            console.log('MFI products already exist in products.ts');
        }
    }
} catch (e) {
    console.error(e);
}
