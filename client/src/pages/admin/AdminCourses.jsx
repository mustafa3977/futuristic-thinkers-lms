import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    ageRange: '7-10 years',
    price: 49,
    currency: 'USD',
    shortDescription: '',
    fullDescription: '',
    duration: '10 lessons (~30-45 mins each)',
    deviceRequirements: 'Tablet, Laptop, or Desktop with web browser',
    accessPeriod: '1 Year Full Access',
    refundText: '14-Day 100% Money-Back Guarantee',
    status: 'draft',
    isFeatured: false
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [coursesRes, catsRes] = await Promise.all([
        api.get('/admin/courses'),
        api.get('/admin/categories')
      ]);
      setCourses(coursesRes.data?.data?.courses || []);
      setCategories(catsRes.data?.data?.categories || []);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      slug: '',
      category: categories[0]?._id || '',
      ageRange: '7-10 years',
      price: 49,
      currency: 'USD',
      shortDescription: '',
      fullDescription: '',
      duration: '10 lessons (~30-45 mins each)',
      deviceRequirements: 'Tablet, Laptop, or Desktop with web browser',
      accessPeriod: '1 Year Full Access',
      refundText: '14-Day 100% Money-Back Guarantee',
      status: 'draft',
      isFeatured: false
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      slug: course.slug,
      category: course.category?._id || course.category,
      ageRange: course.ageRange,
      price: course.price,
      currency: course.currency,
      shortDescription: course.shortDescription,
      fullDescription: course.fullDescription,
      duration: course.duration,
      deviceRequirements: course.deviceRequirements,
      accessPeriod: course.accessPeriod,
      refundText: course.refundText,
      status: course.status,
      isFeatured: course.isFeatured || false
    });
    setError('');
    setModalOpen(true);
  };

  const handleTogglePublish = async (courseId) => {
    try {
      await api.patch(`/admin/courses/${courseId}/publish`);
      await loadData();
    } catch (err) {
      alert('Failed to update course status');
    }
  };

  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}' and all its lessons?`)) {
      return;
    }
    try {
      await api.delete(`/admin/courses/${courseId}`);
      await loadData();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse._id}`, formData);
      } else {
        await api.post('/admin/courses', formData);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-display">Courses Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, publish courses and manage their 10-lesson curriculum.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading courses...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Title &amp; Slug</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Age</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Lessons</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      <div>{course.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">/{course.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {course.category?.name || 'STEM'}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{course.ageRange}</td>
                    <td className="px-6 py-4 font-bold text-brand-teal font-mono">
                      ${course.price} {course.currency}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/curriculum/${course._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-brand-amber border border-slate-700 hover:bg-slate-700 font-semibold text-[11px]"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.lessonsCount || 0} Lessons</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(course._id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold capitalize transition-colors ${
                          course.status === 'published'
                            ? 'bg-teal-500/20 text-brand-teal border border-teal-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {course.status === 'published' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{course.status}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/courses/${course.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 inline-block"
                        title="View Sales Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="p-1.5 text-slate-400 hover:text-brand-teal rounded-lg hover:bg-slate-800 inline-block"
                        title="Edit course"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteCourse(course._id, course.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 inline-block"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold font-display">
                {editingCourse ? 'Edit Course Details' : 'Create New Course'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: editingCourse ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      });
                    }}
                    placeholder="AI Explorers Academy"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ai-explorers-academy"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-brand-teal"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Age Range</label>
                  <input
                    type="text"
                    value={formData.ageRange}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Description (max 300 chars)</label>
                <textarea
                  rows={2}
                  required
                  maxLength={300}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-brand-teal resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Curriculum Description</label>
                <textarea
                  rows={4}
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-brand-teal resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Access Period</label>
                  <input
                    type="text"
                    value={formData.accessPeriod}
                    onChange={(e) => setFormData({ ...formData, accessPeriod: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Refund Terms</label>
                  <input
                    type="text"
                    value={formData.refundText}
                    onChange={(e) => setFormData({ ...formData, refundText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

