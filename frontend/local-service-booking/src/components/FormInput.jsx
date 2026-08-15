import React from 'react';

export const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, required = false, error, disabled = false, options = null }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === 'select' && options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-400 transition-colors duration-200"
        >
          <option value="">Select option</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt} className="bg-white dark:bg-slate-800">
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={3}
          className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-400 transition-colors duration-200"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-400 transition-colors duration-200"
        />
      )}

      {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
    </div>
  );
};
