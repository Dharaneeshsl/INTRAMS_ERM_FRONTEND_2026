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
    <header className="bg-black/90 backdrop-blur-md border-b border-zinc-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center shadow-md">
              EF
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">INTRAMS ERM Forms</h1>
              <p className="text-xs text-zinc-400">{user?.username || 'Club Portal'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/create-event')}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-sm font-semibold shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
                <button
                  onClick={() => navigate('/view-events')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">My Events</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-sm shadow-lg transition-all transform hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
