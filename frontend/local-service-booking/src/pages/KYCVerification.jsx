import React, { useState } from 'react';
import { providerService } from '../services/api';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { ShieldCheck, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const KYCVerification = () => {
  const [docUrl, setDocUrl] = useState('https://serviceconnect.com/docs/id_national_passport.pdf');
  const [docType, setDocType] = useState('Passport / Driver License');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await providerService.uploadKyc({ docUrl });
      setMessage(res.data.message || 'KYC submitted successfully.');
    } catch (err) {
      alert('Failed to submit KYC.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">KYC Verification</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Submit government ID for background verification to unlock verified badge</p>
      </div>

      <div className="sc-card-3d p-6 space-y-6 transition-colors">
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 transition-colors">
          <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-400">Why Verification Matters</h4>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">Verified providers receive 3x more customer bookings and display the trusted green badge.</p>
          </div>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Document Type"
            type="select"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            options={['Passport / Driver License', 'National ID Card', 'Trade Registration Certificate']}
            required
          />

          <FormInput
            label="Identity Document URL / File Reference"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="https://..."
            required
          />

          {/* UI File Upload simulation dropzone */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20 rounded-xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-all">
            <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to upload document or drag & drop</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">PDF, PNG, JPG up to 10MB</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={loading} variant="primary" className="btn-glow">
              <FileText className="w-4 h-4" />
              Submit Documents for Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
