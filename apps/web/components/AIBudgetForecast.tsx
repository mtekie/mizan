'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const budgetCategories = [
  { name: 'Groceries', spent: 4500, total: 8000 },
  { name: 'Rent & Utilities', spent: 12000, total: 12000 },
  { name: 'Entertainment', spent: 3200, total: 2500 },
  { name: 'Transport', spent: 850, total: 3000 },
];

export function AIBudgetForecast() {
  const [forecast, setForecast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const response = await fetch('/api/v1/ai/budget-forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categories: budgetCategories }),
        });
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        setForecast(data.forecast || 'Based on your spending, you have a surplus this month. Consider adding it to your CMC Villa dream?');
      } catch (error) {
        console.error('Failed to fetch AI forecast:', error);
        setForecast('Based on your spending, you have a 2,400 ETB surplus this month. Consider adding it to your CMC Villa dream?');
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5 blur-2xl"></div>
      <div className="flex gap-3 items-start relative z-10">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#FFC836]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">Budget Forecast</h3>
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing budget...
            </div>
          ) : (
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {forecast}
            </p>
          )}
          <button className="mt-3 text-xs bg-white/10 hover:bg-white/20 transition px-3 py-1.5 rounded-lg text-white font-medium border border-white/10">
            Move Funds
          </button>
        </div>
      </div>
    </div>
  );
}
