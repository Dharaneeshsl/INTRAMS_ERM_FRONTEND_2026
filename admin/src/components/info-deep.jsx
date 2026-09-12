import React, { useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { adminAPI } from "../api";
import { FileText, Download, Eye, Trash2, Loader2, ArrowLeft } from "lucide-react";

const InfoDeep = () => {
  const particlesInit = React.useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: "#020617" },
    },
    fpsLimit: 120,
    particles: {
      color: { value: "#38bdf8" },
      links: { color: "#0284c7", distance: 150, enable: true, opacity: 0.25 },
      move: { enable: true, speed: 1 },
      number: { value: 60 },
      opacity: { value: 0.3 },
    },
  };

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(location.state || null);
  const [fetching, setFetching] = useState(!location.state);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSecret, setDeleteSecret] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  React.useEffect(() => {
    if (!event && id) {
      setFetching(true);
      adminAPI.getEventById(id)
        .then(res => {
          const fetchedEvent = res.data?.data || res.data;
          if (fetchedEvent) {
            setEvent(fetchedEvent);
          }
        })
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [id, event]);

  if (fetching) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden">
        <Particles id="info-deep-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <div className="relative z-10 p-6 text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden">
        <Particles id="info-deep-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <div className="relative z-10 p-6 text-center bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
          <p className="text-gray-700 font-semibold mb-4">No event details loaded.</p>
          <button
            onClick={() => navigate('/cards')}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-semibold shadow-md"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  };

  const handleViewPDF = async () => {
    setPdfLoading(true);
    setPdfError(null);
    let mobileWin = null;
    if (isMobile()) {
      mobileWin = window.open('about:blank', '_blank');
    }
    try {
      const res = await adminAPI.getEventPDF(event.event_id || event._id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      if (mobileWin) {
        mobileWin.location.href = url;
      } else {
        setPdfUrl(url);
        setShowPdfViewer(true);
      }
    } catch (err) {
      if (mobileWin) mobileWin.close();
      setPdfError(err.message || 'Failed to load PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteSecret !== 'Event Deletion Secret Key - INTRAMS') {
      setDeleteError('Invalid secret key');
      return;
    }
    setDeleteLoading(true);
    try {
      await adminAPI.deleteEvent(event._id);
      setDeleteModalOpen(false);
      navigate('/cards');
    } catch (err) {
      setDeleteError('Failed to delete event');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden pt-24 pb-12 px-4 sm:px-6">
      <Particles id="info-deep-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">{event.name}</h1>
            {event.tagline && <p className="text-lg text-gray-600 font-medium mt-1">{event.tagline}</p>}
            <p className="text-gray-700 mt-4 leading-relaxed">{event.about}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleViewPDF}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:brightness-110 transition-all disabled:opacity-50"
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} View Event PDF
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold shadow-md hover:bg-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete Event
            </button>
          </div>

          {pdfError && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">{pdfError}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-sm text-gray-700 space-y-2">
              <h3 className="font-bold text-gray-900 text-base mb-2">General Info</h3>
              <p><span className="font-semibold">Event ID:</span> {event.event_id || 'N/A'}</p>
              <p><span className="font-semibold">Association:</span> {event.association_name || event.club_name || 'N/A'}</p>
              <p><span className="font-semibold">Status:</span> {event.edit_req_status || 'Submitted'}</p>
            </div>

            {event.form && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-sm text-gray-700 space-y-2">
                <h3 className="font-bold text-gray-900 text-base mb-2">Form Specifications</h3>
                <p><span className="font-semibold">Day:</span> {event.form.day || 'N/A'}</p>
                <p><span className="font-semibold">Slot:</span> {event.form.slot || 'N/A'}</p>
                <p><span className="font-semibold">Duration:</span> {event.form.duration || 'N/A'}</p>
                <p><span className="font-semibold">Preferred Halls:</span> {event.form.preferred_halls || 'N/A'}</p>
                <p><span className="font-semibold">Participant Type:</span> {event.form.participant_type || 'Solo'}</p>
              </div>
            )}
          </div>

          {/* Rounds */}
          {Array.isArray(event.rounds) && event.rounds.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rounds & Structure</h3>
              <div className="space-y-4">
                {event.rounds.map((round, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-sm text-gray-700">
                    <h4 className="font-bold text-gray-900 text-base">{round.name || `Round ${idx + 1}`}</h4>
                    <p className="mt-1 text-gray-600">{round.description}</p>
                    {Array.isArray(round.rules) && round.rules.length > 0 && (
                      <div className="mt-3">
                        <span className="font-semibold text-gray-900">Rules:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {round.rules.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          {Array.isArray(event.items) && event.items.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Items Required</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <thead className="bg-gray-200 text-gray-900 font-semibold">
                    <tr>
                      <th className="p-3">Item Name</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Price / Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {event.items.map((item, iIdx) => (
                      <tr key={iIdx}>
                        <td className="p-3 font-medium text-gray-900">{item.item_name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">₹{item.price_per_unit || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Event Deletion</h3>
            <p className="text-gray-600 text-xs mb-4">Enter secret deletion key to delete "{event.name}".</p>
            <input
              type="text"
              placeholder="Enter secret key"
              value={deleteSecret}
              onChange={(e) => setDeleteSecret(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none text-gray-900 mb-3"
            />
            {deleteError && <p className="text-red-500 text-xs mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoDeep;
