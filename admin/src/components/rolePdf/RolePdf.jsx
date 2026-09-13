import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import ReportSummary from './ReportSummary';
import PdfPreviewModal from './PdfPreviewModal';
import { adminAPI } from '../../api';
import { getApiErrorMessage } from '../../utils/apiError';
import { useToast } from '../../context/ToastContext';
import { handlePdfBlob } from '../../utils/pdf';
import Button from '../ui/Button';
import PageHeader from '../ui/PageHeader';

const ROLES = [
  { id: 'secretary', label: 'Secretary' },
  { id: 'convenor', label: 'Convenor' },
  { id: 'volunteer', label: 'Volunteer' },
];

export default function RolePdf() {
  const { showToast } = useToast();
  const [selected, setSelected] = useState(ROLES[0].id);
  const [busy, setBusy] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const onSelect = (role) => setSelected(role);

  const previewPdf = async () => {
    try {
      setBusy('preview');
      const res = await adminAPI.getRoleWisePDF(selected);
      const url = await handlePdfBlob(res, { filename: `Role_${selected}.pdf`, preview: true });
      if (url) {
        setPreviewUrl(url);
        setPreviewOpen(true);
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to generate PDF preview.'), 'error');
    } finally {
      setBusy('');
    }
  };

  const downloadPdf = async () => {
    try {
      setBusy('download');
      const res = await adminAPI.getRoleWisePDF(selected);
      await handlePdfBlob(res, { filename: `Role_${selected}.pdf` });
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to download PDF.'), 'error');
    } finally {
      setBusy('');
    }
  };

  const exportExcel = () => {
    showToast('Excel export is not available. Backend endpoint required.', 'info');
  };

  return (
    <div>
      <PageHeader title="Role Reports" subtitle="Generate role-wise personnel PDFs" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <h3 className="font-heading font-semibold mb-2">Select role</h3>
          <RoleSelector roles={ROLES} selected={selected} onSelect={onSelect} />
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" loading={busy === 'preview'} onClick={previewPdf}>Preview</Button>
            <Button loading={busy === 'download'} onClick={downloadPdf}>Download</Button>
            <Button variant="ghost" onClick={exportExcel} disabled>Export Excel</Button>
          </div>
        </div>

        <div className="col-span-2 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <ReportSummary role={selected} />
        </div>
      </div>

      <PdfPreviewModal open={previewOpen} url={previewUrl} filename={`Role_${selected}.pdf`} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
