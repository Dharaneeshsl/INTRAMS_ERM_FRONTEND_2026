import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { AlertTriangle, Home, Compass } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: '#020617' },
    },
    fpsLimit: 120,
    particles: {
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { enable: true, speed: 0.8 },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.4 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (
    <div className="min-h-screen relative bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-6 text-center text-white">
      <Particles id="notfound-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-lg w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-sky-500/20 shadow-2xl flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 border border-sky-500/30 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-sky-500/10">
          <AlertTriangle className="w-10 h-10 text-sky-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-mono mb-4">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>COURSE DEVIATION • 404</span>
        </div>

        <h1 className="text-6xl font-extrabold tracking-tight mb-2 text-white font-heading">404</h1>
        <h2 className="text-2xl font-bold text-sky-200 mb-3 font-heading">Chart Uncharted Territory</h2>
        <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed font-normal">
          The requested page or proposal location does not exist in the INTRAMS system registry.
        </p>

        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:scale-[1.02]"
        >
          <Home className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;
