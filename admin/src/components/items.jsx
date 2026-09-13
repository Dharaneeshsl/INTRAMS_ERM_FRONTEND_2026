import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Modal from './ui/Modal';
import EmptyState from './ui/EmptyState';
import { Table, THead, Th, Td, Tr } from './ui/Table';
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
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
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
      showToast('Name and price are required.', 'warning');
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
      showToast(editing ? 'Item updated.' : 'Item created.', 'success');
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
      showToast('Item deleted.', 'success');
      fetchItems();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to delete item.'), 'error');
    }
  };

  const filtered = items.filter((item) => (item.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Master items"
        subtitle="Catalog of SU-owned equipment used for allocation"
        actions={<Button onClick={openCreate}>Create item</Button>}
      />
      <div className="max-w-sm mb-5">
        <Input placeholder="Search items" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={Package} title="No inventory items" message="Create a master item to start tracking stock." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Item</Th>
                  <Th numeric>Price</Th>
                  <Th numeric>Initial / available stock</Th>
                  <Th>Returnable</Th>
                  <Th></Th>
                </tr>
              </THead>
              <tbody>
                {filtered.map((item) => (
                  <Tr key={item._id}>
                    <Td className="text-white font-medium">{item.item_name}</Td>
                    <Td numeric>₹{item.price_per_unit ?? 0}</Td>
                    <Td numeric>{item.available_quantity ?? 0}</Td>
                    <Td>{item.is_returnable === false ? 'No' : 'Yes'}</Td>
                    <Td>
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => openEdit(item)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => remove(item._id)}>
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit item' : 'Create item'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Item name" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} />
          <Input label="Price per unit" type="number" value={form.price_per_unit} onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })} />
          <Input label="Initial stock" type="number" value={form.available_quantity} onChange={(e) => setForm({ ...form, available_quantity: e.target.value })} />
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
