import { Landmark, Smartphone, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Upload, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const BANKS = [
  { id: 'CBE', name: 'CBE', color: '#68246D', icon: Landmark },
  { id: 'telebirr', name: 'telebirr', color: '#00ADEF', icon: Smartphone },
  { id: 'Awash', name: 'Awash', color: '#1A237E', icon: Landmark },
  { id: 'Dashen', name: 'Dashen', color: '#D32F2F', icon: Landmark },
];

export function AccountStep({ 
  accounts, 
  setAccounts, 
  onNext,
  onBack,
  onSkip
}: { 
  accounts: any[], 
  setAccounts: (a: any[]) => void, 
  onNext: () => void,
  onBack: () => void,
  onSkip?: () => void
}) {
  const toggleBank = (bank: typeof BANKS[0]) => {
    if (accounts.find((a) => a.name === bank.name)) {
      setAccounts(accounts.filter((a) => a.name !== bank.name));
    } else {
      setAccounts([...accounts, { name: bank.name, balance: '', accountNumber: '', type: bank.id === 'telebirr' ? 'Mobile Wallet' : 'Bank Book', color: bank.color }]);
    }
  };

  const updateAccountDetail = (name: string, key: string, value: string) => {
    setAccounts(accounts.map((a) => a.name === name ? { ...a, [key]: value } : a));
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

      <h1 className="text-2xl font-black mb-2 text-center">Your Accounts</h1>
      <p className="text-slate-400 mb-8 text-sm text-center">Select your banks. Details are optional but help Mizan analyze better.</p>

      <div className="w-full space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
        {BANKS.map((bank) => {
          const isSelected = accounts.find((a) => a.name === bank.name);
          const currentAcc = isSelected || {};

          return (
            <div key={bank.id} className={`w-full rounded-2xl border transition-all text-left overflow-hidden ${isSelected ? 'bg-white/10 border-blue-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
              <button
                onClick={() => toggleBank(bank)}
                className="w-full flex items-center gap-4 p-4"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: bank.color }}>
                  <bank.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{bank.name}</p>
                </div>
                <div className="text-slate-400">
                  {isSelected ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 border-t border-white/5 space-y-3"
                  >
                    <div className="pt-4 grid grid-cols-2 gap-3">
                       <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Number</label>
                          <input 
                            type="text"
                            placeholder="Optional"
                            value={currentAcc.accountNumber || ''}
                            onChange={(e) => updateAccountDetail(bank.name, 'accountNumber', e.target.value)}
                            className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                       </div>
                       <div className="col-span-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Balance (ETB)</label>
                          <input 
                            type="number"
                            placeholder="0.00"
                            value={currentAcc.balance || ''}
                            onChange={(e) => updateAccountDetail(bank.name, 'balance', e.target.value)}
                            className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                       </div>
                       <div className="col-span-1 flex flex-col justify-end">
                          <button className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 hover:bg-white/10 transition-all">
                             <Upload className="w-3 h-3" /> Upload PDF
                          </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="w-full flex gap-3 pt-6 mt-2 border-t border-white/10">
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
          Finish <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      
      {onSkip && (
        <button onClick={onSkip} className="w-full text-center text-xs text-slate-500 font-bold hover:text-slate-300 mt-4">
           Skip for now
        </button>
      )}
    </motion.div>
  );
}
