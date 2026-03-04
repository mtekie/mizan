'use client';

import { useState } from 'react';
import { CheckCircle2, X, ChevronRight, Target, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

type Props = {
    productType: 'Loan' | 'Savings' | string;
    productName: string;
    minAmount?: number;
    maxAmount?: number;
    interestRate?: number;
};

type CheckResult = 'pass' | 'warn' | 'fail';
type SuitabilityResult = {
    label: string;
    status: CheckResult;
    detail: string;
};

export function LoanSuitability({ productType, productName, minAmount, maxAmount, interestRate }: Props) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        income: '',
        existingLoans: '',
        employment: '',
        savingsDuration: '',
    });
    const [results, setResults] = useState<SuitabilityResult[] | null>(null);

    const isLoan = productType === 'Loan';

    const loanQuestions = [
        {
            id: 'income',
            question: 'What is your gross monthly income?',
            options: ['Below 10,000 ETB', '10,000 – 25,000 ETB', '25,000 – 50,000 ETB', 'Above 50,000 ETB'],
        },
        {
            id: 'existingLoans',
            question: 'Do you currently have any active loans?',
            options: ['No active loans', '1 loan', '2–3 loans', 'More than 3'],
        },
        {
            id: 'employment',
            question: 'What is your employment status?',
            options: ['Salaried Employee', 'Self-Employed', 'Government/Public Sector', 'Student / Unemployed'],
        },
    ];

    const savingsQuestions = [
        {
            id: 'savingsDuration',
            question: 'How long are you willing to lock in your savings?',
            options: ['Under 3 months', '3 – 12 months', '1 – 3 years', 'More than 3 years'],
        },
        {
            id: 'income',
            question: 'How much can you deposit monthly?',
            options: ['Under 1,000 ETB', '1,000 – 5,000 ETB', '5,000 – 20,000 ETB', 'Above 20,000 ETB'],
        },
    ];

    const questions = isLoan ? loanQuestions : savingsQuestions;
    const currentQ = questions[step] as typeof loanQuestions[0];

    const computeResults = (): SuitabilityResult[] => {
        const res: SuitabilityResult[] = [];

        if (isLoan) {
            // Income check
            const incomePasses = answers.income.includes('25,000') || answers.income.includes('50,000') || answers.income.includes('Above');
            res.push({
                label: 'Income Level',
                status: incomePasses ? 'pass' : answers.income.includes('10,000') ? 'warn' : 'fail',
                detail: incomePasses ? 'Your income meets the typical threshold.' : 'Your income may be below what lenders prefer for this product.',
            });

            // Debt load check
            const debtOk = answers.existingLoans === 'No active loans' || answers.existingLoans === '1 loan';
            res.push({
                label: 'Existing Debt Load',
                status: debtOk ? 'pass' : 'warn',
                detail: debtOk ? 'Low debt load — you are a strong candidate.' : 'Multiple active loans could affect approval odds.',
            });

            // Employment
            const empOk = answers.employment !== 'Student / Unemployed';
            res.push({
                label: 'Employment Stability',
                status: empOk ? 'pass' : 'fail',
                detail: empOk ? 'Stable employment is a key positive factor.' : 'Many lenders require formal employment for this product.',
            });

            // Interest affordability
            if (interestRate) {
                res.push({
                    label: 'Interest Rate Fit',
                    status: interestRate < 20 ? 'pass' : interestRate < 30 ? 'warn' : 'fail',
                    detail: `At ~${interestRate}% p.a., this loan ${interestRate < 20 ? 'is affordable at your income level.' : 'may add significant repayment pressure.'}`,
                });
            }
        } else {
            // Savings product
            const termOk = answers.savingsDuration && !answers.savingsDuration.includes('Under 3');
            res.push({
                label: 'Savings Timeline',
                status: termOk ? 'pass' : 'warn',
                detail: termOk ? "You have the patience for this product's term." : 'Consider a more liquid option for short-term goals.',
            });
            res.push({
                label: 'Deposit Capacity',
                status: !answers.income.includes('Under 1,000') ? 'pass' : 'warn',
                detail: 'Consistent deposits are key to reaching your goal faster.',
            });
        }

        return res;
    };

    const handleAnswer = (value: string) => {
        setAnswers(a => ({ ...a, [currentQ.id]: value }));
        if (step < questions.length - 1) {
            setStep(s => s + 1);
        } else {
            setResults(computeResults());
        }
    };

    const reset = () => {
        setStep(0);
        setAnswers({ income: '', existingLoans: '', employment: '', savingsDuration: '' });
        setResults(null);
    };

    const overallPass = results ? results.filter(r => r.status === 'fail').length === 0 : null;
    const passCount = results?.filter(r => r.status === 'pass').length ?? 0;

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition group mt-6"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black text-slate-900">Am I eligible?</p>
                        <p className="text-xs text-slate-500">Check your suitability in 60 seconds</p>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
            </button>
        );
    }

    return (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-black text-slate-900">Suitability Check</h3>
                </div>
                <button onClick={() => { setOpen(false); reset(); }} className="text-slate-400 hover:text-slate-900">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5">
                {!results ? (
                    <>
                        {/* Progress */}
                        <div className="flex gap-1 mb-6">
                            {questions.map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-blue-500' : 'bg-slate-100'}`} />
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Question {step + 1} of {questions.length}</p>
                        <p className="text-base font-black text-slate-900 mb-5">{currentQ.question}</p>
                        <div className="space-y-2">
                            {currentQ.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-sm font-bold text-slate-700 transition-all flex items-center justify-between"
                                >
                                    {opt}
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Result Summary */}
                        <div className={`rounded-2xl p-4 mb-5 flex items-center gap-3 ${overallPass ? 'bg-[#3EA63B]/10 border border-[#3EA63B]/20' : 'bg-amber-50 border border-amber-200'}`}>
                            {overallPass
                                ? <CheckCircle2 className="w-7 h-7 text-[#3EA63B] shrink-0" />
                                : <AlertTriangle className="w-7 h-7 text-amber-500 shrink-0" />
                            }
                            <div>
                                <p className={`text-sm font-black ${overallPass ? 'text-[#3EA63B]' : 'text-amber-700'}`}>
                                    {overallPass ? 'Strong Match!' : 'Review Before Applying'}
                                </p>
                                <p className="text-xs text-slate-500">{passCount} of {results.length} criteria met for <em>{productName}</em></p>
                            </div>
                        </div>

                        {/* Factor breakdown */}
                        <div className="space-y-3 mb-5">
                            {results.map(r => (
                                <div key={r.label} className="flex gap-3">
                                    {r.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-[#3EA63B] shrink-0 mt-0.5" />}
                                    {r.status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                                    {r.status === 'fail' && <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                                    <div>
                                        <p className="text-xs font-black text-slate-900">{r.label}</p>
                                        <p className="text-[10px] text-slate-500 leading-relaxed">{r.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={reset} className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                            Re-check Answers
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
