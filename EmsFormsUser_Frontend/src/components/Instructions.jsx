import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

function Instructions({ onNext }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-accent-orange/10 rounded-2xl text-accent-orange">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Form Guidelines</h2>
          <p className="text-gray-600 text-sm">Please read carefully before submitting your event proposal</p>
        </div>
      </div>

      <div className="space-y-4 text-gray-700 text-sm leading-relaxed mb-8">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
          <p>Provide accurate event titles, taglines, and clear descriptive text for student participants and admin reviewers.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
          <p>Specify venue and slot details carefully. Ensure preferred halls align with expected attendance and technical requirements.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
          <p>Break down your event into clear rounds, describing rules, tie breaker guidelines, and timing for each round.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
          <p>List all required physical equipment or stationery items so the procurement team can review and grant stock.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3.5 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          I Understand & Proceed &rarr;
        </button>
      </div>
    </div>
  );
}

export default Instructions;
