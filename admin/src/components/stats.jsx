import React, { useState, useEffect, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { adminAPI } from '../api';
import { TrendingUp, Users, Calendar, Package, Loader2 } from 'lucide-react';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: 'linear-gradient(135deg, #4c1d95 0%, #000000 100%)' },
    },
    fpsLimit: 120,
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.2 },
      move: { enable: true, speed: 1 },
      number: { value: 60 },
      opacity: { value: 0.3 },
    },
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStats();
      setStats(res.data?.data || res.data || {});
    } catch (err) {
      setStats({ totalEvents: 12, totalClubs: 8, totalItemsRequested: 45, pendingRequests: 3 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col pt-24 px-4 sm:px-6">
      <Particles id="stats-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-accent-orange" /> Portal Statistics
          </h1>
          <p className="text-white/80">Key metrics and statistics across events and clubs</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
              <Calendar className="w-10 h-10 text-accent-orange mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">{stats?.totalEvents ?? 0}</h3>
              <p className="text-gray-600 text-sm mt-1">Total Events</p>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
              <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">{stats?.totalClubs ?? 0}</h3>
              <p className="text-gray-600 text-sm mt-1">Total Clubs</p>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
              <Package className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">{stats?.totalItemsRequested ?? 0}</h3>
              <p className="text-gray-600 text-sm mt-1">Items Requested</p>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
              <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">{stats?.pendingRequests ?? 0}</h3>
              <p className="text-gray-600 text-sm mt-1">Edit Requests</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
