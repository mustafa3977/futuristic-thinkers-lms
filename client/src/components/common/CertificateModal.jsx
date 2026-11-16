import React from 'react';
import { Award, Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CertificateModal({
  isOpen,
  onClose,
  childNickname = 'Explorer',
  courseName = 'AI Explorers Academy',
  certificateCode = 'FT-CERT-2026'
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white">
        {/* Modal Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-brand-amber font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Official Achievement Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div
          id="certificate-print-area"
          className="mt-6 bg-gradient-to-br from-slate-950 via-brand-navy to-slate-950 border-8 border-double border-brand-amber/60 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Subtle watermark background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Award className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <h1 className="text-sm font-extrabold tracking-widest text-brand-amber uppercase">
                Futuristic Thinkers
              </h1>
              <p className="text-xs text-brand-teal italic font-medium">
                Inspiring Tomorrow&apos;s Innovators
              </p>
            </div>

            <div className="w-16 h-1 mx-auto bg-gradient-to-r from-transparent via-brand-amber to-transparent rounded" />

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
                Certificate of Completion
              </h2>
              <p className="text-xs text-slate-300 uppercase tracking-widest">
                This certifies that
              </p>
            </div>

            {/* Child's Nickname */}
            <div className="py-2 border-b-2 border-slate-700/80 max-w-md mx-auto">
              <span className="text-3xl sm:text-5xl font-black text-brand-teal font-display tracking-wide capitalize">
                {childNickname}
              </span>
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <p className="text-sm text-slate-300 leading-relaxed">
                has successfully conquered all 10 story missions in{' '}
                <strong className="text-white">{courseName}</strong>, demonstrating curiosity,
                algorithmic problem solving, critical thinking, and taking the AI Innovator&apos;s
                Pledge!
              </p>
            </div>

            {/* Seals and Signatures */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-xs">
              <div className="space-y-1">
                <div className="text-brand-amber font-display font-bold">Zara &amp; Zahran</div>
                <div className="text-[10px] text-slate-400">Explorer Guides</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-brand-amber bg-amber-500/10 flex items-center justify-center text-brand-amber">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-[9px] text-amber-300 font-mono mt-1">VERIFIED</span>
              </div>

              <div className="space-y-1">
                <div className="text-brand-teal font-display font-bold">Luna &amp; Faculty</div>
                <div className="text-[10px] text-slate-400">Creative Strategist</div>
              </div>
            </div>

            {/* Verification code and date */}
            <div className="pt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>Code: {certificateCode}</span>
              <span>Issued: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

