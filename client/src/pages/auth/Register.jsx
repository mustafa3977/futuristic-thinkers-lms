import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentalConsent, setParentalConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!parentalConsent) {
      setError('You must confirm that you are a parent or legal guardian over 18 years old.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, parentalConsent);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-amber flex items-center justify-center text-brand-navy font-black text-xl mx-auto shadow-lg">
          FT
        </div>
        <h1 className="text-3xl font-black text-white font-display">Create Parent Account</h1>
        <p className="text-xs text-slate-400">
          Strict child privacy (COPPA / GDPR). Only adult parent accounts are registered.
        </p>
      </div>

      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Parent / Guardian Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jessica Miller"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Parent Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jessica@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Secure Password (min 8 chars, Upper, Lower &amp; Number)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Mandatory Parental Consent Checkbox */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={parentalConsent}
                onChange={(e) => setParentalConsent(e.target.checked)}
                className="mt-0.5 rounded bg-slate-950 border-slate-700 text-brand-teal focus:ring-brand-teal"
              />
              <span className="text-[11px] text-slate-300 leading-snug">
                <strong>Parental Consent:</strong> I confirm that I am a parent or legal guardian
                over 18 years of age and consent to managing my child&apos;s learning profile in
                accordance with the{' '}
                <Link to="/privacy" target="_blank" className="text-brand-teal underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-md disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Creating account...' : 'Create Parent Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/60 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-teal hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

