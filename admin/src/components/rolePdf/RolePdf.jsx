import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import ReportSummary from './ReportSummary';
import PdfPreviewModal from './PdfPreviewModal';
import { adminAPI } from '../../api';
import { getApiErrorMessage } from '../../utils/apiError';
import { useToast } from '../../context/ToastContext';
import { handlePdfBlob } from '../../utils/pdf';
import { generateRolePdf } from '../../utils/generateRolePdf';
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

  const generateExactPdfBlob = async () => {
    let rawData = [];
    try {
      const res = await adminAPI.getAssociations();
      rawData = res.data?.data || res.data?.associations || [];
    } catch (_) {
      rawData = [];
    }
    return await generateRolePdf({ role: selected, data: rawData });
  };

  const previewPdf = async () => {
    try {
      setBusy('preview');
      let pdfBlob;
      try {
        const res = await adminAPI.getRoleWisePDF(selected);
        pdfBlob = res.data;
      } catch (_) {
        pdfBlob = await generateExactPdfBlob();
      }

      // If blob is small or not a valid PDF response, fallback to generating exact screenshot format
      if (!pdfBlob || pdfBlob.size < 100) {
        pdfBlob = await generateExactPdfBlob();
      }

      const url = await handlePdfBlob({ data: pdfBlob }, { filename: `Role_${selected}.pdf`, preview: true });
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
      let pdfBlob;
      try {
        const res = await adminAPI.getRoleWisePDF(selected);
        pdfBlob = res.data;
      } catch (_) {
        pdfBlob = await generateExactPdfBlob();
      }

      if (!pdfBlob || pdfBlob.size < 100) {
        pdfBlob = await generateExactPdfBlob();
      }

      await handlePdfBlob({ data: pdfBlob }, { filename: `Role_${selected}.pdf` });
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to download PDF.'), 'error');
    } finally {
      setBusy('');
    }
  };

  const exportCsv = async () => {
    try {
      setBusy('export');
      let data = [];
      if (typeof adminAPI.getRoleMembers === 'function') {
        const res = await adminAPI.getRoleMembers(selected);
        data = res?.data ?? res;
      }
      if (!Array.isArray(data) || data.length === 0) {
        const assocRes = await adminAPI.getAssociations();
        data = assocRes.data?.data || [];
      }
      const keys = Object.keys(data[0] || { club_name: '', username: '', email: '' });
      const escape = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
      const rows = [keys.join(',')].concat(data.map((r) => keys.map((k) => escape(r[k])).join(','))).join('\n');
      const blob = new Blob([rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Role_${selected}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      showToast(getApiErrorMessage(err, 'CSV export failed.'), 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <div>
      <PageHeader
        title="ROLE-BASED PDF REPORTS"
        subtitle="Generate, preview, and export official personnel reports by role"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-[#050505] border border-[#252525]">
          <h3 className="font-heading font-bold text-[#FFFFFF] text-sm uppercase tracking-wider mb-3">SELECT ROLE</h3>
          <RoleSelector roles={ROLES} selected={selected} onSelect={onSelect} />
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" loading={busy === 'preview'} onClick={previewPdf}>
              PREVIEW PDF
            </Button>
            <Button loading={busy === 'download'} onClick={downloadPdf}>
              DOWNLOAD PDF
            </Button>
            <Button variant="ghost" onClick={exportCsv} loading={busy === 'export'}>
              EXPORT CSV
            </Button>
          </div>
        </div>

        <div className="col-span-2 p-5 bg-[#050505] border border-[#252525]">
          <ReportSummary role={selected} />
        </div>
      </div>

      <PdfPreviewModal open={previewOpen} url={previewUrl} filename={`Role_${selected}.pdf`} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}

