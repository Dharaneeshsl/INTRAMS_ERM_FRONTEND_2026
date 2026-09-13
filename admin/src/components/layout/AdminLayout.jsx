import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AnimatedNetworkBackground from './AnimatedNetworkBackground';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }) {
  const { isLoading } = useAuth();

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

      {/* Permanent Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 w-[260px] border-r border-[#252525] bg-[#050505]">
        <Sidebar />
      </aside>

      {/* Main Page Container */}
      <div className="pl-[260px] min-h-screen relative z-10">
        <Header />
        <main className="pt-[60px]">
          <div className="mx-auto max-w-[1450px] px-6 py-6 sm:px-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}


