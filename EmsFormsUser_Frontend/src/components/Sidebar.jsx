import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, PlusCircle, List } from 'lucide-react';

function Sidebar() {
  const navItems = [
    { to: '/home', icon: Home, label: 'Dashboard' },
    { to: '/view-events', icon: List, label: 'My Events' },
    { to: '/create-event', icon: PlusCircle, label: 'Create Event' },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 min-h-screen p-4 flex flex-col gap-2">
      <div className="px-3 py-4 mb-2">
        <h2 className="text-xs font-semibold text-sky-400/70 uppercase tracking-widest font-mono">Navigation</h2>
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 border border-sky-400/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-sky-200'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}

export default Sidebar;
