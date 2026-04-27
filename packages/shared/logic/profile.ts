export const CORE_PROFILE_FIELDS = [
  'fullName',
  'username',
  'gender',
  'residencyStatus',
  'monthlyIncomeRange',
  'educationLevel',
  'employmentStatus',
  'employmentSector',
] as const;

export const ENRICHMENT_PROFILE_FIELDS = [
  'financialPriority',
  'riskAppetite',
  'housingStatus',
  'incomeStability',
  'digitalAdoption',
  'behavioralStyle',
] as const;

export type ProfileField = typeof CORE_PROFILE_FIELDS[number] | typeof ENRICHMENT_PROFILE_FIELDS[number];

function hasValue(value: unknown) {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
}

export function getProfileCompletion(user: Partial<Record<string, unknown>>) {
  const fields = [...CORE_PROFILE_FIELDS, ...ENRICHMENT_PROFILE_FIELDS];
  const completedFields = fields.filter(field => hasValue(user[field]));
  const completedCoreFields = CORE_PROFILE_FIELDS.filter(field => hasValue(user[field]));

  return {
    completed: completedFields.length,
    completedCore: completedCoreFields.length,
    total: fields.length,
    totalCore: CORE_PROFILE_FIELDS.length,
    percentage: Math.round((completedFields.length / fields.length) * 100),
    corePercentage: Math.round((completedCoreFields.length / CORE_PROFILE_FIELDS.length) * 100),
    isCoreComplete: completedCoreFields.length === CORE_PROFILE_FIELDS.length,
    missingCoreFields: CORE_PROFILE_FIELDS.filter(field => !hasValue(user[field])),
    missingFields: fields.filter(field => !hasValue(user[field])),
  };
}
export function isCoreProfileComplete(user: Partial<Record<string, unknown>>) {
  return getProfileCompletion(user).isCoreComplete;
}
