import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle2, Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isTestMode = searchParams.get('test_mode') === 'true';

  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const confirm = async () => {
      try {
        if (sessionId && isTestMode) {
          await api.post('/payments/confirm-test-payment', { sessionId });
        }
        setConfirmed(true);
      } catch (err) {
        console.error('Payment confirmation error', err);
      } finally {
        setLoading(false);
      }
    };
    confirm();
  }, [sessionId, isTestMode]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-teal-500/20 text-brand-teal flex items-center justify-center mx-auto shadow-xl">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Enrollment Confirmed</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Welcome to the Academy!
        </h1>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Your enrollment in <strong>AI Explorers Academy</strong> is now active. You and your
          child are ready to meet Zara, Zahran, and Luna for Mission 1!
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 max-w-md mx-auto text-left text-xs text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <span className="text-slate-400">Course Access:</span>
          <span className="font-bold text-white">1 Year Full Family Access</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <span className="text-slate-400">Printable Kits:</span>
          <span className="font-bold text-white">60 Included Materials</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Guarantee:</span>
          <span className="font-bold text-brand-teal">14-Day 100% Refund Window</span>
        </div>
      </div>

      <div className="pt-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-teal text-brand-navy font-black text-sm hover:bg-emerald-400 transition-all shadow-xl"
        >
          <span>Go to Parent Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

