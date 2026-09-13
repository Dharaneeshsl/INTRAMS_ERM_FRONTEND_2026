import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { handlePdfBlob } from '../utils/pdf';
import { getAllocated, getRequested } from '../utils/allocation';
import { useToast } from '../context/ToastContext';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { Table, THead, Th, Td, Tr } from './ui/Table';
import EmptyState from './ui/EmptyState';
import { TableSkeleton } from './ui/LoadingState';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getEventById(id);
      setEvent(res.data?.data || res.data);
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to load event details.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const handleStatus = async (status) => {
    if (!event) return;
    try {
      setStatusLoading(true);
      await adminAPI.updateEventStatus(event._id, status);
      showToast(`Event marked as ${status}.`, 'success');
      await fetchEvent();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to update event status.'), 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePdf = async (type) => {
    if (!event) return;
    try {
      setPdfLoading(type);
      const map = {
        event: () => adminAPI.getEventPDF(event._id),
        items: () => adminAPI.getEventItemsPDF(event._id),
        procurement: () => adminAPI.getProcurementPDF(event._id),
      };
      const res = await map[type]();
      await handlePdfBlob(res, { filename: `${type}_${event.event_id || event._id}.pdf` });
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to generate PDF.'), 'error');
    } finally {
      setPdfLoading('');
    }
  };

  const handleDelete = async () => {
    if (!event || !window.confirm('Delete this event proposal?')) return;
    try {
      await adminAPI.deleteEvent(event._id);
      showToast('Event deleted.', 'success');
      navigate('/events');
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to delete event.'), 'error');
    }
  };

  if (loading) return <TableSkeleton />;
  if (!event) return <EmptyState title="Event not found" />;

  const itemsList = Array.isArray(event.items) ? event.items : [];
  const contacts = event.contacts || {};

  return (
    <div>
      <Button variant="ghost" className="mb-4 px-0" onClick={() => navigate('/events')}>
        Back to events
      </Button>
      <PageHeader
        title={event.name || event.event_name || 'Event'}
        subtitle={`${event.club_name || 'Association'} · ${event.event_id || ''}`}
        actions={
          <>
            <Button onClick={() => navigate(`/grant-allocation/${event._id}`)}>Allocate items</Button>
            <Button variant="secondary" loading={pdfLoading === 'event'} onClick={() => handlePdf('event')}>
              Event PDF
            </Button>
            <Button variant="secondary" loading={pdfLoading === 'items'} onClick={() => handlePdf('items')}>
              Items PDF
            </Button>
            <Button variant="secondary" loading={pdfLoading === 'procurement'} onClick={() => handlePdf('procurement')}>
              Procurement PDF
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold">Event information</h2>
              <Badge status={event.status} />
            </div>
            {event.tagline && <p className="text-[13px] text-slate-400 italic mb-3">{event.tagline}</p>}
            <p className="text-[14px] text-slate-300">{event.description || event.about || 'No description provided.'}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-[13px]">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-white">{event.event_type || 'General'}</p>
              </div>
              <div>
                <p className="text-slate-500">Participant mode</p>
                <p className="text-white">{event.form?.participant_type || '—'}</p>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h2 className="font-heading font-semibold">Requested items</h2>
            </div>
            {itemsList.length === 0 ? (
              <EmptyState title="No requested items" />
            ) : (
              <Table>
                <THead>
                  <tr>
                    <Th>Item</Th>
                    <Th numeric>Requested</Th>
                    <Th numeric>Allocated</Th>
                    <Th numeric>Remaining</Th>
                  </tr>
                </THead>
                <tbody>
                  {itemsList.map((item) => {
                    const requested = getRequested(item);
                    const allocated = getAllocated(item);
                    return (
                      <Tr key={item._id || item.item_name}>
                        <Td className="text-white">{item.item_name}</Td>
                        <Td numeric>{requested}</Td>
                        <Td numeric>{allocated}</Td>
                        <Td numeric>{Math.max(0, requested - allocated)}</Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-heading font-semibold mb-3">Association</h3>
            <p className="text-white text-[14px]">{event.club_name || '—'}</p>
            {contacts.faculty_advisor?.name && (
              <p className="text-[13px] text-slate-400 mt-2">Advisor: {contacts.faculty_advisor.name}</p>
            )}
            {contacts.secretary?.name && (
              <p className="text-[13px] text-slate-400 mt-1">Secretary: {contacts.secretary.name}</p>
            )}
          </Card>
          <Card className="p-5 space-y-2">
            <h3 className="font-heading font-semibold mb-2">Admin actions</h3>
            <Button className="w-full" variant="success" loading={statusLoading} disabled={event.status === 'approved'} onClick={() => handleStatus('approved')}>
              Approve
            </Button>
            <Button className="w-full" variant="danger" loading={statusLoading} disabled={event.status === 'rejected'} onClick={() => handleStatus('rejected')}>
              Reject
            </Button>
            <Button className="w-full" variant="ghost" onClick={handleDelete}>
              Delete proposal
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
