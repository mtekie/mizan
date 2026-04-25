import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Building2, Calendar, FileText, BadgePercent, Zap, Globe, AlertTriangle, Clock, Banknote } from 'lucide-react';
import ApplyButton from '@/components/CatalogueApplyButton';
import { ProductRatings } from '@/components/ProductRatings';
import { LoanSuitability } from '@/components/LoanSuitability';
import { LoanCalculator } from '@/components/LoanCalculator';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    
    const product = await prisma.product.findUnique({
        where: { id: resolvedParams.id }
    });
    
    if (!product) {
        notFound();
    }

    const bank = product.bankId || product.instituteId 
        ? await prisma.bank.findUnique({ where: { id: product.bankId || product.instituteId || '' } })
        : null;

    const formatInterest = (val: number) => val < 1 ? (val * 100).toFixed(0) : val.toFixed(0);
    const interestDisplay = product.interestMax && product.interestMax > (product.interestRate || 0)
        ? `${formatInterest(product.interestRate || 0)}–${formatInterest(product.interestMax)}%`
        : `${formatInterest(product.interestRate || 0)}%`;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 md:bg-transparent md:py-8">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 md:bg-transparent md:border-none">
                <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
                    <Link href="/catalogue" className="flex size-10 items-center justify-center rounded-full bg-slate-100 shadow-sm text-slate-900 hover:bg-slate-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        {product.digital && (
                            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Digital
                            </span>
                        )}
                        {product.interestFree && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-black">
                                Interest‑Free
                            </span>
                        )}
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> Verified
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-6 pb-32 max-w-3xl mx-auto w-full">
                {/* Title Section */}
                <section className="mb-8">
                    <Link href={`/catalogue/bank/${bank?.id || product.bankId || product.instituteId}`} className="flex items-center gap-2 mb-3 group">
                        <div className={`w-10 h-10 rounded-xl ${bank?.color || 'bg-slate-600'} ${bank?.textColor || 'text-white'} flex items-center justify-center font-bold text-sm shadow-sm`}>
                            {bank?.logo || product.bankLogo || 'FI'}
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-[#3EA63B] transition-colors">
                                {bank?.name || product.bankName || 'Financial Institution'}
                            </span>
                            {bank?.nameAmh && <span className="text-xs text-slate-400 ml-2 font-ethiopic">{bank.nameAmh}</span>}
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">{product.title || product.name}</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">{product.description}</p>
                    {product.genderBased && (
                        <span className="inline-block mt-3 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Gender-Focused Product
                        </span>
                    )}
                </section>

                {/* Highlight Cards */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <BadgePercent className="w-4 h-4 text-[#3EA63B]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Interest</span>
                        </div>
                        <div className="text-xl font-black text-slate-900">{interestDisplay} <span className="text-xs font-medium text-slate-400">p.a</span></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Banknote className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {product.type === 'Loan' ? 'Max Loan' : 'Min Balance'}
                            </span>
                        </div>
                        <div className="text-xl font-black text-slate-900">
                            {product.type === 'Loan'
                                ? (product.maxAmount ? `${product.maxAmount.toLocaleString()}` : 'N/A')
                                : (product.minBalance ? `${product.minBalance.toLocaleString()}` : '0')
                            }
                            <span className="text-xs font-medium text-slate-400 ml-1">ETB</span>
                        </div>
                    </div>
                    {product.term && (
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Term</span>
                            </div>
                            <div className="text-xl font-black text-slate-900">{product.term}</div>
                        </div>
                    )}
                    {product.currency && (
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                <Globe className="w-4 h-4 text-cyan-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Currency</span>
                            </div>
                            <div className="text-xl font-black text-slate-900">{product.currency}</div>
                        </div>
                    )}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Features */}
                    {(product.features || []).length > 0 && (
                        <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <CheckCircle2 className="w-4 h-4 text-[#3EA63B]" /> Features
                            </h3>
                            <ul className="space-y-3">
                                {(product.features || []).map((feature: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-xs text-slate-600">
                                        <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#3EA63B] shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Requirements & Eligibility */}
                    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <FileText className="w-4 h-4 text-slate-400" /> Requirements
                        </h3>
                        <div className="space-y-4">
                            {product.eligibility && (Array.isArray(product.eligibility) ? product.eligibility.length > 0 : true) && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Eligibility</h4>
                                    <ul className="space-y-2">
                                        {(Array.isArray(product.eligibility) ? product.eligibility : [product.eligibility]).map((item: any, i: number) => (
                                            <li key={i} className="text-xs text-slate-600 border-l-2 border-[#3EA63B] pl-3 py-1">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {product.requirements && (Array.isArray(product.requirements) ? product.requirements.length > 0 : true) && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Documents</h4>
                                    <ul className="space-y-2">
                                        {(Array.isArray(product.requirements) ? product.requirements : [product.requirements]).map((item: any, i: number) => (
                                            <li key={i} className="text-xs text-slate-600 border-l-2 border-blue-300 pl-3 py-1">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {product.collateralRequirements && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Collateral</h4>
                                    <p className="text-xs text-slate-600 border-l-2 border-amber-300 pl-3 py-1">{product.collateralRequirements}</p>
                                </div>
                            )}
                            {product.insuranceRequirements && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Insurance</h4>
                                    <p className="text-xs text-slate-600 border-l-2 border-purple-300 pl-3 py-1">{product.insuranceRequirements}</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Fees & Penalties (if any) */}
                {(product.fees || product.prepaymentPenalties || product.latePaymentPenalties || product.repaymentFrequency || product.disbursementTime) && (
                    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4 text-orange-400" /> Fees & Terms
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {product.fees && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Processing Fee</p>
                                    <p className="text-sm font-bold text-slate-900">{product.fees}</p>
                                </div>
                            )}
                            {product.repaymentFrequency && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Repayment</p>
                                    <p className="text-sm font-bold text-slate-900">{product.repaymentFrequency}</p>
                                </div>
                            )}
                            {product.disbursementTime && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Disbursement</p>
                                    <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" /> {product.disbursementTime}
                                    </p>
                                </div>
                            )}
                            {product.prepaymentPenalties && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Prepayment Penalty</p>
                                    <p className="text-sm font-bold text-red-600">{product.prepaymentPenalties}</p>
                                </div>
                            )}
                            {product.latePaymentPenalties && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Late Payment Penalty</p>
                                    <p className="text-sm font-bold text-red-600">{product.latePaymentPenalties}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
                {/* Loan Calculator — only for loan products */}
                {product.type === 'Loan' && (
                    <LoanCalculator
                        interestRate={product.interestRate}
                        interestMax={product.interestMax}
                        maxAmount={product.maxAmount}
                        term={product.term}
                        fees={product.fees}
                        repaymentFrequency={product.repaymentFrequency}
                        disbursementTime={product.disbursementTime}
                        collateralRequirements={product.collateralRequirements}
                        prepaymentPenalties={product.prepaymentPenalties}
                        productName={product.title || product.name || 'This Product'}
                    />
                )}

                {/* Suitability Check */}
                <LoanSuitability
                    productType={product.type || 'Loan'}
                    productName={product.title || product.name || 'This Product'}
                    interestRate={product.interestRate}
                />

                {/* Community Voice */}
                <ProductRatings productName={product.title || product.name || 'This Product'} />
            </main>

            {/* Fixed Call to Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 md:bg-transparent md:border-none md:static md:p-0 md:max-w-3xl md:mx-auto md:w-full md:mt-6">
                <ApplyButton productType={product.type || 'Product'} />
            </div>
        </div>
    );
}
