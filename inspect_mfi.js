const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('/Users/tykers/Downloads/mizan/Outreach and Financial Information MFIs  June 30 2025 (1).xls');

    console.log('\n--- Products and Services ---');
    const productsSheet = workbook.Sheets['Products and Services'];
    const productsData = xlsx.utils.sheet_to_json(productsSheet, { header: 1 });
    productsData.slice(0, 5).forEach(row => console.log(JSON.stringify(row)));

    console.log('\n--- Loan by Product ---');
    const loanSheet = workbook.Sheets['Loan by Product '];
    if (loanSheet) {
        const loanData = xlsx.utils.sheet_to_json(loanSheet, { header: 1 });
        loanData.slice(0, 5).forEach(row => console.log(JSON.stringify(row)));
    }
} catch (e) {
    console.error(e.message);
}
