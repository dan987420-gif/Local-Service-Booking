import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = 'No data found', description = 'There are no items to display at this time.', icon: Icon = Inbox, actionLabel, onAction }) => {
  return (
    <div className="sc-card p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary text-xs mt-2">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
