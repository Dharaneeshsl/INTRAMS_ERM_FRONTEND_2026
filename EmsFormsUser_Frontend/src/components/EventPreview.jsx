import React from 'react';
import { Calendar, Layers, Package } from 'lucide-react';

function EventPreview({ formData }) {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white font-heading">{formData.name || 'Untitled Event'}</h2>
        {formData.tagline && <p className="text-sky-300/80 font-medium text-sm mt-1">{formData.tagline}</p>}
        <p className="text-slate-300 text-sm mt-3">{formData.about}</p>
      </div>

      {formData.form && (
        <div>
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-heading">
            <Calendar className="w-4 h-4 text-sky-400" />
            Schedule & Venue
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-2xl text-xs text-slate-300 border border-slate-800">
            <div><span className="font-semibold text-slate-400">Day:</span> {formData.form.day || 'N/A'}</div>
            <div><span className="font-semibold text-slate-400">Slot:</span> {formData.form.slot || 'N/A'}</div>
            <div><span className="font-semibold text-slate-400">Duration:</span> {formData.form.duration || 'N/A'}</div>
            <div><span className="font-semibold text-slate-400">Halls:</span> {formData.form.preferred_halls || 'N/A'}</div>
            <div><span className="font-semibold text-slate-400">Participant:</span> {formData.form.participant_type || 'Solo'}</div>
            <div><span className="font-semibold text-slate-400">Team Size:</span> {formData.form.team_min || 1}-{formData.form.team_max || 1}</div>
          </div>
        </div>
      )}

      {Array.isArray(formData.rounds) && formData.rounds.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-heading">
            <Layers className="w-4 h-4 text-sky-400" />
            Rounds ({formData.rounds.length})
          </h3>
          <div className="space-y-3">
            {formData.rounds.map((rd, idx) => (
              <div key={idx} className="bg-slate-950/70 p-4 rounded-2xl text-xs text-slate-300 border border-slate-800">
                <span className="font-bold text-white text-sm">{rd.name}</span>
                <p className="mt-1 text-slate-300">{rd.description}</p>
                {Array.isArray(rd.rules) && rd.rules.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-0.5 text-slate-400">
                    {rd.rules.map((rule, rIdx) => rule && <li key={rIdx}>{rule}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(formData.items) && formData.items.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-heading">
            <Package className="w-4 h-4 text-sky-400" />
            Items ({formData.items.length})
          </h3>
          <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800 text-xs">
            {formData.items.map((it, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b last:border-0 border-slate-800">
                <span className="font-medium text-white">{it.item_name}</span>
                <span className="text-slate-400">Qty: {it.quantity} | ₹{it.price_per_unit || 0}/unit</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPreview;
