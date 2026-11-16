import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  GraduationCap,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manual Enroll Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [accessDays, setAccessDays] = useState(365);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [enrRes, courseRes] = await Promise.all([
        api.get('/admin/enrollments'),
        api.get('/admin/courses')
      ]);
      setEnrollments(enrRes.data?.data?.enrollments || []);
      const loadedCourses = courseRes.data?.data?.courses || [];
      setCourses(loadedCourses);
      if (loadedCourses.length > 0 && !courseId) {
        setCourseId(loadedCourses[0]._id);
      }
    } catch (err) {
      console.error('Failed to load enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualEnroll = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/admin/enrollments/manual', {
        parentEmail,
        courseId,
        accessDays: parseInt(accessDays, 10)
      });
      setModalOpen(false);
      setParentEmail('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Manual enrollment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExtend = async (enrollmentId) => {
    const days = prompt('Enter additional access days to grant (e.g. 30):', '30');
    if (!days) return;

    try {
      await api.patch(`/admin/enrollments/${enrollmentId}/extend`, {
        additionalDays: parseInt(days, 10)
      });
      await loadData();
    } catch (err) {
      alert('Failed to extend enrollment');
    }
  };

  const handleRevoke = async (enrollmentId) => {
    if (!window.confirm('Revoke and delete this enrollment?')) return;
    try {
      await api.delete(`/admin/enrollments/${enrollmentId}`);
      await loadData();
    } catch (err) {
      alert('Failed to revoke enrollment');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-display">Student Enrollments</h1>
          <p className="text-xs text-slate-400 mt-1">
            View student progress, grant manual family licenses, and manage course access periods.
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Enroll Family</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading enrollments...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Parent Account</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Learner Profile</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Access Expires</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {enrollments.map((enr) => (
                <tr key={enr._id} className="hover:bg-slate-800/40">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{enr.parentId?.name || 'Parent'}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {enr.parentId?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-teal">
                    {enr.courseId?.title}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {enr.childId?.nickname || <span className="text-slate-500 italic">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-teal"
                          style={{ width: `${enr.progress?.percent || 0}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-brand-teal font-bold">
                        {enr.progress?.percent || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                      {enr.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-[11px]">
                    {new Date(enr.accessExpiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleExtend(enr._id)}
                      className="p-1.5 text-slate-400 hover:text-brand-amber rounded-lg hover:bg-slate-800"
                      title="Extend access days"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRevoke(enr._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      title="Revoke enrollment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Enroll Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold font-display">Manual Course Enrollment</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleManualEnroll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Parent Email Address (Must be registered)
                </label>
                <input
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} (${c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Access Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={accessDays}
                  onChange={(e) => setAccessDays(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 disabled:opacity-50"
                >
                  {submitting ? 'Enrolling...' : 'Enroll Family'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

