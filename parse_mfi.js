const xlsx = require('xlsx');
const fs = require('fs');

try {
    const workbook = xlsx.readFile('/Users/tykers/Downloads/mizan/Outreach and Financial Information MFIs  June 30 2025 (1).xls');

    // 1. Parse Head Office Info (Institutions)
    const hoSheet = workbook.Sheets['Head Office Information'];
    const hoData = xlsx.utils.sheet_to_json(hoSheet, { header: 1 });
    const newInstitutions = [];

    // Start from row 5 (index 4)
    for (let i = 4; i < hoData.length; i++) {
        const row = hoData[i];
        if (!row || !row[1]) continue;

        // Check if it's a total row
        if (row[1].includes && row[1].includes("Total")) break;

        const name = row[1];
        const hc = row[2] || '';

        newInstitutions.push({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: name + ' Microfinance', // Adding Microfinance to generic MFI names for clarity
            type: 'Microfinance',
            established: 1990, // default if unknown
            branches: parseInt(row[9]) || 1, // Total Employee as branches mapping for demo
            tier: 'Tier 3',
            description: `A microfinance institution headquartered in ${hc}.`,
            website: `https://${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.mfi.et`
        });
    }

    // 2. Parse Products
    const prodSheet = workbook.Sheets['Products and Services'];
    const prodData = xlsx.utils.sheet_to_json(prodSheet, { header: 1 });
    const newProducts = [];

    for (let i = 4; i < prodData.length; i++) {
        const row = prodData[i];
        if (!row || !row[1]) continue;
        if (row[1].includes && row[1].includes("Total")) break;

        const mfiName = row[1] + ' Microfinance';
        const instId = row[1].toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Loan Product
        const loanTypes = (row[2] || '').split(/,|\n/);
        const loanRate = (row[3] || '12%').toString().replace(/[^0-9.]/g, '') || 12;

        loanTypes.forEach((type, index) => {
            if (!type.trim()) return;
            newProducts.push({
                id: `${instId}-loan-${index}`,
                instituteId: instId,
                name: `${type.trim()} Loan`,
                type: 'Loan',
                interestRate: Number(loanRate),
                description: `${type.trim()} Loan provided by ${mfiName} at ${loanRate}% interest.`,
                features: ['Flexible Term', 'Fast Approval'],
                eligibility: ['ID Required', 'Kebele ID'],
                requirements: ['Guarantor', 'Business License'],
                maxAmount: 50000,
                term: '1-3 Years',
                fees: '2% Processing',
                loanCategory: 'Micro Loan'
            });
        });

        // Saving Product
        const savingTypes = (row[5] || '').split(/,|\n/);
        const saveRate = (row[6] || '7%').toString().replace(/[^0-9.]/g, '') || 7;

        savingTypes.forEach((type, index) => {
            if (!type.trim()) return;
            newProducts.push({
                id: `${instId}-save-${index}`,
                instituteId: instId,
                name: `${type.trim()} Account`,
                type: 'Savings',
                interestRate: Number(saveRate),
                description: `${type.trim()} Savings Account provided by ${mfiName} at ${saveRate}% interest.`,
                features: ['Compound Interest', 'Low Minimum Balance'],
                eligibility: ['ID Required'],
                requirements: ['Initial Deposit'],
                minBalance: 50
            });
        });
    }

    fs.writeFileSync('tmp_mfi_institutions.json', JSON.stringify(newInstitutions, null, 2));
    fs.writeFileSync('tmp_mfi_products.json', JSON.stringify(newProducts, null, 2));

    console.log(`Extracted ${newInstitutions.length} MFI Institutions.`);
    console.log(`Extracted ${newProducts.length} MFI Products.`);

} catch (e) {
    console.error("Error formatting MFI data: ", e);
}
