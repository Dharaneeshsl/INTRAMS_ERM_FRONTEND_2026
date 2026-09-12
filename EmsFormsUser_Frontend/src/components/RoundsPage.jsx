import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

function RoundsPage({ formData, setFormData, errors = {} }) {
  const addRound = () => {
    setFormData((prev) => {
      const currentRounds = prev.rounds || [];
      const newRound = {
        name: `Round ${currentRounds.length + 1}`,
        description: '',
        rules: [''],
        num_participants: 50,
        has_tie_breaker: false,
      };
      return {
        ...prev,
        rounds: [...currentRounds, newRound],
        form: {
          ...prev.form,
          num_rounds: currentRounds.length + 1,
        },
      };
    });
  };

  const removeRound = (index) => {
    setFormData((prev) => {
      const updated = prev.rounds.filter((_, i) => i !== index);
      return {
        ...prev,
        rounds: updated,
        form: {
          ...prev.form,
          num_rounds: updated.length,
        },
      };
    });
  };

  const updateRound = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.rounds || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, rounds: updated };
    });
  };

  const addRule = (roundIdx) => {
    setFormData((prev) => {
      const updated = [...prev.rounds];
      updated[roundIdx].rules = [...(updated[roundIdx].rules || []), ''];
      return { ...prev, rounds: updated };
    });
  };

  const updateRule = (roundIdx, ruleIdx, value) => {
    setFormData((prev) => {
      const updated = [...prev.rounds];
      const rules = [...updated[roundIdx].rules];
      rules[ruleIdx] = value;
      updated[roundIdx].rules = rules;
      return { ...prev, rounds: updated };
    });
  };

  const removeRule = (roundIdx, ruleIdx) => {
    setFormData((prev) => {
      const updated = [...prev.rounds];
      updated[roundIdx].rules = updated[roundIdx].rules.filter((_, i) => i !== ruleIdx);
      return { ...prev, rounds: updated };
    });
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans max-w-4xl mx-auto">
      {/* Round Details Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-black font-heading uppercase flex items-center gap-2">
            <Layers className="w-6 h-6 text-black" /> Round Details
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Specify structure, rules, participant caps, and tie-breakers for each round
          </p>
        </div>
        <button
          type="button"
          onClick={addRound}
          className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> ADD ROUND
        </button>
      </div>

      {errors.rounds && <p className="text-rose-600 text-xs font-bold px-2">{errors.rounds}</p>}

      <div className="space-y-6">
        {formData.rounds?.map((round, rIdx) => (
          <div key={rIdx} className="bg-white border border-slate-300 rounded-2xl p-6 relative shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-black uppercase tracking-wider">
                Round {rIdx + 1}
              </h3>
              {formData.rounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRound(rIdx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Round Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Preliminary Round, Semi-Finals, Grand Finale"
                value={round.name || ''}
                onChange={(e) => updateRound(rIdx, 'name', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-slate-900 text-sm placeholder-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Round Description <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g., An initial screening round where participants present their ideas..."
                value={round.description || ''}
                onChange={(e) => updateRound(rIdx, 'description', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-slate-900 text-sm placeholder-slate-400 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Round Rules <span className="text-rose-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => addRule(rIdx)}
                  className="text-xs text-black font-extrabold hover:underline"
                >
                  + Add Rule
                </button>
              </div>
              <div className="space-y-2">
                {round.rules?.map((rule, ruleIdx) => (
                  <div key={ruleIdx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g., 1. Time limit: 5 minutes per team 2. No external assistance allowed"
                      value={rule}
                      onChange={(e) => updateRule(rIdx, ruleIdx, e.target.value)}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none text-slate-900 placeholder-slate-400 font-medium"
                    />
                    {round.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(rIdx, ruleIdx)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Number of Participants <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 50"
                  value={round.num_participants || 50}
                  onChange={(e) => updateRound(rIdx, 'num_participants', parseInt(e.target.value) || 1)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-slate-900 text-sm font-medium"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-300 rounded-xl w-full">
                  <input
                    type="checkbox"
                    checked={round.has_tie_breaker || false}
                    onChange={(e) => updateRound(rIdx, 'has_tie_breaker', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 text-black focus:ring-black"
                  />
                  <span className="text-xs font-bold text-slate-900">This round has a Tie-Breaker</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoundsPage;
