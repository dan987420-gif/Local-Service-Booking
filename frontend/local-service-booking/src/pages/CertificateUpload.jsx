import React, { useState } from 'react';
import { providerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Award, UploadCloud, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const CertificateUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate type and size (limit to PDF and image formats, < 5MB)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selected.type)) {
      setErrorMsg('Invalid file type. Please upload a PDF, JPG, or PNG document.');
      setFile(null);
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum allowed size is 5MB.');
      setFile(null);
      return;
    }

    setErrorMsg('');
    setFile(selected);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a certificate file first.');
      return;
    }

    setLoading(true);
    // Simulate uploading file to cloud storage, generating a mock URL:
    const mockUrl = `https://serviceconnect.com/docs/certificate_${user.userId}_${Date.now()}.pdf`;

    providerService.uploadCertificate({ certUrl: mockUrl })
      .then((res) => {
        setSuccessMsg(res.data.message || 'Trade certificate uploaded successfully.');
        setFile(null);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Upload failed. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Trade Certificates</h1>
        <p className="text-xs text-slate-500 mt-1">Upload business licenses or training certifications to verify your profile credentials.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex gap-2 items-start">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span>Success:</span>
            <p className="font-normal mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-800 text-xs font-semibold rounded-xl border border-red-200 flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span>Error:</span>
            <p className="font-normal mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="sc-card p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-700">
          <Award className="w-8 h-8 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-800">Certificate Verification Process</span>
            <p className="mt-0.5 text-slate-500 leading-relaxed">
              Verified credentials display a validation badge to customers. Uploaded documents are saved securely and are accessible only to system administrators.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer bg-slate-50/20 relative">
            <UploadCloud className="w-10 h-10 text-slate-400" />
            <div className="text-xs text-slate-600 font-semibold">
              {file ? (
                <span className="text-indigo-600">{file.name}</span>
              ) : (
                <span>Drag & drop files or <span className="text-indigo-600">browse local files</span></span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 5MB</p>
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || !file}
              className={`btn-primary text-xs py-2 px-4 flex items-center gap-1.5 ${
                (!file || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Uploading...' : 'Submit Certificate'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
