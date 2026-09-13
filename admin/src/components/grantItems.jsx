import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import PageHeader from './ui/PageHeader';
import Input from './ui/Input';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { TableSkeleton } from './ui/LoadingState';

export default function GrantItems() {
  const navigate = useNavigate();
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getAssociations();
        setAssociations(res.data?.data || []);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load associations.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openAssociation = async (assoc) => {
    setSelected(assoc);
    setEvents([]);
    try {
      setEventsLoading(true);
      const res = await adminAPI.getEventsByAssociation(assoc._id);
      setEvents(res.data?.data || []);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const filtered = associations.filter((assoc) => {
    const term = searchTerm.toLowerCase();
    return (
      (assoc.club_name || assoc.association_name || '').toLowerCase().includes(term) ||
      (assoc.username || '').toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <PageHeader
        title="Grant allocation"
        subtitle="Choose an association, then a submitted event, then allocate against SU inventory"
      />
      <div className="max-w-sm mb-5">
        <Input placeholder="Search associations" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {loading && <TableSkeleton />}
      {error && <p className="text-rose-300 text-[13px]">{error}</p>}
      {!loading && filtered.length === 0 && (
        <EmptyState icon={Gift} title="No associations" message="Create clubs before allocating inventory." />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((assoc) => (
          <button
            key={assoc._id}
            type="button"
            onClick={() => openAssociation(assoc)}
            className="text-left bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-white/20"
          >
            <p className="font-heading font-semibold text-white">{assoc.club_name || assoc.association_name}</p>
            <p className="text-[12px] text-slate-500 font-mono mt-1">@{assoc.username}</p>
          </button>
        ))}
      </div>

      <Modal
        open={Boolean(selected)}
        title={selected?.club_name || 'Events'}
        onClose={() => setSelected(null)}
        wide
      >
        {eventsLoading && <TableSkeleton rows={4} />}
        {!eventsLoading && events.length === 0 && <EmptyState title="No submitted ERM forms" />}
        <div className="space-y-2">
          {events.map((ev) => {
            const eventId = ev._id || ev.id;
            return (
              <div key={eventId} className="flex items-center justify-between gap-3 border border-[var(--border)] rounded-lg p-3">
                <div>
                  <p className="text-white text-[14px] font-medium">{ev.event_name || ev.name}</p>
                  <div className="mt-1">
                    <Badge status={ev.status} />
                  </div>
                </div>
                <Button onClick={() => navigate(`/grant-allocation/${eventId}`)}>Open allocation</Button>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
