'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Bell, Globe, Moon, Sun, Download, Trash2, LogOut, ChevronRight, Check, Languages, Banknote, Smartphone, Mail, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { signOut, deleteAccount, exportData } from './actions';
import { PageHeader } from '@/components/PageHeader';
import { useSearchParams } from 'next/navigation';
import { appendParityQuery } from '@/lib/parity-query';

type ToggleProps = { enabled: boolean; onToggle: () => void };
function Toggle({ enabled, onToggle }: ToggleProps) {
    return (
        <button onClick={onToggle} className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors" style={{ backgroundColor: enabled ? '#3EA63B' : '#cbd5e1' }}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
        </button>
    );
}






export default function SettingsPage() {
    const searchParams = useSearchParams();
    const profileHref = appendParityQuery('/profile', searchParams);
    const [currency, setCurrency] = useState('ETB');
    const [language, setLanguage] = useState('en');
    const [theme, setThemeState] = useState<'light' | 'dark'>('light');
    const [notifs, setNotifs] = useState({ bills: true, spending: true, insights: true, scores: false, marketing: false });
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showExportSuccess, setShowExportSuccess] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/v1/settings')
            .then(res => res.json())
            .then(data => {
                if (data && data.user) {
                    setUserData(data);
                    if (data.preferences?.currency) setCurrency(data.preferences.currency);
                    if (data.preferences?.language) setLanguage(data.preferences.language);
                    if (data.preferences?.theme) setThemeState(data.preferences.theme);
                    if (data.notifications) setNotifs(data.notifications as any);
                }
            })
            .catch(() => {});
    }, []);

    const setTheme = async (newTheme: 'light' | 'dark') => {
        setThemeState(newTheme);
        await updateSetting('theme', newTheme);
    };

    const toggleNotif = async (key: string) => {
        const newNotifs = { ...notifs, [key]: !notifs[key as keyof typeof notifs] };
        setNotifs(newNotifs);
        await updateSetting('notificationPreferences', newNotifs as any);
    };

    const userDisplayName = userData?.user?.name || 'User';
    const userInitial = userData?.user?.initial || 'U';
    const userEmail = userData?.user?.email || 'user@mizan.et';

    const updateSetting = async (key: string, value: any) => {
        setIsSaving(true);
        try {
            await fetch('/api/v1/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        const res = await exportData();
        if (res.success && res.content) {
            const link = document.createElement('a');
            link.href = `data:text/csv;base64,${res.content}`;
            link.download = res.filename || 'export.csv';
            link.click();
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 2000);
        }
    };

    const handleDeleteAccount = async () => {
        const res = await deleteAccount();
        if (res.success) {
            window.location.href = '/login';
        } else {
            alert(res.error || 'Failed to delete account');
        }
    };

    const currencies = ['ETB', 'USD', 'EUR', 'GBP', 'AED'];

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24 md:pb-0">
            {/* Desktop Header */}
            <PageHeader 
                title="Me Settings"
                description="Preferences & Security"
                actions={
                    <Link href={profileHref} className="flex items-center gap-2 border border-[#3EA63B]/30 bg-[#3EA63B]/5 px-4 py-2.5 rounded-xl text-sm font-bold text-[#3EA63B] hover:bg-[#3EA63B]/10 transition-colors">
                        <User className="w-4 h-4" /> Me
                    </Link>
                }
            />

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-slate-900">Me Settings</h1>
                    <p className="text-[10px] text-slate-500">Preferences & Security</p>
                </div>
                <Link href={profileHref} className="text-xs font-bold text-[#3EA63B] border border-[#3EA63B]/30 bg-[#3EA63B]/5 px-3 py-1.5 rounded-lg hover:bg-[#3EA63B]/10 transition">
                    Me
                </Link>
            </header>

            <main className="flex-1 px-6 md:px-8 py-6 pb-24 md:pb-12 max-w-3xl mx-auto w-full space-y-6">

                {/* ── Account ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Account
                        </h2>
                    </div>
                    <Link href="/profile" className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6ED063] to-[#3EA63B] flex items-center justify-center text-white font-black text-lg">{userInitial}</div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{userDisplayName}</p>
                                <p className="text-[10px] text-slate-400">{userEmail}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                    <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center">
                                <svg viewBox="0 0 48 48" className="w-3.5 h-3.5"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.5 30.3 0 24 0 14.6 0 6.7 5.4 2.8 13.3l7.9 6.2c1.9-5.6 7.1-10 13.3-10z" /><path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.9c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.3-10.1 7.3-17z" /><path fill="#FBBC05" d="M10.7 28.5c-1-2.9-1-6.1 0-9l-7.9-6.2C.9 17.1 0 20.5 0 24s.9 6.9 2.8 10.7l7.9-6.2z" /><path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7.5-5.8c-2.1 1.4-4.8 2.2-8 2.2-6.2 0-11.4-4.2-13.3-10l-7.9 6.2C6.7 42.6 14.6 48 24 48z" /></svg>
                            </div>
                            <span className="text-xs text-slate-500">Google connected</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                </section>

                {/* ── Preferences ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5" /> Preferences
                        </h2>
                    </div>

                    {/* Currency */}
                    <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <Banknote className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-900">Default Currency</span>
                        </div>
                        <div className="flex gap-1">
                            {currencies.map(c => (
                                <button
                                    key={c}
                                    onClick={() => { setCurrency(c); updateSetting('currency', c); }}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${currency === c ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language */}
                    <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <Languages className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-900">Language</span>
                        </div>
                        <div className="flex gap-1">
                            {[{ code: 'en', label: 'English' }, { code: 'am', label: 'አማርኛ' }].map(l => (
                                <button
                                    key={l.code}
                                    onClick={() => { setLanguage(l.code); updateSetting('language', l.code); }}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${language === l.code ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {theme === 'light' ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                            <span className="text-sm font-bold text-slate-900">Theme</span>
                        </div>
                        <div className="flex gap-1">
                            {[{ code: 'light' as const, label: 'Light', icon: Sun }, { code: 'dark' as const, label: 'Dark', icon: Moon }].map(t => (
                                <button
                                    key={t.code}
                                    onClick={() => setTheme(t.code)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 ${theme === t.code ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    <t.icon className="w-3 h-3" /> {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Notifications ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5" /> Notification Preferences
                        </h2>
                    </div>
                    {[
                        { key: 'bills' as const, icon: AlertTriangle, label: 'Bill Reminders', desc: 'Due dates and overdue alerts' },
                        { key: 'spending' as const, icon: Banknote, label: 'Spending Alerts', desc: 'Budget limit warnings' },
                        { key: 'insights' as const, icon: TrendingUp, label: 'AI Insights', desc: 'Personalized financial tips' },
                        { key: 'scores' as const, icon: Shield, label: 'Score Changes', desc: 'Mizan Score updates' },
                        { key: 'marketing' as const, icon: Mail, label: 'Product News', desc: 'New products and offers' },
                    ].map((item, i) => (
                        <div key={item.key} className={`px-5 py-3.5 flex items-center justify-between ${i < 4 ? 'border-b border-slate-50' : ''}`}>
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                            <Toggle enabled={notifs[item.key]} onToggle={() => toggleNotif(item.key)} />
                        </div>
                    ))}
                </section>

                {/* ── Security ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" /> Security
                        </h2>
                    </div>
                    <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-sm font-bold text-slate-900">Active Sessions</p>
                                <p className="text-[10px] text-slate-400">1 device connected</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-0.5 rounded-full">Current</span>
                    </div>
                    <div className="px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-sm font-bold text-slate-900">Two-Factor Auth</p>
                                <p className="text-[10px] text-slate-400">Not configured</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Coming Soon</span>
                    </div>
                </section>

                {/* ── Data ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Download className="w-3.5 h-3.5" /> Data & Privacy
                        </h2>
                    </div>
                    <button
                        onClick={handleExport}
                        className="w-full px-5 py-3.5 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition text-left"
                    >
                        <div className="flex items-center gap-3">
                            <Download className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-sm font-bold text-slate-900">Export My Data</p>
                                <p className="text-[10px] text-slate-400">Download all your data as CSV</p>
                            </div>
                        </div>
                        {showExportSuccess ? (
                            <span className="text-[10px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Downloading</span>
                        ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-red-50 transition text-left"
                    >
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-4 h-4 text-red-400" />
                            <div>
                                <p className="text-sm font-bold text-red-600">Delete Account</p>
                                <p className="text-[10px] text-slate-400">Permanently remove all data</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-red-400" />
                    </button>
                </section>

                {/* Sign Out */}
                <button onClick={() => signOut()} className="w-full py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-sm">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>

                <p className="text-center text-[10px] text-slate-300 font-bold">Mizan v1.0 · Built for Ethiopia</p>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 text-center mb-2">Delete Account?</h3>
                        <p className="text-sm text-slate-500 text-center mb-6">This will permanently delete all your data, transactions, goals, and Mizan Score. This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
                            <button onClick={handleDeleteAccount} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete Forever</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
