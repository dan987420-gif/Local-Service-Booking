import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { FormInput } from '../components/FormInput';
import { Megaphone, Send, CheckCircle2, AlertCircle, Users, UserPlus } from 'lucide-react';

export const NotificationManagement = () => {
  const [users, setUsers] = useState([]);
  const [targetType, setTargetType] = useState('Broadcast'); // 'Broadcast' or 'Specific'
  const [targetUserId, setTargetUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch users list to populate dropdown if target is specific
    adminService.getAllUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !message.trim()) {
      setError('Please fill in title and message.');
      return;
    }

    const payload = {
      title,
      message,
      userId: targetType === 'Specific' ? parseInt(targetUserId) : null,
    };

    setLoading(true);
    adminService.sendNotification(payload)
      .then((res) => {
        setSuccess(res.data.message || 'Notification dispatched successfully.');
        setTitle('');
        setMessage('');
        setTargetUserId('');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to send notification. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Push Notifications</h1>
        <p className="text-xs text-slate-500 mt-1">Compose system-wide alerts, safety notices, or target specific users.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex gap-2 items-start">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-800 text-xs font-semibold rounded-xl border border-red-200 flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="sc-card p-6 border border-slate-200 shadow-sm space-y-6">
        
        {/* Toggle Target Type */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setTargetType('Broadcast'); setTargetUserId(''); }}
            className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              targetType === 'Broadcast' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Users className="w-4 h-4" />
            Broadcast to All
          </button>
          <button
            type="button"
            onClick={() => setTargetType('Specific')}
            className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              targetType === 'Specific' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Target Specific User
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Target Specific User Dropdown */}
          {targetType === 'Specific' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Recipient User</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                required
              >
                <option value="">Select User Account...</option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.fullName} ({u.role} - {u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <FormInput
            label="Notification Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled Platform Maintenance"
            required
          />

          {/* Message Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Alert Message Content</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message content here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Dispatched...' : 'Send Notification'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
