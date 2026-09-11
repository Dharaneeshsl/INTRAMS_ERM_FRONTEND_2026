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
    success: 'bg-zinc-900 border-emerald-500/50 text-emerald-300',
    error: 'bg-zinc-900 border-red-500/50 text-red-300',
    warning: 'bg-zinc-900 border-amber-500/50 text-amber-300',
    info: 'bg-zinc-900 border-zinc-700 text-white',
  }[type];

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-zinc-400 flex-shrink-0" />,
  }[type];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-lg transition-all animate-bounce-in ${styles}`}>
      {icons}
      <span className="text-sm font-medium pr-2">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      )}
    </div>
  );
}

export default Toast;
