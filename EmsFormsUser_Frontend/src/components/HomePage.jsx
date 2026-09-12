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
    <div className="min-h-screen relative bg-[#020617] overflow-hidden flex flex-row ocean-gradient-bg">
      <Particles id="home-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <NavBar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 overflow-y-auto">
          {/* Top Banner Box */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-wide uppercase">
              DASHBOARD
            </h1>
            <p className="text-sky-300/70 text-sm sm:text-base mt-2 font-medium">
              Centralized Event Management & Control Center • {user?.username || 'Club Account'}
            </p>
          </div>

          {/* YOUR EVENTS Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-white font-heading tracking-wider uppercase">
                YOUR EVENTS
              </h2>
              <button
                onClick={fetchMyEvents}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md disabled:opacity-50"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>REFRESH</span>
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm text-center">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              </div>
            ) : events.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                <p className="text-slate-400 font-semibold mb-4">No event proposals submitted yet for {user?.username}.</p>
                <button
                  onClick={() => navigate('/create-event')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create First Proposal</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-500/40 transition-all shadow-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white font-heading">
                          {ev.name || 'Untitled Event'}
                        </h3>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono font-bold uppercase">
                          {ev.status || 'submitted'}
                        </span>
                      </div>
                      {ev.tagline && <p className="text-sky-300/70 text-xs">{ev.tagline}</p>}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => navigate(`/event/${ev._id}`, { state: ev })}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>VIEW</span>
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(ev._id, ev.name)}
                        disabled={downloadingId === ev._id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {downloadingId === ev._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
