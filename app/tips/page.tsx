'use client';

import { TipsFeed } from '@/components/TipsFeed';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function TipsPage() {
    return (
        <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent">
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-900" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-amber-500" /> Financial Tips
                            </h1>
                            <p className="text-xs text-slate-500">Curated insights for your financial journey</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 py-6 pb-24 md:pb-6 max-w-4xl mx-auto w-full">
                <TipsFeed />
            </main>
        </div>
    );
}
