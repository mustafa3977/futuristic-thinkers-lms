import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CertificateModal from '../../components/common/CertificateModal';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Download,
  BookOpen,
  Sparkles,
  Award,
  Compass,
  Users,
  ShieldCheck,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function LessonPlayer() {
  const { courseSlug, order } = useParams();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // Celebration & Certificate Modals
  const [celebrationModal, setCelebrationModal] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);

  const fetchLesson = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/parent/courses/${courseSlug}/lessons/${order}${
        childId ? `?childId=${childId}` : ''
      }`;
      const res = await api.get(url);
      setCourse(res.data?.data?.course);
      setLesson(res.data?.data?.lesson);
      setAllLessons(res.data?.data?.allLessons || []);
      setProgress(res.data?.data?.progress);
      setIsLocked(res.data?.data?.isLocked || false);
    } catch (err) {
      console.error('Failed to load lesson', err);
    } finally {
      setLoading(false);
    }
  }, [courseSlug, order, childId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const currentOrder = parseInt(order, 10);
  const isCompleted = progress?.completedLessons?.some(
    (cl) => cl.lessonId === lesson?._id || cl.lessonId?.toString() === lesson?._id?.toString()
  );

  const handleMarkComplete = async () => {
    if (!childId) {
      alert('Please select or add a child profile first from the Parent Dashboard.');
      return;
    }

    setCompleting(true);
    try {
      const res = await api.post('/parent/progress/complete-lesson', {
        courseId: course.id || course._id,
        lessonId: lesson._id || lesson.id,
        childId
      });

      const { newlyAwardedStamp, newlyAwardedBadge, certificateCode } = res.data?.data || {};

      // Open celebration modal
      setCelebrationModal({
        stamp: newlyAwardedStamp,
        badge: newlyAwardedBadge,
        certificateCode
      });

      // Reload lesson state
      await fetchLesson();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record lesson completion');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400 text-sm">Loading mission briefing...</div>;
  }

  if (isLocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 text-brand-amber flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white font-display">Mission Locked</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            In AI Explorers Academy, missions unlock sequentially! Complete{' '}
            <strong className="text-brand-teal">Lesson {currentOrder - 1}</strong> first to earn its
            passport stamp and unlock this mission.
          </p>
        </div>
        <div>
          <Link
            to={`/learn/${courseSlug}/lesson/${currentOrder - 1}${childId ? `?childId=${childId}` : ''}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Go to Lesson {currentOrder - 1}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Player Navigation Bar */}
      <header className="bg-brand-navy/95 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Return to Parent Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider block">
              {course?.title}
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                Mission {lesson?.order}: {lesson?.title}
              </h2>
              {isCompleted && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-brand-teal border border-teal-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>COMPLETED</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-2">
          {currentOrder > 1 && (
            <Link
              to={`/learn/${courseSlug}/lesson/${currentOrder - 1}${childId ? `?childId=${childId}` : ''}`}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Previous Lesson"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}

          <span className="text-xs font-mono text-slate-400 px-2">
            {currentOrder} / 10
          </span>

          {currentOrder < 10 && (
            <Link
              to={`/learn/${courseSlug}/lesson/${currentOrder + 1}${childId ? `?childId=${childId}` : ''}`}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Next Lesson"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Learning Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Video & Narrative (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Box */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative">
            {lesson?.videoUrl ? (
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-2 text-slate-500">
                <BookOpen className="w-12 h-12" />
                <p className="text-xs">Story adventure video will load here.</p>
              </div>
            )}
          </div>

          {/* Action & Completion Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isCompleted
                    ? 'bg-teal-500/20 text-brand-teal'
                    : 'bg-amber-500/20 text-brand-amber'
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Passport Stamp #{lesson?.order}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lesson?.passportStamp?.title || 'Mission Explorer Stamp'}
                </p>
              </div>
            </div>

            <button
              onClick={handleMarkComplete}
              disabled={completing}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all shadow-md ${
                isCompleted
                  ? 'bg-slate-800 text-brand-teal border border-teal-500/30 hover:bg-slate-700'
                  : 'bg-brand-teal text-brand-navy hover:bg-emerald-400 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completing
                  ? 'Saving...'
                  : isCompleted
                  ? 'Completed (Click to Re-stamp)'
                  : 'Mark Lesson Complete'}
              </span>
            </button>
          </div>

          {/* Story Narrative & Explorer Briefing */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-teal" />
              <h3 className="text-lg font-black text-white font-display">
                Story Mission Briefing
              </h3>
            </div>

            {lesson?.characterFocus?.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Featured Guides:</span>
                <span className="text-brand-amber font-bold">
                  {lesson.characterFocus.join(' &bull; ')}
                </span>
              </div>
            )}

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-2">
              {lesson?.content}
            </div>
          </div>
        </div>

        {/* Right Column: Downloadable Materials & Curriculum List (1 col) */}
        <div className="space-y-6">
          {/* Printable Offline Materials Drawer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Download className="w-5 h-5 text-brand-teal" />
              <div>
                <h3 className="text-sm font-bold text-white">Printable Materials</h3>
                <p className="text-[10px] text-slate-400">6 tactile kits for this lesson</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {lesson?.materials?.map((mat, i) => (
                <a
                  key={i}
                  href={mat.fileUrl}
                  download={mat.downloadName}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-start justify-between gap-3 group transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-brand-amber uppercase tracking-wider block">
                      {mat.type.replace('_', ' ')}
                    </span>
                    <h5 className="text-xs font-bold text-white group-hover:text-brand-teal transition-colors">
                      {mat.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{mat.description}</p>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 text-slate-400 group-hover:text-brand-teal shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Curriculum Index Accordion Sidebar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              10-Mission Roadmap
            </h4>
            <div className="space-y-1.5">
              {allLessons.map((l) => {
                const isCurrent = l.order === currentOrder;
                const done = progress?.completedLessons?.some((cl) => cl.lessonId === l._id);

                return (
                  <Link
                    key={l.order}
                    to={`/learn/${courseSlug}/lesson/${l.order}${childId ? `?childId=${childId}` : ''}`}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      isCurrent
                        ? 'bg-brand-teal text-brand-navy font-bold'
                        : done
                        ? 'bg-slate-800/60 text-slate-200 hover:bg-slate-800 font-medium'
                        : 'text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-mono text-[11px] shrink-0">#{l.order}</span>
                      <span className="truncate">{l.title}</span>
                    </div>
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Celebration Modal on Lesson Complete */}
      {celebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-brand-navy to-slate-950 border-2 border-brand-teal/60 rounded-3xl p-8 text-center text-white space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 text-brand-teal flex items-center justify-center mx-auto shadow-xl ring-4 ring-teal-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-amber uppercase tracking-widest">
                Mission {lesson?.order} Conquered!
              </span>
              <h3 className="text-2xl font-black font-display text-white">
                Awesome Work, Explorer!
              </h3>
              <p className="text-xs text-slate-300">
                You&apos;ve stamped your official AI Explorer Passport!
              </p>
            </div>

            {/* Stamp Display */}
            {celebrationModal.stamp && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/40 flex items-center gap-3 text-left">
                <div className="p-2 rounded-xl bg-teal-500/20 text-brand-teal">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase">
                    Passport Stamp Earned
                  </span>
                  <div className="text-xs font-bold text-white">
                    {celebrationModal.stamp.title}
                  </div>
                </div>
              </div>
            )}

            {/* Milestone Badge Display */}
            {celebrationModal.badge && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-3 text-left">
                <div className="p-2 rounded-xl bg-amber-500/20 text-brand-amber">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase">
                    Milestone Badge Unlocked!
                  </span>
                  <div className="text-xs font-bold text-white">
                    {celebrationModal.badge.title}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {celebrationModal.badge.description}
                  </p>
                </div>
              </div>
            )}

            {/* 10th lesson certificate notification */}
            {celebrationModal.certificateCode && (
              <div className="p-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-indigo-300 mx-auto" />
                <h4 className="text-xs font-bold text-white">Graduation Day!</h4>
                <p className="text-[10px] text-slate-300">
                  You completed all 10 lessons! Your official completion certificate is ready.
                </p>
                <button
                  onClick={() => {
                    setCelebrationModal(null);
                    setCertModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-amber text-brand-navy font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  View Official Certificate
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCelebrationModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Close
              </button>

              {currentOrder < 10 && (
                <button
                  onClick={() => {
                    setCelebrationModal(null);
                    navigate(
                      `/learn/${courseSlug}/lesson/${currentOrder + 1}${
                        childId ? `?childId=${childId}` : ''
                      }`
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 shadow-md"
                >
                  Start Next Mission &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        childNickname={user?.name || 'Explorer'}
        courseName={course?.title || 'AI Explorers Academy'}
        certificateCode={celebrationModal?.certificateCode || 'FT-CERT-2026'}
      />
    </div>
  );
}

