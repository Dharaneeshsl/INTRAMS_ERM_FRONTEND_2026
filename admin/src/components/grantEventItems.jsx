import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage, INVENTORY_CHANGED_MESSAGE } from '../utils/apiError';
import { getAllocationMetrics, validateAllocation } from '../utils/allocation';
import { handlePdfBlob } from '../utils/pdf';
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

export default function GrantEventItems() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [eventData, setEventData] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [grantQuantity, setGrantQuantity] = useState('');
  const [grantNotes, setGrantNotes] = useState('');
  const [grantError, setGrantError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [granting, setGranting] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  const getMaster = (name) =>
    availableItems.find((i) => (i.item_name || '').toLowerCase() === (name || '').toLowerCase());
  const getStock = (name) => getMaster(name)?.available_quantity || 0;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [eventRes, itemsRes] = await Promise.all([adminAPI.getEventQuantityToProvide(id), adminAPI.getItems()]);
      if (eventRes.data?.success) setEventData(eventRes.data.data);
      else setError('Unable to load grant details.');
      setAvailableItems(itemsRes.data?.data || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load allocation data.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const metrics = selectedItem ? getAllocationMetrics(selectedItem, getStock(selectedItem.item_name)) : null;
  const qty = parseInt(grantQuantity, 10);

  const openAllocate = (item) => {
    const m = getAllocationMetrics(item, getStock(item.item_name));
    if (m.maxAllocatable <= 0) {
      showToast(m.availableStock <= 0 ? 'No stock available for this item.' : 'This request is already fully allocated.', 'warning');
      return;
    }
    setSelectedItem(item);
    setGrantQuantity('');
    setGrantNotes('');
    setGrantError('');
    setConfirmOpen(false);
  };

  const goConfirm = (e) => {
    e.preventDefault();
    const m = getAllocationMetrics(selectedItem, getStock(selectedItem.item_name));
    const invalid = validateAllocation(qty, m.remainingRequest, m.availableStock);
    if (invalid) {
      setGrantError(invalid);
      return;
    }
    setGrantError('');
    setConfirmOpen(true);
  };

  const executeGrant = async () => {
    const m = getAllocationMetrics(selectedItem, getStock(selectedItem.item_name));
    const master = getMaster(selectedItem.item_name);
    try {
      setGranting(true);
      await adminAPI.grantItemsToEvent({
        event_id: id,
        submission_id: id,
        item_id: master?._id || selectedItem.item_id,
        quantity: qty,
        granted_to:
          eventData?.eventDetails?.associationName ||
          eventData?.event?.club_name ||
          eventData?.eventDetails?.eventName ||
          'Association',
        notes: grantNotes || 'Admin item allocation',
      });
      showToast(`Allocated ${qty} ${selectedItem.item_name}.`, 'success');
      setSelectedItem(null);
      setConfirmOpen(false);
      await fetchData();
    } catch (err) {
      const mapped = getApiErrorMessage(err, 'Unable to allocate items.');
      const message = mapped === 'INVENTORY_CHANGED' ? INVENTORY_CHANGED_MESSAGE : mapped;
      setGrantError(message);
      showToast(message, 'error');
      setConfirmOpen(false);
      await fetchData();
    } finally {
      setGranting(false);
    }
  };

  const revert = async (grantId) => {
    if (!window.confirm('Reverting this allocation will return the allocated quantity to inventory.')) return;
    try {
      await adminAPI.revertGrant(grantId);
      showToast('Grant reverted. Inventory updated.', 'success');
      const res = await adminAPI.getEventGrantHistory(id);
      setHistory(res.data?.data || []);
      await fetchData();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to revert grant.'), 'error');
    }
  };

  const itemsList = eventData?.items || [];
  const filtered = itemsList.filter((item) => (item.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  const eventName = eventData?.eventDetails?.eventName || eventData?.event?.name || 'Event';

  return (
    <div>
      <Button variant="ghost" className="mb-4 px-0" onClick={() => navigate('/grant-allocation')}>
        Back to grant allocation
      </Button>
      <PageHeader
        title="Admin allocation"
        subtitle={`${eventName} · ${eventData?.eventDetails?.associationName || eventData?.event?.club_name || ''}`}
        actions={
          <>
            <Button
              variant="secondary"
              loading={pdfLoading}
              onClick={async () => {
                try {
                  setPdfLoading(true);
                  const res = await adminAPI.getProcurementPDF(id);
                  await handlePdfBlob(res, { filename: `Procurement_${eventName}.pdf`, preview: true });
                } catch (err) {
                  showToast(getApiErrorMessage(err, 'Unable to generate PDF.'), 'error');
                } finally {
                  setPdfLoading(false);
                }
              }}
            >
              Preview PDF
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                setHistoryOpen(true);
                try {
                  const res = await adminAPI.getEventGrantHistory(id);
                  setHistory(res.data?.data || []);
                } catch (err) {
                  showToast(getApiErrorMessage(err, 'Unable to load grant history.'), 'error');
                }
              }}
            >
              Event grant history
            </Button>
          </>
        }
      />

      {loading && <TableSkeleton />}
      {error && <p className="text-rose-300 text-[13px] mb-4">{error}</p>}

      {!loading && !error && (
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h2 className="font-heading font-semibold">Requested items</h2>
            <div className="sm:w-64">
              <Input placeholder="Search items" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={Package} title="No requested items" />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Item</Th>
                  <Th numeric>Requested</Th>
                  <Th numeric>Allocated</Th>
                  <Th numeric>Remaining</Th>
                  <Th numeric>Available stock</Th>
                  <Th numeric>Max allocatable</Th>
                  <Th></Th>
                </tr>
              </THead>
              <tbody>
                {filtered.map((item) => {
                  const m = getAllocationMetrics(item, getStock(item.item_name));
                  const status =
                    m.remainingRequest === 0 ? 'fully_allocated' : m.alreadyAllocated > 0 ? 'partially_allocated' : 'pending';
                  return (
                    <Tr key={item._id || item.item_name}>
                      <Td className="text-white font-medium">{item.item_name}</Td>
                      <Td numeric>{m.requested}</Td>
                      <Td numeric>{m.alreadyAllocated}</Td>
                      <Td numeric>{m.remainingRequest}</Td>
                      <Td numeric>{m.availableStock}</Td>
                      <Td numeric>{m.maxAllocatable}</Td>
                      <Td>
                        <div className="flex items-center justify-end gap-2">
                          <Badge status={status} />
                          <Button disabled={m.maxAllocatable <= 0} onClick={() => openAllocate(item)}>
                            Allocate
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

      <Modal open={Boolean(selectedItem) && !confirmOpen} title="Allocate item" onClose={() => setSelectedItem(null)}>
        {selectedItem && metrics && (
          <form onSubmit={goConfirm} className="space-y-3">
            <p className="text-[13px] text-slate-400">{selectedItem.item_name}</p>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <p>Requested: <span className="text-white">{metrics.requested}</span></p>
              <p>Already allocated: <span className="text-white">{metrics.alreadyAllocated}</span></p>
              <p>Remaining: <span className="text-white">{metrics.remainingRequest}</span></p>
              <p>Available inventory: <span className="text-white">{metrics.availableStock}</span></p>
            </div>
            <Input
              label={`Quantity (max ${metrics.maxAllocatable})`}
              type="number"
              min="1"
              max={metrics.maxAllocatable}
              value={grantQuantity}
              onChange={(e) => setGrantQuantity(e.target.value)}
            />
            <Input label="Notes" value={grantNotes} onChange={(e) => setGrantNotes(e.target.value)} />
            {grantError && <p className="text-rose-400 text-[13px]">{grantError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={confirmOpen}
        title="Confirm allocation"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button loading={granting} onClick={executeGrant}>
              Confirm allocation
            </Button>
          </>
        }
      >
        {selectedItem && metrics && (
          <div className="space-y-2 text-[13px] text-slate-300">
            <p>Event: <span className="text-white">{eventName}</span></p>
            <p>Item: <span className="text-white">{selectedItem.item_name}</span></p>
            <p>Requested: {metrics.requested}</p>
            <p>Already allocated: {metrics.alreadyAllocated}</p>
            <p>Remaining: {metrics.remainingRequest}</p>
            <p>Available inventory: {metrics.availableStock}</p>
            <p>You are allocating: <span className="text-white font-semibold">{qty || 0}</span></p>
            <p>Remaining after allocation: {Math.max(0, metrics.remainingRequest - (qty || 0))}</p>
            {grantError && <p className="text-rose-400">{grantError}</p>}
          </div>
        )}
      </Modal>

      <Modal open={historyOpen} title="Event grant history" onClose={() => setHistoryOpen(false)} wide>
        {history.length === 0 ? (
          <EmptyState title="No grants for this event" />
        ) : (
          <Table>
            <THead>
              <tr>
                <Th>Item</Th>
                <Th numeric>Qty</Th>
                <Th>Admin</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </THead>
            <tbody>
              {history.map((g) => (
                <Tr key={g._id}>
                  <Td className="text-white">{g.item_name}</Td>
                  <Td numeric>{g.quantity}</Td>
                  <Td>{g.granted_by?.username || g.granted_by || 'Admin'}</Td>
                  <Td>
                    <Badge status={g.grant_status || 'active'} />
                  </Td>
                  <Td>
                    {g.grant_status !== 'returned' && (
                      <Button variant="danger" onClick={() => revert(g._id)}>
                        Revert
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal>
    </div>
  );
}
