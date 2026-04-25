import { User, Product, TagDefinition } from '@prisma/client';
import { getProfileCompletion } from '@/lib/profile/completeness';

export function getProfileCompleteness(user: User): number {
    return getProfileCompletion(user as any).percentage / 100;
}

function normalizeProfileValue(value: any): string {
    return String(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function ageFromDate(value: Date | string): number | null {
    const birthDate = new Date(value);
    if (Number.isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDelta = today.getMonth() - birthDate.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    return age;
}

function matchesProfile(userValue: any, tagValue: any, profileField?: string | null): boolean {
    if (!userValue || !tagValue) return false;

    if (profileField === 'dateOfBirth') {
        const age = ageFromDate(userValue);
        if (age === null) return false;
        const normalizedTag = normalizeProfileValue(tagValue);
        if (normalizedTag === 'under_18') return age < 18;
        if (normalizedTag === 'teen') return age >= 14 && age <= 17;
        if (normalizedTag === 'youth') return age >= 18 && age <= 35;
        if (normalizedTag === 'senior') return age >= 60;
    }

    // Handle string comparisons, boolean strings, etc.
    if (typeof userValue === 'boolean') return userValue === (tagValue === 'true');
    return normalizeProfileValue(userValue) === normalizeProfileValue(tagValue);
}

function isExclusiveTag(tag: TagDefinition): boolean {
    return ['women_only', 'diaspora', 'expat'].includes(tag.slug);
}

export function hasHardFilterMismatch(user: User, tag: TagDefinition): boolean {
    if (!tag.profileField || !tag.profileValue) return false;

    const hardFilterFields = ['gender', 'residencyStatus', 'employmentSector'];
    if (!hardFilterFields.includes(tag.profileField)) return false;

    const userValue = (user as any)[tag.profileField];
    if (!userValue) return false;

    return !matchesProfile(userValue, tag.profileValue, tag.profileField);
}

export function isProductEligibleForUser(
    user: User,
    product: Product & { tags: { tag: TagDefinition }[] }
): boolean {
    return !product.tags.some(({ tag }) => hasHardFilterMismatch(user, tag));
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
            if (matchesProfile(userValue, tag.profileValue, tag.profileField)) score += 8;
            else if (isExclusiveTag(tag)) {
                // Stricter mismatch penalty for exclusive audience tags
                if (tag.slug === 'women_only' && normalizeProfileValue(user.gender) === 'male') score -= 40;
                if (tag.slug === 'diaspora' && user.residencyStatus !== 'DIASPORA') score -= 30;
                if (tag.slug === 'expat' && user.residencyStatus !== 'EXPAT') score -= 30;
                if (tag.slug === 'youth' && user.dateOfBirth && (new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() > 25)) score -= 30;
            }
        }

        if (tag.category === 'FEATURE') {
            if (matchesProfile(userValue, tag.profileValue, tag.profileField)) score += 5;
        }

        if (tag.category === 'SECTOR') {
            // Enhanced boost for sector alignment (Employment -> Product Sector)
            if (matchesProfile(userValue, tag.profileValue, tag.profileField)) score += 12;
            
            // Contextual boosts
            if (normalizeProfileValue(user.employmentSector) === 'agriculture' && tag.slug === 'agriculture') score += 15;
            if (normalizeProfileValue(user.employmentStatus) === 'self_employed' && tag.slug === 'sme') score += 10;
        }

    }

    // 3. Simple heuristics for Income/Risk (0-5 pts each)
    if (user.interestFree && product.interestFree) score += 10;
    if (user.digitalAdoption === 'MOBILE' && product.digital) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
}
