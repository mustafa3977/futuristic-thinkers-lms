import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Users,
  Sparkles,
  BookOpen,
  Printer,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function ForParents() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Parent &amp; Family Guide</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
          Guiding Your Child Into the AI Era With Confidence
        </h1>
        <p className="text-sm text-slate-300">
          We built Futuristic Thinkers to help parents in the USA, Canada, UK, and Australia turn
          passive tablet scrolling into rich, creative family learning.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-brand-teal flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Zero Child PII Collected</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Strict COPPA, GDPR, and Australian Privacy Act compliance. Accounts are created and
            managed exclusively by parents. Children only use a nickname and cartoon avatar.
          </p>
        </div>

        <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-brand-amber flex items-center justify-center">
            <Printer className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Screen to Real-World Bridge</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every 10-minute animated video pairs with six printable tactile resources: Detective
            Missions, Around You Challenges, and Myth Buster fact sheets.
          </p>
        </div>

        <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Family AI Talk Cards</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dinner-table discussion prompt decks designed to spark laughter, critical debate, and
            shared inquiry between parents and children.
          </p>
        </div>
      </div>

      {/* Screen Time Deep Dive */}
      <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-black text-white font-display">
          The Futuristic Thinkers Screen Time Philosophy
        </h2>
        <div className="text-sm text-slate-300 leading-relaxed space-y-4">
          <p>
            As parents, we know the constant battle: &ldquo;How much screen time is too much?&rdquo;
          </p>
          <p>
            Cognitive researchers emphasize that what matters most is not mere minutes, but the mode
            of interaction. There is a massive distinction between <strong>Passive Scrolling</strong>
            (auto-play algorithms addicting the brain) and <strong>Active Inquiry</strong> (watching
            a 10-minute story that prompts drawing, detective observation in the kitchen, and debate).
          </p>
          <p>
            In AI Explorers Academy, the screen is merely the launchpad. The actual thinking, testing,
            and discovery happen on paper and in conversations with you.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-700/80">
          <div className="text-xs text-slate-400">
            Ready to experience a whole new kind of STEM learning?
          </div>
          <Link
            to="/courses/ai-explorers-academy"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
          >
            <span>Explore the Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

