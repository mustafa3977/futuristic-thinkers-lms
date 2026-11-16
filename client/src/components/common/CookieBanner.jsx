import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ft_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('ft_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 bg-brand-navy/95 border-t border-slate-700/80 p-4 text-white shadow-2xl backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-500/20 text-brand-teal shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">Child Safety &amp; Privacy First:</strong> We use only
            essential session cookies to enable secure parent logins and track lesson progress. We
            do not sell data or run third-party advertising trackers.{' '}
            <Link to="/privacy" className="text-brand-teal underline hover:text-teal-300">
              Read our Privacy Policy
            </Link>
            .
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-teal"
          >
            Accept Essential Cookies
          </button>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss banner"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

