import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

function Instructions({ onNext }) {
  return (
    <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white/10 rounded-2xl text-white">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Event Form Guidelines</h2>
          <p className="text-zinc-400 text-sm">Please read carefully before submitting your event proposal</p>
        </div>
      </div>

      <div className="space-y-4 text-zinc-300 text-sm leading-relaxed mb-8">
        <div className="p-4 bg-zinc-800/60 rounded-2xl border border-zinc-700/50 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>Provide accurate event titles, taglines, and clear descriptive text for student participants and admin reviewers.</p>
        </div>

        <div className="p-4 bg-zinc-800/60 rounded-2xl border border-zinc-700/50 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>Specify venue and slot details carefully. Ensure preferred halls align with expected attendance and technical requirements.</p>
        </div>

        <div className="p-4 bg-zinc-800/60 rounded-2xl border border-zinc-700/50 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>Break down your event into clear rounds, describing rules, tie breaker guidelines, and timing for each round.</p>
        </div>

        <div className="p-4 bg-zinc-800/60 rounded-2xl border border-zinc-700/50 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>List all required physical equipment or stationery items so the procurement team can review and grant stock.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl shadow-xl transition-all transform hover:scale-[1.02]"
        >
          I Understand & Proceed &rarr;
        </button>
      </div>
    </div>
  );
}

export default Instructions;
