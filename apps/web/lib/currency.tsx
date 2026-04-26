'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatNumber, toFiniteNumber } from '@mizan/shared';

type Rates = Record<string, number>;

type CurrencyContextType = {
    currency: string;
    setCurrency: (c: string) => void;
    rates: Rates;
    convert: (amount: number, from?: string, to?: string) => number;
    format: (amount: number, cur?: string) => string;
    loading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'ETB',
    setCurrency: () => { },
    rates: { ETB: 1 },
    convert: (a) => a,
    format: (a) => `ETB ${formatNumber(a)}`,
    loading: false,
});

const symbols: Record<string, string> = {
    ETB: 'ETB',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState('ETB');
    const [rates, setRates] = useState<Rates>({ ETB: 1, USD: 0.0071, EUR: 0.0065, GBP: 0.0056, AED: 0.026 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('mizan_currency');
        if (saved) {
            const timer = window.setTimeout(() => setCurrencyState(saved), 0);
            return () => window.clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => setLoading(true), 0);
        fetch('/api/v1/exchange')
            .then(r => r.json())
            .then(data => {
                if (data.rates) setRates(data.rates);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
        return () => window.clearTimeout(timer);
    }, []);

    const setCurrency = (c: string) => {
        setCurrencyState(c);
        localStorage.setItem('mizan_currency', c);
    };

    const convert = (amount: number, from = 'ETB', to?: string) => {
        const target = to || currency;
        const safeAmount = toFiniteNumber(amount);
        if (from === target) return safeAmount;
        // Convert from source to ETB first, then to target
        const inETB = from === 'ETB' ? safeAmount : safeAmount / (rates[from] || 1);
        return inETB * (rates[target] || 1);
    };

    const format = (amount: number, cur?: string) => {
        const c = cur || currency;
        const converted = c === 'ETB' ? amount : convert(amount, 'ETB', c);
        const sym = symbols[c] || c;
        return `${sym} ${formatNumber(converted)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format, loading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
