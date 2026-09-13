import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Package,
  Gift,
  ShoppingCart,
  ShieldCheck,
  Warehouse,
  FileWarning,
} from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import PageHeader from './ui/PageHeader';
import StatCard from './ui/StatCard';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { DashboardSkeleton } from './ui/LoadingState';
import { Table, THead, Th, Td, Tr } from './ui/Table';
import EmptyState from './ui/EmptyState';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, eventsRes, assocRes, procRes, itemsRes] = await Promise.allSettled([
          adminAPI.getStats(),
          adminAPI.getEvents(),
          adminAPI.getAssociations(),
          adminAPI.getProcurements(),
          adminAPI.getItems(),
        ]);

        const statsData = statsRes.status === 'fulfilled' ? statsRes.value.data?.data || {} : {};
        const eventsList =
          eventsRes.status === 'fulfilled'
            ? eventsRes.value.data?.data || eventsRes.value.data?.events || []
            : [];
        const assocList = assocRes.status === 'fulfilled' ? assocRes.value.data?.data || [] : [];
        const procItems =
          procRes.status === 'fulfilled' ? procRes.value.data?.data?.items || [] : [];
        const itemsList = itemsRes.status === 'fulfilled' ? itemsRes.value.data?.data || [] : [];
        const stockSum = itemsList.reduce((acc, item) => acc + (item.available_quantity || 0), 0);
        const submitted = eventsList.filter((e) =>
          ['submitted', 'approved', 'under_review'].includes(String(e.status || '').toLowerCase())
        ).length;
        const pending = eventsList.filter((e) =>
          ['draft', 'pending'].includes(String(e.status || '').toLowerCase())
        ).length;

        setEvents(eventsList);
        setItems(itemsList);
        setStats({
          totalClubs: statsData.totalClubs || assocList.length || 0,
          totalEvents: statsData.totalEvents || eventsList.length || 0,
          submittedEvents: statsData.submittedEvents || submitted,
          pendingSubmissions: statsData.pendingSubmissions ?? pending,
          pendingEditRequests: statsData.pendingEditRequests || 0,
          totalItems: statsData.totalItems || itemsList.length || 0,
          totalAvailableStock: stockSum,
          totalGrants: statsData.totalGrants || 0,
          procurementCount: procItems.length,
        });
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load dashboard. Please try again.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="INTRAMS ERM Dashboard"
        subtitle="Monitor associations, events, inventory and allocations"
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/associations')}>
              View Associations
            </Button>
            <Button variant="secondary" onClick={() => navigate('/events')}>
              Review Submissions
            </Button>
            <Button onClick={() => navigate('/grant-allocation')}>Grant Allocation</Button>
            <Button variant="secondary" onClick={() => navigate('/inventory')}>
              Manage Inventory
            </Button>
            <Button variant="secondary" onClick={() => navigate('/procurement')}>
              Procurement
            </Button>
          </>
        }
      />

      {error && <p className="mb-4 text-[13px] text-rose-300">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Associations" value={stats.totalClubs} subtext="Registered clubs" icon={Building2} onClick={() => navigate('/associations')} />
        <StatCard title="Total Events" value={stats.totalEvents} subtext="All ERM proposals" icon={Calendar} onClick={() => navigate('/events')} />
        <StatCard title="Submitted ERM" value={stats.submittedEvents} subtext="Awaiting or under review" icon={Calendar} onClick={() => navigate('/events')} />
        <StatCard title="Pending Submissions" value={stats.pendingSubmissions} subtext="Still in draft" icon={FileWarning} />
        <StatCard title="Master Items" value={stats.totalItems} subtext="Catalog entries" icon={Package} onClick={() => navigate('/items')} />
        <StatCard title="Available Inventory" value={stats.totalAvailableStock} subtext="Units currently in stock" icon={Warehouse} onClick={() => navigate('/inventory')} />
        <StatCard title="Allocated Items" value={stats.totalGrants} subtext="Grant records" icon={Gift} onClick={() => navigate('/grant-history')} />
        <StatCard title="Shortages" value={stats.procurementCount} subtext="Procurement requisitions" icon={ShoppingCart} onClick={() => navigate('/procurement')} />
        <StatCard title="Pending Edit Requests" value={stats.pendingEditRequests} subtext="Convenor edit access" icon={ShieldCheck} onClick={() => navigate('/edit-access')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold">Recent events</h2>
            <Button variant="ghost" onClick={() => navigate('/events')}>
              View all
            </Button>
          </div>
          {events.length === 0 ? (
            <EmptyState title="No events" message="Submitted ERM forms will appear here." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Event</Th>
                  <Th>Association</Th>
                  <Th>Status</Th>
                  <Th numeric>Items</Th>
                </tr>
              </THead>
              <tbody>
                {events.slice(0, 8).map((ev) => (
                  <Tr key={ev._id || ev.id} onClick={() => navigate(`/events/${ev._id || ev.id}`)}>
                    <Td className="text-white font-medium">{ev.name || ev.event_name || 'Untitled'}</Td>
                    <Td>{ev.club_name || '—'}</Td>
                    <Td>
                      <Badge status={ev.status} />
                    </Td>
                    <Td numeric>{Array.isArray(ev.items) ? ev.items.length : 0}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold">Inventory snapshot</h2>
            <Button variant="ghost" onClick={() => navigate('/inventory')}>
              Open
            </Button>
          </div>
          {items.length === 0 ? (
            <EmptyState title="No inventory" message="Master items will appear here." />
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {items.slice(0, 8).map((item) => (
                <div key={item._id} className="px-4 py-3 flex justify-between text-[13px]">
                  <span className="text-white">{item.item_name}</span>
                  <span className="font-mono text-slate-400">{item.available_quantity ?? 0}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
