/**
 * Migrate existing Product rows: link to Provider, set productClass/productType, generate slugs
 * Also migrates directory.ts products (insurance, wallet, SACCO, BNPL)
 * Run: npx tsx scripts/migrate_products.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

// Map old category to productClass
function inferProductClass(product: any): string {
  if (product.category === 'Insurance') return 'INSURANCE';
  if (product.category === 'BNPL') return 'PAYMENT';
  if (product.category === 'SACCOs') return 'COMMUNITY';
  // Banks and MFIs have Loan or Savings types
  const type = (product.type || product.title || '').toLowerCase();
  if (type.includes('loan') || type.includes('credit') || type.includes('overdraft') || type.includes('financing') || type.includes('merchandise')) return 'CREDIT';
  if (type.includes('saving') || type.includes('deposit') || type.includes('account') || type.includes('fund') || type.includes('escrow')) return 'SAVINGS';
  if (type.includes('insurance')) return 'INSURANCE';
  if (type.includes('payment') || type.includes('transfer') || type.includes('wallet') || type.includes('bnpl')) return 'PAYMENT';
  if (type.includes('equb') || type.includes('sacco')) return 'COMMUNITY';
  return 'SAVINGS'; // Default
}

// Map to finer productType slug
function inferProductType(product: any): string {
  const title = (product.title || product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();

  // CREDIT types
  if (title.includes('personal loan') || title.includes('consumer loan')) return 'personal_loan';
  if (title.includes('business loan') || title.includes('working capital')) return 'business_loan';
  if (title.includes('housing') || title.includes('mortgage') || title.includes('home')) return 'housing_loan';
  if (title.includes('vehicle') || title.includes('motor') || title.includes('auto')) return 'vehicle_loan';
  if (title.includes('agriculture') || title.includes('agri') || title.includes('farm')) return 'agriculture_loan';
  if (title.includes('micro') || title.includes('small')) return 'micro_loan';
  if (title.includes('group')) return 'group_loan';
  if (title.includes('merchandise') || title.includes('warehouse')) return 'merchandise_loan';
  if (title.includes('overdraft')) return 'overdraft';
  if (title.includes('emergency')) return 'emergency_loan';
  if (title.includes('education') || title.includes('school')) return 'education_loan';
  if (title.includes('diaspora') && title.includes('loan')) return 'diaspora_loan';
  if (title.includes('investment') || title.includes('project')) return 'investment_loan';
  if (title.includes('trade') || title.includes('letter of credit') || title.includes('lc')) return 'trade_finance';
  if (title.includes('lease')) return 'lease_financing';
  if (title.includes('consumer durable') || title.includes('furniture')) return 'consumer_durables_loan';

  // SAVINGS types
  if (title.includes('time deposit') || title.includes('fixed deposit') || title.includes('fixed time')) return 'time_deposit';
  if (title.includes('youth') || title.includes('child') || title.includes('minor')) return 'youth_savings';
  if (title.includes('teen')) return 'teen_savings';
  if (title.includes('women') || title.includes("woman") || title.includes('gender')) return 'womens_savings';
  if (title.includes('diaspora') || title.includes('foreign currency') || title.includes('fcy')) return 'diaspora_savings';
  if (title.includes('forex') || title.includes('fca')) return 'forex_account';
  if (title.includes('provident')) return 'provident_fund';
  if (title.includes('holiday') || title.includes('vacation')) return 'holiday_savings';
  if (title.includes('sme') || title.includes('entrepreneur')) return 'sme_savings';
  if (title.includes('premium')) return 'premium_savings';
  if (title.includes('escrow')) return 'escrow_deposit';
  if (title.includes('salary')) return 'salary_account';
  if (title.includes('demand') || title.includes('current') || title.includes('checking')) return 'demand_deposit';
  if (title.includes('compulsory')) return 'compulsory_savings';

  // INSURANCE types
  if (title.includes('motor') && title.includes('comprehensive')) return 'motor_comprehensive';
  if (title.includes('motor') || title.includes('third party')) return 'motor_third_party';
  if (title.includes('term life')) return 'life_term';
  if (title.includes('endowment')) return 'life_endowment';
  if (title.includes('health') && title.includes('group')) return 'health_group';
  if (title.includes('health')) return 'health_individual';
  if (title.includes('fire')) return 'property_fire';
  if (title.includes('travel')) return 'travel';
  if (title.includes('engineering') || title.includes('construction')) return 'engineering_car';
  if (title.includes('life')) return 'life_term';

  // PAYMENT types
  if (title.includes('p2p') || title.includes('transfer')) return 'p2p_transfer';
  if (title.includes('bill')) return 'bill_payment';
  if (title.includes('merchant') || title.includes('qr')) return 'merchant_qr';
  if (title.includes('bnpl') || title.includes('buy now') || title.includes('buy later')) return 'bnpl';

  // COMMUNITY
  if (title.includes('equb')) return title.includes('weekly') ? 'equb_weekly' : 'equb_monthly';
  if (title.includes('sacco') && title.includes('loan')) return 'sacco_loan';
  if (title.includes('sacco')) return 'sacco_savings';

  // Fallback by class
  const pc = inferProductClass({ ...product, type: product.type || title });
  if (pc === 'CREDIT') return 'business_loan';
  if (pc === 'SAVINGS') return 'regular_savings';
  return 'regular_savings';
}

// Generate a slug from bankId + title
function makeSlug(bankId: string | null, title: string | null): string {
  const base = `${bankId || 'unknown'}-${title || 'product'}`;
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

async function main() {
  // 1. Load all providers for lookup
  const allProviders = await prisma.provider.findMany();
  const providerMap = new Map(allProviders.map(p => [p.slug, p.id]));
  console.log(`📦 Loaded ${allProviders.length} providers for mapping`);

  // 2. Get all existing products
  const products = await prisma.product.findMany();
  console.log(`📋 Found ${products.length} products to migrate`);

  let updated = 0, skipped = 0, slugConflicts = 0;
  const usedSlugs = new Set<string>();

  for (const p of products) {
    // Skip if already migrated
    if (p.slug && p.providerId) { skipped++; continue; }

    const bankId = p.bankId || '';
    const providerId = providerMap.get(bankId) || null;
    const productClass = inferProductClass(p);
    const productType = inferProductType(p);
    let slug = makeSlug(bankId, p.title);

    // Deduplicate slugs
    if (usedSlugs.has(slug)) {
      slugConflicts++;
      slug = `${slug}-${slugConflicts}`;
    }
    usedSlugs.add(slug);

    // Build attributes JSON
    const attributes: Record<string, any> = {};
    if (p.interestRate) attributes.interestRate = p.interestRate;
    if (p.interestMax) attributes.interestMax = p.interestMax;
    if (p.maxAmount) attributes.maxAmount = p.maxAmount;
    if (p.term) attributes.term = p.term;
    if (p.fees) attributes.fees = p.fees;
    if (p.minBalance) attributes.minBalance = p.minBalance;
    if (p.repaymentFrequency) attributes.repaymentFrequency = p.repaymentFrequency;
    if (p.disbursementTime) attributes.disbursementTime = p.disbursementTime;
    if (p.collateralRequirements) attributes.collateralRequirements = p.collateralRequirements;
    if (p.prepaymentPenalties) attributes.prepaymentPenalties = p.prepaymentPenalties;
    if (p.latePaymentPenalties) attributes.latePaymentPenalties = p.latePaymentPenalties;
    if (p.insuranceRequirements) attributes.insuranceRequirements = p.insuranceRequirements;

    // Flag suspicious data quality
    const isVerified = !(
      (p.interestRate && p.interestRate > 100) || // Likely a range "17-19%" parsed wrong
      (!p.description || p.description.length < 10)
    );

    await prisma.product.update({
      where: { id: p.id },
      data: {
        slug,
        providerId,
        productClass,
        productType,
        name: p.title,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        isVerified,
      },
    });
    updated++;
  }

  console.log(`\n✅ Migration complete:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (already done): ${skipped}`);
  console.log(`   Slug conflicts resolved: ${slugConflicts}`);

  // 3. Report on unlinked products (no matching provider)
  const unlinked = await prisma.product.count({ where: { providerId: null } });
  console.log(`   ⚠️  Unlinked (no provider): ${unlinked}`);

  // 4. Report on unverified data
  const unverified = await prisma.product.count({ where: { isVerified: false } });
  console.log(`   🔍 Flagged unverified: ${unverified}`);

  // 5. Summary by class
  const byClass = await prisma.product.groupBy({
    by: ['productClass'],
    _count: true,
  });
  console.log('\n📊 Products by class:');
  for (const g of byClass) {
    console.log(`   ${g.productClass}: ${g._count}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
