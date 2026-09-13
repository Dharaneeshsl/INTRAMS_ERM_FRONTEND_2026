import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { Table, THead, Th, Td, Tr } from './ui/Table';
import { TableSkeleton } from './ui/LoadingState';

export default function EventsList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [associationFilter, setAssociationFilter] = useState('all');
  const [submittedFilter, setSubmittedFilter] = useState('all');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getEvents();
      setEvents(res.data?.data || res.data?.events || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load events. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const associations = useMemo(() => {
    const names = new Set(events.map((e) => e.club_name).filter(Boolean));
    return [...names];
  }, [events]);

  const statuses = useMemo(() => {
    const set = new Set(events.map((e) => String(e.status || 'submitted').toLowerCase()));
    return ['all', ...set];
  }, [events]);

  const filtered = events.filter((ev) => {
    const term = searchTerm.toLowerCase();
    const name = (ev.name || ev.event_name || '').toLowerCase();
    const club = (ev.club_name || '').toLowerCase();
    const status = String(ev.status || 'submitted').toLowerCase();
    const submitted = ['submitted', 'approved', 'under_review', 'edit_requested'].includes(status);
    return (
      (name.includes(term) || club.includes(term)) &&
      (statusFilter === 'all' || status === statusFilter) &&
      (associationFilter === 'all' || ev.club_name === associationFilter) &&
      (submittedFilter === 'all' || (submittedFilter === 'submitted' ? submitted : !submitted))
    );
  });

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Search and review ERM submissions across associations"
        actions={
          <Button variant="secondary" onClick={fetchEvents}>
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <Input placeholder="Search event or association" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
        <Select value={associationFilter} onChange={(e) => setAssociationFilter(e.target.value)}>
          <option value="all">All associations</option>
          {associations.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
        <Select value={submittedFilter} onChange={(e) => setSubmittedFilter(e.target.value)}>
          <option value="all">Submitted and drafts</option>
          <option value="submitted">Submitted</option>
          <option value="not_submitted">Not submitted</option>
        </Select>
      </div>

      {loading && <TableSkeleton />}
      {error && <p className="text-rose-300 text-[13px]">{error}</p>}

      {!loading && !error && (
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={Calendar} title="No events" message="No event proposals match these filters." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Event ID</Th>
                  <Th>Event</Th>
                  <Th>Association</Th>
                  <Th>ERM status</Th>
                  <Th numeric>Requested</Th>
                  <Th></Th>
                </tr>
              </THead>
              <tbody>
                {filtered.map((ev) => {
                  const eventId = ev._id || ev.id;
                  const submitted = ['submitted', 'approved', 'under_review', 'edit_requested'].includes(
                    String(ev.status || '').toLowerCase()
                  );
                  return (
                    <Tr key={eventId}>
                      <Td className="font-mono text-slate-400">{ev.event_id || '—'}</Td>
                      <Td className="text-white font-medium">{ev.name || ev.event_name || 'Untitled'}</Td>
                      <Td>{ev.club_name || '—'}</Td>
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
      )}
    </div>
  );
}
