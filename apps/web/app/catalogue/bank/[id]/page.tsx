import { notFound } from 'next/navigation';
import { banks } from '@/lib/data/banks';
import { allProducts as products } from '@/lib/data/products';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, Calendar, Globe, ShieldCheck, TrendingUp, BadgePercent, Zap } from 'lucide-react';

export default async function BankDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const bank = banks.find(b => b.id === resolvedParams.id);

    if (!bank) {
        notFound();
    }

    const bankProducts = products.filter(p => p.bankId === bank.id || p.instituteId === bank.id);
    const loanProducts = bankProducts.filter(p => p.type === 'Loan');
    const savingsProducts = bankProducts.filter(p => p.type === 'Savings');

    const interestRates = bankProducts.map(p => p.interestRate).filter(Boolean) as number[];
    const minRate = interestRates.length > 0 ? Math.min(...interestRates) : 0;
    const maxRate = interestRates.length > 0 ? Math.max(...interestRates) : 0;
    const formatInterest = (val: number) => val < 1 ? (val * 100).toFixed(0) : val.toFixed(0);
    const hasDigital = bankProducts.some(p => p.digital);
    const hasInterestFree = bankProducts.some(p => p.interestFree);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 md:bg-transparent md:py-8">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 md:bg-transparent md:border-none">
                <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
                    <Link href="/catalogue" className="flex size-10 items-center justify-center rounded-full bg-slate-100 shadow-sm text-slate-900 hover:bg-slate-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4" /> NBE Regulated
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-6 pb-32 max-w-4xl mx-auto w-full">

                {/* Hero Section */}
                <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className={`w-20 h-20 rounded-2xl ${bank.color || 'bg-slate-600'} ${bank.textColor || 'text-white'} flex items-center justify-center text-2xl font-black shadow-lg shrink-0`}>
                            {bank.logo || bank.id.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-black text-slate-900 leading-tight mb-1">{bank.name}</h1>
                            {bank.nameAmh && (
                                <p className="text-lg font-ethiopic text-slate-400 mb-3">{bank.nameAmh}</p>
                            )}
                            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{bank.description}</p>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                        <Building2 className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                        <p className="text-2xl font-black text-slate-900">{bankProducts.length}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                        <BadgePercent className="w-5 h-5 text-[#3EA63B] mx-auto mb-2" />
                        <p className="text-2xl font-black text-slate-900">{formatInterest(minRate)}–{formatInterest(maxRate)}%</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest Range</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                        <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-slate-900">{bank.founded || bank.established || '—'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Founded</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                        {hasDigital ? <Zap className="w-5 h-5 text-amber-400 mx-auto mb-2" /> : <Globe className="w-5 h-5 text-slate-300 mx-auto mb-2" />}
                        <p className="text-2xl font-black text-slate-900">{hasDigital ? 'Yes' : 'No'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Access</p>
                    </div>
                </section>

                {/* Badges */}
                <section className="flex flex-wrap gap-2 mb-8">
                    {bank.esxListed && (
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> ESX Listed
                        </span>
                    )}
                    {hasInterestFree && (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Interest-Free Available
                        </span>
                    )}
                    {hasDigital && (
                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Digital Banking
                        </span>
                    )}
                    {bank.type === 'Microfinance' && (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Microfinance Institution
                        </span>
                    )}
                </section>

                {/* === Credit Products === */}
                {loanProducts.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <BadgePercent className="w-5 h-5 text-red-400" />
                            Credit Products <span className="text-xs font-bold text-slate-400 ml-1">({loanProducts.length})</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loanProducts.map(product => (
                                <Link href={`/catalogue/${product.id}`} key={product.id} className="group">
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-[#3EA63B] transition-colors flex-1 mr-2">
                                                {product.title || product.name}
                                            </h3>
                                            {product.highlight && (
                                                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full shrink-0">
                                                    {product.highlight}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">{product.description}</p>
                                        <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-3">
                                            <div>
                                                <span className="text-slate-400">Interest: </span>
                                                <span className="font-bold text-[#3EA63B]">{formatInterest(product.interestRate || 0)}%{product.interestMax && product.interestMax > (product.interestRate || 0) ? `–${formatInterest(product.interestMax)}%` : ''}</span>
                                            </div>
                                            {product.maxAmount && product.maxAmount > 0 && (
                                                <span className="font-semibold text-slate-700">Up to {product.maxAmount.toLocaleString()} ETB</span>
                                            )}
                                            {product.digital && <Zap className="w-3 h-3 text-amber-500" />}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* === Savings Products === */}
                {savingsProducts.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#3EA63B]" />
                            Savings Products <span className="text-xs font-bold text-slate-400 ml-1">({savingsProducts.length})</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savingsProducts.map(product => (
                                <Link href={`/catalogue/${product.id}`} key={product.id} className="group">
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-[#3EA63B] transition-colors flex-1 mr-2">
                                                {product.title || product.name}
                                            </h3>
                                            {product.interestFree && (
                                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                                    Interest‑Free
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">{product.description}</p>
                                        <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-3">
                                            <div>
                                                <span className="text-slate-400">Interest: </span>
                                                <span className="font-bold text-[#3EA63B]">{formatInterest(product.interestRate || 0)}%</span>
                                            </div>
                                            {product.minBalance && product.minBalance > 0 && (
                                                <span className="font-semibold text-slate-700">Min. {product.minBalance.toLocaleString()} ETB</span>
                                            )}
                                            {product.digital && <Zap className="w-3 h-3 text-amber-500" />}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {bankProducts.length === 0 && (
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
                        <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Products Coming Soon</h3>
                        <p className="text-sm text-slate-500">This institution&apos;s products are being catalogued. Check back soon.</p>
                    </section>
                )}
            </main>
        </div>
    );
}
