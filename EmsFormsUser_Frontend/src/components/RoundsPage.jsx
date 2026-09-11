import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

function RoundsPage({ formData, setFormData, errors = {} }) {
  const addRound = () => {
    setFormData((prev) => ({
      ...prev,
      rounds: [
        ...(prev.rounds || []),
        { name: `Round ${(prev.rounds?.length || 0) + 1}`, description: '', rules: [''] },
      ],
    }));
  };

  const removeRound = (index) => {
    setFormData((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index),
    }));
  };

  const updateRound = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.rounds];
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
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <Layers className="w-6 h-6 text-sky-400" />
            Event Rounds & Rules
          </h2>
          <p className="text-sky-300/70 text-sm mt-1">Specify structure, timing, and evaluation criteria for each round</p>
        </div>
        <button
          type="button"
          onClick={addRound}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Round
        </button>
      </div>

      {errors.rounds && <p className="text-rose-400 text-xs mb-4">{errors.rounds}</p>}

      <div className="space-y-6">
        {formData.rounds?.map((round, rIdx) => (
          <div key={rIdx} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 relative">
            {formData.rounds.length > 1 && (
              <button
                type="button"
                onClick={() => removeRound(rIdx)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-sky-200/90 mb-1">Round Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Round 1: Preliminary Quiz"
                  value={round.name || ''}
                  onChange={(e) => updateRound(rIdx, 'name', e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-sky-200/90 mb-1">Round Description *</label>
                <input
                  type="text"
                  placeholder="Brief summary of round objectives"
                  value={round.description || ''}
                  onChange={(e) => updateRound(rIdx, 'description', e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-sky-200/90">Rules & Instructions</label>
                <button
                  type="button"
                  onClick={() => addRule(rIdx)}
                  className="text-xs text-sky-400 hover:underline font-bold"
                >
                  + Add Rule
                </button>
              </div>
              <div className="space-y-2">
                {round.rules?.map((rule, ruleIdx) => (
                  <div key={ruleIdx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={`Rule ${ruleIdx + 1}`}
                      value={rule}
                      onChange={(e) => updateRule(rIdx, ruleIdx, e.target.value)}
                      className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-slate-500"
                    />
                    {round.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(rIdx, ruleIdx)}
                        className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoundsPage;
