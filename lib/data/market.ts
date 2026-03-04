export interface CurrencyRate {
    pair: string;
    rate: number;
    change: number;
    trend: 'up' | 'down';
}

export const currencyRates: CurrencyRate[] = [
    { pair: 'USD/ETB', rate: 124.50, change: +1.2, trend: 'up' },
    { pair: 'EUR/ETB', rate: 132.10, change: -0.4, trend: 'down' },
    { pair: 'GBP/ETB', rate: 156.45, change: +0.8, trend: 'up' },
    { pair: 'AED/ETB', rate: 33.90, change: +0.05, trend: 'up' },
];

export interface StockMarket {
    symbol: string;
    name: string;
    price: number;
    change: number;
    volume: string;
}

export const esxMarket: StockMarket[] = [
    { symbol: 'CBE', name: 'Commercial Bank of Eth.', price: 110.00, change: +0.45, volume: '1.2M' },
    { symbol: 'ETHIO', name: 'Ethio Telecom', price: 245.50, change: +1.20, volume: '4.5M' },
    { symbol: 'AWASH', name: 'Awash Bank', price: 320.80, change: -0.15, volume: '0.8M' },
    { symbol: 'DASHEN', name: 'Dashen Bank', price: 202.10, change: +0.30, volume: '1.1M' },
];
