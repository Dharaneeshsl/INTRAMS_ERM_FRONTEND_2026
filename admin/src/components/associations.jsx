import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Modal from './ui/Modal';
import EmptyState from './ui/EmptyState';
import { TableSkeleton } from './ui/LoadingState';

export default function AssociationsList() {
  const navigate = useNavigate();
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    club_name: '',
    username: '',
    email: '',
    password: '',
    faculty_advisor: '',
  });

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getAssociations();
      setAssociations(res.data?.data || res.data?.associations || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load associations. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.club_name || !formData.username || !formData.email || !formData.password) {
      setFormError('Club name, username, email and password are required.');
      return;
    }
    try {
      setFormLoading(true);
      await adminAPI.createAssociation(formData);
      setShowCreate(false);
      setFormData({ club_name: '', username: '', email: '', password: '', faculty_advisor: '' });
      await fetchAssociations();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to create association.'));
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = associations.filter((assoc) => {
    const term = searchTerm.toLowerCase();
    const name = (assoc.club_name || assoc.name || '').toLowerCase();
    const match =
      name.includes(term) ||
      (assoc.username || '').toLowerCase().includes(term) ||
      (assoc.email || '').toLowerCase().includes(term);
    if (statusFilter === 'active') return match && assoc.is_active !== false;
    if (statusFilter === 'inactive') return match && assoc.is_active === false;
    return match;
  });

  return (
    <div>
      <PageHeader
        title="Club Associations"
        subtitle="Manage registered clubs, events and ERM submissions"
        actions={<Button onClick={() => setShowCreate(true)}>Add association</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="sm:w-80">
          <Input placeholder="Search name, username or email" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((s) => (
            <Button key={s} variant={statusFilter === s ? 'primary' : 'secondary'} onClick={() => setStatusFilter(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>

      {loading && <TableSkeleton />}
      {error && <p className="text-rose-300 text-[13px]">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <Card>
          <EmptyState icon={Users} title="No associations" message="Create a club account to get started." />
        </Card>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((assoc) => (
            <button
              key={assoc._id}
              type="button"
              onClick={() => navigate(`/associations/${assoc._id}`)}
              className="text-left bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading font-semibold text-white">{assoc.club_name || assoc.name}</p>
                  <p className="text-[12px] text-slate-500 font-mono">@{assoc.username}</p>
                </div>
                <Badge status={assoc.is_active === false ? 'rejected' : 'active'}>
                  {assoc.is_active === false ? 'Inactive' : 'Active'}
                </Badge>
              </div>
              <p className="mt-3 text-[13px] text-slate-400 truncate">{assoc.email || 'No email'}</p>
              <p className="mt-1 text-[12px] text-slate-500">Advisor: {assoc.faculty_advisor || '—'}</p>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        title="Add club association"
        onClose={() => setShowCreate(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button loading={formLoading} onClick={handleCreate}>
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Club name" value={formData.club_name} onChange={(e) => setFormData({ ...formData, club_name: e.target.value })} />
          <Input label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <Input label="Faculty advisor" value={formData.faculty_advisor} onChange={(e) => setFormData({ ...formData, faculty_advisor: e.target.value })} />
          {formError && <p className="text-rose-400 text-[13px]">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}
