export type ProductCategory = 'Banks' | 'BNPL' | 'Insurance' | 'MFIs' | 'SACCOs';

export type Product = {
    id: string;
    category?: ProductCategory;
    bankId?: string;
    bankName?: string;
    bankLogo?: string;
    bankIconBg?: string;
    title?: string;
    matchScore?: number;
    details?: { label: string; value: string; positive?: boolean }[];
    highlight?: string;
    href?: string;
    description: string;

    // Shared enriched fields
    instituteId?: string;
    name?: string;
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
