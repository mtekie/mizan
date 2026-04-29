'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, LucideIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { appendParityQuery } from '@/lib/parity-query';

export type NudgeVariant = 'card' | 'snap';

export interface NudgeProps {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    link: string;
    btnText: string;
    variant?: NudgeVariant;
    onDismiss?: (id: string) => void;
}

export function Nudge({
    id,
    title,
    description,
    icon: Icon,
    color,
    link,
    btnText,
    variant = 'card',
    onDismiss
}: NudgeProps) {
    const [isVisible, setIsVisible] = useState(true);
    const searchParams = useSearchParams();

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss(id);
        // Persist dismissal
        localStorage.setItem(`mizan_nudge_dismissed_${id}`, 'true');
    };

    if (!isVisible) return null;

    if (variant === 'snap') {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    className="fixed bottom-24 right-6 z-50 max-w-[280px] bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-white/10 backdrop-blur-xl"
                >
                    <button onClick={handleDismiss} className="absolute top-2 right-2 text-white/40 hover:text-white transition">
                        <X className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color.replace('bg-', 'bg-opacity-20 bg-')}`}>
                            <Icon className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xs font-bold leading-tight pr-4">{title}</h3>
                    </div>
                    
                    <p className="text-[11px] text-white/60 leading-relaxed mb-3">
                        {description}
                    </p>
                    
                    <Link 
                        href={appendParityQuery(link, searchParams)}
                        className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-[10px] font-bold transition-colors group"
                    >
                        {btnText}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Default 'card' variant (Integrated)
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative mb-4 overflow-hidden group hover:border-[#3EA63B]/30 transition-colors"
            >
                {/* Decorative background flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <button onClick={handleDismiss} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition p-1">
                    <X className="w-3.5 h-3.5" />
                </button>
                
                <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${color}`}>
                        <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex-1 pr-6">
                        <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                            <Sparkles className="w-3 h-3 text-[#3EA63B] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{description}</p>
                        
                        <Link 
                            href={appendParityQuery(link, searchParams)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3EA63B] hover:text-[#2e7d2c] transition-all group/btn"
                        >
                            {btnText} 
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
