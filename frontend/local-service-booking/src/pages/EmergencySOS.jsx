import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, PhoneCall, HeartPulse, User, ShieldCheck } from 'lucide-react';

export const EmergencySOS = () => {
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSosTrigger = () => {
    setLoading(true);
    setTimeout(() => {
      setTriggered(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Emergency Assistance (SOS)</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">Instant safety console for providers or clients during active job hours.</p>
      </div>

      {triggered ? (
        <div className="sc-card p-6 border-red-200 bg-red-50/50 space-y-4 text-center">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-red-950 uppercase tracking-wide">SOS Beacon Active</h3>
            <p className="text-xs text-red-800">
              An alert has been dispatched to ServiceConnect support operators.
            </p>
          </div>

          <div className="bg-white border border-red-200 p-4 rounded-xl text-xs text-slate-600 text-left space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Safety Action Checklist
            </div>
            <p>1. Ensure you are in a secure location. Lock doors or step outside if needed.</p>
            <p>2. Keep your mobile phone active. Our support agent will call you immediately.</p>
            <p>3. If there is immediate physical danger, dial <strong>911 / 112</strong> immediately.</p>
          </div>

          <button
            onClick={() => setTriggered(false)}
            className="btn-outline text-xs text-red-700 border-red-300 hover:bg-red-100 px-4 py-2 w-full mt-2"
          >
            Cancel Alert
          </button>
        </div>
      ) : (
        <div className="sc-card p-6 border-slate-200 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">
              Hold the button below for 1.5 seconds to trigger the SOS safety protocol.
            </p>
          </div>

          <button
            onClick={handleSosTrigger}
            disabled={loading}
            className={`w-36 h-36 rounded-full mx-auto flex flex-col items-center justify-center text-white font-extrabold uppercase shadow-lg shadow-red-200 border-8 border-red-500 transition-all duration-300 ${
              loading ? 'bg-red-700 animate-pulse border-red-300 scale-95' : 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95'
            }`}
          >
            <ShieldAlert className="w-8 h-8 mb-1" />
            <span className="text-sm tracking-wide">{loading ? 'Sending...' : 'Trigger SOS'}</span>
          </button>

          <div className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed border-t border-slate-100 pt-4 flex gap-2 justify-start text-left">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Demonstration Warning:</strong> This is a prototype safety UI for college project evaluation. It does NOT automatically contact real emergency response centers (911/112/100).
            </p>
          </div>
        </div>
      )}

      {/* Emergency Helpline Directory */}
      <div className="sc-card p-5 border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Help Contacts</h3>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              National Police Helpline
            </span>
            <span className="font-bold text-slate-900">100 / 911</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-600" />
              Medical Ambulance Services
            </span>
            <span className="font-bold text-slate-900">102 / 911</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              ServiceConnect Support Desk
            </span>
            <span className="font-bold text-slate-900">+1 (800) 555-SAFE</span>
          </div>
        </div>
      </div>

    </div>
  );
};
