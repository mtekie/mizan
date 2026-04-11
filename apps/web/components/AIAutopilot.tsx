'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';

export function AIAutopilot() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    async function fetchTip() {
      try {
        const response = await fetch('/api/v1/ai/tip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: "45,200 ETB in Savings, 12,050 ETB in Telebirr, and 8,000 ETB in Equb. Their cash flow is positive"
          }),
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        setTip(data.tip || 'Consider moving idle funds to a high-yield savings account to maximize your returns.');
      } catch (error) {
        console.error('Failed to fetch AI tip:', error);
        setTip('Your telebirr balance is high. Moving 10k ETB to Awash Savings could earn you 700 ETB/yr.');
      } finally {
        setLoading(false);
      }
    }
    fetchTip();
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 shadow-lg text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24" />
      </div>
      <div className="flex items-start gap-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold tracking-wider text-[#6ED063] uppercase">AI Autopilot</span>
            <button onClick={() => setVisible(false)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-3 py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your portfolio...
            </div>
          ) : (
            <p className="text-sm font-light leading-relaxed text-slate-100 mb-3">
              {tip}
            </p>
          )}
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
            Take Action
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
