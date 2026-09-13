import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { adminAPI } from '../../api';
import { handlePdfBlob } from '../../utils/pdf';
import { getApiErrorMessage } from '../../utils/apiError';
import { useToast } from '../../context/ToastContext';

export default function PdfPreviewModal({ open, url, filename, onClose }) {
  const { showToast } = useToast();

  const download = async () => {
    try {
      // If we have a preview URL, trigger download by refetching file
      // Fallback: navigate to url to save
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      showToast('Unable to download preview.', 'error');
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to download.'), 'error');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={filename} wide>
      {url ? (
        <div className="h-[70vh]">
          <iframe title="PDF Preview" src={url} className="w-full h-full border" />
        </div>
      ) : (
        <div>Loading preview…</div>
      )}

      <div className="mt-3 flex justify-end gap-2">
        <Button variant="secondary" onClick={download}>Download</Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
