import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Users,
  Clock,
  Laptop,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowRight,
  Printer,
  Compass,
  Award,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import CharacterCard, { CHARACTERS } from '../../components/common/CharacterCard';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isParent } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openLessonAccordion, setOpenLessonAccordion] = useState(1);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [processingCheckout, setProcessingCheckout] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${slug}`);
        setCourse(res.data?.data?.course);
        setLessons(res.data?.data?.lessons || []);
        setPreviewLesson(res.data?.data?.previewLesson || null);
      } catch (err) {
        console.error('Failed to load course details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/courses/${slug}`);
      return;
    }

    setProcessingCheckout(true);
    setCheckoutError('');

    try {
      if (course.price === 0) {
        await api.post('/parent/enroll-free', { courseId: course._id });
        navigate('/dashboard');
        return;
      }

      const res = await api.post('/payments/create-checkout-session', {
        courseId: course._id,
        couponCode: couponInput || undefined,
        country: 'US'
      });

      if (res.data?.data?.url) {
        window.location.href = res.data.data.url;
      }
    } catch (err) {
      setCheckoutError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400 text-sm">Loading course details...</div>;
  }

  if (!course) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
        <Link to="/courses" className="text-brand-teal underline">
          Back to Course Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="relative pb-24 space-y-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-brand-navy via-slate-900 to-slate-950 border-b border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-brand-teal text-xs font-bold uppercase tracking-wider">
              {course.category?.name || 'STEM'}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-brand-amber text-xs font-bold">
              Ages {course.ageRange}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
              10 Story Lessons
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight leading-tight max-w-4xl">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {course.shortDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-teal" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-amber" />
              <span>{course.refundText}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>{course.accessPeriod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container with 17 Ordered Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. WHAT IS IT */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-4">
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-teal" />
            <span>1. What is it?</span>
          </h2>
          <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
            {course.fullDescription}
          </div>
        </section>

        {/* 2. WHO IS IT FOR */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-4">
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-amber" />
            <span>2. Who is it for?</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{course.whoIsItFor}</p>
        </section>

        {/* 3. WHAT WILL MY CHILD LEARN */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-4">
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            <span>3. What will my child learn?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {course.learningOutcomes?.map((outcome, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-4">
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span>4. How it works</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{course.howItWorks}</p>
        </section>

        {/* 5. WHAT CHILD SEES/DOES */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-4">
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Compass className="w-6 h-6 text-rose-400" />
            <span>5. What child sees and does</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{course.whatChildSeesDoes}</p>
        </section>

        {/* 6. MATERIALS INCLUDED */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-4">
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Printer className="w-6 h-6 text-brand-teal" />
            <span>6. Materials included</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.materialsIncluded?.map((mat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                <span>{mat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. DURATION */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-teal" />
            <span>7. Duration</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{course.duration}</p>
        </section>

        {/* 8. DEVICE REQUIRED */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 text-brand-amber" />
            <span>8. Device required</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{course.deviceRequirements}</p>
        </section>

        {/* 9. SUPPORT */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-teal-400" />
            <span>9. Support</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{course.support}</p>
        </section>

        {/* 10. PRICE */}
        <section className="bg-gradient-to-r from-slate-900 to-brand-navy rounded-3xl border border-teal-500/40 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">10. Investment &amp; Price</h2>
            <p className="text-xs text-slate-400">One-time single family license &bull; No monthly subscription</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-brand-teal font-display">
              ${course.price} {course.currency}
            </span>
          </div>
        </section>

        {/* 11. HOW TO PURCHASE */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">11. How to purchase</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Click &ldquo;Enroll Now&rdquo; below. You will be guided through our secure Stripe Checkout in test mode.
            Once confirmed, the course immediately appears in your Parent Dashboard under &ldquo;My Courses&rdquo;,
            and you can assign it to your child&apos;s learner profile.
          </p>
        </section>

        {/* 12. ACCESS AND REFUND TERMS */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-3">
          <h2 className="text-xl font-bold text-white">12. Access and refund terms</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong>Access Period:</strong> {course.accessPeriod}.<br />
            <strong>Refund Guarantee:</strong> {course.refundText}. If for any reason your child does
            not enjoy the story missions, email us at support@futuristicthinkers.com within 14 days
            for an immediate 100% refund.
          </p>
        </section>

        {/* 13. FULL 10-LESSON CURRICULUM ACCORDION */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white font-display">
              13. Full 10-Lesson Curriculum
            </h2>
            <p className="text-xs text-slate-400">
              Click any lesson to preview mission goals, character focus, and materials.
            </p>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson._id || lesson.order}
                className="bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() =>
                    setOpenLessonAccordion(
                      openLessonAccordion === lesson.order ? null : lesson.order
                    )
                  }
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 text-brand-teal flex items-center justify-center font-black text-xs">
                      {lesson.order}
                    </span>
                    <span className="text-sm font-bold text-white">{lesson.title}</span>
                    {lesson.isPreview && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-brand-teal border border-teal-500/30">
                        FREE SAMPLE
                      </span>
                    )}
                  </div>
                  {openLessonAccordion === lesson.order ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {openLessonAccordion === lesson.order && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-700/50 space-y-3 text-xs text-slate-300">
                    <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                      <span>Est. Duration: {lesson.videoDuration || '12 mins'}</span>
                      {lesson.characterFocus?.length > 0 && (
                        <span>Guides: {lesson.characterFocus.join(', ')}</span>
                      )}
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{lesson.content}</p>

                    <div className="pt-2">
                      <span className="font-bold text-slate-400 block mb-1">
                        Materials in this mission:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {lesson.materials?.map((m, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-300"
                          >
                            {m.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 14. SAMPLE (FREE PREVIEW) LESSON */}
        <section id="sample-preview" className="bg-slate-800/60 rounded-3xl border border-teal-500/30 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">
                Try Before You Enroll
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                14. Sample Free Preview: Lesson 1
              </h2>
            </div>
            {previewLesson && (
              <button
                onClick={() => setPreviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
              >
                <Play className="w-4 h-4 fill-brand-navy" />
                <span>Watch Episode 1 Preview</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {previewLesson?.content ||
              'Preview episode introduces Zara, Zahran, and Luna in their treehouse investigating what makes machines smart.'}
          </p>

          {/* Embedded Preview Video Player */}
          {previewLesson?.videoUrl && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-black">
              <iframe
                src={previewLesson.videoUrl}
                title="Lesson 1 Preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </section>

        {/* 15. CHARACTERS */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white font-display">
              15. Character Guides
            </h2>
            <p className="text-xs text-slate-400">
              Clearly labeled placeholders for character artwork; no invented designs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHARACTERS.map((char) => (
              <CharacterCard key={char.name} character={char} />
            ))}
          </div>
        </section>

        {/* 16. FAQ */}
        <section className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 space-y-6">
          <h2 className="text-2xl font-black text-white font-display">
            16. Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">
                Does my child need prior coding experience?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Zero coding required. The course focuses on conceptual logic, pattern recognition,
                and everyday technology understanding.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">
                How is my child&apos;s privacy protected?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We strictly adhere to COPPA and GDPR. We never collect child email addresses or PII.
                Profiles use nicknames and cartoon avatars only.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">
                What is your 14-day refund policy?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                If your child is not completely engaged within 14 days of purchase, email
                support@futuristicthinkers.com for a full, prompt refund.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 17. STICKY MOBILE & DESKTOP ENROLL BAR */}
      <div className="sticky bottom-0 z-30 inset-x-0 bg-brand-navy/95 border-t border-slate-700/80 p-4 shadow-2xl backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Flagship Course Enrollment
              </span>
              <span className="text-xl sm:text-2xl font-black text-white font-display">
                ${course.price} {course.currency}
              </span>
            </div>
            <div className="hidden sm:block text-xs text-brand-teal font-medium">
              &bull; 1 Year Full Family Access
            </div>
          </div>

          {checkoutError && (
            <div className="text-xs text-rose-300 font-semibold px-3 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">
              {checkoutError}
            </div>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleEnroll}
              disabled={processingCheckout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-teal text-brand-navy font-black text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-lg disabled:opacity-50"
            >
              <span>{processingCheckout ? 'Processing...' : '17. Enroll in AI Explorers Academy'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

