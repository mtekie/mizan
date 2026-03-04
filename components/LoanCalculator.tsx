'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, AlertTriangle, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

type Props = {
    interestRate?: number;
    interestMax?: number;
    maxAmount?: number;
    term?: string;
    fees?: string;
    repaymentFrequency?: string;
    disbursementTime?: string;
    collateralRequirements?: string;
    prepaymentPenalties?: string;
    productName: string;
};

export function LoanCalculator({
    interestRate = 15,
    interestMax,
    maxAmount,
    term,
    fees,
    repaymentFrequency,
    disbursementTime,
    collateralRequirements,
    prepaymentPenalties,
    productName,
}: Props) {
    const [open, setOpen] = useState(false);

    // Parse defaults
    const defaultMax = maxAmount || 500000;
    const defaultRate = interestRate < 1 ? interestRate * 100 : interestRate;
    const defaultTermMonths = term ? parseInt(term) || 36 : 36;

    const [loanAmount, setLoanAmount] = useState(Math.round(defaultMax * 0.5));
    const [termMonths, setTermMonths] = useState(defaultTermMonths);
    const [rate, setRate] = useState(defaultRate);

    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = useMemo(() => {
        if (monthlyRate === 0) return loanAmount / termMonths;
        return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    }, [loanAmount, termMonths, monthlyRate]);

    const totalPaid = monthlyPayment * termMonths;
    const totalInterest = totalPaid - loanAmount;
    const interestPct = Math.round((totalInterest / totalPaid) * 100);

    // Amortization first 6 months
    const amortization = useMemo(() => {
        const rows = [];
        let balance = loanAmount;
        for (let i = 1; i <= Math.min(6, termMonths); i++) {
            const interest = balance * monthlyRate;
            const principal = monthlyPayment - interest;
            balance -= principal;
            rows.push({ month: i, payment: monthlyPayment, principal, interest, balance: Math.max(0, balance) });
        }
        return rows;
    }, [loanAmount, termMonths, monthlyRate, monthlyPayment]);

    const [showAmortization, setShowAmortization] = useState(false);

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition group mt-6"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black text-slate-900">Loan Calculator</p>
                        <p className="text-xs text-slate-500">See your monthly payment instantly</p>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
            </button>
        );
    }

    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-black text-slate-900">Loan Calculator</h3>
                </div>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-900">
                    <ChevronUp className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5 space-y-5">
                {/* Loan Amount Slider */}
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loan Amount</label>
                        <span className="text-lg font-black text-slate-900">{loanAmount.toLocaleString()} <span className="text-xs text-slate-400 font-bold">ETB</span></span>
                    </div>
                    <input
                        type="range"
                        min={10000}
                        max={defaultMax}
                        step={5000}
                        value={loanAmount}
                        onChange={e => setLoanAmount(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#3EA63B]"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                        <span>10K</span>
                        <span>{(defaultMax / 1000).toFixed(0)}K</span>
                    </div>
                </div>

                {/* Term Slider */}
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repayment Term</label>
                        <span className="text-lg font-black text-slate-900">{termMonths} <span className="text-xs text-slate-400 font-bold">months</span></span>
                    </div>
                    <input
                        type="range"
                        min={3}
                        max={120}
                        step={3}
                        value={termMonths}
                        onChange={e => setTermMonths(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#3EA63B]"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                        <span>3 mo</span>
                        <span>10 yr</span>
                    </div>
                </div>

                {/* Interest Rate */}
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual Interest Rate</label>
                        <span className="text-lg font-black text-slate-900">{rate}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={interestMax ? (interestMax < 1 ? interestMax * 100 : interestMax) : 40}
                        step={0.5}
                        value={rate}
                        onChange={e => setRate(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#3EA63B]"
                    />
                </div>

                {/* Result Cards */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#3EA63B]/5 rounded-xl p-3 text-center border border-[#3EA63B]/10">
                        <p className="text-[9px] font-black text-[#3EA63B] uppercase tracking-widest mb-1">Monthly</p>
                        <p className="text-lg font-black text-slate-900">{Math.round(monthlyPayment).toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold">ETB/mo</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Interest</p>
                        <p className="text-lg font-black text-amber-600">{Math.round(totalInterest).toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold">{interestPct}% of total</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cost</p>
                        <p className="text-lg font-black text-slate-900">{Math.round(totalPaid).toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold">ETB</p>
                    </div>
                </div>

                {/* Visual bar: principal vs interest */}
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Cost Breakdown</p>
                    <div className="flex h-3 rounded-full overflow-hidden">
                        <div className="bg-[#3EA63B]" style={{ width: `${100 - interestPct}%` }} />
                        <div className="bg-amber-400" style={{ width: `${interestPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold mt-1">
                        <span className="text-[#3EA63B] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3EA63B]" /> Principal</span>
                        <span className="text-amber-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Interest</span>
                    </div>
                </div>

                {/* Product-specific info */}
                {(fees || repaymentFrequency || disbursementTime || collateralRequirements || prepaymentPenalties) && (
                    <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Terms</p>
                        <div className="grid grid-cols-2 gap-2">
                            {repaymentFrequency && (
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold">Repayment</p>
                                    <p className="text-xs font-bold text-slate-800">{repaymentFrequency}</p>
                                </div>
                            )}
                            {fees && (
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold">Processing Fee</p>
                                    <p className="text-xs font-bold text-slate-800">{fees}</p>
                                </div>
                            )}
                            {disbursementTime && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-bold">Disbursement</p>
                                        <p className="text-xs font-bold text-slate-800">{disbursementTime}</p>
                                    </div>
                                </div>
                            )}
                            {prepaymentPenalties && (
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold">Early Repayment</p>
                                    <p className="text-xs font-bold text-red-600">{prepaymentPenalties}</p>
                                </div>
                            )}
                        </div>
                        {collateralRequirements && (
                            <div className="flex items-start gap-1.5 bg-amber-50 rounded-lg p-2 mt-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[9px] font-bold text-amber-700">Collateral Required</p>
                                    <p className="text-[10px] text-amber-600">{collateralRequirements}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Amortization Table */}
                <div>
                    <button
                        onClick={() => setShowAmortization(v => !v)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition"
                    >
                        {showAmortization ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
                    </button>
                    {showAmortization && (
                        <div className="mt-3 overflow-x-auto">
                            <table className="w-full text-[10px]">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-2 font-black text-slate-400 uppercase tracking-widest">#</th>
                                        <th className="text-right py-2 font-black text-slate-400 uppercase tracking-widest">Payment</th>
                                        <th className="text-right py-2 font-black text-slate-400 uppercase tracking-widest">Principal</th>
                                        <th className="text-right py-2 font-black text-slate-400 uppercase tracking-widest">Interest</th>
                                        <th className="text-right py-2 font-black text-slate-400 uppercase tracking-widest">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {amortization.map(row => (
                                        <tr key={row.month} className="border-b border-slate-50">
                                            <td className="py-2 font-bold text-slate-600">{row.month}</td>
                                            <td className="py-2 text-right font-bold text-slate-800">{Math.round(row.payment).toLocaleString()}</td>
                                            <td className="py-2 text-right font-bold text-[#3EA63B]">{Math.round(row.principal).toLocaleString()}</td>
                                            <td className="py-2 text-right font-bold text-amber-600">{Math.round(row.interest).toLocaleString()}</td>
                                            <td className="py-2 text-right font-bold text-slate-500">{Math.round(row.balance).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {termMonths > 6 && (
                                <p className="text-[9px] text-slate-400 mt-2 text-center">Showing first 6 of {termMonths} months</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
