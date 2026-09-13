import React, { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { Table, THead, Th, Td, Tr } from './ui/Table';
import { TableSkeleton } from './ui/LoadingState';

export default function LabConfirmation() {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getEvents();
      setEvents(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load lab confirmation data.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateStatus = async (eventId, lab_status) => {
    try {
      setUpdating(eventId);
      await adminAPI.updateLabStatus(eventId, { lab_status });
      showToast(`Lab status set to ${lab_status}.`, 'success');
      await fetchEvents();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to update lab status.'), 'error');
    } finally {
      setUpdating('');
    }
  };

  const filtered = events.filter((event) => {
    const halls = event.form?.preferred_halls || event.preferred_halls || '';
    const hallsStr = Array.isArray(halls) ? halls.join(', ') : String(halls);
    const term = searchTerm.toLowerCase();
    return (
      (event.name || event.event_name || '').toLowerCase().includes(term) ||
      (event.club_name || '').toLowerCase().includes(term) ||
      hallsStr.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <PageHeader
        title="Lab confirmation"
        subtitle="Review preferred venues and confirm or reject lab allocations"
        actions={
          <Button variant="secondary" onClick={fetchEvents}>
            Refresh
          </Button>
        }
      />
      <div className="max-w-sm mb-5">
        <Input placeholder="Search event, association or venue" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {loading && <TableSkeleton />}
      {error && <p className="text-rose-300 text-[13px]">{error}</p>}
      {!loading && !error && (
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={FlaskConical} title="No lab records" message="Events with venue requests will appear here." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Event</Th>
                  <Th>Association</Th>
                  <Th>Preferred venue</Th>
                  <Th>Lab status</Th>
                  <Th></Th>
                </tr>
              </THead>
              <tbody>
                {filtered.map((event) => {
                  const labStatus = event.form?.lab_status || event.lab_status || 'pending';
                  const halls = event.form?.preferred_halls || event.preferred_halls || 'Not specified';
                  return (
                    <Tr key={event._id}>
                      <Td className="text-white">{event.name || event.event_name}</Td>
                      <Td>{event.club_name || '—'}</Td>
                      <Td>{Array.isArray(halls) ? halls.join(', ') : halls}</Td>
                      <Td>
                        <Badge status={labStatus} />
                      </Td>
                      <Td>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="success"
                            loading={updating === event._id}
                            disabled={labStatus === 'approved' || labStatus === 'confirmed'}
                            onClick={() => updateStatus(event._id, 'approved')}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="danger"
                            loading={updating === event._id}
                            disabled={labStatus === 'rejected'}
                            onClick={() => updateStatus(event._id, 'rejected')}
                          >
                            Reject
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
    </div>
  );
}
