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
    <aside className="w-64 bg-white/95 backdrop-blur-lg border-r border-gray-200 min-h-screen p-4 flex flex-col gap-2">
      <div className="px-3 py-4 mb-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h2>
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
                  ? 'bg-gradient-to-r from-accent-orange to-accent-yellow text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
