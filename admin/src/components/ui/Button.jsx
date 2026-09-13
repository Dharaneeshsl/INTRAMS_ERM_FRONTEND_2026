import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-white text-black hover:bg-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]',
  secondary: 'bg-[rgba(15,23,42,0.9)] text-slate-100 border border-white/10 hover:border-cyan-400/40 hover:text-white',
  danger: 'bg-rose-950/80 text-rose-100 border border-rose-500/30 hover:bg-rose-900/80',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
  success: 'bg-emerald-950/70 text-emerald-100 border border-emerald-500/30 hover:bg-emerald-900/60',
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}