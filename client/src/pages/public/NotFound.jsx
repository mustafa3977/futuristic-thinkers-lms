import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-28 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-brand-amber flex items-center justify-center mx-auto shadow-xl">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="text-4xl sm:text-6xl font-black text-white font-display">404</span>
        <h1 className="text-xl font-bold text-slate-200">Mission Coordinates Not Found</h1>
        <p className="text-xs text-slate-400">
          The page or lesson you are looking for has either moved or doesn&apos;t exist.
        </p>
      </div>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Headquarters</span>
        </Link>
      </div>
    </div>
  );
}

