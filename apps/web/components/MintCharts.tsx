'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function MintDonutChart({ data, totalSpent }: { data: any[], totalSpent: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-full w-48 mx-auto mb-6 relative">
        <span className="text-sm font-bold text-slate-400">No data</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-48 w-full relative mb-4">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`, 'Spent']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-[var(--color-mint-text-muted)] uppercase tracking-wider">This month</span>
          <span className="text-xl font-black text-[var(--color-mint-text)]">{totalSpent.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full max-w-xs mx-auto">
        {data.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-semibold text-[var(--color-mint-text)] truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MintBudgetBar({ spent, total, title }: { spent: number, total: number, title?: string }) {
  const percent = Math.min(100, Math.max(0, (spent / total) * 100));
  const isOver = spent > total;
  const left = Math.max(0, total - spent);
  
  // Mint pace tracking calculation - roughly linear through the month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const pacePercent = (currentDay / daysInMonth) * 100;
  const statusColor = isOver ? 'bg-[var(--color-mint-coral)]' : (percent > pacePercent && percent > 80 ? 'bg-[var(--color-mint-gold)]' : 'bg-[var(--color-mint-primary)]');

  return (
    <div className="w-full">
      {title && <h4 className="text-[11px] font-bold text-[var(--color-mint-text)] uppercase tracking-wider mb-1">{title}</h4>}
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-sm font-black text-[var(--color-mint-text)]">
          {spent.toLocaleString()} <span className="text-[10px] font-semibold text-[var(--color-mint-text-muted)]">of {total.toLocaleString()}</span>
        </span>
        {!isOver && <span className="text-[10px] font-bold text-[var(--color-mint-text-muted)]">{left.toLocaleString()} left</span>}
        {isOver && <span className="text-[10px] font-bold text-[var(--color-mint-coral)]">Over budget</span>}
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full w-full relative overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
          style={{ width: `${percent}%` }}
        />
        {/* Pace marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-slate-300"
          style={{ left: `${pacePercent}%` }}
        />
      </div>
    </div>
  );
}
