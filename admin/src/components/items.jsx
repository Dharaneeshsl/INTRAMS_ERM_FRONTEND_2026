import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit3, Trash2, Search } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import EmptyState from './ui/EmptyState';
import { TableSkeleton } from './ui/LoadingState';

const emptyForm = { item_name: '', price_per_unit: '', available_quantity: '', is_returnable: true };

export default function Items() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getItems();
      setItems(Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to load master items.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      item_name: item.item_name || '',
      price_per_unit: item.price_per_unit ?? '',
      available_quantity: item.available_quantity ?? 0,
      is_returnable: item.is_returnable !== false,
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.item_name || form.price_per_unit === '') {
      showToast('Item name and price per unit are required.', 'warning');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        item_name: form.item_name,
        price_per_unit: parseFloat(form.price_per_unit),
        available_quantity: form.available_quantity === '' ? 0 : parseInt(form.available_quantity, 10),
        is_returnable: form.is_returnable,
      };
      if (editing) await adminAPI.updateItem(editing._id, payload);
      else await adminAPI.createItem(payload);
      setModalOpen(false);
      showToast(editing ? 'Master item updated successfully.' : 'Master item created successfully.', 'success');
      await fetchItems();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to save item.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this master item?')) return;
    try {
      await adminAPI.deleteItem(id);
      showToast('Master item deleted.', 'success');
      fetchItems();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to delete item.'), 'error');
    }
  };

  const filtered = items.filter((item) => (item.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading uppercase tracking-wide">
            MASTER ITEMS CATALOG
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
            CATALOG OF SU-OWNED EQUIPMENT USED FOR ALLOCATION ACROSS EVENTS
          </p>
        </div>

        <button
          onClick={openCreate}
          className="self-start sm:self-auto bg-white hover:bg-zinc-200 text-black font-extrabold px-6 py-3.5 rounded-none text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-black"
        >
          <Plus className="w-4 h-4 text-black" />
          CREATE ITEM
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border-2 border-black rounded-none shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
          <h2 className="text-lg font-extrabold text-black font-heading uppercase tracking-wide">
            ITEMS LIST
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white text-black text-xs font-bold border border-black rounded-none outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="No master items found" message="Create a master item to populate the inventory." />
        ) : (
          <div className="overflow-x-auto border border-black">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-white text-black font-extrabold uppercase tracking-wider border-b-2 border-black">
                <tr>
                  <th className="py-3.5 px-4 border-r border-black font-extrabold">ITEM NAME</th>
                  <th className="py-3.5 px-4 text-right border-r border-black font-extrabold">PRICE PER UNIT</th>
                  <th className="py-3.5 px-4 text-center border-r border-black font-extrabold">AVAILABLE STOCK</th>
                  <th className="py-3.5 px-4 text-center border-r border-black font-extrabold">RETURNABLE</th>
                  <th className="py-3.5 px-4 text-center font-extrabold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black bg-white text-black">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-black border-r border-black font-sans">
                      {item.item_name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-black border-r border-black">
                      ₹{Number(item.price_per_unit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-black border-r border-black">
                      {Number(item.available_quantity ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-black border-r border-black">
                      {item.is_returnable === false ? 'NO' : 'YES'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit Item"
                          className="w-9 h-9 bg-black text-white hover:bg-zinc-800 border border-black flex items-center justify-center rounded-none shadow-sm transition-all"
                        >
                          <Edit3 className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => remove(item._id)}
                          title="Delete Item"
                          className="w-9 h-9 bg-red-600 text-white hover:bg-red-700 border border-black flex items-center justify-center rounded-none shadow-sm transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
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

      {/* Item Modal */}
      <Modal
        open={modalOpen}
        title={editing ? 'Edit Master Item' : 'Create Master Item'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={save}>
              Save Item
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Item Name"
            value={form.item_name}
            onChange={(e) => setForm({ ...form, item_name: e.target.value })}
            placeholder="e.g. A4 Sheets, Chart Paper Thick"
          />
          <Input
            label="Price Per Unit (INR)"
            type="number"
            value={form.price_per_unit}
            onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })}
            placeholder="e.g. 5.50"
          />
          <Input
            label="Initial Stock Quantity"
            type="number"
            value={form.available_quantity}
            onChange={(e) => setForm({ ...form, available_quantity: e.target.value })}
            placeholder="e.g. 100"
          />
          <label className="flex items-center gap-2 text-[13px] text-slate-300">
            <input
              type="checkbox"
              checked={form.is_returnable}
              onChange={(e) => setForm({ ...form, is_returnable: e.target.checked })}
            />
            Returnable item
          </label>
        </div>
      </Modal>
    </div>
  );
}
