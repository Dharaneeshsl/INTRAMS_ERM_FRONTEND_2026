import React from 'react';

export default function RoleSelector({ roles, selected, onSelect }) {
  return (
    <div className="space-y-2">
      {roles.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelect(r.id)}
          className={`w-full text-left px-3 py-2 rounded-lg border transition ${selected === r.id ? 'border-cyan-400/50 bg-white text-black' : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
