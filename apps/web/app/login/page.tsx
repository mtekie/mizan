"use client";

import { useState, Suspense } from 'react';
import { ShieldCheck, Mail, Lock, Loader2, Apple } from "lucide-react";
import Image from "next/image";
import { login, signup } from './actions';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const errorMsg = searchParams.get('error');
    const supabase = createClient();

    const handleOAuth = async (provider: 'google' | 'apple') => {
        setIsLoading(true);
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
            },
        });
    };

    return (
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 mizan-gradient-bg opacity-10"></div>
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#3EA63B] to-[#0F172A]">M</span>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-center">Welcome to Mizan</h1>
            <p className="text-slate-400 text-center mb-6 text-sm">Your all-in-one Ethiopian financial operating system.</p>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl w-full shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-6 text-[#6ED063]">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-medium">Bank-grade security</span>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                <div className="flex flex-col gap-3 mb-6">
                    <button
                        onClick={() => handleOAuth('google')}
                        disabled={isLoading}
                        className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
                        Continue with Google
                    </button>
                    <button
                        onClick={() => handleOAuth('apple')}
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 border border-slate-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Apple className="w-[18px] h-[18px]" fill="currentColor" />
                        Continue with Apple
                    </button>
                </div>

                <div className="relative flex items-center mb-6">
                    <div className="flex-grow border-t border-slate-600"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">Or email</span>
                    <div className="flex-grow border-t border-slate-600"></div>
                </div>

                <form action={isSignUp ? signup : login} className="flex flex-col gap-3">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3EA63B] transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            minLength={6}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3EA63B] transition-all"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 bg-gradient-to-r from-[#6ED063] to-[#3EA63B] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                    >
                        {isSignUp ? 'Create Account' : 'Log in securely'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs text-slate-400 hover:text-white mt-3 text-center w-full transition-colors font-medium"
                    >
                        {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                    </button>
                </form>
            </div>

            <p className="text-[10px] text-slate-500 mt-6 text-center max-w-xs font-medium uppercase tracking-wider">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
}

export default function Login() {
    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#3EA63B] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#FFC836] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
            
            <Suspense fallback={<div className="text-[#6ED063] animate-pulse">Loading secure gateway...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
