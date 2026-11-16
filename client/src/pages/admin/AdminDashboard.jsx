import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  GraduationCap,
  CreditCard,
  BookOpen,
  DollarSign,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data?.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading admin metrics...</div>;
  }

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-display">Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time overview of enrollments, revenue, parent accounts, and student learning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/enrollments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Manual Enroll</span>
          </Link>
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Courses</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-display">
            ${metrics.totalRevenue || 0}
          </div>
          <p className="text-[11px] text-teal-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Completed Stripe Orders</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Enrollments</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-brand-amber">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-display">
            {metrics.totalEnrollments || 0}
          </div>
          <p className="text-[11px] text-slate-400">Enrolled student profiles</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Parent Accounts</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-display">
            {metrics.totalParents || 0}
          </div>
          <p className="text-[11px] text-slate-400">
            {metrics.totalChildren || 0} active child profiles
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Published Courses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-display">
            {metrics.totalCourses || 0}
          </div>
          <p className="text-[11px] text-slate-400">Flagship: AI Explorers</p>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-teal" />
              <h2 className="text-base font-bold text-white">Recent Stripe Orders</h2>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-teal hover:underline">
              View All
            </Link>
          </div>

          {stats?.recentOrders?.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentOrders?.map((order) => (
                <div
                  key={order._id}
                  className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{order.parentId?.name || 'Parent'}</div>
                    <div className="text-[11px] text-slate-400">{order.courseId?.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-teal font-mono">
                      ${order.amount} {order.currency}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Activity Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-amber" />
              <h2 className="text-base font-bold text-white">Recent Admin Activity</h2>
            </div>
            <Link to="/admin/activity" className="text-xs font-bold text-brand-amber hover:underline">
              View All
            </Link>
          </div>

          {stats?.recentActivity?.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No activity logged yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentActivity?.map((act) => (
                <div
                  key={act._id}
                  className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3 text-xs"
                >
                  <div className="p-1.5 rounded-lg bg-slate-900 text-brand-amber mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span className="font-mono text-[11px] text-brand-teal">{act.action}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {new Date(act.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Target: {act.targetType} {act.details?.title ? `(${act.details.title})` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

