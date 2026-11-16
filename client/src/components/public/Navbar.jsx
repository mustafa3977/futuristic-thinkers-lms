import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Compass,
  BookOpen,
  HelpCircle,
  Mail,
  Shield,
  LayoutDashboard,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isParent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Explore Courses', path: '/courses' },
    { name: 'For Parents', path: '/for-parents' },
    { name: 'Learning Hub', path: '/hub' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-brand-navy/95 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-teal via-teal-500 to-brand-amber flex items-center justify-center text-brand-navy shadow-lg font-black text-xl group-hover:scale-105 transition-transform">
              FT
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Futuristic Thinkers</span>
              </div>
              <p className="text-[11px] text-brand-teal font-medium tracking-wide">
                Inspiring Tomorrow&apos;s Innovators
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-brand-teal'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 text-brand-amber border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                ) : null}

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-brand-navy text-xs font-bold hover:bg-emerald-400 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/courses/ai-explorers-academy"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-brand-navy text-xs font-bold hover:bg-emerald-400 active:scale-95 transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enroll Today</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-xl bg-amber-500/20 text-brand-amber font-bold text-sm"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-sm"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-rose-400 font-bold text-sm hover:bg-rose-500/10"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/courses/ai-explorers-academy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-sm"
                >
                  Enroll
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

