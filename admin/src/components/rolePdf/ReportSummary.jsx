import React from 'react';

export default function ReportSummary({ role }) {
  // Backend metadata endpoint not available; show placeholder info.
  return (
    <div>
      <h3 className="font-heading font-semibold mb-3">Report summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-md">
          <div className="text-sm text-slate-400">Selected role</div>
          <div className="mt-1 font-medium text-white">{role}</div>
        </div>
        <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-md">
          <div className="text-sm text-slate-400">Members (estimate)</div>
          <div className="mt-1 font-medium text-white">—</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-400">No membership metadata endpoint available. Preview the PDF to verify roster content.</div>
    </div>
  );
}
