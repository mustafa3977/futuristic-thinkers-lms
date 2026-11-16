import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  User,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function ParentSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Deletion modal
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setSavingProfile(true);

    try {
      await api.patch('/auth/update-profile', { name });
      setProfileMsg('Parent profile updated successfully');
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    setSavingPassword(true);

    try {
      await api.patch('/auth/update-password', {
        currentPassword,
        newPassword
      });
      setPasswordMsg('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordErr(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      window.open(`${api.defaults.baseURL}/parent/export-data`, '_blank');
    } catch (err) {
      alert('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/parent/delete-account');
      await logout();
      navigate('/');
    } catch (err) {
      alert('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Parent Dashboard</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white font-display">Account &amp; Privacy Settings</h1>
        <p className="text-xs text-slate-400">
          Manage your account security and exercise your GDPR / COPPA data privacy rights.
        </p>
      </div>

      {/* 1. Profile Information */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-700/60 pb-4">
          <User className="w-5 h-5 text-brand-teal" />
          <h2 className="text-lg font-bold text-white">Parent Profile</h2>
        </div>

        {profileMsg && (
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-brand-teal text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{profileMsg}</span>
          </div>
        )}
        {profileErr && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{profileErr}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Parent Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              To change your primary email address, please contact support.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-2.5 rounded-xl bg-brand-teal text-brand-navy font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md disabled:opacity-50"
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* 2. Change Password */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-700/60 pb-4">
          <Lock className="w-5 h-5 text-brand-amber" />
          <h2 className="text-lg font-bold text-white">Security &amp; Password</h2>
        </div>

        {passwordMsg && (
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-brand-teal text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordMsg}</span>
          </div>
        )}
        {passwordErr && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordErr}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              New Password (min 8 chars, Upper, Lower, Number)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 rounded-xl bg-brand-amber text-brand-navy font-bold text-xs hover:bg-amber-400 transition-colors shadow-md disabled:opacity-50"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* 3. COPPA / GDPR Data Subject Rights */}
      <div className="bg-slate-800/80 rounded-3xl border border-rose-500/30 p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-700/60 pb-4">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white">Data Privacy &amp; Deletion Rights</h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Under COPPA, GDPR, UK GDPR, PIPEDA, and the Australian Privacy Act, you have full control
          over your account and child profiles.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4 text-brand-teal" />
            <span>Export My Data (JSON)</span>
          </button>

          <button
            onClick={() => setConfirmDeleteModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account &amp; Child Profiles</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-white text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black font-display">Permanently Delete Account?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will immediately and permanently erase your parent account, all child profiles,
                passport stamps, badges, and completion certificates. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 shadow-md"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

