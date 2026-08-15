import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (st) => {
    switch (st?.toLowerCase()) {
      case 'pending': return 'badge-pending';
      case 'accepted':
      case 'verified':
      case 'completed':
      case 'resolved': return 'badge-completed';
      case 'inprogress': return 'badge-inprogress';
      case 'cancelled':
      case 'rejected': return 'badge-cancelled';
      default: return 'bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold';
    }
  };

  return (
    <span className={getBadgeClass(status)}>
      {status || 'Unknown'}
    </span>
  );
};
