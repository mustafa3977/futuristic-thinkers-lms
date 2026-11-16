import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { History, RefreshCw, AlertCircle, Shield } from 'lucide-react';

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/activity-logs', { params: { page, limit: 25 } });
      const data = res.data?.data || res.data;
      setLogs(data.logs || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-brand-teal" />
            Admin Activity Audit Log
          </h1>
          <p className="text-sm text-slate-500">
            Immutable audit record of all administrative actions, enrollments, and configuration changes
          </p>
        </div>
        <button
          onClick={() => fetchLogs(pagination.page)}
          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600 transition flex items-center gap-1.5 text-sm"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 text-sm font-semibold text-slate-700">
          <span>Total Audit Records: {pagination.total}</span>
          <span className="text-xs text-slate-500 font-normal">
            Page {pagination.page} of {pagination.pages}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading audit records...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No activity logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Details / Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-100 text-brand-navy">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {log.targetType || 'System'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{log.adminId?.name || 'Automated / Seed'}</div>
                      <div className="text-xs text-slate-400">{log.adminId?.email || 'System'}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-600 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
            <button
              onClick={() => fetchLogs(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchLogs(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

