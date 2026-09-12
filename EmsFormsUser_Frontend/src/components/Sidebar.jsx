import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, Edit3, ShieldCheck, LogOut, X } from 'lucide-react';

function Sidebar({ mobile = false, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
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
    <aside className={`${mobile ? 'w-full h-full' : 'fixed left-0 top-0 bottom-0 w-64 h-screen'} bg-black border-r border-slate-800 text-white flex flex-col justify-between p-5 z-40 font-sans shadow-2xl backdrop-blur-xl`}>
      <div>
        {/* Header */}
        <div className="pb-5 mb-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white uppercase tracking-tight leading-tight font-heading">
              CONVENOR<br /><span className="text-sky-400">PORTAL</span>
            </h2>
            {(user?.username || user?.club_name) && (
              <div className="mt-2.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full inline-flex items-center gap-2 max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <span className="text-xs font-mono font-bold text-sky-400 truncate uppercase tracking-wider">
                  {user?.club_name || user?.username}
                </span>
              </div>
            )}
          </div>
          {mobile && (
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={mobile ? onClose : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-3.5 border text-xs font-extrabold tracking-wider transition-all uppercase rounded-2xl text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-400/40 shadow-lg shadow-sky-500/25'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout Button */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 bg-slate-950 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-800 text-xs font-extrabold tracking-wider uppercase transition-all text-center rounded-2xl shadow-md"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
