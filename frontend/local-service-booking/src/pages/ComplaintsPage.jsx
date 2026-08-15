import React, { useEffect, useState } from 'react';
import { complaintService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { AlertCircle, Calendar, ShieldCheck } from 'lucide-react';

export const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getCustomerComplaints()
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
        <p className="text-xs text-slate-500">Track resolution status of your reported booking issues</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No Active Complaints"
          description="You currently have no open or resolved complaints."
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.complaintId} className="sc-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">#CMP-{c.complaintId}</span>
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-slate-500 font-medium">Booking #BK-{c.bookingId}</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900">{c.subject}</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {c.description}
              </p>

              <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Provider: {c.businessName}</span>
                {c.updatedAt && <span>Last Updated: {new Date(c.updatedAt).toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
