import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
        <Compass className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4">404 - Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        We could not find the page you are looking for. It might have been moved, deleted, or never existed in the first place.
      </p>
      
      <Link 
        href="/" 
        className="bg-[#0F172A] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
