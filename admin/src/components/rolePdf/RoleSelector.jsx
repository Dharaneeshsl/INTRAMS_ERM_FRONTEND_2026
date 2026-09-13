import React from 'react';

export default function RoleSelector({ roles, selected, onSelect }) {
  return (
    <div className="space-y-2">
      {roles.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelect(r.id)}
          className={`w-full text-left px-4 py-2.5 rounded-none border transition-all text-xs font-bold uppercase tracking-wider ${
            selected === r.id
              ? 'border-[#00AEEF] bg-[#FFFFFF] text-[#000000] shadow-[0_0_15px_rgba(0,174,239,0.2)]'
              : 'border-[#252525] bg-[#000000] text-[#E5E5E5] hover:border-[#00AEEF] hover:bg-[#080808] hover:text-[#FFFFFF]'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

