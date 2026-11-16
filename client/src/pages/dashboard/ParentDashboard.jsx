import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ChildSelectorBar from '../../components/dashboard/ChildSelectorBar';
import ChildProfileModal from '../../components/dashboard/ChildProfileModal';
import CertificateModal from '../../components/common/CertificateModal';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Award,
  Compass,
  CheckCircle2,
  Lock,
  Plus,
  Receipt,
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certData, setCertData] = useState({ childNickname: '', courseName: '', code: '' });

  const loadData = useCallback(async () => {
    try {
      const childRes = await api.get('/parent/children');
      const fetchedChildren = childRes.data?.data?.children || [];
      setChildren(fetchedChildren);

      const currentActive =
        activeChild && fetchedChildren.some((c) => c._id === activeChild._id)
          ? activeChild
          : fetchedChildren[0] || null;

      setActiveChild(currentActive);

      const enrollUrl = currentActive
        ? `/parent/enrollments?childId=${currentActive._id}`
        : '/parent/enrollments';

      const enrollRes = await api.get(enrollUrl);
      setEnrollments(enrollRes.data?.data?.enrollments || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, [activeChild]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectChild = (child) => {
    setActiveChild(child);
  };

  const handleOpenAddModal = () => {
    setChildToEdit(null);
    setChildModalOpen(true);
  };

  const handleOpenEditModal = (child) => {
    setChildToEdit(child);
    setChildModalOpen(true);
  };

  const handleOpenCertificate = (course, progress) => {
    setCertData({
      childNickname: activeChild?.nickname || 'Innovator',
      courseName: course.title,
      code: progress.certificateCode || 'FT-CERT-2026'
    });
    setCertModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white font-display">
            Welcome, {user?.name || 'Parent'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your family&apos;s learning adventures and track AI Explorer progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Orders &amp; Receipts</span>
          </Link>
          <Link
            to="/dashboard/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings &amp; Privacy</span>
          </Link>
        </div>
      </div>

      {/* Child Learner Selector Bar */}
      <ChildSelectorBar
        childrenList={children}
        activeChild={activeChild}
        onSelectChild={handleSelectChild}
        onOpenAddModal={handleOpenAddModal}
        onOpenEditModal={handleOpenEditModal}
      />

      {/* If no child profile exists, prompt creation */}
      {children.length === 0 && (
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 rounded-3xl border border-brand-teal/40 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-brand-teal flex items-center justify-center mx-auto">
            <Plus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Create Your Child&apos;s Profile</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Children use a nickname and avatar only—no email or personal information collected.
              Ages 7 to 10.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 transition-colors shadow-lg"
          >
            <span>Add Child Profile Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* "My Courses" Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-teal" />
            <h2 className="text-2xl font-black text-white font-display">My Courses</h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
          >
            <span>Explore More Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading your courses...</div>
        ) : enrollments.length === 0 ? (
          /* Empty State: Course Selection Prompt */
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 text-brand-amber flex items-center justify-center mx-auto">
              <Compass className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-white">No Enrolled Courses Yet</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse our course catalogue to enroll in our flagship course:{' '}
                <strong>AI Explorers Academy (Ages 7–10)</strong>. Once enrolled, your lessons and
                progress tracking will appear right here!
              </p>
            </div>
            <div>
              <Link
                to="/courses/ai-explorers-academy"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 transition-colors shadow-lg"
              >
                <span>View AI Explorers Academy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Enrolled Courses Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {enrollments.map((enr) => {
              const course = enr.course;
              const progress = enr.progress || {
                percent: 0,
                completedLessons: [],
                passportStamps: [],
                badges: []
              };

              const nextLessonNumber = Math.min(10, progress.completedLessons.length + 1);

              return (
                <div
                  key={enr.enrollmentId}
                  className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-brand-teal border border-teal-500/30 uppercase tracking-wider">
                          Active Enrollment
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Learner: <strong className="text-white">{activeChild?.nickname || 'Child Profile'}</strong>
                        </p>
                      </div>

                      {progress.percent >= 100 && (
                        <button
                          onClick={() => handleOpenCertificate(course, progress)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-brand-amber border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition-colors shadow"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Certificate</span>
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-300">
                          Mission Progress ({progress.completedLessons.length}/10 Lessons)
                        </span>
                        <span className="text-brand-teal font-mono font-bold">
                          {progress.percent}%
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-teal to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Passport Stamps Preview */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        AI Passport Collectible Stamps Earned:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((order) => {
                          const hasStamp = progress.passportStamps?.some(
                            (s) => s.lessonOrder === order
                          );
                          return (
                            <div
                              key={order}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                                hasStamp
                                  ? 'bg-teal-500/20 text-brand-teal border border-teal-500/40 shadow-sm'
                                  : 'bg-slate-900/60 border border-slate-700/60 text-slate-600'
                              }`}
                              title={hasStamp ? `Mission ${order} Stamp Earned!` : `Lesson ${order} locked`}
                            >
                              {hasStamp ? <CheckCircle2 className="w-4 h-4 text-brand-teal" /> : order}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      {progress.percent >= 100 ? (
                        <span className="text-brand-teal font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> All 10 Lessons Mastered!
                        </span>
                      ) : (
                        <span>Next up: Lesson {nextLessonNumber}</span>
                      )}
                    </div>

                    <Link
                      to={`/learn/${course.slug}/lesson/${nextLessonNumber}${
                        activeChild ? `?childId=${activeChild._id}` : ''
                      }`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-md"
                    >
                      <span>
                        {progress.completedLessons.length === 0
                          ? 'Start Lesson 1'
                          : progress.percent >= 100
                          ? 'Review Lessons'
                          : `Continue Lesson ${nextLessonNumber}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Child Profile Modal */}
      <ChildProfileModal
        isOpen={childModalOpen}
        onClose={() => setChildModalOpen(false)}
        childToEdit={childToEdit}
        onSaved={loadData}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        childNickname={certData.childNickname}
        courseName={certData.courseName}
        certificateCode={certData.code}
      />
    </div>
  );
}

