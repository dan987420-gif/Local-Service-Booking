import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-2">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
};
