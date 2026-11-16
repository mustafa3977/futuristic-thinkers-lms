import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Receipt, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ParentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/parent/orders');
        setOrders(res.data?.data?.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Parent Dashboard</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white font-display">Orders &amp; Receipts</h1>
        <p className="text-xs text-slate-400">
          Official purchase records and receipts processed securely via Stripe.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-8 text-center space-y-3">
          <Receipt className="w-10 h-10 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Order History Found</h2>
          <p className="text-xs text-slate-400">
            When you purchase courses, transaction receipts and invoices will be listed here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Invoice ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      {order.courseId?.title || 'Course Enrollment'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-teal font-mono">
                      ${order.amount} {order.currency}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          order.status === 'completed'
                            ? 'bg-teal-500/20 text-brand-teal border border-teal-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {order.stripeSessionId?.substring(0, 16) || order._id}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

