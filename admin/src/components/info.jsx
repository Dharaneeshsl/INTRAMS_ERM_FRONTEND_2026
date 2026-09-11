import React, { useState, useEffect, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api";
import { HoverEffect } from "../ui/card-hover-effect";
import { Search, Loader2 } from "lucide-react";

const EventCards = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#000000",
      },
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
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.4 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await adminAPI.getEvents();
        console.log("Fetched events:", response.data);
        setEvents(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      (event.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.club_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eventItems = filteredEvents.map((event) => {
    const association = event?.club_name || "Unknown Club";
    const twoDays = event?.form?.two_days;
    const dayInfo = twoDays
      ? /yes/i.test(twoDays)
        ? "Both days"
        : event?.form?.day || "Single day"
      : "Schedule TBA";

    const convenorNames = [
      event?.details?.convenor1_name,
      event?.details?.convenor2_name,
    ].filter(Boolean);

    const status = event?.status || event?.form?.status || "Pending";
    const updatedAt = event?.updatedAt || event?.createdAt || event?.created_at || null;

    return {
      id: event?._id,
      title: event?.name || event?.event_name || event?.workshop?.name || event?.presentation?.event_description?.substring(0, 50) || "Untitled Event",
      tagline: event?.tagline || "",
      about: event?.about || event?.workshop?.description || event?.presentation?.event_description || "",
      association,
      dayInfo,
      convenors: convenorNames,
      status,
      updatedAt,
      onClick: () => navigate(`/info-deep/${event?._id}`, { state: event }),
    };
  });

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-black overflow-hidden pt-24 px-4 sm:px-6">
      <Particles id="info-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search Events or Club Associations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 outline-none focus:ring-2 focus:ring-accent-orange text-gray-900"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-white flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
            <p className="text-lg">Loading events...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-300 bg-red-500/20 rounded-3xl border border-red-500/30 backdrop-blur-md">
            <p className="text-lg">Error loading events: {error}</p>
          </div>
        )}

        {!loading && !error && <HoverEffect items={eventItems} />}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-16 text-white/70 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20">
            <p className="text-xl font-semibold">No events found</p>
            <p className="text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCards;
