import React from 'react';

export default function Select({ label, children, className = '', ...props }) {
  return (
    <label className="block text-[13px]">
      {label && <span className="block mb-1 font-bold text-[#E5E5E5] uppercase tracking-wide text-[11px]">{label}</span>}
      <select
        className={`w-full px-3.5 py-2.5 rounded-none bg-[#000000] border border-[#252525] text-[#FFFFFF] outline-none transition-colors focus:border-[#00AEEF] ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

