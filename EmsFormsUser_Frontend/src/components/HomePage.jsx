import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { userAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Eye, FileText, RefreshCcw, PlusCircle, Edit, Lock, Loader2 } from 'lucide-react';
import '../components_css/HomePage.css';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');

  const { user } = useAuth();
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
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 0.8 },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.3 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const fetchMyEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.getMyEvents();
      const data = response.data?.events || response.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load club events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDownloadPDF = async (eventId, eventName) => {
    setDownloadingId(eventId);
    try {
      const res = await userAPI.getEventPDF(eventId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${eventName || 'Event_Proposal'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF proposal.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="h-screen w-screen relative bg-black overflow-hidden flex flex-row font-sans">
      <Particles id="home-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      
      <Sidebar />

      <div className="flex-1 ml-64 h-screen overflow-y-auto flex flex-col min-w-0 z-10 p-6 sm:p-8 space-y-6">
        {/* Top Banner Box */}
        <div className="p-5 sm:p-6 bg-zinc-950 border border-zinc-800 text-white rounded-none shadow-md max-w-5xl w-full mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
            DASHBOARD
          </h1>
          <p className="text-zinc-400 text-xs font-medium mt-1">
            Centralized Event Management & Control Center
          </p>
        </div>

        {/* YOUR EVENTS Card */}
        <div className="p-5 sm:p-6 bg-zinc-950 border border-zinc-800 text-white rounded-none shadow-md space-y-4 max-w-5xl w-full mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-white tracking-wider uppercase">
              YOUR EVENTS
            </h2>
            <button
              onClick={fetchMyEvents}
              disabled={loading}
              className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-wider uppercase rounded-none transition-all disabled:opacity-50"
            >
              <span>REFRESH</span>
            </button>
          </div>

          <div className="border-b border-zinc-800 w-full my-2" />

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-none bg-zinc-900/40">
              <p className="text-zinc-400 text-xs font-medium mb-3">No event proposals submitted yet for {user?.username}.</p>
              <button
                onClick={() => navigate('/create-event')}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold rounded-none text-xs uppercase transition-all"
              >
                Create First Proposal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev._id}
                  className="p-4 bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-none"
                >
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-white">
                      {ev.name || 'Untitled Event'}
                    </h3>
                    {ev.tagline && <p className="text-zinc-400 text-[11px] font-medium">{ev.tagline}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/event/${ev._id}`, { state: ev })}
                      className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-wider uppercase rounded-none transition-all"
                    >
                      VIEW
                    </button>

                    <button
                      onClick={() => handleDownloadPDF(ev._id, ev.name)}
                      disabled={downloadingId === ev._id}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold tracking-wider uppercase rounded-none transition-all disabled:opacity-50"
                    >
                      {downloadingId === ev._id ? 'LOADING' : 'PDF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
