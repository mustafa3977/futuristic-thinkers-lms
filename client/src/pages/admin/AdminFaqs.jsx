import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { HelpCircle, Plus, Edit2, Trash2, AlertCircle, CheckCircle, Check, X } from 'lucide-react';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isPublished: true
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/faqs');
      const data = res.data?.data || res.data;
      setFaqs(data.faqs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      order: faqs.length + 1,
      isPublished: true
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category || 'General',
      order: item.order || 0,
      isPublished: item.isPublished !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      setSuccess('FAQ deleted');
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.put(`/admin/faqs/${editingId}`, {
          ...formData,
          order: Number(formData.order)
        });
        setSuccess('FAQ updated');
      } else {
        await api.post('/admin/faqs', {
          ...formData,
          order: Number(formData.order)
        });
        setSuccess('FAQ created');
      }
      setShowModal(false);
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-teal" />
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-500">Manage FAQ questions and answers displayed across the platform</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-teal-500 text-white font-medium rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No FAQs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Question</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono text-slate-400 text-xs">
                      #{faq.order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{faq.question}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{faq.answer}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        {faq.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          faq.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {faq.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="p-1.5 text-slate-500 hover:text-brand-teal rounded-lg hover:bg-slate-100 transition"
                        title="Edit FAQ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Delete FAQ"
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
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingId ? 'Edit FAQ' : 'Add FAQ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Answer</label>
                <textarea
                  rows="4"
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Course & Content">Course & Content</option>
                    <option value="Accounts & Privacy">Accounts & Privacy</option>
                    <option value="Pricing & Refunds">Pricing & Refunds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">
                  Visible to public on FAQ page
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-teal hover:bg-teal-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
