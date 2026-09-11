import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import { userAPI } from '../api/api';
import { PlusCircle, Search, Edit, Eye, Lock, Loader2, AlertCircle } from 'lucide-react';

function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestingId, setRequestingId] = useState(null);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.getMyEvents();
      const data = response.data?.events || response.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch event proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEditAccess = async (eventId) => {
    setRequestingId(eventId);
    try {
      await userAPI.requestEditAccess(eventId);
      alert('✅ Edit access requested successfully! Admin will review your request.');
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request edit access.');
    } finally {
      setRequestingId(null);
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.event_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-100 overflow-hidden flex flex-col ocean-gradient-bg">
      <Particles id="view-events-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      <NavBar />

      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-heading">My Event Proposals</h1>
            <p className="text-sky-300/70 text-sm mt-1">Manage and track your submitted INTRAMS event proposals</p>
          </div>
          <button
            onClick={() => navigate('/create-event')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" /> Create Proposal
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search events by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-xl"
          />
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : error ? (
          <div className="bg-rose-950/60 border border-rose-800 text-rose-300 rounded-3xl p-8 text-center backdrop-blur-xl">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-rose-400" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No Proposals Found"
            description="Create your association's event proposal to see it listed here."
            actionLabel="Create Event Proposal"
            onAction={() => navigate('/create-event')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((ev) => {
              const isEditable = ev.edit_req_status === 'approved' || ev.isEditable;
              return (
                <div key={ev._id} className="glass-card rounded-3xl p-6 shadow-2xl border border-sky-500/15 flex flex-col justify-between hover:border-sky-500/40 transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white font-heading">{ev.name || 'Untitled Event'}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 font-mono font-bold border border-cyan-500/30 uppercase tracking-wider">
                        {ev.event_id || 'ID N/A'}
                      </span>
                    </div>
                    {ev.tagline && <p className="text-sky-300/80 text-sm font-medium mb-3">{ev.tagline}</p>}
                    <p className="text-slate-300 text-sm line-clamp-3 mb-4">{ev.about}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 items-center justify-between">
                    <button
                      onClick={() => navigate(`/event/${ev._id}`, { state: ev })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sky-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4 text-sky-400" /> View Details
                    </button>

                    {isEditable ? (
                      <button
                        onClick={() => navigate(`/update-event/${ev._id}`, { state: ev })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
                      >
                        <Edit className="w-4 h-4" /> Edit Event
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestEditAccess(ev._id)}
                        disabled={requestingId === ev._id || ev.edit_req_status === 'requested'}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-semibold hover:text-white transition-all disabled:opacity-50"
                      >
                        {requestingId === ev._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                        {ev.edit_req_status === 'requested' ? 'Request Pending' : 'Request Edit'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewEvents;
