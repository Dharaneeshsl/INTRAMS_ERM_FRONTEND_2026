import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { adminAPI } from '../api';
import { getApiErrorMessage } from '../utils/apiError';
import { handlePdfBlob } from '../utils/pdf';
import { useToast } from '../context/ToastContext';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';

const ROLES = [
  { id: 'secretary', label: 'Secretary' },
  { id: 'convenor', label: 'Convenor' },
  { id: 'volunteer', label: 'Volunteer' },
];

export default function Reports() {
  const { showToast } = useToast();
  const [busy, setBusy] = useState('');
  const [eventId, setEventId] = useState('');

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewFilename, setPreviewFilename] = useState('');

  const run = async (key, request, filename, preview = false) => {
    try {
      setBusy(key);
      const res = await request();
      const url = await handlePdfBlob(res, { filename, preview });
      return url;
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to generate this document.'), 'error');
      return null;
    } finally {
      setBusy('');
    }
  };

  const openPreview = async (key, request, filename) => {
    const url = await run(key, request, filename, true);
    if (url) {
      setPreviewUrl(url);
      setPreviewFilename(filename);
      setPreviewOpen(true);
    }
  };

  return (
    <div>
      <PageHeader title="Reports & documents" subtitle="Generate official ERM administrative PDFs from the backend" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h2 className="font-heading font-semibold mb-1">Role reports</h2>
          <p className="text-[13px] text-slate-500 mb-4">Personnel rosters by existing backend roles.</p>
          <div className="space-y-2">
            {ROLES.map((role) => (
              <div key={role.id} className="flex items-center justify-between gap-2">
                <span className="text-[14px] text-white">{role.label}</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    loading={busy === `${role.id}-preview`}
                    onClick={() => openPreview(`${role.id}-preview`, () => adminAPI.getRoleWisePDF(role.id), `Role_${role.id}.pdf`)}
                  >
                    Preview
                  </Button>
                  <Button
                    loading={busy === role.id}
                    onClick={() => run(role.id, () => adminAPI.getRoleWisePDF(role.id), `Role_${role.id}.pdf`)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-semibold mb-1">Event reports</h2>
          <p className="text-[13px] text-slate-500 mb-4">Uses the event Mongo ID from event details.</p>
          <Input label="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="Paste event ID" />
          <div className="mt-3 space-y-2">
            <Button
              className="w-full"
              variant="secondary"
              disabled={!eventId}
              loading={busy === 'event-preview'}
              onClick={() => openPreview('event-preview', () => adminAPI.getEventPDF(eventId), `Event_${eventId}.pdf`)}
            >
              Preview
            </Button>
            <Button
              className="w-full"
              disabled={!eventId}
              loading={busy === 'event'}
              onClick={() => run('event', () => adminAPI.getEventPDF(eventId), `Event_${eventId}.pdf`)}
            >
              Event summary PDF
            </Button>
            <Button
              className="w-full"
              disabled={!eventId}
              loading={busy === 'items'}
              onClick={() => run('items', () => adminAPI.getEventItemsPDF(eventId), `Items_${eventId}.pdf`)}
            >
              Event items PDF
            </Button>
            <Button
              className="w-full"
              disabled={!eventId}
              loading={busy === 'alloc'}
              onClick={() => run('alloc', () => adminAPI.getProcurementPDF(eventId), `Allocation_${eventId}.pdf`)}
            >
              Allocation / procurement PDF
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-semibold mb-1 flex items-center gap-2">
            <FileText className="w-4 h-4" /> All-events summary
          </h2>
          <p className="text-[13px] text-slate-500 mb-4">Backend-generated overview of submitted events.</p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              loading={busy === 'summary-view'}
              onClick={() => openPreview('summary-view', () => adminAPI.getEventsSummaryPDF(), 'INTRAMS_Events_Summary.pdf')}
            >
              Preview
            </Button>
            <Button
              loading={busy === 'summary'}
              onClick={() => run('summary', () => adminAPI.getEventsSummaryPDF(), 'INTRAMS_Events_Summary.pdf')}
            >
              Download
            </Button>
          </div>
        </Card>
      </div>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title={previewFilename} wide>
        {previewUrl ? (
          <div className="h-[70vh]">
            <iframe title="PDF Preview" src={previewUrl} className="w-full h-full border" />
          </div>
        ) : (
          <div>Loading preview…</div>
        )}
        <div />
      </Modal>
    </div>
  );
}
