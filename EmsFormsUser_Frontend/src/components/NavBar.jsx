import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LogIn, PlusCircle, List, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NavBar({ showSidebarToggle = false, onToggleMobileMenu, mobileMenuOpen = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {showSidebarToggle && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/home')}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform text-xs sm:text-sm">
                <span>INT</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-white leading-tight font-heading text-sm sm:text-base">INTRAMS ERM Forms</h1>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold">
                    Horizon 2026
                  </span>
                </div>
                <p className="text-[11px] text-sky-400 font-mono hidden xs:block">{user?.username || user?.club_name || 'Sailing Into The Unknown'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/create-event')}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:scale-[1.02]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Proposal</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <button
                  onClick={() => navigate('/view-events')}
                  className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-300 rounded-2xl text-xs sm:text-sm font-bold transition-colors"
                >
                  <List className="w-4 h-4 text-sky-400" />
                  <span className="hidden md:inline">My Proposals</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-2xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
