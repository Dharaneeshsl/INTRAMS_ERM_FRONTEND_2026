import React from 'react';

const styles = {
  draft: 'bg-slate-800/80 text-slate-300 border-slate-600/40',
  submitted: 'bg-blue-950/60 text-blue-300 border-blue-500/25',
  under_review: 'bg-amber-950/50 text-amber-300 border-amber-500/25',
  edit_requested: 'bg-amber-950/50 text-amber-300 border-amber-500/25',
  pending: 'bg-amber-950/50 text-amber-300 border-amber-500/25',
  approved: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/25',
  confirmed: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/25',
  active: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/25',
  allocated: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/25',
  fully_allocated: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/25',
  completed: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/25',
  rejected: 'bg-rose-950/50 text-rose-300 border-rose-500/25',
  returned: 'bg-rose-950/50 text-rose-300 border-rose-500/25',
  partial: 'bg-sky-950/50 text-sky-300 border-sky-500/25',
  partially_allocated: 'bg-sky-950/50 text-sky-300 border-sky-500/25',
  shortage: 'bg-rose-950/60 text-rose-200 border-rose-500/30',
};

function pretty(status) {
  if (!status) return 'Draft';
  return String(status).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Badge({ status, children }) {
  const key = String(status || 'draft').toLowerCase();
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${styles[key] || styles.draft}`}>
      {children || pretty(status)}
    </span>
  );
}
