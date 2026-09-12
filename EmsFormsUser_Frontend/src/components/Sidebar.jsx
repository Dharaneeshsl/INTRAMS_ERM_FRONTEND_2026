import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/home', label: 'DASHBOARD' },
    { to: '/create-event', label: 'CREATE' },
    { to: '/edit', label: 'EDIT' },
    { to: '/lab-confirmation', label: 'LAB CONFIRMATION FORMS' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 h-screen flex-shrink-0 bg-zinc-950 border-r border-zinc-800 text-white flex flex-col justify-between p-4 z-40 font-sans">
      <div>
        {/* Header */}
        <div className="pb-4 mb-4 border-b border-zinc-800">
          <h2 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
            CONVENOR<br />PORTAL
          </h2>
          {(user?.username || user?.club_name) && (
            <div className="mt-2.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-none inline-flex items-center gap-2 max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-zinc-300 truncate uppercase tracking-wider">
                {user?.club_name || user?.username}
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-2.5">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block w-full px-4 py-3 border text-xs font-bold tracking-wider transition-all uppercase rounded-none text-left ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout Button */}
      <div className="pt-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-zinc-900 hover:bg-rose-950 hover:text-rose-300 text-zinc-300 border border-zinc-800 text-xs font-bold tracking-wider uppercase transition-all text-center rounded-none"
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

