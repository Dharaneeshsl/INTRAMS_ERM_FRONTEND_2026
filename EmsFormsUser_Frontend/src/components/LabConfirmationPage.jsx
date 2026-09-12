import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { userAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { RefreshCcw, Loader2, FileCheck, Building2, Calendar, Clock, UserCheck, Download } from 'lucide-react';

function LabConfirmationPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: '#020617' } },
    fpsLimit: 120,
    interactivity: {
      events: { onClick: { enable: true, mode: 'push' }, onHover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { push: { quantity: 4 }, repulse: { distance: 200, duration: 0.4 } },
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

  const fetchLabConfirmations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userAPI.getMyEvents();
      const eventList = res.data?.events || res.data || [];
      const validEvents = Array.isArray(eventList) ? eventList : [];
      setEvents(validEvents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lab confirmation forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabConfirmations();
  }, []);

  const handleDownloadPDF = async (eventId, eventName) => {
    setDownloadingId(eventId);
    try {
      const res = await userAPI.getEventPDF(eventId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LabConfirmation_${eventName || 'Event'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download lab confirmation form.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#020617] overflow-hidden flex flex-row ocean-gradient-bg text-slate-100">
      <Particles id="lab-conf-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <NavBar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 overflow-y-auto">
          {/* Header Box */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-wide uppercase">
              LAB CONFIRMATION FORMS
            </h1>
            <p className="text-sky-300/70 text-sm sm:text-base mt-2 font-medium">
              Manage and view all lab confirmation requests
            </p>
          </div>

          {/* YOUR LAB CONFIRMATIONS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-white font-heading tracking-wider uppercase">
                YOUR LAB CONFIRMATIONS
              </h2>
              <button
                onClick={fetchLabConfirmations}
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
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              </div>
            ) : events.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                <p className="text-slate-400 text-sm font-semibold">No lab confirmations registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((ev) => {
                  const formSpecs = ev.form || {};
                  const convenors = ev.contacts?.convenors || [];

                  return (
                    <div
                      key={ev._id}
                      className="p-6 rounded-2xl bg-white text-slate-950 border border-slate-300 shadow-xl flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold uppercase tracking-widest border border-slate-300">
                          LABCONFIRM
                        </span>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900 font-heading leading-tight">
                            {ev.name || 'Untitled Event'}
                          </h3>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            {user?.username ? `${user.username.toUpperCase()} • Students Union` : 'Students Union'}
                          </p>
                        </div>

                        <div className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-500">Lab / Hall:</span>
                            <span className="font-mono font-bold text-slate-900">
                              {formSpecs.preferred_halls || 'AI Lab - 123'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-500">Date:</span>
                            <span className="font-mono text-slate-800">
                              {formSpecs.day || '16-03-2026'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-500">Session:</span>
                            <span className="font-mono text-slate-800">
                              {formSpecs.slot || 'DAY 2 - SESSION 1'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-500">Duration:</span>
                            <span className="font-mono text-slate-800">
                              {formSpecs.duration || '1 hour'}
                            </span>
                          </div>
                        </div>

                        {convenors.length > 0 && (
                          <div className="pt-2 border-t border-slate-200">
                            <p className="text-[11px] font-semibold text-slate-500 mb-1">Convenors:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {convenors.map((c, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-300"
                                >
                                  {c.name || 'Sample'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                        <button
                          onClick={() => handleDownloadPDF(ev._id, ev.name)}
                          disabled={downloadingId === ev._id}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase transition-all shadow flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {downloadingId === ev._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>PDF Form</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LabConfirmationPage;
