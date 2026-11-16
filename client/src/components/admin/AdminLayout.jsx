import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  GraduationCap,
  CreditCard,
  Tag,
  FileText,
  HelpCircle,
  Shield,
  Mail,
  Settings,
  Activity,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20 shadow-xl">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white font-display">Administrative Access Required</h1>
          <p className="text-xs text-slate-400">
            You must be signed in with an authorized administrator account to access the control panel.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs"
          >
            Sign in as Admin
          </Link>
          <Link to="/" className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Enrollments', path: '/admin/enrollments', icon: GraduationCap },
    { name: 'Orders / Stripe', path: '/admin/orders', icon: CreditCard },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Learning Hub (Blog)', path: '/admin/blog', icon: FileText },
    { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Policy Pages', path: '/admin/pages', icon: Shield },
    { name: 'Contact Inbox', path: '/admin/contact', icon: Mail },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
    { name: 'Activity Log', path: '/admin/activity', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-brand-navy border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-teal text-brand-navy font-black flex items-center justify-center text-sm">
            FT
          </div>
          <span className="font-bold text-sm text-white">Admin Control</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-navy border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo & Admin Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-amber flex items-center justify-center text-brand-navy font-black text-lg shadow">
              FT
            </div>
            <div>
              <div className="text-sm font-black text-white">Admin Portal</div>
              <p className="text-[10px] text-brand-teal font-medium">Futuristic Thinkers</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-brand-teal text-brand-navy shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <div className="font-bold text-white truncate">{user?.name}</div>
            <div className="truncate text-teal-400">{user?.email}</div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}

