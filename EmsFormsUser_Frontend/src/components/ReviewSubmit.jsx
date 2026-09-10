import React, { useState } from 'react';
import EventPreview from './EventPreview';
import { Send, Loader2 } from 'lucide-react';

function ReviewSubmit({ formData, onSubmit, isSubmitting, isEdit = false }) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please confirm that the submitted proposal information is accurate.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <EventPreview formData={formData} />

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-700">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 text-accent-orange border-gray-300 rounded focus:ring-accent-orange"
          />
          <span>
            I confirm that all details, round specifications, and item requests provided in this proposal are correct and approved by our club convenors.
          </span>
        </label>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!agreed || isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> {isEdit ? 'Update Event Proposal' : 'Submit Event Proposal'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewSubmit;
