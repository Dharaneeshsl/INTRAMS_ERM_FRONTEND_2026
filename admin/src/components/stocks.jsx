import React, { useEffect, useState } from 'react';
import { Warehouse } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Modal from './ui/Modal';
import EmptyState from './ui/EmptyState';
import { Table, THead, Th, Td, Tr } from './ui/Table';
import { TableSkeleton } from './ui/LoadingState';

export default function Inventory() {
  const { showToast } = useToast();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [qty, setQty] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getStocks();
      setStocks(res.data?.data || res.data || []);
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to load inventory.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const save = async () => {
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

  const filtered = stocks.filter((s) => (s.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="SU-owned stock available for allocation across all events"
        actions={
          <Button variant="secondary" onClick={fetchStocks}>
            Refresh
          </Button>
        }
      />
      <div className="max-w-sm mb-5">
        <Input placeholder="Search inventory" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={Warehouse} title="No inventory" message="Stock records will appear once master items exist." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Item</Th>
                  <Th numeric>Total / available</Th>
                  <Th numeric>Allocated</Th>
                  <Th numeric>Reserved</Th>
                  <Th numeric>Shortage</Th>
                  <Th>Type</Th>
                  <Th></Th>
                </tr>
              </THead>
              <tbody>
                {filtered.map((stock) => {
                  const available = stock.available_quantity ?? stock.quantity ?? 0;
                  const allocated = stock.allocated_quantity ?? stock.total_allocated;
                  const reserved = stock.reserved_quantity;
                  const total = stock.total_quantity ?? (Number.isFinite(allocated) ? available + allocated : available);
                  const shortage = stock.shortage_quantity;
                  const type = stock.item_type || (stock.is_returnable === false ? 'Consumable' : 'Returnable');
                  return (
                    <Tr key={stock._id}>
                      <Td className="text-white font-medium">{stock.item_name}</Td>
                      <Td numeric>{total}</Td>
                      <Td numeric>{Number.isFinite(allocated) ? allocated : '—'}</Td>
                      <Td numeric>{Number.isFinite(reserved) ? reserved : '—'}</Td>
                      <Td numeric>{Number.isFinite(shortage) ? shortage : '—'}</Td>
                      <Td>
                        <Badge status={available === 0 ? 'shortage' : available < 10 ? 'pending' : 'active'}>
                          {available === 0 ? 'Out of stock' : type}
                        </Badge>
                      </Td>
                      <Td>
                        <div className="flex justify-end">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setEditing(stock);
                              setQty(String(available));
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      <Modal
        open={Boolean(editing)}
        title={`Update stock${editing ? `: ${editing.item_name}` : ''}`}
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        <Input label="Available quantity" type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} />
        <p className="text-[12px] text-slate-500 mt-2">
          Available stock is the SU inventory remaining for future allocations.
        </p>
      </Modal>
    </div>
  );
}
