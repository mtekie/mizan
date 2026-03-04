import { ShoppingBasket, Home, Car, Wallet, Heart, Smartphone, GraduationCap, Briefcase, Zap, Coffee, type LucideIcon } from 'lucide-react';

export type BudgetCategory = {
    name: string;
    pct: number;
    icon: LucideIcon;
    color: string;
    bg: string;
    progressColor: string;
};

export type BudgetTemplate = {
    id: string;
    name: string;
    emoji: string;
    description: string;
    categories: BudgetCategory[];
};

export const budgetTemplates: BudgetTemplate[] = [
    {
        id: 'student',
        name: 'Student',
        emoji: '🎓',
        description: 'Tight budget, education-first',
        categories: [
            { name: 'Rent & Housing', pct: 40, icon: Home, color: 'text-blue-600', bg: 'bg-blue-100', progressColor: 'bg-blue-500' },
            { name: 'Food & Groceries', pct: 25, icon: ShoppingBasket, color: 'text-orange-600', bg: 'bg-orange-100', progressColor: 'bg-orange-500' },
            { name: 'Transport', pct: 15, icon: Car, color: 'text-purple-600', bg: 'bg-purple-100', progressColor: 'bg-purple-500' },
            { name: 'Education', pct: 10, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100', progressColor: 'bg-emerald-500' },
            { name: 'Savings', pct: 10, icon: Wallet, color: 'text-[#3EA63B]', bg: 'bg-[#3EA63B]/10', progressColor: 'bg-[#3EA63B]' },
        ],
    },
    {
        id: 'young-pro',
        name: 'Young Professional',
        emoji: '💼',
        description: 'Balanced growth & lifestyle',
        categories: [
            { name: 'Rent & Housing', pct: 30, icon: Home, color: 'text-blue-600', bg: 'bg-blue-100', progressColor: 'bg-blue-500' },
            { name: 'Food & Groceries', pct: 20, icon: ShoppingBasket, color: 'text-orange-600', bg: 'bg-orange-100', progressColor: 'bg-orange-500' },
            { name: 'Savings', pct: 20, icon: Wallet, color: 'text-[#3EA63B]', bg: 'bg-[#3EA63B]/10', progressColor: 'bg-[#3EA63B]' },
            { name: 'Transport', pct: 10, icon: Car, color: 'text-purple-600', bg: 'bg-purple-100', progressColor: 'bg-purple-500' },
            { name: 'Entertainment', pct: 10, icon: Coffee, color: 'text-pink-600', bg: 'bg-pink-100', progressColor: 'bg-pink-500' },
            { name: 'Utilities', pct: 10, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100', progressColor: 'bg-amber-500' },
        ],
    },
    {
        id: 'family',
        name: 'Family',
        emoji: '👨‍👩‍👧',
        description: 'Kids, health, and stability',
        categories: [
            { name: 'Rent & Housing', pct: 30, icon: Home, color: 'text-blue-600', bg: 'bg-blue-100', progressColor: 'bg-blue-500' },
            { name: 'Food & Groceries', pct: 25, icon: ShoppingBasket, color: 'text-orange-600', bg: 'bg-orange-100', progressColor: 'bg-orange-500' },
            { name: 'Education', pct: 15, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100', progressColor: 'bg-emerald-500' },
            { name: 'Healthcare', pct: 10, icon: Heart, color: 'text-red-600', bg: 'bg-red-100', progressColor: 'bg-red-500' },
            { name: 'Savings', pct: 10, icon: Wallet, color: 'text-[#3EA63B]', bg: 'bg-[#3EA63B]/10', progressColor: 'bg-[#3EA63B]' },
            { name: 'Utilities', pct: 10, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100', progressColor: 'bg-amber-500' },
        ],
    },
    {
        id: 'freelancer',
        name: 'Freelancer',
        emoji: '🚀',
        description: 'Variable income, high savings buffer',
        categories: [
            { name: 'Rent & Housing', pct: 25, icon: Home, color: 'text-blue-600', bg: 'bg-blue-100', progressColor: 'bg-blue-500' },
            { name: 'Business Costs', pct: 20, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100', progressColor: 'bg-indigo-500' },
            { name: 'Savings', pct: 20, icon: Wallet, color: 'text-[#3EA63B]', bg: 'bg-[#3EA63B]/10', progressColor: 'bg-[#3EA63B]' },
            { name: 'Food & Groceries', pct: 15, icon: ShoppingBasket, color: 'text-orange-600', bg: 'bg-orange-100', progressColor: 'bg-orange-500' },
            { name: 'Insurance', pct: 10, icon: Heart, color: 'text-red-600', bg: 'bg-red-100', progressColor: 'bg-red-500' },
            { name: 'Buffer / Emergency', pct: 10, icon: Smartphone, color: 'text-sky-600', bg: 'bg-sky-100', progressColor: 'bg-sky-500' },
        ],
    },
];
