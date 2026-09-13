import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AnimatedNetworkBackground from './AnimatedNetworkBackground';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }) {
  const { isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#000000] text-[#FFFFFF]">
        <AnimatedNetworkBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-pulse border border-[#00AEEF] bg-[#00AEEF]/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#FFFFFF]">
      <AnimatedNetworkBackground />

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-40 w-[260px] border-r border-[#252525] bg-[#050505]">
        <Sidebar />
      </aside>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-[#000000]/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-[#050505] shadow-2xl border-r border-[#252525]">
            <Sidebar
              onItemClick={() => setMobileMenuOpen(false)}
              onClose={() => setMobileMenuOpen(false)}
              isMobile
            />
          </div>
        </>
      )}

      {/* Main Page Container */}
      <div className="lg:pl-[260px] min-h-screen relative z-10 w-full">
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="pt-[60px]">
          <div className="mx-auto max-w-[1450px] px-4 py-5 sm:px-6 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
