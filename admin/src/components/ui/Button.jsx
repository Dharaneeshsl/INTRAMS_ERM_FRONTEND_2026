import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[#FFFFFF] text-[#000000] border border-[#FFFFFF] hover:bg-[#E5E5E5] hover:border-[#00AEEF]',
  secondary: 'bg-[#050505] text-[#E5E5E5] border border-[#252525] hover:border-[#00AEEF] hover:text-[#FFFFFF]',
  danger: 'bg-[#050505] text-[#FF4D67] border border-[#FF4D67]/40 hover:bg-[#FF4D67]/10',
  ghost: 'bg-transparent text-[#E5E5E5] border border-transparent hover:border-[#252525] hover:text-[#FFFFFF]',
  success: 'bg-[#050505] text-[#00D084] border border-[#00D084]/40 hover:bg-[#00D084]/10',
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
      className={`inline-flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}