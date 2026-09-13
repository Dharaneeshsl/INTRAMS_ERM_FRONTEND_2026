import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, onClose, children, footer, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const modalRef = React.useRef(null);
  const handleMouseMove = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    modalRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    modalRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        onMouseMove={handleMouseMove}
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${wide ? 'max-w-5xl' : 'max-w-xl'} max-h-[90vh] overflow-y-auto white-glass-box shadow-[0_0_50px_rgba(0,0,0,0.9)]`}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#252525] bg-[#000000]">
          <h2 className="text-base font-bold uppercase tracking-wider text-[#FFFFFF] font-heading">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-none border border-[#252525] text-[#A0A0A0] hover:text-[#FFFFFF] hover:border-[#00AEEF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 text-[#E5E5E5]">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-[#252525] bg-[#000000] flex flex-col sm:flex-row sm:justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

