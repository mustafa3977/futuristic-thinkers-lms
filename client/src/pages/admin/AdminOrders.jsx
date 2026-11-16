import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { ShoppingCart, Search, RefreshCw, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      const res = await api.get('/admin/orders', { params });
      const data = res.data?.data || res.data;
      setOrders(data.orders || []);
      setTotal(data.pagination?.total || data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleMarkRefunded = async (orderId) => {
    if (!window.confirm('Are you sure you want to mark this order as refunded? This will update the status to refunded.')) {
      return;
    }
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/admin/orders/${orderId}/refund`);
      setSuccess('Order successfully marked as refunded.');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refund order');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-brand-teal" />
            Orders & Payments
          </h1>
          <p className="text-sm text-slate-500">Track Stripe transactions and process refunds</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={fetchOrders}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
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
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="text-sm font-semibold text-slate-700">Total Orders: {total}</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Order ID / Date</th>
                  <th className="py-3 px-4">Parent / Customer</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-slate-500">{order._id.substring(0, 10)}...</div>
                      <div className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{order.parentId?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{order.parentId?.email || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-brand-navy">
                        {order.courseId?.title || 'Unknown Course'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {(order.currency || 'USD').toUpperCase()} ${(order.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'refunded'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleMarkRefunded(order._id)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                          title="Mark Refunded"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
