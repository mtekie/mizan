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

    // Apply tags
    if (appliedTagIds.length > 0) {
      for (const tagId of appliedTagIds) {
        await prisma.productTag.upsert({
          where: {
            productId_tagId: {
              productId: product.id,
              tagId: tagId,
            },
          },
          update: {},
          create: {
            productId: product.id,
            tagId: tagId,
          },
        });
      }
      totalTagsApplied += appliedTagIds.length;
    }
  }

  console.log(`✅ Auto-tagging complete. Applied ${totalTagsApplied} tags across products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
