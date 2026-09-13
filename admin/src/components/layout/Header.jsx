import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api';

const labels = {
  connected: { text: 'Backend Connected', dot: 'bg-emerald-400', tone: 'text-emerald-300' },
  offline: { text: 'Offline', dot: 'bg-rose-400', tone: 'text-rose-300' },
  connecting: { text: 'Connecting', dot: 'bg-amber-400', tone: 'text-amber-300' },
};

export default function Header({ onOpenSidebar, onToggleSidebar, sidebarOpen }) {
  const { user } = useAuth();
  const [health, setHealth] = useState('connecting');

  useEffect(() => {
    let mounted = true;
    const ping = async () => {
      try {
        await adminAPI.checkHealth();
        if (mounted) setHealth('connected');
      } catch {
        if (mounted) setHealth('offline');
      }
    };

    ping();
    const interval = setInterval(ping, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const status = labels[health] || labels.connecting;

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-[68px] border-b border-white/10 bg-[rgba(5,7,11,0.82)] backdrop-blur-md lg:left-[280px]">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/50 hover:text-white lg:hidden"
            onClick={onToggleSidebar || onOpenSidebar}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="min-w-0 truncate font-heading text-[14px] font-semibold tracking-[0.22em] text-white sm:text-[15px]">
            INTRAMS ERM Admin
          </div>
          {user?.username && (
            <span className="hidden min-w-0 truncate text-[12px] text-slate-400 sm:inline-block">{user.username}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-slate-200">
          <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          <span className={status.tone}>{status.text}</span>
        </div>
      </div>
    </header>
  );
}

