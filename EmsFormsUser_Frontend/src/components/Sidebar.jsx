import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, Edit3, ShieldCheck, LogOut, X } from 'lucide-react';

function Sidebar({ mobile = false, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/home', label: 'DASHBOARD', icon: LayoutDashboard },
    { to: '/create-event', label: 'CREATE PROPOSAL', icon: PlusCircle },
    { to: '/edit', label: 'EDIT ACCESS', icon: Edit3 },
    { to: '/lab-confirmation', label: 'LAB CONFIRMATIONS', icon: ShieldCheck },
  ];

  return (
    <aside className="w-full h-full bg-black border-r border-zinc-800 text-white flex flex-col justify-between p-5 font-sans backdrop-blur-xl shadow-2xl overflow-y-auto">
      <div>
        {/* Header */}
        <div className="pb-4 mb-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white uppercase tracking-tight leading-tight font-heading">
              CONVENOR<br />
              <span className="text-sky-400">PORTAL</span>
            </h2>
            {user?.username && (
              <div className="mt-3 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-none inline-flex items-center gap-2 max-w-full overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <span className="text-xs font-mono font-bold text-sky-400 truncate uppercase tracking-wider">
                  {user.username}
                </span>
              </div>
            )}
          </div>
          {mobile && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-none bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={mobile ? onClose : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-3.5 border-2 text-xs font-extrabold tracking-wider transition-all uppercase rounded-none text-left ${
                    isActive
                      ? 'bg-white text-black border-sky-400 shadow-md shadow-sky-500/20 ring-1 ring-sky-400'
                      : 'bg-white text-black border-black hover:bg-zinc-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-black flex-shrink-0" />
                <span className="text-black font-extrabold">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout Button */}
      <div className="pt-4 mt-6 border-t border-zinc-800">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 bg-white hover:bg-rose-600 hover:text-white text-black border-2 border-black text-xs font-extrabold tracking-wider uppercase transition-all text-center rounded-none shadow-sm"
        >
          <LogOut className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
