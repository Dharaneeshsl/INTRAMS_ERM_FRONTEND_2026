import React from 'react';
import { Calendar, Layers, Package } from 'lucide-react';

function EventPreview({ formData }) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'Untitled Event'}</h2>
        {formData.tagline && <p className="text-gray-600 font-medium text-sm mt-1">{formData.tagline}</p>}
        <p className="text-gray-700 text-sm mt-3">{formData.about}</p>
      </div>

      {formData.form && (
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent-orange" />
            Schedule & Venue
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl text-xs text-gray-700">
            <div><span className="font-semibold">Day:</span> {formData.form.day || 'N/A'}</div>
            <div><span className="font-semibold">Slot:</span> {formData.form.slot || 'N/A'}</div>
            <div><span className="font-semibold">Duration:</span> {formData.form.duration || 'N/A'}</div>
            <div><span className="font-semibold">Halls:</span> {formData.form.preferred_halls || 'N/A'}</div>
            <div><span className="font-semibold">Participant:</span> {formData.form.participant_type || 'Solo'}</div>
            <div><span className="font-semibold">Team Size:</span> {formData.form.team_min || 1}-{formData.form.team_max || 1}</div>
          </div>
        </div>
      )}

      {Array.isArray(formData.rounds) && formData.rounds.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-orange" />
            Rounds ({formData.rounds.length})
          </h3>
          <div className="space-y-3">
            {formData.rounds.map((rd, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-700 border border-gray-200">
                <span className="font-bold text-gray-900 text-sm">{rd.name}</span>
                <p className="mt-1 text-gray-600">{rd.description}</p>
                {Array.isArray(rd.rules) && rd.rules.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-0.5">
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
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-accent-orange" />
            Items ({formData.items.length})
          </h3>
          <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200 text-xs">
            {formData.items.map((it, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b last:border-0 border-gray-200">
                <span className="font-medium text-gray-900">{it.item_name}</span>
                <span className="text-gray-600">Qty: {it.quantity} | ₹{it.price_per_unit || 0}/unit</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPreview;
