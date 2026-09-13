import React from 'react';

export function Table({ children, className = '' }) {
  const containerRef = React.useRef(null);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    containerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`white-glass-box overflow-x-auto ${className}`}
    >
      <table className="w-full text-left text-[13px] text-[#E5E5E5] min-w-[640px] border-collapse">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="sticky top-0 bg-[#080808] text-[11px] font-bold uppercase tracking-wider text-[#00AEEF] border-b border-[#252525]">
      {children}
    </thead>
  );
}

export function Th({ children, className = '', numeric = false }) {
  return <th className={`px-4 py-3.5 font-bold border-r border-[#252525] last:border-r-0 ${numeric ? 'text-right' : ''} ${className}`}>{children}</th>;
}

export function Td({ children, className = '', numeric = false }) {
  return <td className={`px-4 py-3 align-middle border-b border-[#252525] border-r border-[#252525] last:border-r-0 ${numeric ? 'text-right font-mono tabular-nums' : ''} ${className}`}>{children}</td>;
}

export function Tr({ children, className = '', onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[#252525] bg-[#000000] hover:bg-[#080808] transition-colors ${onClick ? 'cursor-pointer hover:border-[#00AEEF]' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

