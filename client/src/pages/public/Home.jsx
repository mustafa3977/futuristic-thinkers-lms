import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Compass,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
  Printer,
  Star,
  Check
} from 'lucide-react';
import CharacterCard, { CHARACTERS } from '../../components/common/CharacterCard';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-navy via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Inspiring Tomorrow&apos;s Innovators</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto font-display">
            Where Curious Kids Ages 7–10{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-300 to-brand-amber">
              Decode the Secrets of AI
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Turn passive screen time into active real-world inquiry. Join character guides{' '}
            <strong className="text-white">Zara (9)</strong>,{' '}
            <strong className="text-white">Zahran (8)</strong>, and{' '}
            <strong className="text-white">Luna (9)</strong> on 10 story-driven learning missions
            with printable offline detective kits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/courses/ai-explorers-academy"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-teal text-brand-navy font-black text-base hover:bg-emerald-400 active:scale-95 transition-all shadow-xl hover:shadow-teal-500/20"
            >
              <span>Explore AI Explorers Academy</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/courses/ai-explorers-academy#sample-preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base hover:bg-slate-700/80 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-brand-amber" />
              <span>Watch Free Sample Lesson</span>
            </Link>
          </div>

          {/* Trust badges bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              <span>Strict COPPA &amp; GDPR Child Privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-amber" />
              <span>Ages 7–10 School-Age Specific</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>14-Day 100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE CHARACTER GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">
            Story-Driven Learning
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
            Meet Your Child&apos;s Explorer Team
          </h2>
          <p className="text-sm text-slate-300">
            Children don&apos;t learn from dry textbooks—they learn through relatable peers facing
            exciting challenges!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHARACTERS.map((char) => (
            <CharacterCard key={char.name} character={char} />
          ))}
        </div>
      </section>

      {/* 3. WHY AGES 7-10 (NOT PRESCHOOL, NOT UNIVERSITY MATH) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800/60 rounded-3xl border border-slate-700/70 p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-amber uppercase tracking-wider">
                Targeted Developmental Age
              </span>
              <h2 className="text-3xl font-black text-white font-display leading-tight">
                Designed Specially for Primary / Elementary Schoolers (Ages 7–10)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Most STEM content for young kids is either simplistic toddler cartoons that fail to
                explain how technology actually works, or dry high-school coding that frustrates
                them.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Futuristic Thinkers hits the perfect cognitive sweet spot: concrete analogies,
                detective missions, visual pattern exploration, and ethical questions that spark
                independent thinking.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  'Concrete analogies (Comparing robot vision to pixel puzzles)',
                  'No coding syntax prerequisites required',
                  'Fosters critical thinking and digital safety',
                  'Printable tactile activities bridge screen time to real life'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-brand-teal shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual comparison box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700 space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase">Typical Media</span>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">&times;</span>
                    Passive auto-play video trance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">&times;</span>
                    Ads, trackers &amp; clickbait
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">&times;</span>
                    Babyish preschool cartoons
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-6 border-2 border-brand-teal/40 space-y-3 shadow-lg">
                <span className="text-xs font-bold text-brand-teal uppercase">Futuristic Thinkers</span>
                <ul className="text-xs text-slate-200 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-teal shrink-0" />
                    10-min focused episodic story
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-teal shrink-0" />
                    Offline printable detective kits
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-teal shrink-0" />
                    Family dinner conversation cards
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLAGSHIP COURSE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">
            Flagship Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
            AI Explorers Academy
          </h2>
          <p className="text-sm text-slate-300">
            A comprehensive 10-lesson story adventure with complete offline material kits.
          </p>
        </div>

        <div className="bg-gradient-to-br from-brand-indigo via-slate-900 to-slate-950 rounded-3xl border border-slate-700/80 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-brand-teal border border-teal-500/30 text-xs font-bold">
                  Ages 7–10
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  10 Story Lessons
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  60 Printable Activity Sheets
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                From Pattern Detectives to Certified AI Innovators
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Over 10 self-paced episodes, your child investigates how smart speakers hear, how
                cameras see, why data needs to be diverse and fair, how robots steer through obstacle
                courses, and how technology helps preserve wildlife and oceans.
              </p>

              {/* 6 Included Materials Tags */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  6 Printable Materials Included in Every Single Lesson:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                    <BookOpen className="w-4 h-4 text-brand-teal" />
                    <span>AI Notebook Activity Page</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                    <Compass className="w-4 h-4 text-brand-amber" />
                    <span>AI Detective Mission</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>AI Around You Challenge</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>AI Myth Buster Fact Sheet</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>AI Hero Spotlight Story</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                    <Users className="w-4 h-4 text-indigo-300" />
                    <span>Family AI Talk Card Deck</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Card Sidebar */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase">One-Time Enrollment</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-display">$49</span>
                  <span className="text-xs text-slate-400 font-semibold">USD / Single Family</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  Full 1-Year Access for all children in your household.
                </p>
                <div className="pt-2 text-xs text-brand-teal flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>14-Day Money-Back Guarantee</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/courses/ai-explorers-academy"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-teal text-brand-navy font-black text-sm hover:bg-emerald-400 transition-colors shadow-lg"
                >
                  <span>View Full Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[10px] text-center text-slate-500">
                  Instant access on iPad, tablet, laptop, or desktop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PARENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-amber uppercase tracking-widest">
            Loved By Families Worldwide
          </span>
          <h2 className="text-3xl font-black text-white font-display">
            What Parents in USA, Canada, UK &amp; Australia Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/70 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &ldquo;My 8-year-old son Zahran’s namesake character had him hooked instantly! The
              Family Talk Cards are now our favorite dinner routine.&rdquo;
            </p>
            <div className="text-xs text-white font-bold">
              Claire M. &bull; <span className="text-slate-400 font-normal">Toronto, Canada</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/70 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &ldquo;As a parent in tech, I was tired of fluffy coding games. This actually taught my
              9-year-old daughter how computer vision and dataset bias work in simple terms.&rdquo;
            </p>
            <div className="text-xs text-white font-bold">
              David H. &bull; <span className="text-slate-400 font-normal">Austin, Texas, USA</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/70 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &ldquo;The printable detective sheets got my kids away from passive iPad scrolling and
              drawing patterns on paper. Absolutely brilliant curriculum.&rdquo;
            </p>
            <div className="text-xs text-white font-bold">
              Sarah W. &bull; <span className="text-slate-400 font-normal">Melbourne, Australia</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900/60 via-brand-navy to-slate-900 border border-teal-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
            Start Your Child&apos;s AI Adventure Today
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Inspiring tomorrow&apos;s innovators begins with understanding today&apos;s technology.
            Protected by our 14-day 100% money-back guarantee.
          </p>
          <div className="pt-2">
            <Link
              to="/courses/ai-explorers-academy"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-teal text-brand-navy font-black text-sm hover:bg-emerald-400 transition-all shadow-lg"
            >
              <span>Enroll in AI Explorers Academy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

