import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import { PlusCircle, List, CalendarCheck, ShieldCheck } from 'lucide-react';
import '../components_css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: '#000000' },
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
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 1 },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.4 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (
    <div className="min-h-screen relative bg-black overflow-hidden flex flex-col">
      <Particles id="home-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      
      <NavBar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Welcome to INTRAMS ERM Forms
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Create, manage, and submit official event proposals, round structures, and item requests seamlessly for your club.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div
            onClick={() => navigate('/create-event')}
            className="group bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-accent-orange cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-gradient-to-r from-accent-orange to-accent-yellow rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <PlusCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Event</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Step-by-step proposal wizard covering event details, hall preferences, slots, round descriptions, and equipment items.
              </p>
            </div>
            <div className="mt-6 flex items-center text-accent-orange font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Start Proposal &rarr;</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/view-events')}
            className="group bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-accent-orange cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <List className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">My Submitted Events</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                View your club's submitted event proposals, request edit access from admin, or view detailed specifications.
              </p>
            </div>
            <div className="mt-6 flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>View Events &rarr;</span>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-white/60 text-xs">
          &copy; INTRAMS ERM Forms. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default HomePage;
