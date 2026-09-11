import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { Users, Calendar, Package, Loader2, AlertTriangle, X, ChevronRight, Gift, Search } from "lucide-react";

function GrantItems() {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: "linear-gradient(135deg, #4c1d95 0%, #000000 100%)" } },
    fpsLimit: 120,
    particles: {
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.2 },
      move: { enable: true, speed: 1 },
      number: { value: 60 },
      opacity: { value: 0.3 },
    },
  };

  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAssociations();
      if (response.data) {
        const mappedData = (response.data.data || []).map((club) => ({
          ...club,
          association_name: club.clubName || club.association_name,
        }));
        setAssociations(mappedData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch associations');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsByAssociation = async (associationId) => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      const response = await adminAPI.getEventsByAssociation(associationId);
      setEvents(response.data?.data || []);
    } catch (err) {
      setEventsError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleAssociationClick = async (association) => {
    setSelectedAssociation(association);
    setShowModal(true);
    setEvents([]);
    await fetchEventsByAssociation(association._id);
  };

  const filteredAssociations = associations.filter((association) => {
    const searchLower = searchTerm.toLowerCase();
    const associationName = (association.association_name || '').toLowerCase();
    const username = (association.username || '').toLowerCase();
    return associationName.includes(searchLower) || username.includes(searchLower);
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col pt-24 px-4 sm:px-6">
      <Particles id="grant-items-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-accent-orange" />
            <h1 className="text-3xl font-bold text-accent-orange">Grant Items to Events</h1>
          </div>
          <p className="text-gray-600 mb-6">Select a club association to view their events and grant items.</p>

          <div className="mb-8 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search association..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none text-gray-900"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssociations.map((assoc) => (
                <div
                  key={assoc._id}
                  onClick={() => handleAssociationClick(assoc)}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-accent-orange" />
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-accent-orange transition-colors">
                      {assoc.association_name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center justify-between mt-4">
                    <span>View Events &rarr;</span>
                    <ChevronRight className="w-4 h-4 text-accent-orange" />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedAssociation?.association_name} Events
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1 space-y-3">
              {eventsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent-orange" />
                </div>
              ) : events.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No events found for this association.</p>
              ) : (
                events.map((ev) => (
                  <div key={ev.mongoId || ev._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{ev.eventName || ev.name}</h4>
                      <p className="text-xs text-gray-500">ID: {ev.eventId || ev.event_id}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/grant-event-items/${ev.mongoId || ev._id}`)}
                      className="px-4 py-2 bg-accent-orange text-white rounded-xl font-semibold text-xs hover:bg-accent-yellow transition-colors"
                    >
                      Grant Items
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GrantItems;
