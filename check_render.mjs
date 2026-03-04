import { allProducts } from './lib/data/products.ts';
import { banks } from './lib/data/banks.ts';

const formatInterest = (val) => val < 1 ? (val * 100).toFixed(0) : val.toFixed(0);

let errs = 0;
for (const product of allProducts) {
    try {
        const bank = banks.find(b => b.id === (product.bankId || product.instituteId));
        if (product.interestMax && product.interestMax > (product.interestRate || 0)) {
            const h = `${formatInterest(product.interestRate || 0)}–${formatInterest(product.interestMax)}%`;
        } else {
            const h = `${formatInterest(product.interestRate || 0)}%`;
        }

        // Emulate loops
        (product.features || []).map((feature, i) => feature.toString());
        (product.eligibility || []).map((item, i) => item.toString());
        (product.requirements || []).map((item, i) => item.toString());

    } catch (e) {
        console.log(`Product ${product.id} failed:`, e.message);
        errs++;
    }
}
console.log(`Total errors: ${errs}`);
