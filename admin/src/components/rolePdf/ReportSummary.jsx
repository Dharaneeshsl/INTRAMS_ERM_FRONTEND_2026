import React from 'react';

export default function ReportSummary({ role, memberCount = 0 }) {
  return (
    <div className="space-y-4">
      <h3 className="font-heading font-bold text-[#FFFFFF] text-sm uppercase tracking-wider">REPORT SUMMARY</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-[#000000] border border-[#252525]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#A0A0A0]">SELECTED ROLE</div>
          <div className="mt-1 text-base font-bold text-[#00AEEF] uppercase">{role}</div>
        </div>
        <div className="p-4 bg-[#000000] border border-[#252525]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#A0A0A0]">FORMAT SPECIFICATION</div>
          <div className="mt-1 text-xs font-bold text-[#00D084] uppercase">INTRAMS OFFICIAL LANDSCAPE REPORT</div>
        </div>
      </div>

      <p className="text-xs text-[#A0A0A0] leading-relaxed uppercase">
        Generated reports group personnel by association header banners (#1F4E79) with structured table data (#D9E1F2 column headers and black grid borders).
      </p>
    </div>
  );
}

