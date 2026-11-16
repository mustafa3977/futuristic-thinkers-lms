import React, { useState } from 'react';
import api from '../../services/api';
import { Mail, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await api.post('/contact', {
        name,
        email,
        subject,
        message
      });
      setSuccessMsg(res.data?.message || 'Thank you! Your message was sent successfully.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Support &amp; Inquiries</span>
        </div>
        <h1 className="text-4xl font-black text-white font-display">
          We&apos;re Here to Support Your Family
        </h1>
        <p className="text-sm text-slate-300">
          Have a question about AI Explorers Academy, billing, or accessibility? Send us a message
          and our team will reply within 24 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Support Highlights */}
        <div className="space-y-6">
          <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/80 space-y-3">
            <Clock className="w-6 h-6 text-brand-teal" />
            <h3 className="text-base font-bold text-white">Dedicated Parent Response</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We respond to all parent and educator inquiries within 24 business hours.
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/80 space-y-3">
            <ShieldCheck className="w-6 h-6 text-brand-amber" />
            <h3 className="text-base font-bold text-white">Direct Email Support</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              support@futuristicthinkers.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-xl">
          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-brand-teal text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rachel@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Question about AI Explorers Academy"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you and your learner?..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

