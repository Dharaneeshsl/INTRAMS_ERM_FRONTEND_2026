import React, { useEffect, useState } from 'react';
import { Warehouse, Download, Package, BarChart3, Plus } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import EmptyState from './ui/EmptyState';
import { TableSkeleton } from './ui/LoadingState';

const emptyItemForm = { item_name: '', price_per_unit: '', available_quantity: '', is_returnable: true };

export default function Inventory() {
  const { showToast } = useToast();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [qty, setQty] = useState('');
  const [saving, setSaving] = useState(false);

  // Master Item Creation Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [creatingItem, setCreatingItem] = useState(false);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getItems();
      const itemsList = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setStocks(itemsList);
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to load master inventory items.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const saveStock = async () => {
    if (!editing || qty === '') return;
    try {
      setSaving(true);
      await adminAPI.updateStock(editing._id, { available_quantity: parseInt(qty, 10) });
      showToast(`Stock updated for ${editing.item_name}.`, 'success');
      setEditing(null);
      await fetchStocks();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to update stock.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const createMasterItem = async () => {
    if (!itemForm.item_name || itemForm.price_per_unit === '') {
      showToast('Item name and price per unit are required.', 'warning');
      return;
    }
    try {
      setCreatingItem(true);
      const payload = {
        item_name: itemForm.item_name,
        price_per_unit: parseFloat(itemForm.price_per_unit),
        available_quantity: itemForm.available_quantity === '' ? 0 : parseInt(itemForm.available_quantity, 10),
        is_returnable: itemForm.is_returnable,
      };
      await adminAPI.createItem(payload);
      showToast(`Master item "${itemForm.item_name}" added to inventory successfully.`, 'success');
      setCreateModalOpen(false);
      setItemForm(emptyItemForm);
      await fetchStocks();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to create master item.'), 'error');
    } finally {
      setCreatingItem(false);
    }
  };

  // KPI Calculations from dynamic database records
  const totalItemsCount = stocks.reduce((acc, item) => {
    const available = item.available_quantity ?? item.quantity ?? 0;
    return acc + (Number(available) || 0);
  }, 0);

  const totalValuation = stocks.reduce((acc, item) => {
    const available = item.available_quantity ?? item.quantity ?? 0;
    const price = Number(item.price_per_unit) || 0;
    return acc + (Number(available) * price);
  }, 0);

  const uniqueItemsCount = stocks.length;

  // CSV Export from real database records
  const handleDownloadExcel = () => {
    if (stocks.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Item Name,Quantity,Unit Price (INR),Total Value (INR)\n';

    stocks.forEach((item) => {
      const available = item.available_quantity ?? item.quantity ?? 0;
      const price = Number(item.price_per_unit) || 0;
      const total = available * price;
      const name = `"${(item.item_name || '').replace(/"/g, '""')}"`;
      csvContent += `${name},${available},${price},${total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_statistics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = stocks.filter((s) => (s.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading uppercase tracking-wide">
            ITEM STATISTICS
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
            VIEW COMPREHENSIVE ITEM ANALYTICS AND EXPORT REPORTS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-black text-white hover:bg-zinc-800 font-extrabold px-5 py-3.5 rounded-none text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-white/20"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            ADD MASTER ITEM
          </button>
          <button
            onClick={handleDownloadExcel}
            disabled={stocks.length === 0}
            className="bg-white hover:bg-zinc-200 text-black font-extrabold px-6 py-3.5 rounded-none text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 text-black" />
            DOWNLOAD EXCEL
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Items Card */}
        <div className="bg-white border-2 border-black p-6 rounded-none shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white rounded-none flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Total Items</p>
              <h3 className="text-3xl font-extrabold text-black font-mono tracking-tight mt-0.5">
                {totalItemsCount.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Total Value Card */}
        <div className="bg-white border-2 border-black p-6 rounded-none shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white rounded-none flex items-center justify-center font-bold text-xl flex-shrink-0">
              $
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Total Value</p>
              <h3 className="text-3xl font-extrabold text-black font-mono tracking-tight mt-0.5">
                ₹{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        {/* Unique Items Card */}
        <div className="bg-white border-2 border-black p-6 rounded-none shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white rounded-none flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Unique Items</p>
              <h3 className="text-3xl font-extrabold text-black font-mono tracking-tight mt-0.5">
                {uniqueItemsCount.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Item Breakdown Table */}
      <div className="bg-white border-2 border-black rounded-none shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
          <h2 className="text-lg font-extrabold text-black font-heading uppercase tracking-wide">
            ITEM BREAKDOWN
          </h2>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search master items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white text-black border-black focus:ring-black"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Warehouse} title="No master inventory items found" message="Master items added by Admin will appear here automatically." />
        ) : (
          <div className="overflow-x-auto border border-black">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-white text-black font-extrabold uppercase tracking-wider border-b-2 border-black">
                <tr>
                  <th className="py-3.5 px-4 border-r border-black font-extrabold">ITEM NAME</th>
                  <th className="py-3.5 px-4 text-center border-r border-black font-extrabold">QUANTITY</th>
                  <th className="py-3.5 px-4 text-right border-r border-black font-extrabold">UNIT PRICE</th>
                  <th className="py-3.5 px-4 text-right border-r border-black font-extrabold">TOTAL VALUE</th>
                  <th className="py-3.5 px-4 text-center font-extrabold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black bg-white text-black">
                {filtered.map((stock) => {
                  const available = stock.available_quantity ?? stock.quantity ?? 0;
                  const price = Number(stock.price_per_unit) || 0;
                  const totalVal = available * price;

                  return (
                    <tr key={stock._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-black border-r border-black font-sans">
                        {stock.item_name}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-black border-r border-black">
                        {available.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-black border-r border-black">
                        ₹{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-black border-r border-black">
                        ₹{totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setEditing(stock);
                            setQty(String(available));
                          }}
                          className="bg-black text-white hover:bg-zinc-800 px-3 py-1.5 rounded-none text-[11px] font-extrabold uppercase tracking-wider transition-all"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      <Modal
        open={Boolean(editing)}
        title={`Update Stock: ${editing?.item_name || ''}`}
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={saveStock}>
              Save Stock
            </Button>
          </>
        }
      >
        <Input label="Available Quantity" type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} />
        <p className="text-[12px] text-slate-400 mt-2">
          Update the available SU inventory count for future event allocations.
        </p>
      </Modal>

      {/* Add Master Item Modal */}
      <Modal
        open={createModalOpen}
        title="Add Master Item"
        onClose={() => setCreateModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={creatingItem} onClick={createMasterItem}>
              Add Item
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Item Name"
            value={itemForm.item_name}
            onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })}
            placeholder="e.g. A4 Sheets, Pen(BLUE)"
          />
          <Input
            label="Price Per Unit (INR)"
            type="number"
            value={itemForm.price_per_unit}
            onChange={(e) => setItemForm({ ...itemForm, price_per_unit: e.target.value })}
            placeholder="e.g. 2.50"
          />
          <Input
            label="Initial Stock Quantity"
            type="number"
            value={itemForm.available_quantity}
            onChange={(e) => setItemForm({ ...itemForm, available_quantity: e.target.value })}
            placeholder="e.g. 500"
          />
          <label className="flex items-center gap-2 text-[13px] text-slate-300">
            <input
              type="checkbox"
              checked={itemForm.is_returnable}
              onChange={(e) => setItemForm({ ...itemForm, is_returnable: e.target.checked })}
            />
            Returnable item
          </label>
        </div>
      </Modal>
    </div>
  );
}


