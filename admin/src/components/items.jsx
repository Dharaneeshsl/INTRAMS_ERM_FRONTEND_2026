import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit3, Trash2, Search } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';
import EmptyState from './ui/EmptyState';
import { TableSkeleton } from './ui/LoadingState';
import PageHeader from './ui/PageHeader';

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
      <PageHeader
        title="MASTER ITEMS DIRECTORY"
        subtitle="Manage standard equipment catalog, unit pricing, stock levels, and returnable status"
        actions={
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            ADD MASTER ITEM
          </Button>
        }
      />

      {/* Main Table Container */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252525] pb-4">
          <h2 className="text-sm font-bold text-[#FFFFFF] font-heading uppercase tracking-wider">
            ITEMS CATALOG ({filtered.length})
          </h2>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
            <input
              type="text"
              placeholder="SEARCH ITEMS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#000000] text-[#FFFFFF] text-xs font-bold border border-[#252525] rounded-none outline-none focus:border-[#00AEEF]"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="NO MASTER ITEMS FOUND" message="Create a master item to populate the inventory catalog." />
        ) : (
          <div className="overflow-x-auto border border-[#252525]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#080808] text-[#00AEEF] font-bold uppercase tracking-wider border-b border-[#252525]">
                <tr>
                  <th className="py-3.5 px-4 border-r border-[#252525] font-bold">ITEM NAME</th>
                  <th className="py-3.5 px-4 text-right border-r border-[#252525] font-bold">PRICE PER UNIT</th>
                  <th className="py-3.5 px-4 text-center border-r border-[#252525] font-bold">AVAILABLE STOCK</th>
                  <th className="py-3.5 px-4 text-center border-r border-[#252525] font-bold">RETURNABLE</th>
                  <th className="py-3.5 px-4 text-center font-bold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252525] bg-[#000000] text-[#E5E5E5]">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-[#080808] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#FFFFFF] border-r border-[#252525]">
                      {item.item_name}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#E5E5E5] border-r border-[#252525]">
                      ₹{Number(item.price_per_unit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#00AEEF] border-r border-[#252525]">
                      {Number(item.available_quantity ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#E5E5E5] border-r border-[#252525]">
                      {item.is_returnable === false ? 'NO' : 'YES'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit Item"
                          className="px-2.5 py-1.5 bg-[#050505] text-[#FFFFFF] hover:border-[#00AEEF] hover:text-[#00AEEF] border border-[#252525] rounded-none text-[11px] font-bold uppercase transition-all flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          EDIT
                        </button>
                        <button
                          onClick={() => remove(item._id)}
                          title="Delete Item"
                          className="px-2.5 py-1.5 bg-[#050505] text-[#FF4D67] hover:bg-[#FF4D67]/10 border border-[#FF4D67]/40 rounded-none text-[11px] font-bold uppercase transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Item Modal */}
      <Modal
        open={modalOpen}
        title={editing ? 'EDIT MASTER ITEM' : 'CREATE MASTER ITEM'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              CANCEL
            </Button>
            <Button loading={saving} onClick={save}>
              SAVE ITEM
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Item Name"
            value={form.item_name}
            onChange={(e) => setForm({ ...form, item_name: e.target.value })}
            placeholder="e.g. Extension Box 5m"
          />
          <Input
            label="Price Per Unit (INR)"
            type="number"
            value={form.price_per_unit}
            onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })}
            placeholder="e.g. 250.00"
          />
          <Input
            label="Initial Stock Quantity"
            type="number"
            value={form.available_quantity}
            onChange={(e) => setForm({ ...form, available_quantity: e.target.value })}
            placeholder="e.g. 50"
          />
          <label className="flex items-center gap-2 text-[13px] text-[#E5E5E5] font-bold uppercase cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_returnable}
              onChange={(e) => setForm({ ...form, is_returnable: e.target.checked })}
              className="accent-[#00AEEF] h-4 w-4"
            />
            Returnable equipment item
          </label>
        </div>
      </Modal>
    </div>
  );
}

