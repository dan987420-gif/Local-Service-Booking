import React, { useState } from 'react';
import { authService } from '../services/api';
import { FormInput } from '../components/FormInput';
import { ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ProviderSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    authService.changePassword({ currentPassword, newPassword })
      .then((res) => {
        setSuccess(res.data.message || 'Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to change password. Please verify current password.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your provider account security settings and update credentials.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-900/30 flex gap-2 items-start transition-colors">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/30 flex gap-2 items-start transition-colors">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-450 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="sc-card-3d p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex gap-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750 p-4 rounded-xl text-xs text-slate-700 dark:text-slate-300 transition-colors">
          <KeyRound className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Password Security Guidelines</span>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400 leading-relaxed">
              Use a strong password combining uppercase and lowercase letters, numbers, and special characters. Do not share your login credentials with anyone.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <FormInput
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="•••••••• (Min 6 chars)"
            required
          />

          <FormInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-glow text-xs py-2 px-4 flex items-center gap-1.5"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
