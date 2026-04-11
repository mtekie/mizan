"use client";

import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
                <p className="text-slate-500 mb-8 text-sm">{error.message || "An unexpected error occurred."}</p>
                <button
                    onClick={() => reset()}
                    className="w-full bg-[#0F172A] text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
