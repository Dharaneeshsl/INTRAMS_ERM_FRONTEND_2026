import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { 
  History, 
  Loader2, 
  AlertTriangle, 
  Package, 
  Users, 
  Calendar,
  Gift,
  Search,
  RotateCcw
} from "lucide-react";

function GrantLogs() {
  const particlesInit = React.useCallback(async (engine) => {
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
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const [grantLogs, setGrantLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [revertingGrants, setRevertingGrants] = useState(new Set());

  useEffect(() => {
    fetchGrantLogs();
  }, []);

  const fetchGrantLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllGrants();
      if (response.data.success) {
        setGrantLogs(response.data.data);
      } else {
        setError('Failed to fetch grant logs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch grant logs');
    } finally {
      setLoading(false);
    }
  };

  const resolveAssociationName = (grant) => {
    return (
      grant?.association_name ||
      grant?.clubName ||
      grant?.club_name ||
      grant?.association?.clubName ||
      grant?.association?.association_name ||
      grant?.association?.club_name ||
      '—'
    );
  };

  const filteredGrants = React.useMemo(() => {
    const grants = grantLogs?.grants || [];
    if (!searchTerm.trim()) return grants;
    const lower = searchTerm.toLowerCase();
    return grants.filter((grant) =>
      grant?.item_name?.toLowerCase().includes(lower) ||
      grant?.event_name?.toLowerCase().includes(lower) ||
      resolveAssociationName(grant).toLowerCase().includes(lower) ||
      grant?.granted_to?.toLowerCase().includes(lower) ||
      grant?.granted_by?.toLowerCase().includes(lower)
    );
  }, [grantLogs, searchTerm]);

  const handleRevert = async (grantId) => {
    if (!window.confirm('Are you sure you want to revert this grant? The quantity will be added back to stock.')) return;
    try {
      setRevertingGrants((prev) => new Set([...prev, grantId]));
      await adminAPI.revertGrant(grantId);
      await fetchGrantLogs();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to revert grant');
    } finally {
      setRevertingGrants((prev) => {
        const next = new Set(prev);
        next.delete(grantId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
        <Particles id="tsparticles-logs-loading" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <div className="relative z-10 flex items-center gap-3 bg-white/95 backdrop-blur-lg rounded-2xl p-6">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          <span className="text-lg text-gray-600">Loading grant logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden">
        <Particles id="tsparticles-logs-error" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <div className="relative z-10 flex flex-col items-center gap-4 bg-white/95 backdrop-blur-lg rounded-2xl p-8">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={fetchGrantLogs}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[#000000] text-white overflow-hidden">
      <Particles id="tsparticles-logs" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-28 pb-16 sm:pt-24">
        <header className="mb-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg font-heading">Grant Logs</h1>
          <p className="mt-3 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            View and manage all item grants across events and associations.
          </p>
        </header>

        {grantLogs?.summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <Gift className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Grants</p>
                  <p className="text-2xl font-bold text-white">{grantLogs.summary.totalGrants ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <Package className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Quantity</p>
                  <p className="text-2xl font-bold text-white">{grantLogs.summary.totalQuantity ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Events Covered</p>
                  <p className="text-2xl font-bold text-white">{grantLogs.summary.uniqueEvents ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Unique Items</p>
                  <p className="text-2xl font-bold text-white">{grantLogs.summary.uniqueItems ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {grantLogs?.summary?.grantsByAdmin && Object.keys(grantLogs.summary.grantsByAdmin).length > 0 && (
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Grants by Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(grantLogs.summary.grantsByAdmin).map(([admin, count]) => (
                <div key={admin} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-400" />
                    <span className="font-medium text-slate-200">{admin}</span>
                  </div>
                  <p className="text-xl font-bold text-white mt-1">{count} grants</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
          <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 text-white flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-sky-400" /> All Grant Records
            </h2>
            <button
              onClick={fetchGrantLogs}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" /> Refresh
            </button>
          </div>

          <div className="p-4 border-b border-slate-800">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by item, event, association, or grantee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-200">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Item Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Association / Club</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Granted To</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Granted By</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredGrants.length > 0 ? (
                  filteredGrants.map((grant) => {
                    const isReverting = revertingGrants.has(grant._id);
                    const associationDisplay = resolveAssociationName(grant);

                    return (
                      <tr key={grant._id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">
                          {new Date(grant.createdAt).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-white">
                          {grant.item_name || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-400 font-semibold">
                          {grant.quantity ?? grant.provided_quantity ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {grant.event_name || grant.event_id || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-950/60 text-sky-300 border border-sky-500/30 rounded-full text-xs font-medium">
                            <Users className="w-3 h-3 text-sky-400" />
                            {associationDisplay}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {grant.granted_to || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {grant.granted_by || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleRevert(grant._id)}
                            disabled={isReverting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 text-rose-300 border border-rose-500/30 rounded-lg hover:bg-rose-900/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                          >
                            {isReverting ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3" />
                            )}
                            {isReverting ? 'Reverting...' : 'Revert'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      {searchTerm ? (
                        <>
                          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No grants match your search</p>
                          <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                        </>
                      ) : (
                        <>
                          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No grant logs found</p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8 text-white/70 text-sm">
          <p>&copy; INTRAMS ERM Forms. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default GrantLogs;
