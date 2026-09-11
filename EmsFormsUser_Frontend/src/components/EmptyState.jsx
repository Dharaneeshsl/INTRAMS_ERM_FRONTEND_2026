import React from 'react';
import { PackageOpen } from 'lucide-react';

function EmptyState({ title = 'No Items Found', description = 'There are no records to display at this time.', actionLabel, onAction }) {
  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 mb-4 shadow-lg">
        <PackageOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-sm rounded-xl transition-all shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
