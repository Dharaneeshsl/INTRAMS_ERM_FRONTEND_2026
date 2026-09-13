import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  Warehouse,
  Gift,
  History,
  ShoppingCart,
  ShieldCheck,
  FlaskConical,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Item({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-all ${
          isActive
            ? 'border-cyan-400/50 bg-white text-black shadow-[0_0_20px_rgba(34,211,238,0.12)]'
            : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
      <span className="leading-none">{label}</span>
    </NavLink>
  );
}

export default function Sidebar({ onNavigate, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || localStorage.getItem('role') || 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const username = user?.username || 'admin';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="relative flex h-full flex-col bg-[rgba(11,17,28,0.96)]">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute right-3 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-white/6 bg-white/3 text-slate-200 hover:border-cyan-400/50"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="border-b border-white/10 px-5 py-6">
        <div className="font-heading text-[19px] font-semibold tracking-[0.12em] text-white">INTRAMS</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">ADMIN PORTAL</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Item to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={onNavigate} />

        <Section title="Operations">
          <Item to="/associations" icon={Users} label="Associations" onClick={onNavigate} />
          <Item to="/events" icon={Calendar} label="Events" onClick={onNavigate} />
          <Item to="/items" icon={Package} label="Items" onClick={onNavigate} />
          <Item to="/inventory" icon={Warehouse} label="Inventory" onClick={onNavigate} />
          <Item to="/grant-allocation" icon={Gift} label="Grant Allocation" onClick={onNavigate} />
          <Item to="/grant-history" icon={History} label="Grant History" onClick={onNavigate} />
          <Item to="/procurement" icon={ShoppingCart} label="Procurement" onClick={onNavigate} />
        </Section>

        <Section title="Administration">
          <Item to="/edit-access" icon={ShieldCheck} label="Edit Access" onClick={onNavigate} />
          <Item to="/lab-confirmation" icon={FlaskConical} label="Lab Confirmation" onClick={onNavigate} />
        </Section>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-[11px] font-semibold text-cyan-300">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-white">{username}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{role}</div>
          </div>
        </div>

        <Button variant="ghost" className="mt-3 w-full justify-start text-slate-200 hover:text-white" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
