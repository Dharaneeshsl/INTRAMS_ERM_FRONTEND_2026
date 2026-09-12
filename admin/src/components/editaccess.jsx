import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { CheckCircle2, Eye, Loader2, RefreshCcw, ShieldAlert, XCircle, ShieldCheck, Filter } from "lucide-react";
import { adminAPI } from "../api";

const EditAccess = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: { color: { value: "#000000" } },
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
    }),
    []
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    setActionStatus(null);
    try {
      const res = await adminAPI.getRequestedEvents();
      const rawData = res?.data?.data ?? res?.data ?? res;
      const dataArray = Array.isArray(rawData) ? rawData : [];
      setRequests(dataArray);
    } catch (err) {
      setRequests([]);
      setError(err?.response?.data?.message || "Failed to fetch edit access requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccess = async (requestId, decision) => {
    setUpdatingId(requestId);
    setActionStatus(null);
    try {
      await adminAPI.giveEditAccess(requestId, decision);
      setActionStatus({
        type: "success",
        message: `Edit request ${decision === "approved" ? "approved" : "cancelled/declined"} successfully.`,
      });
      await fetchRequests();
    } catch (err) {
      setActionStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to update edit access request.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewEvent = (eventId, req) => {
    const targetId = eventId || req?.event_id?._id || req?._id;
    if (!targetId) {
      setActionStatus({ type: "error", message: "Event record not found." });
      return;
    }
    navigate(`/info-deep/${targetId}`, { state: req });
  };

  // Filtered requests logic
  const filteredRequests = requests.filter((req) => {
    const reqStatus = (req.status || "pending").toLowerCase();
    if (statusFilter !== "all" && reqStatus !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen relative bg-[#000000] text-slate-100 ocean-gradient-bg overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <Particles id="edit-access-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-6xl w-full mx-auto space-y-8 pt-16 sm:pt-6">
        {/* Header & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-wide uppercase flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-sky-400" />
              EDIT ACCESS REQUESTS
            </h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              REVIEW AND MANAGE EVENT EDIT REQUESTS
            </p>
          </div>

          <button
            onClick={fetchRequests}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-slate-800 px-5 py-3 text-xs font-extrabold text-white tracking-widest uppercase transition-all hover:border-sky-500/50 shadow-lg backdrop-blur-xl"
          >
            <RefreshCcw className="h-4 w-4 text-sky-400" /> Refresh
          </button>
        </div>

        {/* Filters Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              TYPE
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
            >
              <option value="all">All Types</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              STATUS
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-xs font-semibold"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Feedback Alert Messages */}
        {actionStatus && (
          <div
            className={`flex items-center gap-3 rounded-2xl border p-4 text-xs font-bold backdrop-blur-xl animate-fade-in ${
              actionStatus.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {actionStatus.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400" />
            )}
            <span>{actionStatus.message}</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-bold text-rose-400 backdrop-blur-xl">
            {error}
          </div>
        )}

        {/* Requests List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
            <p className="text-slate-400 text-sm">Loading edit access requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-12 text-center text-slate-400 backdrop-blur-xl">
            <p className="text-lg font-extrabold text-white">No edit access requests found.</p>
            <p className="mt-1 text-xs text-slate-500">Check back later or adjust filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req, idx) => {
              const statusStr = (req.status || "pending").toLowerCase();
              const eventTitle = req?.event_id?.name || req?.eventName || req?.name || "SEMICON EDGE - FUNDAMENTALS OF SEMICONDUCTOR MATERIALS AND DEVICES";
              const clubId = req.club_id || req?.event_id?.club_id || req._id?.slice(0, 16) || "656525c0766f793f3d014d257";
              const eventIdStr = req.event_code || `EVNT${idx + 10}`;
              const requestedAt = req.createdAt || req.requested_at || new Date().toLocaleString();
              const reasonText = req.req_message || req.reason || "date change";

              return (
                <div
                  key={req._id || idx}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-sky-500/50 transition-all"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base sm:text-lg font-extrabold text-white font-heading uppercase tracking-wide">
                        {eventTitle}
                      </h3>

                      {statusStr === "approved" ? (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono font-extrabold uppercase">
                          APPROVED
                        </span>
                      ) : statusStr === "rejected" ? (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-400 font-mono font-extrabold uppercase">
                          REJECTED
                        </span>
                      ) : (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/30 text-amber-400 font-mono font-extrabold uppercase">
                          PENDING
                        </span>
                      )}

                      <span className="text-[10px] px-2.5 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 font-mono font-extrabold uppercase">
                        EVENT
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400 font-mono">
                      <p><span className="text-slate-500 font-bold uppercase">CLUB ID:</span> <span className="text-slate-300">{clubId}</span></p>
                      <p><span className="text-slate-500 font-bold uppercase">EVENT ID:</span> <span className="text-sky-400 font-bold">{eventIdStr}</span></p>
                      <p><span className="text-slate-500 font-bold uppercase">REQUESTED:</span> <span className="text-slate-300">{new Date(requestedAt).toLocaleString()}</span></p>
                      <p><span className="text-slate-500 font-bold uppercase">REASON:</span> <span className="text-white font-sans">{reasonText}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewEvent(req.event_id?._id, req)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 px-5 py-3 text-xs font-extrabold text-white uppercase tracking-wider transition-all shadow-lg"
                    >
                      <Eye className="h-4 w-4 text-sky-400" /> VIEW
                    </button>

                    {statusStr === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccess(req._id, "approved")}
                          disabled={updatingId === req._id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-3 text-xs font-extrabold text-white uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                          {updatingId === req._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          APPROVE
                        </button>
                        <button
                          onClick={() => handleAccess(req._id, "rejected")}
                          disabled={updatingId === req._id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 px-5 py-3 text-xs font-extrabold text-white uppercase tracking-wider transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
                        >
                          {updatingId === req._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                          CANCEL
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAccess;
