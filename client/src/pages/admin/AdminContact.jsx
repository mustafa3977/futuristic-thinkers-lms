import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Mail, Check, Trash2, Reply, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';

export default function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyNotes, setReplyNotes] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/contact-messages');
      const data = res.data?.data || res.data;
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/admin/contact-messages/${id}/read`);
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/admin/contact-messages/${id}`);
      setSuccess('Message deleted');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;
    setSubmittingReply(true);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/admin/contact-messages/${selectedMessage._id}/reply`, { replyNotes });
      setSuccess('Reply recorded successfully');
      setSelectedMessage(null);
      setReplyNotes('');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-brand-teal" />
            Contact Messages Inbox
          </h1>
          <p className="text-sm text-slate-500">Inquiries and support requests from parents and visitors</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Inbox is empty. No messages yet!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject & Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`hover:bg-slate-50 transition ${!msg.isRead ? 'bg-teal-50/30' : ''}`}
                  >
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{msg.name}</div>
                      <div className="text-xs text-slate-500">{msg.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-medium text-slate-800">{msg.subject}</div>
                      <div className="text-xs text-slate-600 line-clamp-2 mt-0.5">{msg.message}</div>
                      {msg.replyNotes && (
                        <div className="mt-1 text-xs text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-100">
                          <strong>Admin Reply Note:</strong> {msg.replyNotes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {msg.isReplied ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Replied
                        </span>
                      ) : msg.isRead ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                          New
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkRead(msg._id)}
                          className="p-1.5 text-slate-500 hover:text-brand-teal rounded-lg hover:bg-slate-100 transition"
                          title="Mark as Read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          setReplyNotes(msg.replyNotes || '');
                        }}
                        className="p-1.5 text-slate-500 hover:text-brand-teal rounded-lg hover:bg-slate-100 transition"
                        title="Reply / Record Notes"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Delete Message"
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

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Message Details & Reply</h2>
            <div className="p-4 bg-slate-50 rounded-xl mb-4 text-sm space-y-1">
              <div>
                <span className="font-semibold text-slate-700">From:</span> {selectedMessage.name} ({selectedMessage.email})
              </div>
              <div>
                <span className="font-semibold text-slate-700">Subject:</span> {selectedMessage.subject}
              </div>
              <div className="pt-2 text-slate-800 border-t border-slate-200 mt-2 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Admin Resolution / Reply Notes
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Record your response sent via email or action taken..."
                  value={replyNotes}
                  onChange={(e) => setReplyNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="px-4 py-2 bg-brand-teal hover:bg-teal-500 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  {submittingReply ? 'Saving...' : 'Save & Mark Replied'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
