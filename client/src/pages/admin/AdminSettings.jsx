import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Settings, Save, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState({
    site_name: 'Futuristic Thinkers',
    site_tagline: "Inspiring Tomorrow's Innovators",
    support_email: 'support@futuristicthinkers.com',
    default_price: '49',
    default_currency: 'USD',
    refund_window_days: '14',
    access_period_text: '12 Months Unlimited Access',
    maintenance_mode: 'false'
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/settings');
      const map = res.data?.data?.settingsMap || res.data?.settingsMap || {};
      setSettings((prev) => ({
        ...prev,
        ...map
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, val) => {
    setSettings((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/admin/settings', { settings });
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-teal" />
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500">Configure global site variables, pricing defaults, and policies</p>
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

      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Brand & Contact Information</h2>
            <p className="text-xs text-slate-500">Primary brand identity and support lines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Site Name</label>
              <input
                type="text"
                required
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Tagline</label>
              <input
                type="text"
                required
                value={settings.site_tagline || ''}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Support Email</label>
            <input
              type="email"
              required
              value={settings.support_email || ''}
              onChange={(e) => handleChange('support_email', e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
            />
          </div>

          <div className="border-b border-slate-200 pb-4 pt-4">
            <h2 className="text-lg font-bold text-slate-900">Course & Commerce Defaults</h2>
            <p className="text-xs text-slate-500">Pricing fallbacks and customer guarantee windows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Default Price ($)</label>
              <input
                type="number"
                required
                value={settings.default_price || ''}
                onChange={(e) => handleChange('default_price', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Currency Code</label>
              <input
                type="text"
                required
                value={settings.default_currency || 'USD'}
                onChange={(e) => handleChange('default_currency', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase font-mono focus:ring-2 focus:ring-brand-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Refund Window (Days)
              </label>
              <input
                type="number"
                required
                value={settings.refund_window_days || ''}
                onChange={(e) => handleChange('refund_window_days', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Standard Access Period Display
            </label>
            <input
              type="text"
              value={settings.access_period_text || ''}
              onChange={(e) => handleChange('access_period_text', e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-teal hover:bg-teal-500 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

