'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ApplyButton({ productType }: { productType: string }) {
    const [applied, setApplied] = useState(false);

    const handleApply = () => {
        setApplied(true);
        // Simulate API request
        setTimeout(() => {
            // In a real app we'd redirect or show a persistent modal
        }, 2000);
    };

    return (
        <button
            onClick={handleApply}
            disabled={applied}
            className={`w-full font-bold text-lg py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group ${applied
                    ? 'bg-[#E8F5E9] text-[#3EA63B] shadow-none cursor-not-allowed'
                    : 'bg-[#0F172A] text-white active:scale-[0.98] hover:bg-slate-800'
                }`}
        >
            {applied ? (
                <>
                    <CheckCircle2 className="w-5 h-5" />
                    Application Sent
                </>
            ) : (
                <>
                    Apply for {productType}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </button>
    );
}
