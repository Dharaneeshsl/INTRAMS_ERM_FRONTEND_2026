import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NavBar from './NavBar';

export default function UserLayout({ children, showSidebar = true }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-slate-100 ocean-gradient-bg">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Mobile Slide-Over Menu */}
      {showSidebar && mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]">
            <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
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
