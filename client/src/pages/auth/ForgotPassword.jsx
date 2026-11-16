import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data?.message || 'If an account exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white font-display">Reset Your Password</h1>
        <p className="text-xs text-slate-400">
          Enter your registered parent email address and we&apos;ll send you a secure reset link.
        </p>
      </div>

      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        {message && (
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-brand-teal text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="parent@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            <span>{submitting ? 'Sending...' : 'Send Reset Link'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

