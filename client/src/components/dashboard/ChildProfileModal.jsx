import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, ShieldCheck, User, Lock, AlertCircle } from 'lucide-react';

const AVATARS = [
  { id: 'avatar-zara', name: 'Zara Detective', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { id: 'avatar-zahran', name: 'Zahran Tinkerer', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'avatar-luna', name: 'Luna Artist', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { id: 'avatar-bot', name: 'Cyber Bot', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { id: 'avatar-rover', name: 'Space Rover', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
];

export default function ChildProfileModal({ isOpen, onClose, childToEdit = null, onSaved }) {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('avatar-zara');
  const [age, setAge] = useState(8);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (childToEdit) {
      setNickname(childToEdit.nickname || '');
      setAvatar(childToEdit.avatar || 'avatar-zara');
      setAge(childToEdit.age || 8);
      setPin('');
    } else {
      setNickname('');
      setAvatar('avatar-zara');
      setAge(8);
      setPin('');
    }
    setError('');
  }, [childToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (pin && pin.trim().length !== 4) {
      setError('Optional profile PIN must be exactly 4 digits');
      return;
    }

    setSubmitting(true);

    try {
      if (childToEdit) {
        await api.put(`/parent/children/${childToEdit._id || childToEdit.id}`, {
          nickname,
          avatar,
          age: parseInt(age, 10),
          pin: pin ? pin.trim() : undefined
        });
      } else {
        await api.post('/parent/children', {
          nickname,
          avatar,
          age: parseInt(age, 10),
          pin: pin ? pin.trim() : undefined
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save child profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black font-display">
              {childToEdit ? 'Edit Child Profile' : 'Add Child Learner'}
            </h2>
            <p className="text-[11px] text-teal-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COPPA Safe: Nickname &amp; Avatar Only</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Child Nickname / First Name
            </label>
            <input
              type="text"
              required
              maxLength={30}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Leo, Maya, Sam"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Age (Ages 7–10 Only)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 8, 9, 10].map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAge(a)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    age === a
                      ? 'bg-brand-teal text-brand-navy border-brand-teal'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {a} yrs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Choose Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => setAvatar(av.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    avatar === av.id
                      ? `${av.color} ring-2 ring-brand-teal border-transparent scale-105`
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <User className="w-6 h-6" />
                  <span className="text-[9px] font-semibold truncate w-full text-center">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Optional 4-Digit Profile PIN
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 1234 (optional)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal font-mono tracking-widest"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Prevent siblings from accidentally switching or completing each other&apos;s lessons.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-brand-teal text-brand-navy font-black text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving...' : childToEdit ? 'Save Changes' : 'Create Learner Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

