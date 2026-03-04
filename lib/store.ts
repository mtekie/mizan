import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coffee, ArrowDownToLine, ShoppingCart, Tv, LucideIcon } from 'lucide-react';

export type Transaction = {
    id: number;
    title: string;
    titleAmh: string;
    amount: number;
    source: string;
    iconName: 'Coffee' | 'ArrowDownToLine' | 'ShoppingCart' | 'Tv' | 'Plus';
    color: string;
    date: string;
    category: string;
};

const initialTransactions: Transaction[] = [
    { id: 1, title: "Kaldi's Coffee", titleAmh: 'ካፌና ሻይ', amount: -450.00, source: 'telebirr', iconName: 'Coffee', color: 'text-orange-600 bg-orange-100', date: 'Today', category: 'Food & Drink' },
    { id: 2, title: 'Deposit from Abebe', titleAmh: 'Transfer', amount: 5000.00, source: 'CBE', iconName: 'ArrowDownToLine', color: 'text-green-600 bg-green-100', date: 'Today', category: 'Income' },
    { id: 3, title: 'Shoa Supermarket', titleAmh: 'ሸቀጣሸቀጥ', amount: -2340.50, source: 'CBE', iconName: 'ShoppingCart', color: 'text-blue-600 bg-blue-100', date: 'Yesterday', category: 'Groceries' },
    { id: 4, title: 'Canal+ Subscription', titleAmh: 'Utilities', amount: -600.00, source: 'telebirr', iconName: 'Tv', color: 'text-purple-600 bg-purple-100', date: 'Yesterday', category: 'Entertainment' },
];

type MizanStore = {
    score: number;
    aiEnabled: boolean;
    transactions: Transaction[];
    setScore: (s: number) => void;
    setAiEnabled: (e: boolean) => void;
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    resetDemo: () => void;
};

export const useStore = create<MizanStore>()(
    persist(
        (set) => ({
            score: 720,
            aiEnabled: true,
            transactions: initialTransactions,
            setScore: (score) => set({ score }),
            setAiEnabled: (aiEnabled) => set({ aiEnabled }),
            addTransaction: (tx) =>
                set((state) => ({
                    transactions: [{ ...tx, id: Date.now() }, ...state.transactions],
                })),
            resetDemo: () => set({ score: 720, transactions: initialTransactions }),
        }),
        {
            name: 'mizan-demo-storage',
        }
    )
);
