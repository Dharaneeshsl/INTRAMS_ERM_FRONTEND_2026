import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

function Instructions({ onNext }) {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-400 border border-sky-500/20">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Event Proposal Guidelines</h2>
          <p className="text-sky-200/70 text-sm">Please read carefully before submitting your event proposal</p>
        </div>
      </div>

      <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-8">
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <p>Provide accurate event titles, taglines, and clear descriptive text for student participants and admin reviewers.</p>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <p>Specify venue and slot details carefully. Ensure preferred halls align with expected attendance and technical requirements.</p>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <p>Break down your event into clear rounds, describing rules, tie breaker guidelines, and timing for each round.</p>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <p>List all required physical equipment or stationery items so the procurement team can review and grant stock.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all transform hover:scale-[1.02]"
        >
          I Understand & Proceed &rarr;
        </button>
      </div>
    </div>
  );
}

export default Instructions;
