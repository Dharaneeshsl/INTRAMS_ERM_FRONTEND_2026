import React, { useState, useEffect, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { adminAPI } from "../api";
import { Edit, Trash2, Plus, Search, Loader2, Package, Check, RefreshCw } from "lucide-react";

function Items() {
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
      color: { value: "#38bdf8" },
      links: { color: "#0284c7", distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.35 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    item_name: "",
    price_per_unit: "",
    available_quantity: "",
    is_returnable: true,
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    item_name: "",
    price_per_unit: "",
    available_quantity: "",
    is_returnable: true,
  });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getItems();
      const itemsData = Array.isArray(response.data.data) ? response.data.data : [];
      setItems(itemsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = Array.isArray(items) ? items.filter((item) =>
    (item.item_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.item_name || !formData.price_per_unit) {
      setMessage("⚠️ Please fill in all required fields (*)");
      return;
    }

    try {
      await adminAPI.createItem({
        item_name: formData.item_name,
        price_per_unit: parseFloat(formData.price_per_unit),
        available_quantity: formData.available_quantity ? parseInt(formData.available_quantity) : 0,
        is_returnable: formData.is_returnable,
      });
      setMessage("✅ Item created successfully!");
      setFormData({ item_name: "", price_per_unit: "", available_quantity: "", is_returnable: true });
      fetchItems();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      item_name: item.item_name || "",
      price_per_unit: item.price_per_unit ? item.price_per_unit.toString() : "0",
      available_quantity: item.available_quantity !== undefined ? item.available_quantity.toString() : "0",
      is_returnable: item.is_returnable !== false,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFormData.item_name || !editFormData.price_per_unit) {
      setMessage("⚠️ Please fill in all required fields (*)");
      return;
    }

    try {
      await adminAPI.updateItem(editingItem._id, {
        item_name: editFormData.item_name,
        price_per_unit: parseFloat(editFormData.price_per_unit),
        available_quantity: parseInt(editFormData.available_quantity || "0"),
        is_returnable: editFormData.is_returnable,
      });
      setMessage("✅ Item updated successfully!");
      setShowEditModal(false);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await adminAPI.deleteItem(id);
      setMessage("✅ Item deleted successfully!");
      fetchItems();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#000000] text-slate-100 ocean-gradient-bg overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-5 pt-16 sm:pt-4">
        {/* Title Header */}
        <div className="text-left space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-400" />
            Item Management
          </h1>
          <p className="text-zinc-400 text-xs">
            Manage items, create new ones, and update pricing
          </p>
        </div>

        {/* Create Item Form Card */}
        <div className="bg-zinc-950/90 backdrop-blur-xl rounded-xl shadow-lg border border-zinc-800 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
            <Plus className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-semibold tracking-wider uppercase text-white">
              CREATE ITEM
            </h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-zinc-500 text-xs font-medium transition-all"
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Price per Unit (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-zinc-500 text-xs font-medium transition-all"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Available Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  min="0"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-zinc-500 text-xs font-medium transition-all"
                  value={formData.available_quantity}
                  onChange={(e) => setFormData({ ...formData, available_quantity: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_returnable"
                checked={formData.is_returnable}
                onChange={(e) => setFormData({ ...formData, is_returnable: e.target.checked })}
                className="w-3.5 h-3.5 accent-sky-500 rounded border-zinc-800 bg-zinc-900 cursor-pointer"
              />
              <label htmlFor="is_returnable" className="text-xs text-zinc-300 font-medium cursor-pointer select-none">
                This is a return item
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-semibold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all"
              >
                CREATE ITEM
              </button>
            </div>
          </form>
        </div>

        {/* All Items List Section */}
        <div className="bg-zinc-950/90 backdrop-blur-xl rounded-xl shadow-lg border border-zinc-800 overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
              ALL ITEMS ({filteredItems.length})
            </h2>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-500 text-xs shadow-inner"
              />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                <p className="text-slate-400 text-sm">Loading items catalog...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-rose-400 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <p className="text-sm font-semibold">Error: {error}</p>
              </div>
            )}

            {!loading && !error && filteredItems.length === 0 && (
              <div className="text-center py-12 text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                <p className="text-base font-semibold">No items match your search</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sky-400 hover:text-sky-300 text-xs font-semibold underline"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filteredItems.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-sm text-slate-200">
                  <thead className="bg-slate-950 text-slate-300 font-bold uppercase tracking-wider text-xs border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">ITEM NAME</th>
                      <th className="py-4 px-6">PRICE PER UNIT</th>
                      <th className="py-4 px-6">AVAILABLE QUANTITY</th>
                      <th className="py-4 px-6">RETURNABLE</th>
                      <th className="py-4 px-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                    {filteredItems.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-900/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-white font-heading">
                          {item.item_name}
                        </td>
                        <td className="py-4 px-6 text-sky-400 font-mono font-bold">
                          ₹{(item.price_per_unit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs font-semibold">
                            {item.available_quantity !== undefined ? item.available_quantity : 0}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {item.is_returnable !== false ? (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                              <Check className="w-3 h-3" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/30 text-amber-400 font-bold uppercase">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 rounded-xl transition-all shadow-md"
                              title="Edit item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-400 rounded-xl transition-all shadow-md"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-lg w-full text-slate-100 overflow-hidden">
              <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-base font-bold text-white font-heading uppercase tracking-wide flex items-center gap-2">
                  <Edit className="w-5 h-5 text-sky-400" />
                  Edit Item
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Item Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      value={editFormData.item_name}
                      onChange={(e) => setEditFormData({ ...editFormData, item_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Price per Unit (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      value={editFormData.price_per_unit}
                      onChange={(e) => setEditFormData({ ...editFormData, price_per_unit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Available Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      value={editFormData.available_quantity}
                      onChange={(e) => setEditFormData({ ...editFormData, available_quantity: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="edit_is_returnable"
                      checked={editFormData.is_returnable}
                      onChange={(e) => setEditFormData({ ...editFormData, is_returnable: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded border-slate-800 bg-slate-950 cursor-pointer"
                    />
                    <label htmlFor="edit_is_returnable" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
                      This is a return item
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-slate-800 text-slate-300 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="fixed bottom-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 max-w-sm text-slate-200 text-xs font-bold z-50 animate-bounce">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Items;
