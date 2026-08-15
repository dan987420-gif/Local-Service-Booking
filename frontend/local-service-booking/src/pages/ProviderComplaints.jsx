import React, { useEffect, useState } from 'react';
import { complaintService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { AlertCircle, User, Calendar, ShieldAlert, Check, X } from 'lucide-react';

export const ProviderComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    setLoading(true);
    complaintService.getProviderComplaints()
      .then((res) => {
        setComplaints(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = (id, status) => {
    if (window.confirm(`Are you sure you want to change status to "${status}"?`)) {
      setLoading(true);
      complaintService.updateComplaintStatus(id, status)
        .then(() => {
          fetchComplaints();
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to update complaint status.');
          setLoading(false);
        });
    }
  };

  if (loading && complaints.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Complaints Desk</h1>
        <p className="text-xs text-slate-500 mt-1">Review disputes or issues raised by customers regarding your service deliveries.</p>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="Congratulations! No disputes are registered against your jobs."
        />
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.complaintId} className="sc-card p-5 border border-slate-200 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Complaint Reference #{complaint.complaintId}</span>
                  <h3 className="text-sm font-bold text-slate-950 mt-0.5">{complaint.subject}</h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                  complaint.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  complaint.status === 'InProgress' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                  complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {complaint.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-3.5 rounded-xl leading-relaxed">
                {complaint.description}
              </p>

              {/* Footer Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {complaint.customerName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="font-semibold text-slate-600">Booking Reference: #{complaint.bookingId}</span>
                </div>

                {/* Status Update Options for Provider */}
                {(complaint.status === 'Pending' || complaint.status === 'InProgress') && (
                  <div className="flex items-center gap-2">
                    {complaint.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(complaint.complaintId, 'InProgress')}
                        className="btn-outline text-[11px] py-1.5 px-3 flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(complaint.complaintId, 'Resolved')}
                      className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
