'use client';

import { useState, useEffect } from 'react';
import { Bell, ArrowRight, Building2, Car, Plus, Home, TrendingUp, MapPin, Fuel, Calendar, ShieldCheck, Bed, Bath, Maximize, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { banks } from '@/lib/data/banks';
import { addAssetAction } from './actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const esxListedBanks = banks.filter(b => b.esxListed && b.esxSymbol);
const stockData = esxListedBanks.map((bank) => ({
  id: bank.id, name: bank.name, symbol: bank.esxSymbol,
  price: bank.esxPrice ?? 0, change: bank.esxChange ?? 0,
  isPositive: (bank.esxChange ?? 0) >= 0,
  iconBg: bank.color, logo: bank.logo,
  href: `/wealth/${bank.esxSymbol?.toLowerCase()}`,
}));

const mockPortfolioData = [
  { name: 'Stocks', value: 180000, color: '#3EA63B' },
  { name: 'Savings', value: 145000, color: '#6366f1' },
  { name: 'Real Estate', value: 450000, color: '#f59e0b' },
  { name: 'Equb/SACCO', value: 32000, color: '#ef4444' },
];

const tabs = ['Stocks', 'Real Estate', 'Vehicles'] as const;

export default function WealthClient({ initialAssets = [] }: { initialAssets: any[] }) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Stocks');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const portfolioData = initialAssets.length > 0 ? initialAssets.reduce((acc: any[], asset: any) => {
    const existing = acc.find(a => a.name === asset.category);
    if (existing) {
      existing.value += asset.value;
    } else {
      const colors = ['#3EA63B', '#6366f1', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];
      acc.push({ name: asset.category, value: asset.value, color: colors[acc.length % colors.length] });
    }
    return acc;
  }, []) : mockPortfolioData;

  const totalPortfolio = portfolioData.reduce((s: any, d: any) => s + d.value, 0);

  const calculateMizanAssessment = (asset: any) => {
    if (!asset.purchasePrice || !asset.purchasedAt) return asset.value;
    const yearDiff = (new Date().getTime() - new Date(asset.purchasedAt).getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (asset.category === 'Vehicles') {
        return asset.purchasePrice * Math.pow(0.9, yearDiff);
    }
    if (asset.category === 'Real Estate') {
        return asset.purchasePrice * Math.pow(1.05, yearDiff);
    }
    return asset.value;
  };

  const [form, setForm] = useState({
    name: '',
    category: 'Real Estate',
    purchasePrice: '',
    purchasedAt: '',
    currentValue: '',
  });

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await addAssetAction({
            ...form,
            purchasePrice: parseFloat(form.purchasePrice),
            currentValue: parseFloat(form.currentValue),
        });
        if (res.error) throw new Error(res.error);
        toast.success(`${form.name} added to your wealth hub`);
        setIsAddModalOpen(false);
        setForm({ name: '', category: 'Real Estate', purchasePrice: '', purchasedAt: '', currentValue: '' });
    } catch (err: any) {
        toast.error(err.message || 'Failed to add asset');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Wealth Hub</h1>
            <p className="text-sm text-slate-500">Manual asset tracking & Mizan assessment</p>
          </div>
          <Link href="/notifications" className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition">
            <Bell className="w-5 h-5 text-slate-500" />
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
        {/* Portfolio Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Your Portfolio</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={portfolioData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={42} paddingAngle={2}>
                        {portfolioData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">ETB {(totalPortfolio / 1000).toFixed(0)}K</p>
                <p className="text-[10px] font-bold text-[#3EA63B]">Synced & Verified</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white overflow-hidden relative flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#3EA63B]/10 rounded-full blur-3xl" />
            <h3 className="text-xs font-bold opacity-60 uppercase tracking-wider mb-4">Simulated ESX Market</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {stockData.map(stock => (
                <div key={stock.id} className="min-w-[140px] bg-white/10 rounded-xl p-3 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${stock.iconBg} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {stock.logo}
                    </div>
                    <span className="text-xs font-bold">{stock.symbol}</span>
                  </div>
                  <p className="text-lg font-black">{stock.price.toFixed(2)}</p>
                  <p className={`text-[10px] font-bold ${stock.isPositive ? 'text-[#6ED063]' : 'text-red-400'}`}>
                    {stock.isPositive ? '+' : ''}{stock.change}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1">
            {tabs.map(tab => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab
                    ? 'bg-[#3EA63B] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                {tab}
                </button>
            ))}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="ml-auto bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition"
          >
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>

        {/* Dynamic Content */}
        {activeTab === 'Stocks' && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockData.map(stock => (
                <div key={stock.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${stock.iconBg} flex items-center justify-center text-white font-bold text-sm`}>
                      {stock.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{stock.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{stock.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-black text-slate-900">{stock.price.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400">ETB per share</p>
                    </div>
                    <span className={`text-sm font-bold px-2 py-1 rounded-lg ${stock.isPositive ? 'bg-[#3EA63B]/10 text-[#3EA63B]' : 'bg-red-100 text-red-600'}`}>
                      {stock.isPositive ? '+' : ''}{stock.change}%
                    </span>
                  </div>
                </div>
            ))}
          </section>
        )}

        {(activeTab === 'Real Estate' || activeTab === 'Vehicles') && (
           <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialAssets.filter(a => a.category === activeTab).map(asset => {
                const mizanVal = calculateMizanAssessment(asset);
                const isHealthy = asset.value >= mizanVal;
                const roi = Math.round((asset.value / asset.purchasePrice - 1) * 100);
                
                return (
                  <div key={asset.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${asset.category === 'Vehicles' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                           {asset.category === 'Vehicles' ? <Car className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{asset.name}</h3>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{asset.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400">Purchased {new Date(asset.purchasedAt).getFullYear()}</p>
                        <p className="text-[10px] text-slate-300 font-medium">ETB {(asset.purchasePrice/1000000).toFixed(1)}M</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Manual Value</p>
                        <p className="text-lg font-black text-slate-900 leading-none">{asset.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Mizan Assessment</p>
                        <p className={`text-lg font-black leading-none ${isHealthy ? 'text-[#3EA63B]' : 'text-amber-500'}`}>
                            {Math.round(mizanVal).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${isHealthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isHealthy ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                            {isHealthy ? 'Outperforming' : 'Under Assessment'}
                        </div>
                        <span className="text-[10px] font-black text-slate-500">ROI: <span className={roi >= 0 ? 'text-[#3EA63B]' : 'text-red-500'}>{roi}%</span></span>
                    </div>
                  </div>
                );
              })}
              {initialAssets.filter(a => a.category === activeTab).length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        {activeTab === 'Vehicles' ? <Car className="w-8 h-8 text-slate-300" /> : <Home className="w-8 h-8 text-slate-300" />}
                    </div>
                    <p className="text-sm text-slate-400 font-bold mb-6">No {activeTab} recorded.</p>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-xs font-black text-slate-900 hover:border-[#3EA63B] transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add your first {activeTab}
                    </button>
                </div>
              )}
           </section>
        )}

        {/* Add Asset Modal */}
        <AnimatePresence>
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                        onClick={() => setIsAddModalOpen(false)} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Track New Asset</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 text-[#3EA63B]">Building your Net Worth</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddAsset} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Name</label>
                                        <input 
                                            required
                                            placeholder="e.g. 2022 Toyota Hilux"
                                            value={form.name}
                                            onChange={e => setForm({...form, name: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#3EA63B] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                        <select 
                                            value={form.category}
                                            onChange={e => setForm({...form, category: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#3EA63B] appearance-none"
                                        >
                                            <option value="Real Estate">Real Estate</option>
                                            <option value="Vehicles">Vehicles</option>
                                            <option value="Equb/SACCO">Equb/SACCO</option>
                                            <option value="Stocks">Stocks (Manual)</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Purchase Price (ETB)</label>
                                        <input 
                                            required
                                            type="number"
                                            placeholder="Amount paid"
                                            value={form.purchasePrice}
                                            onChange={e => setForm({...form, purchasePrice: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#3EA63B]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Purchase Date</label>
                                        <input 
                                            required
                                            type="date"
                                            value={form.purchasedAt}
                                            onChange={e => setForm({...form, purchasedAt: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#3EA63B]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Current Market Estimation (ETB)</label>
                                    <input 
                                        required
                                        type="number"
                                        placeholder="What is it worth today?"
                                        value={form.currentValue}
                                        onChange={e => setForm({...form, currentValue: e.target.value})}
                                        className="w-full bg-[#F1F8F1] border border-[#3EA63B]/20 rounded-2xl py-5 px-4 text-center text-2xl font-black text-[#3EA63B] placeholder:text-[#3EA63B]/20 focus:outline-none focus:ring-2 focus:ring-[#3EA63B]/30"
                                    />
                                    <p className="text-[9px] text-slate-400 font-bold text-center uppercase tracking-tighter mt-2">Mizan will perform an independent verification after submission</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-4.5 rounded-[1.25rem] font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
                                >
                                    {loading ? 'Processing...' : 'Securely Add Asset'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}
