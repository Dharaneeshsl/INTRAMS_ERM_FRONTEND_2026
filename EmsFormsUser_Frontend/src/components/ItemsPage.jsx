import React from 'react';
import { Plus, Trash2, Package } from 'lucide-react';

function ItemsPage({ formData, setFormData }) {
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { item_name: '', quantity: 1, price_per_unit: 0 }],
    }));
  };

  const removeItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, items: updated };
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <Package className="w-6 h-6 text-sky-400" />
            Equipment & Item Requirements
          </h2>
          <p className="text-sky-300/70 text-sm mt-1">Specify items required for event execution</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-4">
        {formData.items?.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-sky-200/80 mb-1">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Extension Boxes, Projector"
                value={item.item_name || ''}
                onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder-slate-500"
              />
            </div>

            <div className="w-full sm:w-32">
              <label className="block text-xs font-semibold text-sky-200/80 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={item.quantity || 1}
                onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none text-white"
              />
            </div>

            <div className="w-full sm:w-36">
              <label className="block text-xs font-semibold text-sky-200/80 mb-1">Price / Unit (₹)</label>
              <input
                type="number"
                min="0"
                value={item.price_per_unit || 0}
                onChange={(e) => updateItem(idx, 'price_per_unit', parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg sm:mt-5 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {(!formData.items || formData.items.length === 0) && (
          <div className="text-center py-8 text-slate-400 text-sm bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
            No equipment items added yet. Click "+ Add Item" to specify requirements.
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemsPage;
