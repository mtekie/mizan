import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Building2, Calendar, FileText, BadgePercent, Zap, Globe, AlertTriangle, Clock, Banknote } from 'lucide-react';
import ApplyButton from '@/components/CatalogueApplyButton';
import { ProductBookmarkButton } from '@/components/ProductBookmarkButton';
import { ProductRatings } from '@/components/ProductRatings';
import { LoanSuitability } from '@/components/LoanSuitability';
import { LoanCalculator } from '@/components/LoanCalculator';
import { getProductDetailApiResponse } from '@/lib/server/catalogue-contract';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const response = await getProductDetailApiResponse(resolvedParams.id);
    
    if (!response || !response.productDetail) {
        notFound();
    }

    const product = response.productDetail;
    const providerHref = `/catalogue/bank/${product.provider.id}`;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 md:bg-transparent md:py-8">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 md:bg-transparent md:border-none">
                <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
                    <Link href="/catalogue" className="flex size-10 items-center justify-center rounded-full bg-slate-100 shadow-sm text-slate-900 hover:bg-slate-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        {product.badges.isDigital && (
                            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Digital
                            </span>
                        )}
                        {product.badges.isInterestFree && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-black">
                                Interest‑Free
                            </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${product.trust.tone === 'good' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                            {product.trust.tone === 'good' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {product.trust.label}
                        </span>
                        <ProductBookmarkButton productId={product.id} initialBookmarked={product.isBookmarked} />
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-6 pb-32 max-w-3xl mx-auto w-full">
                {/* Title Section */}
                <section className="mb-8">
                    <Link href={providerHref} className="flex items-center gap-2 mb-3 group">
                        <div
                            className="w-10 h-10 rounded-xl bg-slate-600 text-white flex items-center justify-center font-bold text-sm shadow-sm"
                            style={product.provider.brandColor ? { backgroundColor: product.provider.brandColor } : undefined}
                        >
                            {product.provider.shortCode || 'FI'}
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-[#3EA63B] transition-colors">
                                {product.provider.name}
                            </span>
                            {product.provider.nameAmh && <span className="text-xs text-slate-400 ml-2 font-ethiopic">{product.provider.nameAmh}</span>}
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">{product.title}</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">{product.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${product.trust.tone === 'good' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {product.trust.label}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 border border-slate-100">
                            {product.trust.freshness}
                        </span>
                    </div>
                    {product.badges.isGenderFocused && (
                        <span className="inline-block mt-3 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Gender-Focused Product
                        </span>
                    )}
                </section>

                <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
                    <h2 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wide">Why This May Fit</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{product.matchExplanation}</p>
                    <div className="flex flex-wrap gap-2">
                        {product.facts.map((fact) => (
                            <span key={`${fact.label}-${fact.value}`} className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${fact.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
                                {fact.label}: {fact.value}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Highlight Cards */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <BadgePercent className="w-4 h-4 text-[#3EA63B]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Interest</span>
                        </div>
                        <div className="text-xl font-black text-slate-900">{product.metrics.interestDisplay} <span className="text-xs font-medium text-slate-400">p.a</span></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                            <Banknote className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {product.metrics.amountLabel}
                            </span>
                        </div>
                        <div className="text-xl font-black text-slate-900">
                            {product.metrics.amountDisplay}
                        </div>
                    </div>
                    {product.metrics.termDisplay && (
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Term</span>
                            </div>
                            <div className="text-xl font-black text-slate-900">{product.metrics.termDisplay}</div>
                        </div>
                    )}
                    {product.metrics.currencyDisplay && (
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                <Globe className="w-4 h-4 text-cyan-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Currency</span>
                            </div>
                            <div className="text-xl font-black text-slate-900">{product.metrics.currencyDisplay}</div>
                        </div>
                    )}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Features */}
                    {product.details.features.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <CheckCircle2 className="w-4 h-4 text-[#3EA63B]" /> Features
                            </h3>
                            <ul className="space-y-3">
                                {product.details.features.map((feature: string, i: number) => (
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
                            {product.details.eligibility.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Eligibility</h4>
                                    <ul className="space-y-2">
                                        {product.details.eligibility.map((item: any, i: number) => (
                                            <li key={i} className="text-xs text-slate-600 border-l-2 border-[#3EA63B] pl-3 py-1">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {product.details.eligibility.length === 0 && product.details.requirements.length === 0 && (
                                <p className="text-xs text-slate-500">Requirements are still being cleaned up for this product. Check with the provider before applying.</p>
                            )}
                            {product.details.requirements.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Documents</h4>
                                    <ul className="space-y-2">
                                        {product.details.requirements.map((item: any, i: number) => (
                                            <li key={i} className="text-xs text-slate-600 border-l-2 border-blue-300 pl-3 py-1">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {product.details.collateralRequirements && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Collateral</h4>
                                    <p className="text-xs text-slate-600 border-l-2 border-amber-300 pl-3 py-1">{product.details.collateralRequirements}</p>
                                </div>
                            )}
                            {product.details.insuranceRequirements && (
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Insurance</h4>
                                    <p className="text-xs text-slate-600 border-l-2 border-purple-300 pl-3 py-1">{product.details.insuranceRequirements}</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Fees & Penalties (if any) */}
                {product.feesAndTerms && (
                    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4 text-orange-400" /> Fees & Terms
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {product.feesAndTerms.processingFee && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Processing Fee</p>
                                    <p className="text-sm font-bold text-slate-900">{product.feesAndTerms.processingFee}</p>
                                </div>
                            )}
                            {product.feesAndTerms.repaymentFrequency && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Repayment</p>
                                    <p className="text-sm font-bold text-slate-900">{product.feesAndTerms.repaymentFrequency}</p>
                                </div>
                            )}
                            {product.feesAndTerms.disbursementTime && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Disbursement</p>
                                    <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" /> {product.feesAndTerms.disbursementTime}
                                    </p>
                                </div>
                            )}
                            {product.feesAndTerms.prepaymentPenalties && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Prepayment Penalty</p>
                                    <p className="text-sm font-bold text-red-600">{product.feesAndTerms.prepaymentPenalties}</p>
                                </div>
                            )}
                            {product.feesAndTerms.latePaymentPenalties && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Late Payment Penalty</p>
                                    <p className="text-sm font-bold text-red-600">{product.feesAndTerms.latePaymentPenalties}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
                <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-6">
                    <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <ShieldCheck className="w-4 h-4 text-[#3EA63B]" /> Data Quality
                    </h3>
                    <div className="grid gap-3 md:grid-cols-3">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Status</p>
                            <p className={`text-sm font-bold ${product.trust.tone === 'good' ? 'text-[#3EA63B]' : 'text-amber-700'}`}>{product.trust.label}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Freshness</p>
                            <p className="text-sm font-bold text-slate-900">{product.trust.freshness}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Source</p>
                            {product.dataQuality.sourceUrl ? (
                                <a href={product.dataQuality.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#3EA63B] hover:underline">
                                    Provider Website
                                </a>
                            ) : (
                                <p className="text-sm font-bold text-slate-900">{product.trust.source}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                            <p className="text-sm font-bold text-slate-900">{product.dataQuality.confidence != null ? `${product.dataQuality.confidence}%` : 'Pending'}</p>
                        </div>
                    </div>
                    <a href={`mailto:support@mizan.app?subject=Incorrect product info: ${encodeURIComponent(product.title)}`} className="mt-4 inline-flex text-xs font-black text-[#3EA63B] hover:underline">
                        Report incorrect information
                    </a>
                </section>
                
                {/* Loan Calculator — only for loan products */}
                {product.isCreditProduct && product.rawCalculatorData && (
                    <LoanCalculator
                        interestRate={product.rawCalculatorData.interestRate}
                        interestMax={product.rawCalculatorData.interestMax}
                        maxAmount={product.rawCalculatorData.maxAmount}
                        term={product.metrics.termDisplay}
                        fees={product.feesAndTerms?.processingFee}
                        repaymentFrequency={product.feesAndTerms?.repaymentFrequency}
                        disbursementTime={product.feesAndTerms?.disbursementTime}
                        collateralRequirements={product.details.collateralRequirements}
                        prepaymentPenalties={product.feesAndTerms?.prepaymentPenalties}
                        productName={product.title}
                    />
                )}

                {/* Suitability Check */}
                <LoanSuitability
                    productType={product.productKind}
                    productName={product.title}
                    interestRate={product.rawCalculatorData?.interestRate}
                />

                {/* Community Voice */}
                <ProductRatings productName={product.title} />
            </main>

            {/* Fixed Call to Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 md:bg-transparent md:border-none md:static md:p-0 md:max-w-3xl md:mx-auto md:w-full md:mt-6">
                <ApplyButton productType={product.productKind} />
            </div>
        </div>
    );
}
