import React from 'react';

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-none bg-[#0D0D0D] border border-[#252525] ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      ))}
    </div>
  );
}

export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="py-16">
      <TableSkeleton />
      <p className="sr-only">{label}</p>
    </div>
  );
}

