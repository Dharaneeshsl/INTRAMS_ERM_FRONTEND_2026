import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-accent-orange to-accent-yellow px-6 py-4 text-white shadow-md flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">INTRAMS ERM Forms Admin</h1>
        <p className="text-xs opacity-90">{user?.username || 'Admin Portal'}</p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </header>
  );
}

export default Navbar;
