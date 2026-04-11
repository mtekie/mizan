import { NextResponse } from 'next/server';

// Supported currencies and their exchange rates against ETB
// Primary source: NBE (National Bank of Ethiopia) daily rates
// Fallback: static rates updated weekly
const STATIC_RATES: Record<string, number> = {
    ETB: 1,
    USD: 0.0071,
    EUR: 0.0065,
    GBP: 0.0056,
    AED: 0.026,
};

let cachedRates: Record<string, number> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

async function fetchLiveRates(): Promise<Record<string, number>> {
    try {
        // Try exchangerate-api.com free tier
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/ETB', {
            next: { revalidate: 21600 }, // 6 hours
        });
        if (!res.ok) throw new Error('API unavailable');
        const data = await res.json();
        return {
            ETB: 1,
            USD: data.rates?.USD || STATIC_RATES.USD,
            EUR: data.rates?.EUR || STATIC_RATES.EUR,
            GBP: data.rates?.GBP || STATIC_RATES.GBP,
            AED: data.rates?.AED || STATIC_RATES.AED,
        };
    } catch {
        return STATIC_RATES;
    }
}

export async function GET() {
    const now = Date.now();

    // Return cached if fresh
    if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
        return NextResponse.json({
            base: 'ETB',
            rates: cachedRates,
            source: 'cached',
            updatedAt: new Date(cacheTimestamp).toISOString(),
        });
    }

    // Fetch fresh
    const rates = await fetchLiveRates();
    cachedRates = rates;
    cacheTimestamp = now;

    return NextResponse.json({
        base: 'ETB',
        rates,
        source: rates === STATIC_RATES ? 'static_fallback' : 'live',
        updatedAt: new Date().toISOString(),
    });
}
