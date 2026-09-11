import React, { useState, useEffect, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { adminAPI } from '../api';
import { Package, Search, Edit, Loader2 } from 'lucide-react';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStock, setEditingStock] = useState(null);
  const [newQty, setNewQty] = useState('');

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
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStocks();
      setStocks(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingStock || newQty === '') return;
    try {
      await adminAPI.updateStock(editingStock._id, { available_quantity: parseInt(newQty) });
      setEditingStock(null);
      fetchStocks();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const filtered = stocks.filter((s) =>
    (s.item_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col pt-24 px-4 sm:px-6">
      <Particles id="stocks-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Package className="w-8 h-8 text-accent-orange" /> Stock Inventory
          </h1>
          <p className="text-white/80">Manage available quantities for requested equipment items</p>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
          <div className="mb-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stock items..."
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-800">
                <thead className="bg-gray-100 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Available Quantity</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((stock) => (
                    <tr key={stock._id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{stock.item_name}</td>
                      <td className="p-3 font-bold text-accent-orange">{stock.available_quantity ?? stock.quantity ?? 0}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setEditingStock(stock);
                            setNewQty(stock.available_quantity ?? stock.quantity ?? 0);
                          }}
                          className="p-2 bg-accent-orange text-white rounded-lg hover:bg-accent-yellow transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingStock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Stock: {editingStock.item_name}</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="number"
                min="0"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none text-gray-900"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-accent-orange text-white rounded-xl font-semibold">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingStock(null)}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stocks;
