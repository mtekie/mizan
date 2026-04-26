import type { ProductAttributes } from '@/lib/marketplace/product-attributes';

export type ProductCategory = 'Banks' | 'BNPL' | 'Insurance' | 'MFIs' | 'SACCOs';
export type ProductClass = 'SAVINGS' | 'CREDIT' | 'INSURANCE' | 'PAYMENT' | 'CAPITAL_MARKET' | 'COMMUNITY';

export type Product = {
    id: string;
    category?: ProductCategory;
    bankId?: string;
    bankName?: string;
    bankLogo?: string;
    bankIconBg?: string;
    title?: string;
    matchScore?: number;
    personalizedScore?: number;
    details?: { label: string; value: string; positive?: boolean }[];
    highlight?: string;
    href?: string;
    description: string;

    // Shared enriched fields
    instituteId?: string;
    providerId?: string;
    name?: string;
    productClass?: ProductClass;
    productType?: string;
    attributes?: ProductAttributes;
    provider?: {
        id?: string;
        name?: string;
        logoUrl?: string | null;
        brandColor?: string | null;
        shortCode?: string | null;
    } | null;
    type?: string;
    interestRate?: number;
    interestMax?: number;
    features?: string[];
    eligibility?: string[];
    requirements?: string[];
    maxAmount?: number;
    term?: string;
    fees?: string;
    loanCategory?: string;
    minBalance?: number;
    isFeatured?: boolean;
    isVerified?: boolean;
    updatedAt?: Date | string;
    sourceName?: string | null;
    sourceUrl?: string | null;
    sourceType?: string | null;
    lastReviewedAt?: Date | string | null;
    reviewedBy?: string | null;
    dataConfidence?: number | null;

    // Rich Excel fields
    digital?: boolean;
    interestFree?: boolean;
    genderBased?: boolean;
    currency?: string;
    repaymentFrequency?: string;
    disbursementTime?: string;
    collateralRequirements?: string;
    prepaymentPenalties?: string;
    latePaymentPenalties?: string;
    insuranceRequirements?: string;
};
