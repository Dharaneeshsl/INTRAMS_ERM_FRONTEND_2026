import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

function Toast({ type = 'info', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-slate-900/95 border-emerald-500/50 text-emerald-200 shadow-emerald-500/10',
    error: 'bg-slate-900/95 border-rose-500/50 text-rose-200 shadow-rose-500/10',
    warning: 'bg-slate-900/95 border-amber-500/50 text-amber-200 shadow-amber-500/10',
    info: 'bg-slate-900/95 border-sky-500/50 text-sky-200 shadow-sky-500/10',
  }[type];

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />,
  }[type];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 ${styles}`}>
      {icons}
      <span className="text-sm font-medium pr-2">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      )}
    </div>
  );
}

export default Toast;
