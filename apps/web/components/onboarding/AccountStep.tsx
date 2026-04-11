'use client';

import { Wallet, Smartphone, Landmark, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const accountTypes = [
  { id: 'Bank Book', label: 'Bank Book', icon: Landmark, color: '#68246D' },
  { id: 'Mobile Wallet', label: 'Mobile Wallet', icon: Smartphone, color: '#00ADEF' },
  { id: 'Debit Card', label: 'Card', icon: Wallet, color: '#F15A22' },
];

export function AccountStep({ 
  accounts, 
  setAccounts, 
  onNext,
  onBack
}: { 
  accounts: any[], 
  setAccounts: (a: any[]) => void, 
  onNext: () => void,
  onBack: () => void
}) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Bank Book');

  const handleAdd = () => {
    if (!name || !balance) return;
    const color = accountTypes.find(t => t.id === type)?.color || '#3EA63B';
    setAccounts([...accounts, { name, balance, type, color }]);
    setName('');
    setBalance('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-sm flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
        <Landmark className="w-8 h-8 text-blue-400" />
      </div>

      <h1 className="text-2xl font-black mb-2 text-center">Power Mizan Up</h1>
      <p className="text-slate-400 mb-8 text-sm text-center">Add your first account to see your real net worth. (CBE, Telebirr, etc.)</p>

      <div className="w-full space-y-4">
        {/* Existing Accounts */}
        {accounts.length > 0 && (
          <div className="space-y-2 mb-6">
            {accounts.map((acc, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: acc.color }}>
                    {acc.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{acc.name}</p>
                    <p className="text-[10px] text-slate-400">{acc.type}</p>
                  </div>
                </div>
                <p className="text-xs font-black text-white">{Number(acc.balance).toLocaleString()} ETB</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex gap-2">
            {accountTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border ${type === t.id ? 'bg-white/10 border-white/20' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                <t.icon className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase">{t.label}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Account Name (e.g. My CBE)"
            className="w-full bg-black/20 border border-white/5 rounded-lg py-2.5 px-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
          />

          <div className="relative">
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Current Balance"
              className="w-full bg-black/20 border border-white/5 rounded-lg py-2.5 px-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500">ETB</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!name || !balance}
            className="w-full py-2.5 rounded-lg bg-blue-500 text-white text-xs font-black hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add Account
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl border border-white/10 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onNext}
            disabled={accounts.length === 0}
            className="flex-[2] py-4 rounded-xl bg-[#3EA63B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2e7d2c] transition-colors shadow-lg disabled:opacity-50"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <button onClick={onNext} className="w-full text-center text-xs text-slate-500 font-bold hover:text-slate-300 mt-2">
           Skip for now
        </button>
      </div>
    </motion.div>
  );
}
