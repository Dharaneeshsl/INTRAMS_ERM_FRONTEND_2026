import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LogIn, PlusCircle, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <span className="tracking-wider">INT</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white leading-tight font-heading">INTRAMS ERM Forms</h1>
                <span className="hidden md:inline-block text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                  Horizon 2026
                </span>
              </div>
              <p className="text-xs text-sky-300/70">{user?.username || 'Sailing Into The Unknown'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/create-event')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:scale-[1.02]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Proposal</span>
                </button>
                <button
                  onClick={() => navigate('/view-events')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sky-200 rounded-xl text-sm font-medium transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">My Proposals</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:scale-[1.02]"
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
