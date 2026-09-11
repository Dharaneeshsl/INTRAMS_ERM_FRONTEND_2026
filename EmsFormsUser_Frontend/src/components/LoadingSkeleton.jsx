import React from 'react';

function LoadingSkeleton({ count = 3, type = 'card' }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-3.5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-800/80 rounded-lg w-1/3" />
            <div className="h-5 bg-sky-950/60 border border-sky-500/20 rounded-full w-20" />
          </div>
          <div className="h-4 bg-slate-800/60 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-800/40 rounded-lg w-1/2" />
          <div className="pt-2 flex gap-3">
            <div className="h-9 bg-slate-800/60 rounded-xl w-28" />
            <div className="h-9 bg-slate-800/40 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
