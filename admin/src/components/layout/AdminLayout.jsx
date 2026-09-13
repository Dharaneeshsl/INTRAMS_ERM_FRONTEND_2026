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
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
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
      if (event.key === 'Escape' && window.innerWidth < 1024) setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setSidebarOpen((value) => !value);
  
  const handleNavigate = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleClose = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

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
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnimatedNetworkBackground />

      {/* Desktop Static Sidebar (Always visible on lg screens) */}
      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-white/10 bg-[rgba(11,17,28,0.97)] shadow-[0_0_30px_rgba(2,132,199,0.12)]">
        <Sidebar onNavigate={() => {}} onClose={() => {}} isMobile={false} />
      </aside>

      {/* Mobile Drawer Sidebar (< 1024px) */}
      <aside
        className={`lg:hidden fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-white/10 bg-[rgba(11,17,28,0.97)] shadow-[0_0_30px_rgba(2,132,199,0.12)] transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={handleNavigate} onClose={handleClose} isMobile={true} />
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={handleClose}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Main Container - Padded 280px on desktop to accommodate static sidebar */}
      <div className="relative z-10 min-h-screen lg:pl-[280px]">
        <Header onOpenSidebar={toggleSidebar} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="pt-[68px]">
          <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-5 sm:px-5 lg:px-8 xl:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

