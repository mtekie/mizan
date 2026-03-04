'use client';

import { useState } from 'react';
import { Bell, ArrowRight, Building2, Car, Plus, Home, TrendingUp, MapPin, Fuel, Calendar, ShieldCheck, Bed, Bath, Maximize } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { banks } from '@/lib/data/banks';
import { properties, vehicles } from '@/lib/data/listings';

const esxListedBanks = banks.filter(b => b.esxListed && b.esxSymbol);
const stockData = esxListedBanks.map((bank) => ({
  id: bank.id, name: bank.name, symbol: bank.esxSymbol,
  price: bank.esxPrice ?? 0, change: bank.esxChange ?? 0,
  isPositive: (bank.esxChange ?? 0) >= 0,
  iconBg: bank.color, logo: bank.logo,
  href: `/wealth/${bank.esxSymbol?.toLowerCase()}`,
}));

const portfolioData = [
  { name: 'Stocks', value: 180000, color: '#3EA63B' },
  { name: 'Savings', value: 145000, color: '#6366f1' },
  { name: 'Real Estate', value: 450000, color: '#f59e0b' },
  { name: 'Equb/SACCO', value: 32000, color: '#ef4444' },
];
const totalPortfolio = portfolioData.reduce((s, d) => s + d.value, 0);

const tabs = ['Stocks', 'Real Estate', 'Vehicles'] as const;

export default function Wealth() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Stocks');

  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Wealth Hub</h1>
            <p className="text-sm text-slate-500">Stocks, property, and vehicles</p>
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
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Portfolio</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={portfolioData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={42} paddingAngle={2}>
                      {portfolioData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">ETB {(totalPortfolio / 1000).toFixed(0)}K</p>
                <p className="text-[10px] font-bold text-[#3EA63B]">+8.2% this year</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {portfolioData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] text-slate-500">{d.name}</span>
                  <span className="text-[10px] font-bold text-slate-700 ml-auto">{Math.round(d.value / totalPortfolio * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#3EA63B]/10 rounded-full blur-3xl" />
            <h3 className="text-xs font-bold opacity-60 uppercase tracking-wider mb-2">ESX Market Ticker</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {stockData.map(stock => (
                <Link href={stock.href} key={stock.id} className="min-w-[160px] bg-white/10 rounded-xl p-4 shrink-0 hover:bg-white/15 transition">
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
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab
                  ? 'bg-[#3EA63B] text-white shadow-lg shadow-[#3EA63B]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#3EA63B]/30'
                }`}
            >
              {tab === 'Stocks' && <TrendingUp className="w-3 h-3 inline mr-1" />}
              {tab === 'Real Estate' && <Home className="w-3 h-3 inline mr-1" />}
              {tab === 'Vehicles' && <Car className="w-3 h-3 inline mr-1" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Stocks Tab */}
        {activeTab === 'Stocks' && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockData.map(stock => (
              <Link href={stock.href} key={stock.id} className="group">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${stock.iconBg} flex items-center justify-center text-white font-bold text-sm`}>
                      {stock.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#3EA63B] transition-colors">{stock.name}</h3>
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
              </Link>
            ))}
          </section>
        )}

        {/* Real Estate Tab */}
        {activeTab === 'Real Estate' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map(prop => (
              <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                {/* Color bar for type */}
                <div className={`h-2 ${prop.type === 'apartment' ? 'bg-blue-500' : prop.type === 'villa' ? 'bg-emerald-500' : prop.type === 'commercial' ? 'bg-purple-500' : 'bg-amber-500'}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{prop.title}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {prop.location}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${prop.listingType === 'sale' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                      {prop.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  <p className="text-xl font-black text-slate-900 mb-3">
                    ETB {prop.price.toLocaleString()}
                    {prop.priceUnit !== 'ETB' && <span className="text-xs font-medium text-slate-400 ml-1">{prop.priceUnit.replace('ETB', '').trim()}</span>}
                  </p>
                  <div className="flex gap-4 mb-3 text-[10px] text-slate-500 font-semibold">
                    {prop.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {prop.bedrooms} BR</span>}
                    {prop.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {prop.bathrooms} BA</span>}
                    <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {prop.area} sqm</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {prop.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-50 text-slate-500 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                  {prop.verified && (
                    <div className="flex items-center gap-1 mt-3 text-[10px] text-blue-600 font-bold">
                      <ShieldCheck className="w-3 h-3" /> Verified by {prop.agent}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'Vehicles' && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(car => (
              <div key={car.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{car.make} {car.model}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">{car.year} · {car.color}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${car.condition === 'New' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
                      {car.condition}
                    </span>
                  </div>
                  <p className="text-xl font-black text-slate-900 mb-3">ETB {car.price.toLocaleString()}</p>
                  <div className="flex gap-4 mb-3 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {car.fuelType}</span>
                    <span>{car.transmission}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {car.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {car.features.slice(0, 4).map((f, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-50 text-slate-500 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                  {car.verified && (
                    <div className="flex items-center gap-1 mt-3 text-[10px] text-blue-600 font-bold">
                      <ShieldCheck className="w-3 h-3" /> {car.dealer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
