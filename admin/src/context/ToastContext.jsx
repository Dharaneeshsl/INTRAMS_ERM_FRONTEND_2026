import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    addToast(message, type);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ showToast, addToast, removeToast }}>
      {children}
      {/* Toast Render Portal Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          let bgStyle = 'bg-[#0B1220]/95 border-[#1E293B] text-white';
          let IconComponent = Info;
          let iconColor = 'text-[#3B82F6]';

          if (toast.type === 'success') {
            bgStyle = 'bg-[#061C14]/95 border-[#10B981]/40 text-emerald-100 shadow-lg shadow-[#10B981]/10';
            IconComponent = CheckCircle2;
            iconColor = 'text-[#10B981]';
          } else if (toast.type === 'error') {
            bgStyle = 'bg-[#1C080A]/95 border-[#EF4444]/40 text-rose-100 shadow-lg shadow-[#EF4444]/10';
            IconComponent = XCircle;
            iconColor = 'text-[#EF4444]';
          } else if (toast.type === 'warning') {
            bgStyle = 'bg-[#1F1403]/95 border-[#F59E0B]/40 text-amber-100 shadow-lg shadow-[#F59E0B]/10';
            IconComponent = AlertTriangle;
            iconColor = 'text-[#F59E0B]';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${bgStyle}`}
            >
              <div className="flex items-start gap-3">
                <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors p-0.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if component is rendered outside provider
    return {
      showToast: (msg) => console.log('[Toast Fallback]', msg),
      addToast: (msg) => console.log('[Toast Fallback]', msg),
      removeToast: () => {},
    };
  }
  return context;
}
