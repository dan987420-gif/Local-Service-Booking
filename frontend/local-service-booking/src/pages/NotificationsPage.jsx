import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/api';
import { NotificationItem } from '../components/NotificationItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    notificationService.getUserNotifications()
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await notificationService.deleteNotification(id);
    fetchNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500">System updates, booking confirmations, and status alerts</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" onClick={handleMarkAllRead} className="text-xs">
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are all caught up! There are no new notifications."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem
              key={n.notificationId}
              notification={n}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
