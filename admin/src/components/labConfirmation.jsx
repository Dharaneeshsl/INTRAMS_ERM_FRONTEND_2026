import React, { useState, useEffect, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api";
import { Search, Loader2, CheckCircle2, ShieldCheck, MapPin, Calendar, Users, Layers } from "lucide-react";

function LabConfirmation() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: "#000000" },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#38bdf8" },
      links: { color: "#0284c7", distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.35 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  useEffect(() => {
    fetchLabEvents();
  }, []);

  const [updatingId, setUpdatingId] = useState(null);

  const fetchLabEvents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getEvents();
      const eventsData = Array.isArray(response.data?.data) ? response.data.data : [];
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch lab confirmation events");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLabStatus = async (e, eventId, newStatus) => {
    e.stopPropagation();
    try {
      setUpdatingId(eventId);
      await adminAPI.updateLabStatus(eventId, { lab_status: newStatus });
      await fetchLabEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update lab status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEvents = events.filter((event) => {
    const halls = event.form?.preferred_halls || event.preferred_halls || event.form?.venue || event.venue || '';
    if (!halls || typeof halls !== 'string') return false;
    const trimmedHalls = halls.trim().toLowerCase();
    const isLabRequested = (
      trimmedHalls !== '' &&
      trimmedHalls !== 'none' &&
      trimmedHalls !== 'n/a' &&
      trimmedHalls !== 'no' &&
      trimmedHalls !== 'false' &&
      trimmedHalls !== 'nil'
    );
    if (!isLabRequested) return false;

    const term = searchTerm.toLowerCase();
    const eventName = (event.name || event.event_name || "").toLowerCase();
    const clubName = (event.club_name || "").toLowerCase();
    const venue = trimmedHalls;
    const confirmationId = `LABCNFM${event._id ? event._id.slice(-4).toUpperCase() : ""}`.toLowerCase();

    return (
      eventName.includes(term) ||
      clubName.includes(term) ||
      venue.includes(term) ||
      confirmationId.includes(term)
    );
  });

  return (
    <div className="min-h-screen relative bg-[#000000] text-slate-100 ocean-gradient-bg overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <Particles id="lab-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-6xl w-full mx-auto space-y-8 pt-16 sm:pt-6">
        {/* Title & Header */}
        <div className="text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-wide uppercase flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            LAB CONFIRMATION
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            MONITOR AND VERIFY LAB VENUE ALLOCATIONS AND CONFIRMATION STATUS
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            placeholder="Search by event name, club, lab, or confirmation ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-500 text-sm shadow-xl font-medium"
          />
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-extrabold text-white font-heading uppercase tracking-wide">
            ALL LAB CONFIRMATIONS ({filteredEvents.length})
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
            <p className="text-slate-400 text-sm">Loading lab confirmation records...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 text-rose-400 bg-rose-500/10 rounded-3xl border border-rose-500/20 backdrop-blur-md">
            <p className="text-base font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-16 text-slate-400 bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800">
            <p className="text-lg font-semibold">No lab confirmations found</p>
            <p className="text-xs text-slate-500 mt-1">Try refining your search terms</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const eventTitle = event.name || event.event_name || "Untitled Event";
              const clubName = event.club_name || "Students Union";
              const labBlock = event.form?.venue || event.venue || "E Block";
              const confirmationId = `LABCNFM${event._id ? event._id.slice(-4).toUpperCase() : (idx + 10).toString()}`;
              const rounds = event.form?.rounds || event.rounds || 1;
              const participants = event.form?.participants_count || event.participants || 2;
              const dayStr = event.form?.two_days && /yes/i.test(event.form.two_days)
                ? "DAY 1 & 2"
                : `DAY ${event.form?.day || "1"}`;
              const updatedAtStr = event.updatedAt || event.createdAt || new Date().toISOString();
              const currentLabStatus = event.form?.lab_status || 'pending';
              const isUpdating = updatingId === event._id;

              return (
                <div
                  key={event._id || idx}
                  className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4 hover:border-sky-500/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3" onClick={() => navigate(`/info-deep/${event._id}`, { state: event })}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-extrabold text-white font-heading tracking-wide uppercase group-hover:text-sky-400 transition-colors line-clamp-2">
                        {eventTitle}
                      </h3>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-500/30 text-sky-400 font-mono font-extrabold uppercase shrink-0">
                        LAB_CONFIRMATION
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {clubName}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">Venue / Lab:</span>
                        <span className="font-bold text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-400" />
                          {labBlock}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">ID:</span>
                        <span className="font-bold text-sky-400">{confirmationId}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">Rounds: {rounds}</span>
                        <span className="text-slate-400">Participants: {participants}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">Day:</span>
                        <span className="font-bold text-cyan-300">{dayStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Lab Status Control */}
                  <div className="pt-3 border-t border-slate-800 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        ADMIN LAB STATUS:
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${
                        currentLabStatus === 'confirmed' || currentLabStatus === 'approved'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : currentLabStatus === 'rejected'
                          ? 'bg-rose-950 text-rose-400 border-rose-500/30'
                          : 'bg-amber-950 text-amber-400 border-amber-500/30'
                      }`}>
                        {currentLabStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <select
                        value={currentLabStatus}
                        disabled={isUpdating}
                        onChange={(e) => handleUpdateLabStatus(e, event._id, e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer disabled:opacity-50"
                      >
                        <option value="pending" className="bg-slate-900 text-amber-400">PENDING</option>
                        <option value="confirmed" className="bg-slate-900 text-emerald-400">CONFIRMED</option>
                        <option value="approved" className="bg-slate-900 text-emerald-400">APPROVED</option>
                        <option value="rejected" className="bg-slate-900 text-rose-400">REJECTED</option>
                      </select>
                      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-sky-400 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LabConfirmation;
