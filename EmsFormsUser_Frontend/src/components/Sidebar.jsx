import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Edit3, FileCheck, LogOut, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/home', icon: LayoutDashboard, label: 'DASHBOARD' },
    { to: '/create-event', icon: PlusCircle, label: 'CREATE' },
    { to: '/edit', icon: Edit3, label: 'EDIT' },
    { to: '/lab-confirmation', icon: FileCheck, label: 'LAB CONFIRMATION FORMS' },
  ];

  return (
    <aside className="w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 text-slate-100 flex flex-col min-h-screen p-5 shadow-2xl z-30">
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-slate-800/80 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white mb-3 shadow-lg shadow-sky-500/20">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-lg font-extrabold text-white uppercase tracking-wider font-heading leading-tight">
          CONVENOR PORTAL
        </h2>
        <p className="text-xs text-sky-400/80 font-mono mt-1">{user?.username || 'Club Account'}</p>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 border-sky-400/40'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white hover:border-slate-700'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Logout Button */}
      <div className="pt-6 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-slate-900/90 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
