import React, { useState, useEffect, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { adminAPI } from '../api';
import { ShoppingCart, Package, CheckCircle2, Clock, FileText, Search, RefreshCw, AlertCircle } from 'lucide-react';

function Procurements() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: '#020617' } },
    fpsLimit: 120,
    particles: {
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { enable: true, speed: 1 },
      number: { value: 60 },
      opacity: { value: 0.3 },
    },
  };

  const [procurements, setProcurements] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getProcurements();
      const data = res.data?.data || {};
      setProcurements(data.procurements || []);
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch procurement requisitions');
    } finally {
      setLoading(false);
    }
  };

  const filteredProcurements = procurements.filter((p) => {
    const eventName = p.submission_id?.event_name || '';
    const clubName = p.requested_by?.club_name || '';
    return (
      eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clubName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <Particles id="procurement-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Procurement <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Requisitions</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            View equipment purchase requisitions automatically generated from stock shortages during item granting.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/95 backdrop-blur-lg p-4 rounded-2xl border border-white/20 shadow-xl">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by event or club name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 text-sm"
            />
          </div>
          <button
            onClick={fetchProcurements}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium text-sm transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-white">
            <p className="text-gray-400 animate-pulse">Loading procurement records...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center text-rose-400">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredProcurements.length === 0 && (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 text-center text-gray-600 shadow-xl border border-white/20">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-800">No Procurement Requisitions Found</p>
            <p className="text-sm text-gray-500 mt-1">Requisitions will be automatically created when granted quantities exceed available stock.</p>
          </div>
        )}

        {!loading && !error && filteredProcurements.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {filteredProcurements.map((proc) => {
              const reqItems = items.filter((i) => i.procurement_id === proc._id || i.procurement_id?._id === proc._id);
              return (
                <div key={proc._id} className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {proc.submission_id?.event_name || 'Event Proposal'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Requested by: <span className="font-medium text-sky-600">{proc.requested_by?.club_name || 'Club'}</span>
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                      {proc.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requisition Shortage Items</h4>
                    {reqItems.length > 0 ? (
                      <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                        {reqItems.map((item) => (
                          <div key={item._id} className="p-3 bg-gray-50 flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-800">{item.item_id?.item_name || 'Item'}</span>
                            <span className="text-gray-600">Shortage Qty: <strong className="text-rose-600">{item.requested_quantity}</strong></span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Auto-logged inventory shortage requirement.</p>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 flex justify-between">
                    <span>Requisition ID: {proc._id}</span>
                    <span>Created: {new Date(proc.created_at || Date.now()).toLocaleDateString()}</span>
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

export default Procurements;
