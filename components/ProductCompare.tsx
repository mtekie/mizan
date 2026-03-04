'use client';

import { useState } from 'react';
import { X, Check, AlertTriangle, Zap, BadgePercent, Banknote, Clock, FileText, Shield } from 'lucide-react';
import type { Product } from '@/lib/data/types';

type Props = {
    products: Product[];
    onClose: () => void;
};

export function ProductCompare({ products, onClose }: Props) {
    const formatInterest = (val?: number) => {
        if (!val) return '—';
        return val < 1 ? `${(val * 100).toFixed(0)}%` : `${val.toFixed(0)}%`;
    };

    const rows: { label: string; icon: typeof BadgePercent; getValue: (p: Product) => string; highlight?: 'lower' | 'higher' }[] = [
        { label: 'Interest Rate', icon: BadgePercent, getValue: (p: Product) => formatInterest(p.interestRate) },
        { label: 'Max Amount', icon: Banknote, getValue: p => p.maxAmount ? `${p.maxAmount.toLocaleString()} ETB` : '—' },
        { label: 'Term', icon: Clock, getValue: p => p.term || '—' },
        { label: 'Fees', icon: FileText, getValue: p => p.fees || 'None stated' },
        { label: 'Digital Access', icon: Zap, getValue: p => p.digital ? 'Yes' : 'No' },
        { label: 'Interest-Free', icon: Shield, getValue: p => p.interestFree ? 'Yes' : 'No' },
        { label: 'Disbursement', icon: Clock, getValue: p => p.disbursementTime || '—' },
        { label: 'Collateral', icon: AlertTriangle, getValue: p => p.collateralRequirements || 'None' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <h3 className="text-sm font-black text-slate-900">Compare Products ({products.length})</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
                </div>

                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        {/* Product headers */}
                        <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
                            <tr>
                                <th className="text-left px-4 py-3 w-36"></th>
                                {products.map(p => (
                                    <th key={p.id} className="px-4 py-3 text-center min-w-[160px]">
                                        <p className="text-xs font-black text-slate-900 leading-tight">{p.title || p.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{p.bankName}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => {
                                const Icon = row.icon;
                                const values = products.map(p => row.getValue(p));
                                return (
                                    <tr key={row.label} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{row.label}</span>
                                            </div>
                                        </td>
                                        {values.map((val, j) => (
                                            <td key={j} className="px-4 py-3 text-center">
                                                <span className="text-xs font-bold text-slate-900">{val}</span>
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
