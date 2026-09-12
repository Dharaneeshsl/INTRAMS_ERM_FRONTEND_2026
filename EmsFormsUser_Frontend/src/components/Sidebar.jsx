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
    <aside
      className={`${
        mobile ? 'w-full h-full' : 'fixed left-0 top-0 bottom-0 w-64 h-screen'
      } bg-white border-r-2 border-black text-black flex flex-col justify-between p-5 z-40 font-sans backdrop-blur-xl shadow-xl`}
    >
      <div>
        {/* Header */}
        <div className="pb-4 mb-4 border-b-2 border-black flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black uppercase tracking-tight leading-tight font-heading">
              CONVENOR<br />PORTAL
            </h2>
            {(user?.username || user?.club_name) && (
              <div className="mt-3 px-2.5 py-1 bg-zinc-100 border border-black rounded-none inline-flex items-center gap-2 max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-black truncate uppercase tracking-wider">
                  {user?.club_name || user?.username}
                </span>
              </div>
            )}
          </div>
          {mobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-none bg-zinc-100 text-black hover:bg-black hover:text-white border border-black transition-colors"
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
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-black border-black hover:bg-zinc-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout Button */}
      <div className="pt-4 border-t-2 border-black">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 bg-white hover:bg-rose-600 hover:text-white text-black border-2 border-black text-xs font-extrabold tracking-wider uppercase transition-all text-center rounded-none shadow-sm"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

