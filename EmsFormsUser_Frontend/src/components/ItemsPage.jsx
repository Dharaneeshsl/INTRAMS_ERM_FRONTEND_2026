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
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-accent-orange" />
            Equipment & Item Requirements
          </h2>
          <p className="text-gray-600 text-sm mt-1">Specify items required for event execution</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-xl text-sm font-semibold shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-4">
        {formData.items?.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Extension Boxes, Projector"
                value={item.item_name || ''}
                onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
              />
            </div>

            <div className="w-full sm:w-32">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={item.quantity || 1}
                onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
              />
            </div>

            <div className="w-full sm:w-36">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Price / Unit (₹)</label>
              <input
                type="number"
                min="0"
                value={item.price_per_unit || 0}
                onChange={(e) => updateItem(idx, 'price_per_unit', parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
              />
            </div>

            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg sm:mt-5"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {(!formData.items || formData.items.length === 0) && (
          <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            No equipment items added yet. Click "+ Add Item" to specify requirements.
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemsPage;
