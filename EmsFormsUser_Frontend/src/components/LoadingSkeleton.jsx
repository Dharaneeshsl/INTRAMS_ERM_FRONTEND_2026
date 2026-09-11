import React from 'react';

function LoadingSkeleton({ count = 3, type = 'card' }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col gap-3"
        >
          <div className="h-6 bg-zinc-800 rounded-lg w-1/3" />
          <div className="h-4 bg-zinc-800/60 rounded-lg w-2/3" />
          <div className="h-4 bg-zinc-800/40 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
