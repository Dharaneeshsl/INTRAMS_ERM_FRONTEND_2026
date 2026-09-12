import React from 'react';
import Sidebar from './Sidebar';
import NavBar from './NavBar';

export default function UserLayout({ children, showSidebar = true }) {
  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 ocean-gradient-bg">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <NavBar showSidebarToggle={!showSidebar} />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
