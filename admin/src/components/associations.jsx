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
        title="CLUB ASSOCIATIONS DIRECTORY"
        subtitle="Manage registered clubs, convenor accounts, and submitted ERM proposals"
        actions={<Button onClick={() => setShowCreate(true)}>+ ADD ASSOCIATION</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="sm:w-80">
          <Input placeholder="SEARCH NAME, USERNAME OR EMAIL..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((s) => (
            <Button key={s} variant={statusFilter === s ? 'primary' : 'secondary'} onClick={() => setStatusFilter(s)}>
              {s.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {loading && <TableSkeleton />}
      {error && <p className="text-[#FF4D67] text-[13px] font-bold border border-[#FF4D67]/40 bg-[#050505] p-3 mb-4">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <Card>
          <EmptyState icon={Users} title="NO ASSOCIATIONS FOUND" message="Create a club association account to get started." />
        </Card>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((assoc) => (
            <button
              key={assoc._id}
              type="button"
              onClick={() => navigate(`/associations/${assoc._id}`)}
              className="text-left bg-[#050505] border border-[#252525] rounded-none p-5 hover:border-[#00AEEF] hover:bg-[#080808] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading font-bold text-[#FFFFFF] text-base">{assoc.club_name || assoc.name}</p>
                  <p className="text-[12px] text-[#00AEEF] font-bold font-mono mt-0.5">@{assoc.username}</p>
                </div>
                <Badge status={assoc.is_active === false ? 'rejected' : 'active'}>
                  {assoc.is_active === false ? 'INACTIVE' : 'ACTIVE'}
                </Badge>
              </div>
              <p className="mt-3 text-[13px] text-[#E5E5E5] truncate">{assoc.email || 'No email'}</p>
              <p className="mt-1 text-[11px] text-[#A0A0A0] font-bold uppercase">ADVISOR: {assoc.faculty_advisor || '—'}</p>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        title="ADD CLUB ASSOCIATION"
        onClose={() => setShowCreate(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              CANCEL
            </Button>
            <Button loading={formLoading} onClick={handleCreate}>
              CREATE
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Club Name" value={formData.club_name} onChange={(e) => setFormData({ ...formData, club_name: e.target.value })} />
          <Input label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <Input label="Faculty Advisor" value={formData.faculty_advisor} onChange={(e) => setFormData({ ...formData, faculty_advisor: e.target.value })} />
          {formError && <p className="text-[#FF4D67] text-[13px] font-bold">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}

