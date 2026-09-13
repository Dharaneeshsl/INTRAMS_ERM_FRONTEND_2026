import React from 'react';

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      {Icon && <Icon className="w-8 h-8 text-slate-600 mb-3" />}
      <p className="text-[15px] font-heading font-semibold text-white">{title}</p>
      {message && <p className="text-[13px] text-slate-500 mt-1 max-w-md">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
