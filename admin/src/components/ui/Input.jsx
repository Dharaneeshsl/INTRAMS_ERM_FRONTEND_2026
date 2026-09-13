import React from 'react';

export default function Input({ label, error, hint, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block text-[13px]">
      {label && <span className="mb-1.5 block font-medium text-slate-300">{label}</span>}
      <input
        id={inputId}
        className={`w-full rounded-lg border bg-[rgba(5,7,11,0.7)] px-3 py-2.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/70 ${
          error ? 'border-rose-500/50' : 'border-white/10'
        } ${className}`}
        {...props}
      />
      {hint && !error && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-rose-300">{error}</span>}
    </label>
  );
}