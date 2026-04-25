/**
 * Bank Lookup Utility
 * 
 * Provides fast O(1) lookups for bank metadata by ID.
 * Used by catalogue components to resolve a product's bankId
 * into full brand metadata (colors, logo, type, etc.)
 */
import { banks, type Bank } from './banks';

// Pre-build a map for O(1) lookups
const bankMap = new Map<string, Bank>();
for (const bank of banks) {
  bankMap.set(bank.id, bank);
}

/**
 * Look up a bank by its ID
 */
export function getBankById(bankId: string): Bank | undefined {
  return bankMap.get(bankId);
}

/**
 * Get brand color classes for a bank
 */
export function getBankColors(bankId: string): { bg: string; text: string } {
  const bank = bankMap.get(bankId);
  return {
    bg: bank?.color || 'bg-slate-600',
    text: bank?.textColor || 'text-white',
  };
}

/**
 * Get all unique banks that have products, with product counts
 */
export function getBanksWithProducts(products: { bankId?: string; instituteId?: string }[]): {
  banks: Bank[];
  counts: Record<string, number>;
} {
  const counts: Record<string, number> = {};

  for (const p of products) {
    const id = p.bankId || p.instituteId;
    if (id) {
      counts[id] = (counts[id] || 0) + 1;
    }
  }

  const matchedBanks = Object.keys(counts)
    .map(id => bankMap.get(id))
    .filter((b): b is Bank => !!b);

  return { banks: matchedBanks, counts };
}

export { banks, type Bank };
