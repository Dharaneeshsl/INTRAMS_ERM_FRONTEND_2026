import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import { userAPI } from '../api/api';
import { Eye, Edit, Lock, Search, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';

function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestingId, setRequestingId] = useState(null);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userAPI.getEvents();
      const rawData = res.data?.data || res.data || [];
      setEvents(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEditAccess = async (eventId) => {
    const reqMsg = window.prompt('Enter reason for edit access request:');
    if (!reqMsg) return;

    setRequestingId(eventId);
    try {
      await userAPI.requestEditAccess(eventId, reqMsg);
      setMessage('✅ Edit access requested successfully!');
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request edit access');
    } finally {
      setRequestingId(null);
    }
  };

  const filteredEvents = events.filter(
    (ev) =>
      (ev.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.event_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col">
      <Particles id="view-events-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      <NavBar />

      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Submitted Events</h1>
            <p className="text-white/70 text-sm mt-1">Review event details or request edit access</p>
          </div>
          <button
            onClick={fetchEvents}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-all"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-400/40 text-white rounded-2xl text-sm backdrop-blur-md">
            {message}
          </div>
        )}

        <div className="mb-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl text-gray-900 focus:ring-2 focus:ring-accent-orange outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex items-center gap-3 bg-white/20 text-white px-6 py-4 rounded-2xl backdrop-blur-md">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading events...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-400/40 text-white rounded-2xl p-6 text-center backdrop-blur-md">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-80" />
            <p>{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white/10 border border-white/20 text-white rounded-3xl p-12 text-center backdrop-blur-xl">
            <p className="text-lg font-semibold">No events found.</p>
            <p className="text-sm text-white/70 mt-1">Create an event proposal to see it listed here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((ev) => {
              const isEditable = ev.edit_req_status === 'approved' || ev.isEditable;
              return (
                <div key={ev._id} className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{ev.name || 'Untitled Event'}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-accent-orange/10 text-accent-orange font-semibold border border-accent-orange/20">
                        {ev.event_id || 'ID N/A'}
                      </span>
                    </div>
                    {ev.tagline && <p className="text-gray-600 text-sm font-medium mb-3">{ev.tagline}</p>}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{ev.about}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between">
                    <button
                      onClick={() => navigate(`/event/${ev._id}`, { state: ev })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>

                    {isEditable ? (
                      <button
                        onClick={() => navigate(`/update-event/${ev._id}`, { state: ev })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-xl text-xs font-semibold shadow-md hover:brightness-110 transition-all"
                      >
                        <Edit className="w-4 h-4" /> Edit Event
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestEditAccess(ev._id)}
                        disabled={requestingId === ev._id || ev.edit_req_status === 'requested'}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-700 border border-amber-300 hover:bg-amber-500/20 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60"
                      >
                        <Lock className="w-4 h-4" />
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
