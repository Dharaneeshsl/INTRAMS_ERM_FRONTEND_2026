import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import { PlusCircle, List, Compass } from 'lucide-react';
import '../components_css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: '#020617' },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 0.8 },
      number: { density: { enable: true, area: 800 }, value: 70 },
      opacity: { value: 0.35 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (
    <div className="min-h-screen relative bg-[#020617] overflow-hidden flex flex-col ocean-gradient-bg">
      <Particles id="home-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      
      <NavBar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        {/* Horizon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 shadow-xl shadow-cyan-500/10">
          <Compass className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>INTRAMS • Sailing Into The Unknown</span>
        </div>

        <div className="text-center max-w-3xl mb-14">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-5 font-heading drop-shadow-lg">
            Navigate New <span className="horizon-glow">Possibilities</span>
          </h1>
          <p className="text-lg text-sky-200/80 leading-relaxed font-normal">
            Chart the course for your association's events. Submit proposals, structure round challenges, and manage logistics for INTRAMS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div
            onClick={() => navigate('/create-event')}
            className="group glass-card rounded-3xl p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-sky-500/25 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 font-heading">Chart New Proposal</h2>
              <p className="text-sky-200/70 text-sm leading-relaxed">
                Embark on creating an official event proposal covering hall logistics, slots, round mechanics, and item equipment.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sky-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              <span>Begin Proposal Wizard &rarr;</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/view-events')}
            className="group glass-card rounded-3xl p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                <List className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 font-heading">Explore Submitted Proposals</h2>
              <p className="text-sky-200/70 text-sm leading-relaxed">
                Review your association's active event proposals, monitor administrative edit approvals, and inspect full specs.
              </p>
            </div>
            <div className="mt-8 flex items-center text-cyan-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              <span>View All Proposals &rarr;</span>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-slate-500 text-xs tracking-wider">
          &copy; INTRAMS • Sailing Into The Unknown. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default HomePage;
