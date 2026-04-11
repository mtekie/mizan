'use client';

import { useState } from 'react';
import { ArrowLeft, Info, Verified, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MicroLoan() {
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(6);

  const interestRate = 0.12;
  const processingFee = 50;
  const totalInterest = Math.round(amount * interestRate * (duration / 12));
  const totalRepayment = amount + totalInterest + processingFee;
  const monthlyRepayment = (totalRepayment / duration).toFixed(2);

  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent md:py-8">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 md:bg-transparent md:border-none">
        <div className="flex items-center justify-between">
          <Link href="/catalogue" className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm text-slate-900 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Micro-Loan</h1>
          <button className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm text-slate-900 hover:bg-slate-50 transition-colors">
            <Info className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center gap-3 mt-6 mb-2">
          <div className="h-1.5 w-8 rounded-full bg-[#3EA63B]"></div>
          <div className="h-1.5 w-2 rounded-full bg-slate-200"></div>
          <div className="h-1.5 w-2 rounded-full bg-slate-200"></div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-24 space-y-8 max-w-md mx-auto w-full hide-scrollbar overflow-y-auto">
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-end mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">I want to borrow</label>
              <div className="text-3xl font-bold tracking-tight flex items-baseline gap-1 text-slate-900">
                <span className="text-[#3EA63B] text-xl">ETB</span>
                {amount.toLocaleString()}
              </div>
            </div>
            <div className="bg-[#6ED063]/10 text-[#3EA63B] px-3 py-1 rounded-full text-xs font-semibold">
              Max: 50k
            </div>
          </div>
          
          <div className="relative w-full h-8 flex items-center mb-2">
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="500" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full z-20 focus:outline-none appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3EA63B] [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:-mt-2.5 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-green-100 [&::-webkit-slider-runnable-track]:rounded-full"
            />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-[#3EA63B] rounded-full z-10 pointer-events-none" 
              style={{ width: `${((amount - 1000) / 49000) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
            <span>1,000</span>
            <span>25,000</span>
            <span>50,000</span>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4 px-1 text-slate-900">Repayment Duration</h3>
          <div className="grid grid-cols-3 gap-3">
            {[3, 6, 12].map((months) => (
              <label key={months} className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="duration" 
                  value={months} 
                  checked={duration === months}
                  onChange={() => setDuration(months)}
                  className="peer sr-only" 
                />
                <div className="flex flex-col items-center justify-center py-4 px-2 rounded-xl bg-white border-2 border-transparent peer-checked:border-[#3EA63B] peer-checked:bg-[#6ED063]/5 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                  {months === 6 && (
                    <div className="absolute top-0 right-0 bg-[#3EA63B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">Popular</div>
                  )}
                  <span className={`text-2xl font-bold ${duration === months ? 'text-[#3EA63B]' : 'text-slate-900'}`}>{months}</span>
                  <span className="text-xs text-slate-500 font-medium">Months</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#122111] to-[#0a150a] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#3EA63B]/20 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-[#3EA63B]/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Monthly Repayment</p>
              <h2 className="text-3xl font-bold text-white">ETB {monthlyRepayment.split('.')[0]}<span className="text-lg text-gray-400 font-normal">.{monthlyRepayment.split('.')[1]}</span></h2>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
              <div className="text-[10px] text-gray-300 uppercase">Rate</div>
              <div className="text-[#6ED063] font-bold">12%</div>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Principal Amount</span>
              <span className="font-medium">ETB {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Total Interest</span>
              <span className="font-medium text-[#6ED063]">ETB {totalInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Processing Fee</span>
              <span className="font-medium">ETB {processingFee}</span>
            </div>
            <div className="h-px w-full bg-white/10 my-2"></div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300 font-medium">Total Repayment</span>
              <span className="font-bold text-lg">ETB {totalRepayment.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 bg-black/20 p-2 rounded-lg">
            <Verified className="text-[#3EA63B] w-4 h-4" />
            <p>Based on your <span className="text-white font-semibold">Mizan Score (720)</span></p>
          </div>
        </section>

        <button className="w-full bg-gradient-to-r from-[#6ED063] to-[#3EA63B] text-white font-bold text-lg py-4 px-6 rounded-full shadow-lg shadow-[#3EA63B]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
          Apply Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>
    </div>
  );
}
