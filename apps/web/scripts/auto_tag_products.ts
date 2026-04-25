/**
 * Auto-tag existing products based on keywords and existing flags.
 * Run: npx tsx scripts/auto_tag_products.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  console.log('🏷️  Starting auto-tagging process...');

  const products = await prisma.product.findMany();
  const tagDefinitions = await prisma.tagDefinition.findMany();
  const tagMap = new Map(tagDefinitions.map(t => [t.slug, t.id]));

  console.log(`📦 Found ${products.length} products and ${tagDefinitions.length} tag definitions.`);

  let totalTagsApplied = 0;
  const rowsToCreate: Array<{ productId: string; tagId: string }> = [];

  for (const product of products) {
    const appliedTagIds: string[] = [];
    const textToScan = `${product.name} ${product.description} ${product.features.join(' ')} ${product.eligibility.join(' ')}`.toLowerCase();

    // 1. Feature Tags based on flags
    if (product.interestFree && tagMap.has('interest_free')) appliedTagIds.push(tagMap.get('interest_free')!);
    if (product.interestFree && tagMap.has('sharia_compliant')) appliedTagIds.push(tagMap.get('sharia_compliant')!);
    if (product.digital && tagMap.has('digital_only')) appliedTagIds.push(tagMap.get('digital_only')!);
    if (product.genderBased && tagMap.has('women_only')) appliedTagIds.push(tagMap.get('women_only')!);

    // 2. Keyword-based tagging
    const keywordRules: Record<string, string[]> = {
      'agriculture': ['agri', 'farm', 'crop', 'livestock', 'irrigation'],
      'trade': ['trade', 'merchandise', 'import', 'export', 'retail', 'wholesale'],
      'construction': ['construction', 'building', 'cement', 'real estate'],
      'manufacturing': ['manufactur', 'factory', 'production', 'industry'],
      'transport': ['transport', 'logistics', 'truck', 'vehicle', 'cargo'],
      'education_sector': ['education', 'school', 'university', 'tuition'],
      'health_sector': ['health', 'medical', 'hospital', 'pharma'],
      'diaspora': ['diaspora', 'non-resident', 'abroad'],
      'youth': ['youth', 'child', 'teen', 'student'],
      'interest_free': ['interest free', 'sharia', 'halal', 'winterest'],
      'no_collateral': ['no collateral', 'unsecured', 'clean loan', 'guarantor based'],
      'flexible_repayment': ['flexible repayment', 'grace period'],
      'requires_kebele_id': ['kebele id', 'resident id'],
      'requires_tin': ['tin', 'tax identification'],
    };

    for (const [tagSlug, keywords] of Object.entries(keywordRules)) {
      if (keywords.some(k => textToScan.includes(k)) && tagMap.has(tagSlug)) {
        const tagId = tagMap.get(tagSlug)!;
        if (!appliedTagIds.includes(tagId)) {
          appliedTagIds.push(tagId);
        }
      }
    }

    // 3. MFI and Sector heuristics
    if (product.productClass === 'CREDIT' && (product.category === 'MFIs' || textToScan.includes('micro'))) {
      if (tagMap.has('low_income')) appliedTagIds.push(tagMap.get('low_income')!);
    }

    if (product.category === 'MFIs' || product.category === 'Banks') {
      if (tagMap.has('nbe_regulated')) appliedTagIds.push(tagMap.get('nbe_regulated')!);
    }

    if (product.productClass === 'CREDIT') {
      if (tagMap.has('general_sector')) appliedTagIds.push(tagMap.get('general_sector')!);
      if (product.productType === 'business_loan' && tagMap.has('self_employed')) {
        appliedTagIds.push(tagMap.get('self_employed')!);
      }
      if ((product.collateralRequirements || '').toLowerCase().includes('collateral') && tagMap.has('requires_collateral')) {
        appliedTagIds.push(tagMap.get('requires_collateral')!);
      }
    }

    if (product.productClass === 'SAVINGS') {
      if (tagMap.has('first_time_saver')) appliedTagIds.push(tagMap.get('first_time_saver')!);
      if (tagMap.has('deposit_insured')) appliedTagIds.push(tagMap.get('deposit_insured')!);
      if (product.productType === 'compulsory_savings' && tagMap.has('requires_membership')) {
        appliedTagIds.push(tagMap.get('requires_membership')!);
      }
    }

    if (product.productClass === 'PAYMENT') {
      if (tagMap.has('mobile_accessible')) appliedTagIds.push(tagMap.get('mobile_accessible')!);
      if (tagMap.has('digital_only')) appliedTagIds.push(tagMap.get('digital_only')!);
    }

    if (product.productClass === 'COMMUNITY' && tagMap.has('requires_membership')) {
      appliedTagIds.push(tagMap.get('requires_membership')!);
    }

    // Queue tags
    const uniqueTagIds = Array.from(new Set(appliedTagIds));
    if (uniqueTagIds.length > 0) {
      for (const tagId of uniqueTagIds) {
        rowsToCreate.push({ productId: product.id, tagId });
      }
      totalTagsApplied += uniqueTagIds.length;
    }
  }

  const batchSize = 500;
  for (let i = 0; i < rowsToCreate.length; i += batchSize) {
    await prisma.productTag.createMany({
      data: rowsToCreate.slice(i, i + batchSize),
      skipDuplicates: true,
    });
  }

  console.log(`✅ Auto-tagging complete. Queued ${totalTagsApplied} tags across products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
