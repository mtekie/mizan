'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Wallet, Target, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type PromptType = 'accounts' | 'profile' | 'budget';

interface OnboardingPromptProps {
    type: PromptType;
    userName?: string;
}

export function OnboardingPrompt({ type, userName }: OnboardingPromptProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check local storage so we don't nag if dismissed recently
        const dismissed = localStorage.getItem(`mizan_prompt_dismissed_${type}`);
        if (!dismissed) {
            const timer = window.setTimeout(() => setIsVisible(true), 0);
            return () => window.clearTimeout(timer);
        }
    }, [type]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(`mizan_prompt_dismissed_${type}`, 'true');
    };

    if (!isVisible) return null;

    const content = {
        accounts: {
            title: `Welcome, ${userName || 'there'}! Add your first account`,
            desc: "Let's bring Mizan to life. Connect a bank, wallet, or equb to track your real net worth.",
            icon: Wallet,
            color: 'text-blue-500 bg-blue-100',
            link: '/ledger?action=add-account',
            btnText: 'Add Account'
        },
        profile: {
            title: 'Complete your profile',
            desc: 'Tell us a bit more about yourself to get a more accurate Mizan financial score.',
            icon: UserCircle,
            color: 'text-purple-500 bg-purple-100',
            link: '/score?action=complete-profile',
            btnText: 'Complete Profile'
        },
        budget: {
            title: 'Set your first budget',
            desc: 'Start tracking your spending and saving by defining your monthly budgets.',
            icon: Target,
            color: 'text-orange-500 bg-orange-100',
            link: '/dreams?action=set-budget',
            btnText: 'Create Budget'
        }
    };

    const current = content[type];
    const Icon = current.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative mb-6 overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
                
                <button onClick={handleDismiss} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition">
                    <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${current.color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{current.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{current.desc}</p>
                        
                        <Link href={current.link} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3EA63B] hover:text-[#2e7d2c] transition-colors">
                            {current.btnText} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
