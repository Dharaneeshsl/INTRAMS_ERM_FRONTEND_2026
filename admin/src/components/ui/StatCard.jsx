import React, { useRef } from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, onClick }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    btnRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    btnRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`white-glass-box text-left p-4 w-full transition-all duration-300 ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#A0A0A0] font-heading">{title}</p>
        {Icon && (
          <span className="text-[#00AEEF]">
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-[28px] leading-none font-bold text-[#FFFFFF] tabular-nums font-heading">
        {value ?? 0}
      </p>
      {subtext && <p className="mt-2 text-[11px] text-[#A0A0A0] font-bold uppercase tracking-wide">{subtext}</p>}
    </button>
  );
}


