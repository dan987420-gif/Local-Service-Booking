import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ShieldCheck, Check, X, FileText, ExternalLink, Calendar, User } from 'lucide-react';

export const KYCManagement = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const fetchPendingKyc = () => {
    setLoading(true);
    adminService.getPendingKyc()
      .then((res) => {
        setProviders(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleVerify = (providerId, status) => {
    if (window.confirm(`Are you sure you want to set status to "${status}" for this provider profile?`)) {
      setLoading(true);
      adminService.verifyKyc(providerId, status)
        .then(() => {
          fetchPendingKyc();
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to update verification status.');
          setLoading(false);
        });
    }
  };

  if (loading && providers.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Provider Verification (KYC)</h1>
        <p className="text-xs text-slate-500 mt-1">Review trade licenses, certifications, and identities submitted by providers to verify profiles.</p>
      </div>

      {providers.length === 0 ? (
        <EmptyState
          title="No pending KYC requests"
          description="All provider profiles are currently reviewed and processed."
        />
      ) : (
        <div className="space-y-4">
          {providers.map((p) => (
            <div key={p.providerId} className="sc-card p-5 border border-slate-200 shadow-sm space-y-4">
              
              {/* Header: Provider Name and Category */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                    {p.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">{p.fullName}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.email} • {p.phone || 'No phone'}</p>
                  </div>
                </div>

                <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded border border-teal-100 uppercase tracking-wide">
                  {p.category}
                </span>
              </div>

              {/* Provider Profile summary info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <div>
                  <span className="font-bold text-slate-500 block mb-0.5">Business Name</span>
                  <p className="font-semibold text-slate-800">{p.businessName}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block mb-0.5">Rate / Experience</span>
                  <p className="font-semibold text-slate-800">${p.hourlyRate}/hr • {p.experienceYears} Years Exp</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block mb-0.5">Location</span>
                  <p className="font-semibold text-slate-800">{p.city}, {p.state} {p.zipCode}</p>
                </div>
                {p.bio && (
                  <div className="sm:col-span-2 md:col-span-3 border-t border-slate-200/50 pt-2 mt-2">
                    <span className="font-bold text-slate-500 block mb-0.5">Profile Bio</span>
                    <p className="text-slate-600 italic leading-relaxed">{p.bio}</p>
                  </div>
                )}
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-950 block">Documents for Review</span>
                
                <div className="flex flex-wrap gap-3">
                  {p.identityDocUrl ? (
                    <a
                      href={p.identityDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline py-1.5 px-3 flex items-center gap-1.5 hover:bg-slate-100"
                    >
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Government ID card
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No identity doc uploaded</span>
                  )}

                  {p.certificateUrl ? (
                    <a
                      href={p.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline py-1.5 px-3 flex items-center gap-1.5 hover:bg-slate-100"
                    >
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Trade Certificate
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No certificate uploaded</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => handleVerify(p.providerId, 'Rejected')}
                  className="btn-danger py-1.5 px-3.5 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Reject Request
                </button>
                <button
                  onClick={() => handleVerify(p.providerId, 'Verified')}
                  className="btn-secondary py-1.5 px-3.5 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Verify Account
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
