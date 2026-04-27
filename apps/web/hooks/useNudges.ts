'use client';

import { useMemo } from 'react';
import { Wallet, Target, UserCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { NudgeProps } from '@/components/Nudge';
import { getProfileCompletion } from '@/lib/profile/completeness';

interface UseNudgesProps {
    user: any;
    accounts: any[];
    goals: any[];
    mizanScore: number;
}

export function useNudges({ user, accounts, goals, mizanScore }: UseNudgesProps) {
    const nudges = useMemo(() => {
        const potentialNudges: NudgeProps[] = [];

        // 1. Priority: Setup Accounts (Fundamental)
        if (accounts.length === 0) {
            potentialNudges.push({
                id: 'setup-accounts',
                title: 'Start your journey',
                description: 'Connect your first bank, wallet, or equb to see your real net worth in real-time.',
                icon: Wallet,
                color: 'text-blue-500 bg-blue-100',
                link: '/ledger?action=add-account',
                btnText: 'Add Account'
            });
        }

        // 2. Profile Enrichment (One-Question-at-a-Time Nudges)
        const completion = getProfileCompletion(user || {});
        const enrichmentFields = [
            { field: 'financialPriority', title: 'What is your top priority?', desc: 'Saving for a home, business, or education?' },
            { field: 'riskAppetite', title: 'How do you view risk?', desc: 'Are you cautious or aggressive with investments?' },
            { field: 'incomeStability', title: 'How stable is your income?', desc: 'Helps us tailor your resilience buffer.' },
            { field: 'housingStatus', title: 'What is your housing status?', desc: 'Helps in calculating your net worth accuracy.' },
        ];

        const nextMissingEnrichment = enrichmentFields.find(ef => 
            completion.missingFields.includes(ef.field as any)
        );

        if (nextMissingEnrichment && accounts.length > 0) {
            potentialNudges.push({
                id: `enrich-${nextMissingEnrichment.field}`,
                title: nextMissingEnrichment.title,
                description: nextMissingEnrichment.desc,
                icon: UserCircle,
                color: 'text-purple-500 bg-purple-100',
                link: `/score?action=complete-profile&step=${nextMissingEnrichment.field}`,
                btnText: 'Answer Question'
            });
        }

        // 3. Goals & Dreams
        if (goals.length === 0 && accounts.length > 0) {
            potentialNudges.push({
                id: 'set-goal',
                title: 'Build your future',
                description: 'Users with clear goals save 24% more on average. What are you saving for?',
                icon: Target,
                color: 'text-orange-500 bg-orange-100',
                link: '/dreams?action=set-goal',
                btnText: 'Create Goal'
            });
        }

        // 4. Score Logic: Emergency Fund / Resilience
        if (mizanScore < 650 && accounts.length > 0) {
            potentialNudges.push({
                id: 'resilience-boost',
                title: 'Low Resilience Detected',
                description: 'Your Mizan score is lower than average for your income. Let\'s optimize your savings.',
                icon: ShieldCheck,
                color: 'text-red-500 bg-red-100',
                link: '/score',
                btnText: 'View Analysis'
            });
        }

        // 5. Interest-Free Check (Contextual for Ethiopia)
        if (user && user.interestFree === false && !localStorage.getItem('mizan_nudge_dismissed_interest-free-check')) {
            // We only show this if they haven't set it yet
            potentialNudges.push({
                id: 'interest-free-check',
                title: 'Prefer Interest-Free?',
                description: 'Looking for Sharia-compliant or interest-free options? We can tailor your marketplace.',
                icon: Sparkles,
                color: 'text-emerald-500 bg-emerald-100',
                link: '/settings',
                btnText: 'Adjust Preferences'
            });
        }

        // Filter out dismissed nudges
        return potentialNudges.filter(nudge => {
            if (typeof window !== 'undefined') {
                return !localStorage.getItem(`mizan_nudge_dismissed_${nudge.id}`);
            }
            return true;
        });
    }, [user, accounts, goals, mizanScore]);

    return {
        activeNudge: nudges[0] || null,
        nudges
    };
}
