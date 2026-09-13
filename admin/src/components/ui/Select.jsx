import React from 'react';

export default function Select({ label, children, className = '', ...props }) {
  return (
    <label className="block text-[13px]">
      {label && <span className="block mb-1.5 font-medium text-slate-300">{label}</span>}
      <select
        className={`w-full px-3 py-2.5 rounded-lg bg-[#05070b] border border-[var(--border)] text-white outline-none focus:border-primary ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
