import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Instructions({ onNext }) {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-900 font-sans">
      {/* Header Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-300 text-center shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-heading uppercase">
          Instructions to be Read
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">Before Filling the Form</p>
      </div>

      {/* IMPORTANT Box */}
      <div className="bg-black text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-extrabold tracking-wider uppercase text-slate-100 border-b border-slate-700 pb-2">
          IMPORTANT
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-xs leading-relaxed font-medium">
          <li>
            If <strong className="text-sky-300">TWO DIFFERENT events</strong> are to be conducted, then fill the above form for each event separately and TACTICALLY.
          </li>
          <li>
            If the same event continues on both days (i.e. Preliminary round on the first day and final round on the second day), then fill the needed requirements in the <strong className="text-sky-300">SAME FORM</strong>.
          </li>
        </ol>
      </div>

      {/* INSTRUCTIONS Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xl space-y-4">
        <h2 className="text-sm font-extrabold tracking-wider uppercase text-black border-b border-slate-200 pb-2">
          INSTRUCTIONS
        </h2>
        <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-800 leading-relaxed font-medium">
          <li>Not all the events and workshops submitted will be approved.</li>
          <li>Maximum of two events, one workshop, and one paper presentation can be proposed.</li>
          <li>Events and workshops should be innovative or focus on the trending/new technologies relating to the respective stream.</li>
          <li>Judges must be present throughout the duration of the event.</li>
          <li>Refreshment, prizes, memento, or any other form of prizes should be given by clubs/associations for the event winners.</li>
          <li>Memento for the external chief guest will be provided by the Students Union if mentioned in the forms submitted.</li>
          <li>Certificates for the winners, runners, convenors, and volunteers of each event will be provided by the students union.</li>
          <li>If any materials are required prior to the day of the event, please mention "Required in advance" near that material in the "From Same" column.</li>
          <li>Halls will be allotted based on availability.</li>
          <li>The projector will not be provided by the students union; use the projector available in the hall.</li>
          <li>Winner and runner details should be submitted within one hour from the end of the event.</li>
          <li>HDMI to VGA converter will not be provided.</li>
          <li>Take enough copies of the form for your reference.</li>
          <li>Further changes are not accepted once approved.</li>
          <li>Submit it to the point of contact allotted to your club/association.</li>
          <li>For more details, contact your respective point of contact.</li>
        </ol>
      </div>

      {/* Terms Agreement & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xl space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-slate-400 text-black focus:ring-black"
          />
          <span className="text-xs font-bold text-slate-900">I agree to the terms and conditions</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> BACK
          </button>
          <button
            onClick={onNext}
            disabled={!agreed}
            className="px-8 py-2.5 bg-black hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>PROCEED</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
