import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-amber flex items-center justify-center text-brand-navy font-black text-sm">
                FT
              </div>
              <span className="font-black text-white text-base">Futuristic Thinkers</span>
            </div>
            <p className="text-brand-teal font-medium text-[11px]">
              Inspiring Tomorrow&apos;s Innovators
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Story-driven STEM and AI learning for curious children aged 7-10 across the USA,
              Canada, UK, and Australia.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-teal-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Child Safe &bull; No Child PII Collected</span>
            </div>
          </div>

          {/* Col 2: Learning */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Learning</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/courses/ai-explorers-academy" className="hover:text-white transition-colors">
                  AI Explorers Academy (Flagship)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Course Catalogue
                </Link>
              </li>
              <li>
                <Link to="/hub" className="hover:text-white transition-colors">
                  Free Learning Hub (Articles)
                </Link>
              </li>
              <li>
                <Link to="/for-parents" className="hover:text-white transition-colors">
                  For Parents &amp; Families
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Support */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Company &amp; Help</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Futuristic Thinkers
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Support Email: support@futuristicthinkers.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Trust &amp; Policies</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Child Safety &amp; Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition-colors">
                  14-Day Refund Guarantee
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-white transition-colors">
                  WCAG AA Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <p>
            &copy; 2026 Futuristic Thinkers. All rights reserved. Self-paced educational enrichment.
            Does not imply synchronous live teaching, individual coaching, school accreditation, or
            guaranteed academic outcomes.
          </p>
          <p className="shrink-0 text-slate-400">
            Compliant with COPPA, GDPR, UK GDPR, PIPEDA &amp; Australian Privacy Act.
          </p>
        </div>
      </div>
    </footer>
  );
}

