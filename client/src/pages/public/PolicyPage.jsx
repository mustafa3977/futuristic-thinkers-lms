import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { Shield, FileText, AlertTriangle } from 'lucide-react';

export default function PolicyPage() {
  const location = useLocation();
  // Extract slug from pathname: e.g. /privacy -> privacy
  const slug = location.pathname.replace('/', '') || 'privacy';

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/pages/${slug}`);
        setPage(res.data?.data?.page);
      } catch (err) {
        console.error('Failed to load page content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-slate-400 text-sm">Loading policy content...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Legal Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-brand-amber" />
        <div className="leading-relaxed">
          <strong>Notice:</strong> This policy document is provided for operational demonstration
          and reflects strict compliance principles (COPPA, GDPR, UK GDPR, PIPEDA, and Australian
          Privacy Act). Commercial deployments should undergo formal local legal review.
        </div>
      </div>

      <header className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Futuristic Thinkers Trust &amp; Safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          {page?.title || 'Policy'}
        </h1>
        {page?.lastUpdated && (
          <p className="text-xs text-slate-400">
            Last Updated: {new Date(page.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </header>

      {/* Render Markdown / Text content */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
        {page?.content || 'Content not available.'}
      </div>
    </div>
  );
}

