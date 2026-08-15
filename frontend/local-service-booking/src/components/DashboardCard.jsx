import React from 'react';

export const DashboardCard = ({ title, value, subtitle, icon: Icon, color = 'indigo' }) => {
  const colorStyles = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
    teal: 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
    amber: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    red: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30',
  };

  return (
    <div className="sc-card-3d p-5 flex items-center justify-between transition-colors duration-200">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors duration-200 ${colorStyles[color] || colorStyles.indigo}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
