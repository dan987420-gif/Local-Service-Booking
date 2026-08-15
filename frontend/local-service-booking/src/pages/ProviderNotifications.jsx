import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Bell, Check, Trash2, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';

export const ProviderNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    notificationService.getUserNotifications()
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id)
      .then(() => {
        fetchNotifications();
      })
      .catch((err) => console.error(err));
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
      .then(() => {
        fetchNotifications();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this notification?')) {
      notificationService.deleteNotification(id)
        .then(() => {
          fetchNotifications();
        })
        .catch((err) => console.error(err));
    }
  };

  if (loading && notifications.length === 0) {
    return <LoadingSpinner />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">Review alerts regarding booking confirmations, KYC requests, and disputes.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="We will notify you when you receive new bookings or updates."
        />
      ) : (
        <div className="sc-card divide-y divide-slate-100 overflow-hidden border border-slate-200">
          {notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-indigo-50/20' : 'bg-white'
              }`}
            >
              <div className="flex gap-3">
                {/* Notification Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  n.type === 'Booking' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  n.type === 'KYC' ? 'bg-teal-50 text-teal-600 border-teal-100' :
                  n.type === 'Complaint' ? 'bg-red-50 text-red-600 border-red-100' :
                  'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {n.type === 'Booking' && <Bell className="w-5 h-5" />}
                  {n.type === 'KYC' && <ShieldCheck className="w-5 h-5" />}
                  {n.type === 'Complaint' && <ShieldAlert className="w-5 h-5" />}
                  {n.type !== 'Booking' && n.type !== 'KYC' && n.type !== 'Complaint' && <Mail className="w-5 h-5" />}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0"></span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.notificationId)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.notificationId)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
