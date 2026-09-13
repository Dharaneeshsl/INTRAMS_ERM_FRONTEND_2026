import React from 'react';

export default function EmptyState({ icon: Icon, title, message, action }) {
  const ref = React.useRef(null);
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="white-glass-box flex flex-col items-center justify-center text-center py-14 px-4"
    >
      {Icon && <Icon className="w-8 h-8 text-[#00AEEF] mb-3" />}
      <p className="text-[15px] font-bold uppercase tracking-wider text-[#FFFFFF] font-heading">{title}</p>
      {message && <p className="text-[13px] text-[#A0A0A0] mt-1 max-w-md">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

