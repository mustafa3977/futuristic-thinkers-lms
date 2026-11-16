import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Video,
  FileText,
  Compass,
  Award,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminCurriculum() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lesson Edit/Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    order: 1,
    title: '',
    videoUrl: '',
    videoDuration: '12:00',
    content: '',
    isPreview: false,
    unlockRule: 'sequential',
    characterFocus: ['The Explorer Team']
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const res = await api.get(`/admin/courses/${courseId}`);
      setCourse(res.data?.data?.course);
      setLessons(res.data?.data?.lessons || []);
    } catch (err) {
      console.error('Failed to load curriculum', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingLesson(null);
    setFormData({
      order: lessons.length + 1,
      title: `[LESSON ${lessons.length + 1} TITLE] New Mission`,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: '12:00',
      content: 'Enter story mission instructions here...',
      isPreview: false,
      unlockRule: 'sequential',
      characterFocus: ['Zara (9)', 'Zahran (8)', 'Luna (9)']
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      order: lesson.order,
      title: lesson.title,
      videoUrl: lesson.videoUrl || '',
      videoDuration: lesson.videoDuration || '12:00',
      content: lesson.content,
      isPreview: lesson.isPreview || false,
      unlockRule: lesson.unlockRule || 'sequential',
      characterFocus: lesson.characterFocus || []
    });
    setError('');
    setModalOpen(true);
  };

  const handleDeleteLesson = async (lessonId, title) => {
    if (!window.confirm(`Delete '${title}'?`)) return;
    try {
      await api.delete(`/admin/lessons/${lessonId}`);
      await loadData();
    } catch (err) {
      alert('Failed to delete lesson');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingLesson) {
        await api.put(`/admin/lessons/${editingLesson._id}`, formData);
      } else {
        await api.post(`/admin/courses/${courseId}/lessons`, formData);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lesson');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <Link
        to="/admin/courses"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-teal uppercase tracking-wider block">
            Curriculum Builder
          </span>
          <h1 className="text-3xl font-black text-white font-display">
            {course?.title || 'Course Curriculum'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            10-Lesson story curriculum, embedded video URLs, and downloadable materials.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lesson</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading lessons...</div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-xl bg-slate-800 text-brand-teal border border-slate-700 flex items-center justify-center font-black text-sm shrink-0">
                  #{lesson.order}
                </span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{lesson.title}</h3>
                    {lesson.isPreview && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-brand-teal border border-teal-500/30">
                        FREE PREVIEW
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {lesson.unlockRule} unlock
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">{lesson.content}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>{lesson.videoDuration || '12 mins'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lesson.materials?.length || 6} materials attached</span>
                    </span>
                    {lesson.characterFocus?.length > 0 && (
                      <span className="text-amber-400">
                        Guides: {lesson.characterFocus.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(lesson)}
                  className="p-2 text-slate-400 hover:text-brand-teal rounded-xl hover:bg-slate-800 transition-colors"
                  title="Edit lesson"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson._id, lesson.title)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Delete lesson"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Lesson Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold font-display">
                {editingLesson ? `Edit Lesson #${formData.order}` : 'Add Lesson to Course'}
              </h2>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Order (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Lesson Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Embedded Video URL (YouTube unlisted / Vimeo / Bunny)
                </label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Story Narrative &amp; Mission Briefing
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Unlock Rule</label>
                  <select
                    value={formData.unlockRule}
                    onChange={(e) => setFormData({ ...formData, unlockRule: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  >
                    <option value="sequential">Sequential (Unlocks after prior lesson)</option>
                    <option value="immediate">Immediate (Unlocked from start)</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPreview}
                      onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-brand-teal"
                    />
                    <span className="text-xs text-slate-300 font-bold">
                      Free Preview Lesson (Publicly accessible)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingLesson ? 'Save Changes' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

