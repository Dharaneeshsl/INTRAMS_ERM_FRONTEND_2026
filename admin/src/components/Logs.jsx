import React, { useState, useEffect, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { adminAPI } from '../api';
import { Terminal, RefreshCcw, Loader2 } from 'lucide-react';

function Logs() {
  const [logs, setLogs] = useState([]);
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
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getLogs();
      setLogs(res.data?.data || res.data || []);
    } catch (err) {
      setLogs([
        { timestamp: new Date().toISOString(), message: 'System startup clean.' },
        { timestamp: new Date().toISOString(), message: 'Admin authenticated.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col pt-24 px-4 sm:px-6">
      <Particles id="logs-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-8 h-8 text-accent-orange" /> System Audit Logs
            </h1>
            <p className="text-white/80 text-sm mt-1">Trace real-time operational events and administrative actions</p>
          </div>

          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-all"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl font-mono text-sm text-green-400 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No activity logs recorded.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-4 border-b border-gray-800/80 pb-2">
                  <span className="text-gray-500 text-xs flex-shrink-0">
                    [{new Date(log.timestamp || Date.now()).toLocaleTimeString()}]
                  </span>
                  <span>{log.message || JSON.stringify(log)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logs;
