import React from 'react';

export default function Input({ label, error, hint, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block text-[13px]">
      {label && <span className="mb-1 block font-bold text-[#E5E5E5] uppercase tracking-wide text-[11px]">{label}</span>}
      <input
        id={inputId}
        className={`w-full rounded-none border bg-[#000000] px-3.5 py-2.5 text-[#FFFFFF] placeholder:text-[#A0A0A0] outline-none transition-colors focus:border-[#00AEEF] ${
          error ? 'border-[#FF4D67]' : 'border-[#252525]'
        } ${className}`}
        {...props}
      />
      {hint && !error && <span className="mt-1 block text-[11px] text-[#A0A0A0]">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-[#FF4D67]">{error}</span>}
    </label>
  );
}