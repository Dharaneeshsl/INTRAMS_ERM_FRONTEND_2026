import React from 'react';
import { PackageOpen, Compass } from 'lucide-react';

function EmptyState({ title = 'No Proposals Found', description = 'There are no active event records to display at this time.', actionLabel, onAction }) {
  return (
    <div className="w-full glass-card rounded-3xl p-10 sm:p-12 text-center flex flex-col items-center justify-center my-6 border border-sky-500/15 shadow-2xl">
      <div className="w-16 h-16 bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 border border-sky-500/30 rounded-2xl flex items-center justify-center text-sky-400 mb-4 shadow-lg shadow-sky-500/10">
        <PackageOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 font-heading">{title}</h3>
      <p className="text-sky-200/70 text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-500/25 transform hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
