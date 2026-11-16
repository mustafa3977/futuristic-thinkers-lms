import React from 'react';
import { Sparkles, Bot, Globe, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story &amp; Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
          About Futuristic Thinkers
        </h1>
        <p className="text-sm text-brand-teal font-semibold tracking-wide">
          Tagline: Inspiring Tomorrow&apos;s Innovators
        </p>
      </div>

      <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 sm:p-12 space-y-6 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-2xl font-bold text-white font-display">Demystifying Emerging Technology</h2>
        <p>
          Futuristic Thinkers is an educational learning laboratory founded on a simple conviction:
          every child growing up in the 21st century deserves to understand the algorithmic systems
          shaping their world.
        </p>
        <p>
          Children interact with voice assistants, smart cameras, and recommendation engines every
          day. Yet all too often, technology is presented either as inscrutable magic or as dry,
          intimidating mathematics.
        </p>
        <p>
          We replace intimidation with story, adventure, and humor. Through our three relatable
          character guides—<strong>Zara (9)</strong>, <strong>Zahran (8)</strong>, and{' '}
          <strong>Luna (9)</strong>—children discover that artificial intelligence is simply human
          ingenuity taught through data and patterns.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-2">
          <Globe className="w-6 h-6 text-brand-teal" />
          <h3 className="text-base font-bold text-white">Global Community</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Designed for curious families and homeschoolers across the USA, Canada, UK, and Australia.
          </p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-2">
          <Shield className="w-6 h-6 text-brand-amber" />
          <h3 className="text-base font-bold text-white">Ethical Tech Literacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We teach algorithmic fairness, data truthfulness, and digital citizenship alongside mechanics.
          </p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-2">
          <Heart className="w-6 h-6 text-rose-400" />
          <h3 className="text-base font-bold text-white">Family Centered</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Parent-controlled, child-safe, and designed to bridge screens into family dinner conversations.
          </p>
        </div>
      </div>
    </div>
  );
}

