import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { Table, THead, Th, Td, Tr } from './ui/Table';
import { TableSkeleton } from './ui/LoadingState';

export default function AssociationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [association, setAssociation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [assocRes, eventsRes] = await Promise.all([
          adminAPI.getAssociations(),
          adminAPI.getEventsByAssociation(id),
        ]);
        const clubs = assocRes.data?.data || assocRes.data?.associations || [];
        setAssociation(clubs.find((c) => c._id === id) || null);
        setEvents(eventsRes.data?.data || []);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load association details.'));
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <TableSkeleton />;

  const submittedCount = events.filter((ev) =>
    ['submitted', 'approved', 'under_review', 'edit_requested'].includes(String(ev.status || '').toLowerCase())
  ).length;

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/associations')} className="mb-4 px-0">
        Back to associations
      </Button>
      <PageHeader
        title={association?.club_name || association?.name || 'Association'}
        subtitle="Association details, events and ERM submissions"
      />
      {error && <p className="text-rose-300 text-[13px] mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <p className="text-[11px] uppercase text-slate-500">Username</p>
          <p className="text-white mt-1 font-mono text-[13px]">@{association?.username || '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-slate-500">Email</p>
          <p className="text-white mt-1 text-[13px] truncate">{association?.email || '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-slate-500">Advisor</p>
          <p className="text-white mt-1 text-[13px]">{association?.faculty_advisor || '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-slate-500">Status</p>
          <div className="mt-1">
            <Badge status={association?.is_active === false ? 'rejected' : 'active'}>
              {association?.is_active === false ? 'Inactive' : 'Active'}
            </Badge>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex justify-between">
          <h2 className="font-heading font-semibold">Events ({events.length})</h2>
          <span className="text-[12px] text-slate-500">{submittedCount} submitted</span>
        </div>
        {events.length === 0 ? (
          <EmptyState icon={Calendar} title="No events" message="This association has not submitted ERM forms yet." />
        ) : (
          <Table>
            <THead>
              <tr>
                <Th>Event</Th>
                <Th>Event ID</Th>
                <Th>ERM status</Th>
                <Th numeric>Requested items</Th>
                <Th></Th>
              </tr>
            </THead>
            <tbody>
              {events.map((ev) => {
                const eventId = ev._id || ev.id;
                const submitted = ['submitted', 'approved', 'under_review', 'edit_requested'].includes(
                  String(ev.status || '').toLowerCase()
                );
                return (
                  <Tr key={eventId}>
                    <Td className="text-white font-medium">{ev.event_name || ev.name || 'Untitled'}</Td>
                    <Td className="font-mono text-slate-400">{ev.event_id || '—'}</Td>
                    <Td>
                      <Badge status={ev.status} />
                    </Td>
                    <Td numeric>{Array.isArray(ev.items) ? ev.items.length : 0}</Td>
                    <Td>
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => navigate(`/events/${eventId}`)}>
                          Details
                        </Button>
                        {submitted && (
                          <Button onClick={() => navigate(`/grant-allocation/${eventId}`)}>Allocate</Button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
