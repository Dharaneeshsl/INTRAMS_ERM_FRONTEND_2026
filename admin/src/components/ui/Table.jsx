import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-[13px] text-slate-300 min-w-[640px]">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="sticky top-0 bg-[#0a1018] text-[11px] uppercase tracking-wide text-slate-500 border-b border-[var(--border)]">
      {children}
    </thead>
  );
}

export function Th({ children, className = '', numeric = false }) {
  return <th className={`px-4 py-3 font-semibold ${numeric ? 'text-right' : ''} ${className}`}>{children}</th>;
}

export function Td({ children, className = '', numeric = false }) {
  return <td className={`px-4 py-3 align-middle ${numeric ? 'text-right font-mono tabular-nums' : ''} ${className}`}>{children}</td>;
}

export function Tr({ children, className = '', onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[var(--border)] hover:bg-white/[0.03] ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}
