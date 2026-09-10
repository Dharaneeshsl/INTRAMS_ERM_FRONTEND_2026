import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

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
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Rounds & Rules</h2>
          <p className="text-gray-600 text-sm mt-1">Specify structure, timing, and evaluation criteria for each round</p>
        </div>
        <button
          type="button"
          onClick={addRound}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-xl text-sm font-semibold shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Round
        </button>
      </div>

      {errors.rounds && <p className="text-red-500 text-xs mb-4">{errors.rounds}</p>}

      <div className="space-y-6">
        {formData.rounds?.map((round, rIdx) => (
          <div key={rIdx} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 relative">
            {formData.rounds.length > 1 && (
              <button
                type="button"
                onClick={() => removeRound(rIdx)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Round Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Round 1: Quiz Elimination"
                  value={round.name || ''}
                  onChange={(e) => updateRound(rIdx, 'name', e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Round Description *</label>
                <input
                  type="text"
                  placeholder="Brief summary of round objectives"
                  value={round.description || ''}
                  onChange={(e) => updateRound(rIdx, 'description', e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Rules & Instructions</label>
                <button
                  type="button"
                  onClick={() => addRule(rIdx)}
                  className="text-xs text-accent-orange hover:underline font-semibold"
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
                      className="flex-1 p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
                    />
                    {round.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(rIdx, ruleIdx)}
                        className="p-2 text-gray-400 hover:text-red-500"
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
