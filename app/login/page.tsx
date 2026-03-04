"use client";

import { signIn } from "next-auth/react";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function Login() {
    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#3EA63B] rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#FFC836] rounded-full blur-[120px] opacity-10"></div>

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden">
                    {/* Mizan Logo Placeholder */}
                    <div className="absolute inset-0 mizan-gradient-bg opacity-10"></div>
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#3EA63B] to-[#0F172A]">M</span>
                </div>

                <h1 className="text-3xl font-bold mb-2 text-center">Welcome to Mizan</h1>
                <p className="text-slate-400 text-center mb-10">Your all-in-one Ethiopian financial operating system.</p>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full shadow-2xl">
                    <div className="flex items-center justify-center gap-2 mb-6 text-[#6ED063]">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-medium">Bank-grade security</span>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/wealth" })}
                        className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors shadow-lg"
                    >
                        <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
                        Continue with Google
                    </button>
                </div>

                <p className="text-xs text-slate-500 mt-8 text-center max-w-xs">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
