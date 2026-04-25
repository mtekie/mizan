/**
 * Data Quality Audit Report
 * Run: npx tsx scripts/audit_data_quality.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  console.log('🔍 Starting Data Quality Audit...');

  const totalProducts = await prisma.product.count();
  const unlinkedProducts = await prisma.product.findMany({
    where: { providerId: null },
    select: { name: true, bankName: true, category: true }
  });

  const productsWithSuspiciousRates = await prisma.product.findMany({
    where: {
      OR: [
        { interestRate: { gt: 100 } },
        { interestMax: { gt: 100 } }
      ]
    },
    select: { id: true, name: true, interestRate: true, interestMax: true }
  });

  const productsWithEmptyDescription = await prisma.product.count({
    where: { description: "" }
  });

  const productsWithNoTags = await prisma.product.findMany({
    where: { tags: { none: {} } },
    select: { name: true }
  });

  const productsUnverified = await prisma.product.count({
    where: { isVerified: false }
  });

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total Products: ${totalProducts}`);
  console.log(`Unlinked (No Provider): ${unlinkedProducts.length}`);
  console.log(`Suspicious Rates (>100%): ${productsWithSuspiciousRates.length}`);
  console.log(`Empty Descriptions: ${productsWithEmptyDescription}`);
  console.log(`Products with No Tags: ${productsWithNoTags.length}`);
  console.log(`Unverified Flag Set: ${productsUnverified}`);

  if (unlinkedProducts.length > 0) {
    console.log('\n--- UNLINKED SAMPLES ---');
    unlinkedProducts.slice(0, 10).forEach(p => console.log(`- ${p.name} (Bank: ${p.bankName}, Cat: ${p.category})`));
  }

  if (productsWithSuspiciousRates.length > 0) {
    console.log('\n--- SUSPICIOUS RATE SAMPLES ---');
    productsWithSuspiciousRates.slice(0, 5).forEach(p => console.log(`- ${p.name}: ${p.interestRate}% - ${p.interestMax}%`));
  }

  console.log('\n--- CLASS DISTRIBUTION ---');
  const classDist = await prisma.product.groupBy({
    by: ['productClass'],
    _count: true
  });
  classDist.forEach(c => console.log(`${c.productClass || 'UNKNOWN'}: ${c._count}`));

  console.log('\n--- PROVIDER COVERAGE ---');
  const providerCoverage = await prisma.provider.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { products: { _count: 'desc' } },
    take: 10
  });
  providerCoverage.forEach(p => console.log(`${p.name}: ${p._count.products} products`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
