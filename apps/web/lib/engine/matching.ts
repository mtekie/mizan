import { User, Product, TagDefinition } from '@prisma/client';

export function getProfileCompleteness(user: User): number {
    const fields = [
        'gender', 'dateOfBirth', 'educationLevel', 'employmentStatus',
        'monthlyIncomeRange', 'financialPriority', 'riskAppetite',
        'housingStatus', 'digitalAdoption'
    ];
    const filled = fields.filter(f => !!(user as any)[f]).length;
    return filled / fields.length;
}

function matchesProfile(userValue: any, tagValue: any): boolean {
    if (!userValue || !tagValue) return false;
    // Handle string comparisons, boolean strings, etc.
    if (typeof userValue === 'boolean') return userValue === (tagValue === 'true');
    return String(userValue).toLowerCase() === String(tagValue).toLowerCase();
}

function isExclusiveTag(tag: TagDefinition): boolean {
    return tag.slug === 'women_only';
}

export function computeMatchScore(
    user: User,
    product: Product & { tags: { tag: TagDefinition }[] }
): number {
    let score = 50; // Base

    // 1. Profile completeness bonus (0-15 pts)
    score += getProfileCompleteness(user) * 15;

    // 2. Tag-based matching (0-30 pts)
    const productTags = product.tags.map(t => t.tag);
    for (const tag of productTags) {
        if (!tag.profileField) continue;
        const userValue = (user as any)[tag.profileField];

        if (tag.category === 'AUDIENCE') {
            if (matchesProfile(userValue, tag.profileValue)) score += 8;
            else if (isExclusiveTag(tag)) {
                // Stricter mismatch penalty for exclusive audience tags
                if (tag.slug === 'women_only' && user.gender === 'MALE') score -= 40;
                if (tag.slug === 'youth' && user.dateOfBirth && (new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() > 25)) score -= 30;
            }
        }

        if (tag.category === 'FEATURE') {
            if (matchesProfile(userValue, tag.profileValue)) score += 5;
        }

        if (tag.category === 'SECTOR') {
            // Enhanced boost for sector alignment (Employment -> Product Sector)
            if (matchesProfile(userValue, tag.profileValue)) score += 12;
            
            // Contextual boosts
            if (user.employmentStatus === 'FARMER' && tag.slug === 'agriculture') score += 15;
            if (user.employmentStatus === 'SELF_EMPLOYED' && tag.slug === 'sme') score += 10;
        }

    }

    // 3. Simple heuristics for Income/Risk (0-5 pts each)
    if (user.interestFree && product.interestFree) score += 10;
    if (user.digitalAdoption === 'MOBILE' && product.digital) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
}
