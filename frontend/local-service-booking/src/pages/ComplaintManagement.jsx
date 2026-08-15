import React, { useEffect, useState } from 'react';
import { complaintService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { AlertCircle, User, Calendar, ShieldCheck, Check, X, ShieldAlert } from 'lucide-react';

export const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    setLoading(true);
    complaintService.getAllComplaints()
      .then((res) => {
        setComplaints(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = (id, status) => {
    if (window.confirm(`Are you sure you want to change this complaint's status to "${status}"?`)) {
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
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Complaints & Disputes</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review, monitor, and resolve customer grievances and provider disputes.</p>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints registered"
          description="Platform operations are running smoothly with no active complaints."
        />
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.complaintId} className="sc-card-3d p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-450 block">Complaint Reference #{complaint.complaintId}</span>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white mt-0.5">{complaint.subject}</h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider transition-colors ${
                  complaint.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/30' :
                  complaint.status === 'InProgress' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30' :
                  complaint.status === 'Resolved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border-emerald-200 dark:border-emerald-900/30' :
                  'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900/30'
                }`}>
                  {complaint.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-605 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 p-3.5 rounded-xl leading-relaxed transition-colors">
                {complaint.description}
              </p>

              {/* Details and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    Client: {complaint.customerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    Provider: {complaint.businessName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Booking: #{complaint.bookingId}</span>
                </div>

                {/* Status action buttons */}
                {(complaint.status === 'Pending' || complaint.status === 'InProgress') && (
                  <div className="flex items-center gap-2">
                    {complaint.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(complaint.complaintId, 'InProgress')}
                        className="btn-outline text-[11px] py-1.5 px-3 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        In Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(complaint.complaintId, 'Resolved')}
                      className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1 text-white"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(complaint.complaintId, 'Rejected')}
                      className="btn-danger text-[11px] py-1.5 px-3 flex items-center gap-1 text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject/Dismiss
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
