import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { FileText, Edit2, AlertCircle, CheckCircle, Save } from 'lucide-react';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('privacy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: ''
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pages');
      const data = res.data?.data || res.data;
      setPages(data.pages || []);
      if (data.pages?.length > 0 && !selectedSlug) {
        loadPage(data.pages[0].pageSlug || data.pages[0].slug);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (slug) => {
    setSelectedSlug(slug);
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get(`/admin/pages/${slug}`);
      const page = res.data?.data?.page || res.data?.page;
      setFormData({
        title: page.title || '',
        content: page.content || '',
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
    loadPage('privacy');
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/admin/pages/${selectedSlug}`, formData);
      setSuccess(`Page "${formData.title}" updated successfully!`);
      fetchPages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-teal" />
            Policy & Content Pages
          </h1>
          <p className="text-sm text-slate-500">Edit content for Privacy Policy, Terms, Refund, Accessibility, and About</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm flex items-center gap-2 border border-emerald-200">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation list */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-2">
          <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider px-2 mb-2">Select Page</h2>
          {pages.map((p) => {
            const currentSlug = p.pageSlug || p.slug;
            return (
              <button
                key={p._id || currentSlug}
                onClick={() => loadPage(currentSlug)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                  selectedSlug === currentSlug
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{p.title}</span>
                <span className="text-xs opacity-60 font-mono">/{currentSlug}</span>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Editing: <span className="text-brand-teal">/{selectedSlug}</span>
              </h2>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-teal-500 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Meta SEO Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Meta SEO Description</label>
              <input
                type="text"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Content (Markdown supported)
              </label>
              <textarea
                rows="16"
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-teal focus:outline-none leading-relaxed"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
