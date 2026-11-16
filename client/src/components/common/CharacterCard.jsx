import React from 'react';
import { Sparkles, Compass, Wrench, Palette } from 'lucide-react';

export const CHARACTERS = [
  {
    name: 'Zara',
    age: 9,
    role: 'The Curious Detective',
    icon: Compass,
    accentBg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description:
      'Loves asking "Why?" and cracking tech mysteries. Zara specializes in logic, pattern recognition, and ethical questions about how AI treats everyone fairly.',
    placeholderLabel: '[CHARACTER ARTWORK PLACEHOLDER: Zara (9) - Curious Detective]'
  },
  {
    name: 'Zahran',
    age: 8,
    role: 'The Hands-on Tinkerer',
    icon: Wrench,
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description:
      'Loves taking things apart and building rovers! Zahran tests computer vision with everyday objects and wonders how sensors help self-driving robots navigate.',
    placeholderLabel: '[CHARACTER ARTWORK PLACEHOLDER: Zahran (8) - Hands-on Tinkerer]'
  },
  {
    name: 'Luna',
    age: 9,
    role: 'The Creative Strategist',
    icon: Palette,
    accentBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description:
      'A digital artist and storyteller. Luna explores generative AI, co-creates poems and artwork with machines, and leads family conversations at the dinner table.',
    placeholderLabel: '[CHARACTER ARTWORK PLACEHOLDER: Luna (9) - Creative Strategist]'
  }
];

export default function CharacterCard({ character }) {
  const Icon = character.icon;

  return (
    <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 flex flex-col items-center text-center space-y-4 hover:border-slate-600 transition-all shadow-lg">
      {/* Explicit Artwork Placeholder Box */}
      <div className="w-full aspect-[4/3] rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
        <div className={`p-3 rounded-2xl ${character.accentBg} mb-2`}>
          <Icon className="w-8 h-8" />
        </div>
        <span className="text-[11px] font-mono font-medium text-slate-400 px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-center leading-snug">
          {character.placeholderLabel}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-xl font-black text-white">{character.name}</h3>
          <span className="text-xs text-slate-400 font-semibold">({character.age} yrs)</span>
        </div>
        <span
          className={`inline-block text-xs font-bold px-3 py-0.5 rounded-full border ${character.tagColor}`}
        >
          {character.role}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
        {character.description}
      </p>
    </div>
  );
}

