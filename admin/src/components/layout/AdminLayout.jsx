import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AnimatedNetworkBackground from './AnimatedNetworkBackground';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }) {
  const { isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // keep sidebar closed by default on resize; user controls open/close
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setSidebarOpen((value) => !value);

  const handleNavigate = () => {
    // Always close overlay sidebar after navigation
    setSidebarOpen(false);
  };

  const handleClose = () => setSidebarOpen(false);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AnimatedNetworkBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-pulse rounded-full border border-cyan-400/40 bg-cyan-500/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <AnimatedNetworkBackground />

      {/* Overlay Sidebar (works on all screen sizes) */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-white/10 bg-[rgba(11,17,28,0.97)] shadow-[0_0_30px_rgba(2,132,199,0.12)] transition-transform duration-300 ease-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar onNavigate={handleNavigate} onClose={handleClose} />
      </aside>

      {/* Backdrop when sidebar is open */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={handleClose}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[1px]"
        />
      )}

      {/* Main Container - full width when sidebar closed */}
      <div className="relative z-10 min-h-screen">
        <Header onOpenSidebar={toggleSidebar} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="pt-[68px]">
          <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-5 sm:px-5 lg:px-8 xl:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
