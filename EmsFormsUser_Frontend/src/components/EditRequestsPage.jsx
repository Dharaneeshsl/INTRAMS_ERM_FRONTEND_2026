import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { userAPI } from '../api/api';
import { Edit, RefreshCcw, Send, Loader2, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

function EditRequestsPage() {
  const [events, setEvents] = useState([]);
  const [editRequests, setEditRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [selectedType, setSelectedType] = useState('Event');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [reason, setReason] = useState('');

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

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userAPI.getMyEvents();
      const eventList = res.data?.events || res.data || [];
      const validEvents = Array.isArray(eventList) ? eventList : [];
      setEvents(validEvents);

      // Extract edit requested events
      const reqList = validEvents.filter(
        (e) => e.edit_req_status || e.status === 'edit_requested' || e.status === 'draft' || e.editReason
      );
      setEditRequests(reqList);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch edit requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      alert('Please select an event to request edit access.');
      return;
    }
    if (!reason.trim()) {
      alert('Please provide a reason for editing this event.');
      return;
    }

    setSubmitting(true);
    setSuccessMsg('');
    setError('');
    try {
      await userAPI.requestEditAccess(selectedEventId, reason);
      setSuccessMsg('✅ Edit access request submitted successfully!');
      setReason('');
      setSelectedEventId('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit edit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#020617] overflow-hidden flex flex-row ocean-gradient-bg text-slate-100">
      <Particles id="edit-req-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <NavBar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 overflow-y-auto">
          {/* Header Box */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-wide uppercase">
              EDIT REQUESTS
            </h1>
            <p className="text-sky-300/70 text-sm sm:text-base mt-2 font-medium">
              View submitted edit requests and submit new ones
            </p>
          </div>

          {/* ALL SUBMITTED EDIT REQUESTS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-white font-heading tracking-wider uppercase">
                ALL SUBMITTED EDIT REQUESTS ({editRequests.length})
              </h2>
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md disabled:opacity-50"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>REFRESH</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              </div>
            ) : editRequests.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                <p className="text-slate-400 text-sm font-semibold">No edit requests submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {editRequests.map((ev) => {
                  const status = ev.edit_req_status || (ev.status === 'draft' ? 'approved' : ev.status);
                  const isApproved = status === 'approved' || ev.status === 'draft';
                  const isPending = status === 'requested' || ev.status === 'edit_requested' || status === 'pending';

                  return (
                    <div
                      key={ev._id}
                      className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] px-2.5 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 font-mono font-bold uppercase">
                            WORKSHOP / EVENT
                          </span>
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                              <CheckCircle2 className="w-3 h-3" /> APPROVED
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/30 text-amber-400 font-bold uppercase">
                              <Clock className="w-3 h-3" /> PENDING
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-400 font-bold uppercase">
                              <XCircle className="w-3 h-3" /> REJECTED
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white font-heading">{ev.name || 'Untitled Event'}</h3>

                        <div className="text-xs text-slate-400">
                          <span className="font-semibold text-slate-300 uppercase">EDIT REASON: </span>
                          <span>{ev.editReason || ev.about || 'Date / logistics update'}</span>
                        </div>
                      </div>

                      <div>
                        {isApproved ? (
                          <button
                            onClick={() => navigate(`/update-event/${ev._id}`, { state: ev })}
                            className="px-5 py-2.5 bg-black hover:bg-slate-900 text-white border border-slate-700 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-sky-400" />
                            <span>EDIT</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-5 py-2.5 bg-slate-900 text-slate-500 border border-slate-800 rounded-xl text-xs font-bold uppercase cursor-not-allowed opacity-60"
                          >
                            LOCKED
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SUBMIT NEW EDIT REQUEST */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
            <h2 className="text-xl font-extrabold text-white font-heading tracking-wider uppercase border-b border-slate-800 pb-4">
              SUBMIT NEW EDIT REQUEST
            </h2>

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  SELECT TYPE *
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-sky-500 font-semibold"
                >
                  <option value="Event">Event</option>
                  <option value="Lab">Lab Confirmation Form</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  SELECT EVENT *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-sky-500 font-semibold"
                >
                  <option value="">-- Select an event --</option>
                  {events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.name} ({ev.event_id || 'ID N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  REASON FOR EDITING *
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a detailed reason for editing this event..."
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-sky-500 placeholder-slate-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">This reason will be logged for audit purposes</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 px-6 bg-black hover:bg-slate-900 border border-slate-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>SUBMIT EDIT REQUEST</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReason('');
                    setSelectedEventId('');
                  }}
                  className="py-3.5 px-6 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditRequestsPage;
