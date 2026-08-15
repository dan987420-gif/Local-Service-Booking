import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';

export const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'Booking': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'KYC': return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'Complaint': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
        notification.isRead
          ? 'bg-white border-slate-200 opacity-75'
          : 'bg-indigo-50/50 border-indigo-200 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs mt-0.5">
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h5 className="text-xs font-bold text-slate-900">{notification.title}</h5>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notification.message}</p>
          <span className="text-[10px] text-slate-400 font-medium block mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.notificationId)}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 bg-white border border-indigo-200 rounded"
          >
            Mark Read
          </button>
        )}
        <button
          onClick={() => onDelete(notification.notificationId)}
          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
