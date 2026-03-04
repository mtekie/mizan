'use client';

import { useState } from 'react';
import { Bell, Calendar, Check, ChevronDown, ChevronUp, Home, Phone, Shield, Zap, Wifi, CreditCard, Plus, X, Trash2 } from 'lucide-react';

type Bill = {
    id: number;
    name: string;
    amount: number;
    category: string;
    icon: typeof Bell;
    color: string;
    bg: string;
    dueDay: number;
    frequency: string;
    isPaid: boolean;
};

const categoryMap = [
    { label: 'Rent', icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Utilities', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Phone', icon: Phone, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Internet', icon: Wifi, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Insurance', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Subscription', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const demoBills: Bill[] = [
    { id: 1, name: 'Apartment Rent', amount: 8000, category: 'Rent', icon: Home, color: 'text-blue-600', bg: 'bg-blue-50', dueDay: 1, frequency: 'Monthly', isPaid: false },
    { id: 2, name: 'Ethio Telecom', amount: 500, category: 'Phone', icon: Phone, color: 'text-sky-600', bg: 'bg-sky-50', dueDay: 5, frequency: 'Monthly', isPaid: false },
    { id: 3, name: 'Electric (EELPA)', amount: 350, category: 'Utilities', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', dueDay: 10, frequency: 'Monthly', isPaid: true },
    { id: 4, name: 'Internet - Safaricom', amount: 1200, category: 'Internet', icon: Wifi, color: 'text-indigo-600', bg: 'bg-indigo-50', dueDay: 15, frequency: 'Monthly', isPaid: false },
];

export function BillReminders() {
    const [bills, setBills] = useState(demoBills);
    const [showAdd, setShowAdd] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [newBill, setNewBill] = useState({ name: '', amount: '', category: '', dueDay: '' });

    const today = new Date().getDate();
    const unpaid = bills.filter(b => !b.isPaid);
    const overdue = unpaid.filter(b => b.dueDay < today);
    const upcoming = unpaid.filter(b => b.dueDay >= today).sort((a, b) => a.dueDay - b.dueDay);
    const paid = bills.filter(b => b.isPaid);
    const totalDue = unpaid.reduce((s, b) => s + b.amount, 0);

    const markPaid = (id: number) => setBills(bs => bs.map(b => b.id === id ? { ...b, isPaid: true } : b));
    const removeBill = (id: number) => setBills(bs => bs.filter(b => b.id !== id));

    const handleAdd = () => {
        if (!newBill.name || !newBill.amount || !newBill.category || !newBill.dueDay) return;
        const cat = categoryMap.find(c => c.label === newBill.category);
        setBills(bs => [...bs, {
            id: Date.now(),
            name: newBill.name,
            amount: Number(newBill.amount),
            category: newBill.category,
            icon: cat?.icon || Bell,
            color: cat?.color || 'text-slate-600',
            bg: cat?.bg || 'bg-slate-50',
            dueDay: Number(newBill.dueDay),
            frequency: 'Monthly',
            isPaid: false,
        }]);
        setNewBill({ name: '', amount: '', category: '', dueDay: '' });
        setShowAdd(false);
    };

    return (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
            >
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Bill Reminders</h2>
                    {overdue.length > 0 && (
                        <span className="text-[9px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded-full">{overdue.length} overdue</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">{totalDue.toLocaleString()} ETB due</span>
                    {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {expanded && (
                <div className="px-5 pb-5">
                    {/* Overdue */}
                    {overdue.length > 0 && (
                        <div className="mb-4">
                            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2">⚠ Overdue</p>
                            <div className="space-y-2">
                                {overdue.map(bill => (
                                    <BillRow key={bill.id} bill={bill} today={today} onPay={markPaid} onRemove={removeBill} isOverdue />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming */}
                    {upcoming.length > 0 && (
                        <div className="mb-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Upcoming</p>
                            <div className="space-y-2">
                                {upcoming.map(bill => (
                                    <BillRow key={bill.id} bill={bill} today={today} onPay={markPaid} onRemove={removeBill} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Paid */}
                    {paid.length > 0 && (
                        <div className="mb-4">
                            <p className="text-[9px] font-black text-[#3EA63B] uppercase tracking-widest mb-2">✓ Paid This Month</p>
                            <div className="space-y-2">
                                {paid.map(bill => (
                                    <BillRow key={bill.id} bill={bill} today={today} onPay={markPaid} onRemove={removeBill} isPaid />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add button */}
                    {!showAdd ? (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 text-xs font-bold text-slate-500 hover:text-[#3EA63B] hover:border-[#3EA63B] transition flex items-center justify-center gap-1"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add a Bill
                        </button>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Bill</p>
                                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-900"><X className="w-3.5 h-3.5" /></button>
                            </div>
                            <input placeholder="Bill name" value={newBill.name} onChange={e => setNewBill(b => ({ ...b, name: e.target.value }))}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#3EA63B]" />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="number" placeholder="Amount (ETB)" value={newBill.amount} onChange={e => setNewBill(b => ({ ...b, amount: e.target.value }))}
                                    className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#3EA63B]" />
                                <input type="number" placeholder="Due day (1-31)" min={1} max={31} value={newBill.dueDay} onChange={e => setNewBill(b => ({ ...b, dueDay: e.target.value }))}
                                    className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#3EA63B]" />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {categoryMap.map(cat => (
                                    <button key={cat.label} onClick={() => setNewBill(b => ({ ...b, category: cat.label }))}
                                        className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition ${newBill.category === cat.label ? 'border-[#3EA63B] bg-[#3EA63B]/5 text-[#3EA63B]' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                                        <cat.icon className="w-3 h-3" /> {cat.label}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleAdd}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${newBill.name && newBill.amount && newBill.category && newBill.dueDay ? 'bg-[#0F172A] text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                                Add Bill
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

function BillRow({ bill, today, onPay, onRemove, isOverdue, isPaid }: {
    bill: Bill; today: number; onPay: (id: number) => void; onRemove: (id: number) => void; isOverdue?: boolean; isPaid?: boolean;
}) {
    const Icon = bill.icon;
    const daysUntil = bill.dueDay - today;
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl transition ${isOverdue ? 'bg-red-50 border border-red-100' : isPaid ? 'bg-slate-50 opacity-60' : 'bg-slate-50'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bill.bg}`}>
                <Icon className={`w-4 h-4 ${bill.color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${isPaid ? 'line-through text-slate-400' : 'text-slate-900'}`}>{bill.name}</p>
                <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {isPaid ? 'Paid' : isOverdue ? `${Math.abs(daysUntil)} days overdue` : daysUntil === 0 ? 'Due today' : `Due in ${daysUntil} days`}
                </p>
            </div>
            <span className={`text-xs font-black ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>{bill.amount.toLocaleString()}</span>
            {!isPaid && (
                <button onClick={() => onPay(bill.id)} className="text-[9px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-1 rounded-lg hover:bg-[#3EA63B]/20 transition">
                    <Check className="w-3 h-3" />
                </button>
            )}
            <button onClick={() => onRemove(bill.id)} className="text-slate-300 hover:text-red-400 transition">
                <Trash2 className="w-3 h-3" />
            </button>
        </div>
    );
}
