export function toFiniteNumber(value: unknown, fallback = 0): number {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function formatNumber(value: unknown, options: Intl.NumberFormatOptions = {}): string {
  return toFiniteNumber(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
    ...options,
  });
}

export function formatMoney(value: unknown, currency = 'ETB', options: Intl.NumberFormatOptions = {}): string {
  return `${formatNumber(value, options)} ${currency}`;
}

export function formatSignedMoney(value: unknown, currency = 'ETB', options: Intl.NumberFormatOptions = {}): string {
  const numberValue = toFiniteNumber(value);
  const sign = numberValue > 0 ? '+' : numberValue < 0 ? '-' : '';
  return `${sign}${formatMoney(Math.abs(numberValue), currency, options)}`;
}

export function safePercent(numerator: unknown, denominator: unknown, fallback = 0): number {
  const n = toFiniteNumber(numerator);
  const d = toFiniteNumber(denominator);
  if (d <= 0) return fallback;
  return Math.round((n / d) * 100);
}
