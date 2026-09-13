import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 w-full ${
        onClick ? 'hover:border-white/20 transition-colors' : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        {Icon && (
          <span className="text-slate-500">
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-[28px] leading-none font-heading font-semibold text-white tabular-nums">
        {value ?? 0}
      </p>
      {subtext && <p className="mt-2 text-[12px] text-slate-500">{subtext}</p>}
    </button>
  );
}
