import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-5xl font-black tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold text-zinc-300 mb-4">Page Not Found</h2>
      <p className="text-zinc-400 max-w-md mb-8 text-sm leading-relaxed">
        The page or event resource you are trying to access does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/home')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm shadow-xl transition-all"
      >
        <Home className="w-4 h-4" /> Return to Dashboard
      </button>
    </div>
  );
}

export default NotFound;
