import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NavBar from './NavBar';

export default function UserLayout({ children, showSidebar = true }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-slate-100 ocean-gradient-bg flex flex-col lg:flex-row relative">
      {/* Desktop Fixed Left Sidebar */}
      {showSidebar && (
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-40 w-64 border-r border-zinc-800 bg-black">
          <Sidebar />
        </aside>
      )}

      {/* Mobile Slide-Over Sidebar Drawer */}
      {showSidebar && mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-black shadow-2xl">
            <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 w-full min-h-screen ${showSidebar ? 'lg:pl-64' : ''}`}>
        <NavBar
          showSidebarToggle={showSidebar}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
