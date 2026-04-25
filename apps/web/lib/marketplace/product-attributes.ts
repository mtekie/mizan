export type InterestComputation = 'declining' | 'flat';

export type BaseProductAttributes = {
  notes?: string;
  sourceSheet?: string;
  lastReviewedAt?: string;
};

export type SavingsAttributes = BaseProductAttributes & {
  interestRate?: number;
  minBalance?: number;
  isCompulsory?: boolean;
  withdrawalRules?: string;
};

export type CreditAttributes = BaseProductAttributes & {
  interestRate?: number;
  interestMax?: number;
  interestComputation?: InterestComputation;
  insurancePremiumRate?: string;
  collateralRequirements?: string;
  repaymentFrequency?: string;
  disbursementTime?: string;
  maxAmount?: number;
  minAmount?: number;
  minAge?: number;
  maxAge?: number;
};

export type InsuranceAttributes = BaseProductAttributes & {
  premiumRate?: string;
  coverageLimit?: number;
  deductible?: number;
  exclusions?: string[];
};

export type PaymentAttributes = BaseProductAttributes & {
  transactionLimit?: number;
  fees?: string;
  channels?: string[];
};

export type CapitalMarketAttributes = BaseProductAttributes & {
  riskRating?: string;
  minimumInvestment?: number;
  expectedReturn?: string;
};

export type CommunityAttributes = BaseProductAttributes & {
  contributionFrequency?: string;
  groupSize?: string;
  payoutRules?: string;
};

export type ProductAttributes =
  | SavingsAttributes
  | CreditAttributes
  | InsuranceAttributes
  | PaymentAttributes
  | CapitalMarketAttributes
  | CommunityAttributes
  | Record<string, unknown>;
