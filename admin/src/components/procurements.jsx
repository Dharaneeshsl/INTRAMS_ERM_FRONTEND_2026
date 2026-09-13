import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { handlePdfBlob } from '../utils/pdf';
import { useToast } from '../context/ToastContext';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { TableSkeleton } from './ui/LoadingState';

export default function Procurements() {
  const { showToast } = useToast();
  const [procurements, setProcurements] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfLoading, setPdfLoading] = useState('');

  const fetchProcurements = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getProcurements();
      const data = res.data?.data || {};
      setProcurements(data.procurements || []);
      setItems(data.items || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load procurement records.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcurements();
  }, []);

  const pdf = async (eventId, preview) => {
    if (!eventId) {
      showToast('No event is linked to this procurement record.', 'warning');
      return;
    }
    try {
      setPdfLoading(eventId);
      const res = await adminAPI.getProcurementPDF(eventId);
      await handlePdfBlob(res, { filename: `Procurement_${eventId}.pdf`, preview });
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to generate procurement PDF.'), 'error');
    } finally {
      setPdfLoading('');
    }
  };

  const filtered = procurements.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.submission_id?.event_name || '').toLowerCase().includes(term) ||
      (p.requested_by?.club_name || '').toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <PageHeader
        title="Procurement"
        subtitle="Shortage requisitions generated when requests exceed SU inventory"
        actions={
          <Button variant="secondary" onClick={fetchProcurements}>
            Refresh
          </Button>
        }
      />
      <div className="max-w-sm mb-5">
        <Input placeholder="Search event or association" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {loading && <TableSkeleton />}
      {error && <p className="text-rose-300 text-[13px]">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <Card>
          <EmptyState icon={ShoppingCart} title="No procurement records" message="Shortages are logged when allocation demand exceeds stock." />
        </Card>
      )}
      <div className="space-y-3">
        {filtered.map((proc) => {
          const reqItems = items.filter((i) => i.procurement_id === proc._id || i.procurement_id?._id === proc._id);
          const eventId = proc.submission_id?._id || proc.submission_id;
          return (
            <Card key={proc._id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-heading font-semibold text-white">{proc.submission_id?.event_name || 'Event'}</p>
                  <p className="text-[13px] text-slate-500">{proc.requested_by?.club_name || 'Association'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={proc.status || 'pending'} />
                  {eventId && (
                    <>
                      <Button variant="secondary" loading={pdfLoading === eventId} onClick={() => pdf(eventId, true)}>
                        Preview PDF
                      </Button>
                      <Button variant="secondary" loading={pdfLoading === eventId} onClick={() => pdf(eventId, false)}>
                        Download PDF
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4 divide-y divide-[var(--border)]">
                {reqItems.length === 0 && <p className="text-[13px] text-slate-500">Shortage logged during allocation.</p>}
                {reqItems.map((item) => (
                  <div key={item._id} className="py-2 flex justify-between text-[13px]">
                    <span className="text-white">{item.item_name || item.item_id?.item_name}</span>
                    <span className="font-mono text-slate-400">Shortage {item.requested_quantity ?? item.shortage_quantity ?? '—'}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
