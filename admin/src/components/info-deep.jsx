import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { ArrowLeft, Trash2, Eye, Loader2, CheckCircle2, XCircle, Clock, ShieldAlert } from "lucide-react";

const InfoDeep = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [event, setEvent] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: "#000000" } },
    fpsLimit: 120,
    particles: {
      color: { value: "#38bdf8" },
      links: { color: "#0284c7", distance: 150, enable: true, opacity: 0.25 },
      move: { enable: true, speed: 1 },
      number: { value: 60 },
      opacity: { value: 0.3 },
    },
  };

  useEffect(() => {
    if (!event && id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getEventById(id);
      setEvent(res.data?.data || res.data);
    } catch (err) {
      console.error("Error fetching event details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus, reason = "") => {
    if (!event) return;
    setStatusLoading(true);
    setStatusMessage("");
    try {
      await adminAPI.updateEventStatus(event._id, newStatus, reason);
      setStatusMessage(`✅ Event status updated to ${newStatus.toUpperCase()}`);
      fetchEventDetails();
    } catch (err) {
      setStatusMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleViewPDF = async () => {
    if (!event) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const res = await adminAPI.getEventPDF(event._id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Event_${event.name || event._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError(err.response?.data?.message || "Failed to download PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await adminAPI.deleteEvent(event._id);
      setDeleteModalOpen(false);
      navigate("/cards");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete event");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-black text-white">
        <Particles id="info-deep-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <div className="relative z-10 text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-sky-400 mx-auto" />
          <p className="text-slate-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-black text-white px-4">
        <Particles id="info-deep-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <div className="relative z-10 text-center bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 space-y-4 max-w-md">
          <p className="text-slate-300 font-semibold">Event details not found.</p>
          <button
            onClick={() => navigate("/cards")}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = (event.status || event.edit_req_status || "submitted").toLowerCase();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-black text-white overflow-hidden pt-24 pb-12 px-4 sm:px-6">
      <Particles id="info-deep-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-5xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" /> Back
        </button>

        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-8 space-y-8">
          {/* Header & Status Actions */}
          <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-white font-heading tracking-wide uppercase">
                  {event.name || event.event_name}
                </h1>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono font-bold uppercase">
                  {currentStatus}
                </span>
              </div>
              {event.tagline && <p className="text-sky-400 font-mono text-sm">{event.tagline}</p>}
              <p className="text-slate-300 text-sm leading-relaxed mt-2">{event.about || event.description}</p>
            </div>

            {/* Admin Status Transition Controls */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleViewPDF}
                disabled={pdfLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Eye className="w-4 h-4 text-sky-400" />} PDF
              </button>

              {currentStatus !== "approved" && (
                <button
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={statusLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
              )}

              {currentStatus !== "under_review" && (
                <button
                  onClick={() => handleUpdateStatus("under_review")}
                  disabled={statusLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-amber-500/40 text-amber-400 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <Clock className="w-4 h-4" /> Review
                </button>
              )}

              {currentStatus !== "rejected" && (
                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={statusLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              )}

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-400 rounded-2xl text-xs font-bold uppercase transition-all"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200">
              <p>{statusMessage}</p>
            </div>
          )}

          {pdfError && (
            <div className="p-4 bg-rose-950/60 text-rose-300 border border-rose-500/30 rounded-2xl text-xs font-bold">
              <p>{pdfError}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2.5">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3">General Details</h3>
              <p><span className="font-bold text-slate-400 uppercase">Event ID:</span> <span className="text-sky-400 font-mono font-bold">{event.event_id || event._id}</span></p>
              <p><span className="font-bold text-slate-400 uppercase">Association / Club:</span> <span className="text-white font-bold">{event.club_name || event.association_name || 'N/A'}</span></p>
              <p><span className="font-bold text-slate-400 uppercase">Status:</span> <span className="text-cyan-300 font-mono font-bold uppercase">{currentStatus}</span></p>
            </div>

            {event.form && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2.5">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Form Specifications</h3>
                <p><span className="font-bold text-slate-400 uppercase">Schedule:</span> <span className="text-white">{event.form.day || 'Day 1'} {event.form.slot ? `| ${event.form.slot}` : ''}</span></p>
                <p><span className="font-bold text-slate-400 uppercase">Duration:</span> <span className="text-white">{event.form.duration || 'N/A'}</span></p>
                <p><span className="font-bold text-slate-400 uppercase">Preferred Halls:</span> <span className="text-white">{event.form.preferred_halls || event.venue || 'N/A'}</span></p>
                <p><span className="font-bold text-slate-400 uppercase">Participant Type:</span> <span className="text-white">{event.form.participant_type || 'Solo'}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white font-heading uppercase">Confirm Deletion</h3>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Are you sure you want to permanently delete event <span className="font-bold text-white">"{event.name || event.event_name}"</span>?
              </p>
              {deleteError && <p className="text-rose-400 text-xs font-bold">{deleteError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-rose-600/20 disabled:opacity-50"
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete Event"}
                </button>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold rounded-2xl text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoDeep;
