/**
 * Seed ProductTypeDefinitions + TagDefinitions
 * Run: npx tsx scripts/seed_taxonomy.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const productTypes = [
  // SAVINGS
  { slug: 'regular_savings', label: 'Regular Savings', productClass: 'SAVINGS', icon: '💰' },
  { slug: 'demand_deposit', label: 'Demand Deposit / Current Account', productClass: 'SAVINGS', icon: '🏦' },
  { slug: 'time_deposit', label: 'Time Deposit', productClass: 'SAVINGS', icon: '⏳' },
  { slug: 'fixed_deposit', label: 'Fixed Deposit', productClass: 'SAVINGS', icon: '🔒' },
  { slug: 'youth_savings', label: 'Youth Savings', productClass: 'SAVINGS', icon: '👶' },
  { slug: 'teen_savings', label: 'Teen Savings', productClass: 'SAVINGS', icon: '🧑' },
  { slug: 'womens_savings', label: "Women's Savings", productClass: 'SAVINGS', icon: '👩' },
  { slug: 'diaspora_savings', label: 'Diaspora Savings', productClass: 'SAVINGS', icon: '🌍' },
  { slug: 'forex_account', label: 'Foreign Currency Account', productClass: 'SAVINGS', icon: '💱' },
  { slug: 'provident_fund', label: 'Provident Fund', productClass: 'SAVINGS', icon: '🏢' },
  { slug: 'mortgage_savings', label: 'Mortgage Savings', productClass: 'SAVINGS', icon: '🏠' },
  { slug: 'holiday_savings', label: 'Holiday Savings', productClass: 'SAVINGS', icon: '🎉' },
  { slug: 'sme_savings', label: 'SME Savings', productClass: 'SAVINGS', icon: '📈' },
  { slug: 'premium_savings', label: 'Premium Savings', productClass: 'SAVINGS', icon: '⭐' },
  { slug: 'escrow_deposit', label: 'Escrow Deposit', productClass: 'SAVINGS', icon: '🤝' },
  { slug: 'compulsory_savings', label: 'Compulsory Savings', productClass: 'SAVINGS', icon: '📋' },
  { slug: 'voluntary_savings', label: 'Voluntary Savings', productClass: 'SAVINGS', icon: '✋' },
  { slug: 'salary_account', label: 'Salary Account', productClass: 'SAVINGS', icon: '💼' },
  // CREDIT
  { slug: 'personal_loan', label: 'Personal Loan', productClass: 'CREDIT', icon: '👤' },
  { slug: 'business_loan', label: 'Business Loan', productClass: 'CREDIT', icon: '🏪' },
  { slug: 'housing_loan', label: 'Housing / Mortgage Loan', productClass: 'CREDIT', icon: '🏠' },
  { slug: 'vehicle_loan', label: 'Vehicle Loan', productClass: 'CREDIT', icon: '🚗' },
  { slug: 'agriculture_loan', label: 'Agriculture Loan', productClass: 'CREDIT', icon: '🌾' },
  { slug: 'micro_loan', label: 'Micro Loan', productClass: 'CREDIT', icon: '🔬' },
  { slug: 'group_loan', label: 'Group Loan', productClass: 'CREDIT', icon: '👥' },
  { slug: 'merchandise_loan', label: 'Merchandise Loan', productClass: 'CREDIT', icon: '📦' },
  { slug: 'overdraft', label: 'Overdraft', productClass: 'CREDIT', icon: '📊' },
  { slug: 'emergency_loan', label: 'Emergency Loan', productClass: 'CREDIT', icon: '🚨' },
  { slug: 'consumer_durables_loan', label: 'Consumer Durables Loan', productClass: 'CREDIT', icon: '🛋️' },
  { slug: 'education_loan', label: 'Education Loan', productClass: 'CREDIT', icon: '🎓' },
  { slug: 'diaspora_loan', label: 'Diaspora Loan', productClass: 'CREDIT', icon: '🌍' },
  { slug: 'investment_loan', label: 'Investment / Project Loan', productClass: 'CREDIT', icon: '🏗️' },
  { slug: 'warehouse_receipt', label: 'Warehouse Receipt Financing', productClass: 'CREDIT', icon: '🏭' },
  { slug: 'lease_financing', label: 'Lease Financing', productClass: 'CREDIT', icon: '📄' },
  { slug: 'trade_finance', label: 'Trade Finance (LC/Guarantee)', productClass: 'CREDIT', icon: '🚢' },
  // INSURANCE
  { slug: 'motor_comprehensive', label: 'Motor Comprehensive', productClass: 'INSURANCE', icon: '🚗' },
  { slug: 'motor_third_party', label: 'Motor Third Party', productClass: 'INSURANCE', icon: '🛡️' },
  { slug: 'life_term', label: 'Term Life Insurance', productClass: 'INSURANCE', icon: '❤️' },
  { slug: 'life_endowment', label: 'Endowment Life Insurance', productClass: 'INSURANCE', icon: '💎' },
  { slug: 'life_whole', label: 'Whole Life Insurance', productClass: 'INSURANCE', icon: '🏛️' },
  { slug: 'health_group', label: 'Group Health Insurance', productClass: 'INSURANCE', icon: '🏥' },
  { slug: 'health_individual', label: 'Individual Health Insurance', productClass: 'INSURANCE', icon: '💊' },
  { slug: 'property_fire', label: 'Fire & Allied Perils', productClass: 'INSURANCE', icon: '🔥' },
  { slug: 'property_burglary', label: 'Burglary Insurance', productClass: 'INSURANCE', icon: '🔐' },
  { slug: 'marine_cargo', label: 'Marine & Cargo Insurance', productClass: 'INSURANCE', icon: '🚢' },
  { slug: 'travel', label: 'Travel Insurance', productClass: 'INSURANCE', icon: '✈️' },
  { slug: 'engineering_car', label: 'Construction All Risk', productClass: 'INSURANCE', icon: '🏗️' },
  { slug: 'engineering_ear', label: 'Erection All Risk', productClass: 'INSURANCE', icon: '⚙️' },
  { slug: 'machinery_breakdown', label: 'Machinery Breakdown', productClass: 'INSURANCE', icon: '🔧' },
  { slug: 'workmen_compensation', label: "Workmen's Compensation", productClass: 'INSURANCE', icon: '👷' },
  { slug: 'professional_indemnity', label: 'Professional Indemnity', productClass: 'INSURANCE', icon: '⚖️' },
  { slug: 'general_liability', label: 'General Liability', productClass: 'INSURANCE', icon: '📜' },
  { slug: 'agricultural_crop', label: 'Crop Insurance', productClass: 'INSURANCE', icon: '🌱' },
  { slug: 'livestock', label: 'Livestock Insurance', productClass: 'INSURANCE', icon: '🐄' },
  { slug: 'microinsurance', label: 'Microinsurance', productClass: 'INSURANCE', icon: '🔬' },
  { slug: 'bond_insurance', label: 'Bond Insurance', productClass: 'INSURANCE', icon: '📋' },
  { slug: 'group_credit_life', label: 'Group Credit Life', productClass: 'INSURANCE', icon: '👥' },
  // PAYMENT
  { slug: 'mobile_wallet', label: 'Mobile Wallet', productClass: 'PAYMENT', icon: '📱' },
  { slug: 'p2p_transfer', label: 'P2P Transfer', productClass: 'PAYMENT', icon: '🔄' },
  { slug: 'bill_payment', label: 'Bill Payment', productClass: 'PAYMENT', icon: '🧾' },
  { slug: 'merchant_qr', label: 'Merchant QR Payment', productClass: 'PAYMENT', icon: '📷' },
  { slug: 'agent_banking', label: 'Agent Banking', productClass: 'PAYMENT', icon: '🏪' },
  { slug: 'ussd_banking', label: 'USSD Banking', productClass: 'PAYMENT', icon: '📟' },
  { slug: 'internet_banking', label: 'Internet Banking', productClass: 'PAYMENT', icon: '🌐' },
  { slug: 'mobile_banking_app', label: 'Mobile Banking App', productClass: 'PAYMENT', icon: '📲' },
  { slug: 'international_remittance', label: 'International Remittance', productClass: 'PAYMENT', icon: '🌍' },
  { slug: 'bnpl', label: 'Buy Now Pay Later', productClass: 'PAYMENT', icon: '🛒' },
  { slug: 'pos_terminal', label: 'POS Terminal', productClass: 'PAYMENT', icon: '💳' },
  // CAPITAL_MARKET
  { slug: 'esx_stock', label: 'ESX Stock', productClass: 'CAPITAL_MARKET', icon: '📈' },
  { slug: 'government_bond', label: 'Government Bond', productClass: 'CAPITAL_MARKET', icon: '🏛️' },
  { slug: 'treasury_bill', label: 'Treasury Bill', productClass: 'CAPITAL_MARKET', icon: '📃' },
  { slug: 'corporate_bond', label: 'Corporate Bond', productClass: 'CAPITAL_MARKET', icon: '🏢' },
  { slug: 'sukuk_bond', label: 'Sukuk Bond', productClass: 'CAPITAL_MARKET', icon: '☪️' },
  { slug: 'municipal_bond', label: 'Municipal Bond', productClass: 'CAPITAL_MARKET', icon: '🏙️' },
  { slug: 'mutual_fund', label: 'Mutual Fund', productClass: 'CAPITAL_MARKET', icon: '📊' },
  { slug: 'etf', label: 'Exchange-Traded Fund', productClass: 'CAPITAL_MARKET', icon: '💹' },
  { slug: 'reit', label: 'REIT', productClass: 'CAPITAL_MARKET', icon: '🏘️' },
  { slug: 'pension_fund', label: 'Pension Fund', productClass: 'CAPITAL_MARKET', icon: '👴' },
  { slug: 'crowd_investment', label: 'Crowd Investment', productClass: 'CAPITAL_MARKET', icon: '🤝' },
  // COMMUNITY
  { slug: 'equb_weekly', label: 'Weekly Equb', productClass: 'COMMUNITY', icon: '📅' },
  { slug: 'equb_monthly', label: 'Monthly Equb', productClass: 'COMMUNITY', icon: '🗓️' },
  { slug: 'equb_daily', label: 'Daily Equb', productClass: 'COMMUNITY', icon: '☀️' },
  { slug: 'idir', label: 'Idir (Mutual Aid)', productClass: 'COMMUNITY', icon: '🤲' },
  { slug: 'sacco_savings', label: 'SACCO Savings', productClass: 'COMMUNITY', icon: '🏘️' },
  { slug: 'sacco_loan', label: 'SACCO Loan', productClass: 'COMMUNITY', icon: '🤝' },
  { slug: 'sacco_share', label: 'SACCO Share', productClass: 'COMMUNITY', icon: '📊' },
];

const tags = [
  // AUDIENCE
  { slug: 'women_only', label: "Women's Product", category: 'AUDIENCE', icon: '👩', profileField: 'gender', profileValue: 'FEMALE' },
  { slug: 'youth', label: 'Youth (Under 18)', category: 'AUDIENCE', icon: '👶', profileField: 'dateOfBirth', profileValue: 'UNDER_18' },
  { slug: 'teen', label: 'Teen (14-17)', category: 'AUDIENCE', icon: '🧑', profileField: 'dateOfBirth', profileValue: 'TEEN' },
  { slug: 'senior', label: 'Senior / Retirement', category: 'AUDIENCE', icon: '👴', profileField: 'dateOfBirth', profileValue: 'SENIOR' },
  { slug: 'diaspora', label: 'Diaspora', category: 'AUDIENCE', icon: '🌍', profileField: 'housingStatus', profileValue: 'DIASPORA' },
  { slug: 'expat', label: 'Expat / Foreign National', category: 'AUDIENCE', icon: '🛂' },
  { slug: 'first_time_saver', label: 'First-Time Saver', category: 'AUDIENCE', icon: '🌱' },
  { slug: 'low_income', label: 'Low Income', category: 'AUDIENCE', icon: '📉', profileField: 'monthlyIncomeRange', profileValue: 'LOW' },
  { slug: 'salaried', label: 'Salaried Employee', category: 'AUDIENCE', icon: '💼', profileField: 'employmentStatus', profileValue: 'EMPLOYED' },
  { slug: 'self_employed', label: 'Self-Employed', category: 'AUDIENCE', icon: '🏪', profileField: 'employmentStatus', profileValue: 'SELF_EMPLOYED' },
  { slug: 'group_based', label: 'Group / Cooperative', category: 'AUDIENCE', icon: '👥' },
  { slug: 'ngo_staff', label: 'NGO / Intl Org Staff', category: 'AUDIENCE', icon: '🏢' },
  // SECTOR
  { slug: 'agriculture', label: 'Agriculture', category: 'SECTOR', icon: '🌾', profileField: 'employmentStatus', profileValue: 'FARMER' },
  { slug: 'manufacturing', label: 'Manufacturing', category: 'SECTOR', icon: '🏭' },
  { slug: 'trade', label: 'Trade / Import-Export', category: 'SECTOR', icon: '🚢' },
  { slug: 'construction', label: 'Construction', category: 'SECTOR', icon: '🏗️' },
  { slug: 'transport', label: 'Transport / Logistics', category: 'SECTOR', icon: '🚛' },
  { slug: 'hospitality', label: 'Hospitality / Tourism', category: 'SECTOR', icon: '🏨' },
  { slug: 'technology', label: 'Technology / IT', category: 'SECTOR', icon: '💻' },
  { slug: 'education_sector', label: 'Education', category: 'SECTOR', icon: '📚' },
  { slug: 'health_sector', label: 'Health / Pharma', category: 'SECTOR', icon: '🏥' },
  { slug: 'creative', label: 'Creative / Media', category: 'SECTOR', icon: '🎨' },
  { slug: 'general_sector', label: 'General (No Restriction)', category: 'SECTOR', icon: '🔓' },
  // FEATURE
  { slug: 'interest_free', label: 'Interest-Free', category: 'FEATURE', icon: '☪️', profileField: 'interestFree', profileValue: 'true' },
  { slug: 'digital_only', label: 'Digital Only', category: 'FEATURE', icon: '📱', profileField: 'digitalAdoption', profileValue: 'MOBILE' },
  { slug: 'mobile_accessible', label: 'Mobile Accessible', category: 'FEATURE', icon: '📲' },
  { slug: 'no_collateral', label: 'No Collateral', category: 'FEATURE', icon: '🔓' },
  { slug: 'flexible_repayment', label: 'Flexible Repayment', category: 'FEATURE', icon: '🔄' },
  { slug: 'instant_disbursement', label: 'Instant Disbursement', category: 'FEATURE', icon: '⚡' },
  { slug: 'compound_interest', label: 'Compound Interest', category: 'FEATURE', icon: '📈' },
  { slug: 'profit_sharing', label: 'Profit Sharing / Dividend', category: 'FEATURE', icon: '💰' },
  { slug: 'loyalty_reward', label: 'Loyalty Reward', category: 'FEATURE', icon: '🎁' },
  { slug: 'zero_minimum', label: 'Zero Minimum Balance', category: 'FEATURE', icon: '0️⃣' },
  { slug: 'salary_advance', label: 'Salary Advance', category: 'FEATURE', icon: '💵' },
  { slug: 'auto_debit', label: 'Auto Debit / Auto Save', category: 'FEATURE', icon: '🤖' },
  // COMPLIANCE
  { slug: 'sharia_compliant', label: 'Sharia-Compliant', category: 'COMPLIANCE', icon: '☪️', profileField: 'interestFree', profileValue: 'true' },
  { slug: 'nbe_regulated', label: 'NBE Regulated', category: 'COMPLIANCE', icon: '🏛️' },
  { slug: 'deposit_insured', label: 'Deposit Insured', category: 'COMPLIANCE', icon: '🛡️', profileField: 'riskAppetite', profileValue: 'SAFE' },
  { slug: 'mandatory', label: 'Mandatory by Law', category: 'COMPLIANCE', icon: '⚖️' },
  { slug: 'tax_advantaged', label: 'Tax Advantaged', category: 'COMPLIANCE', icon: '💲' },
  // ACCESS_REQUIREMENT
  { slug: 'requires_account', label: 'Requires Existing Account', category: 'ACCESS_REQUIREMENT', icon: '🏦' },
  { slug: 'requires_membership', label: 'Requires Membership', category: 'ACCESS_REQUIREMENT', icon: '🎫' },
  { slug: 'requires_guarantor', label: 'Requires Guarantor', category: 'ACCESS_REQUIREMENT', icon: '🤝' },
  { slug: 'requires_collateral', label: 'Requires Collateral', category: 'ACCESS_REQUIREMENT', icon: '🏠' },
  { slug: 'requires_business_license', label: 'Requires Business License', category: 'ACCESS_REQUIREMENT', icon: '📋' },
  { slug: 'requires_kebele_id', label: 'Requires Kebele ID', category: 'ACCESS_REQUIREMENT', icon: '🪪' },
  { slug: 'requires_tin', label: 'Requires TIN', category: 'ACCESS_REQUIREMENT', icon: '🔢' },
  { slug: 'min_credit_score', label: 'Min Credit Score', category: 'ACCESS_REQUIREMENT', icon: '📊' },
  { slug: 'min_savings_history', label: 'Min Savings History', category: 'ACCESS_REQUIREMENT', icon: '📅' },
  // COLLATERAL_TYPE
  { slug: 'collateral_property', label: 'Property Collateral', category: 'COLLATERAL_TYPE', icon: '🏠' },
  { slug: 'collateral_vehicle', label: 'Vehicle Collateral', category: 'COLLATERAL_TYPE', icon: '🚗' },
  { slug: 'collateral_equipment', label: 'Equipment Collateral', category: 'COLLATERAL_TYPE', icon: '⚙️' },
  { slug: 'collateral_inventory', label: 'Inventory Collateral', category: 'COLLATERAL_TYPE', icon: '📦' },
  { slug: 'collateral_salary', label: 'Salary Assignment', category: 'COLLATERAL_TYPE', icon: '💼' },
  { slug: 'collateral_group', label: 'Group Guarantee', category: 'COLLATERAL_TYPE', icon: '👥' },
  { slug: 'collateral_gold', label: 'Gold Collateral', category: 'COLLATERAL_TYPE', icon: '🥇' },
  { slug: 'collateral_savings', label: 'Savings Pledge', category: 'COLLATERAL_TYPE', icon: '🔒' },
  { slug: 'collateral_none', label: 'No Collateral Required', category: 'COLLATERAL_TYPE', icon: '✅' },
];

async function main() {
  console.log('📚 Seeding product type definitions...');
  for (let i = 0; i < productTypes.length; i++) {
    const t = productTypes[i];
    await prisma.productTypeDefinition.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, sortOrder: i },
    });
  }
  console.log(`  ✅ ${productTypes.length} product types seeded`);

  console.log('🏷️  Seeding tag definitions...');
  for (const t of tags) {
    await prisma.tagDefinition.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }
  console.log(`  ✅ ${tags.length} tags seeded`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

