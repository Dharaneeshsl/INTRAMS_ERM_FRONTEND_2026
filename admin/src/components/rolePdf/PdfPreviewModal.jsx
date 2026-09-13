import React, { useEffect, useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getApiErrorMessage } from '../../utils/apiError';
import { useToast } from '../../context/ToastContext';

export default function PdfPreviewModal({ open, url, filename, onClose }) {
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [notes, setNotes] = useState([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setPage(1);
      setZoom(100);
      setRotation(0);
      setNotes([]);
    }
  }, [open]);

  const download = async () => {
    try {
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

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => p + 1);
  const zoomIn = () => setZoom((z) => Math.min(400, z + 25));
  const zoomOut = () => setZoom((z) => Math.max(25, z - 25));
  const rotate = () => setRotation((r) => (r + 90) % 360);

  const addNoteAt = (e) => {
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const text = prompt('Add annotation text');
    if (!text) return;
    setNotes((n) => [...n, { id: Date.now(), x, y, text }]);
  };

  const removeNote = (id) => setNotes((n) => n.filter((x) => x.id !== id));

  const timestamp = new Date().toLocaleString();

  return (
    <Modal open={open} onClose={onClose} title={`${filename} — ${timestamp}`} wide>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={prevPage}>Prev</Button>
          <div className="px-2">Page</div>
          <div className="font-medium">{page}</div>
          <Button variant="secondary" onClick={nextPage}>Next</Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={zoomOut}>-</Button>
          <div className="px-2">{zoom}%</div>
          <Button variant="secondary" onClick={zoomIn}>+</Button>
          <Button variant="secondary" onClick={rotate}>Rotate</Button>
          <Button onClick={download}>Download</Button>
        </div>
      </div>

      {url ? (
        <div className="relative h-[70vh] border">
          <div
            ref={overlayRef}
            onClick={addNoteAt}
            className="absolute inset-0 z-20 pointer-events-auto"
            style={{ transform: `rotate(${rotation}deg)` }}
          />

          <iframe
            title="PDF Preview"
            src={`${url}#page=${page}&zoom=${zoom}`}
            className="w-full h-full bg-white"
            style={{ transform: `rotate(${rotation}deg)` }}
          />

          {/* Notes overlay */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            {notes.map((n) => (
              <div
                key={n.id}
                className="absolute bg-yellow-200/90 text-black text-sm px-2 py-1 rounded drop-shadow pointer-events-auto cursor-pointer"
                onClick={() => removeNote(n.id)}
                style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)' }}
                title="Click to remove"
              >
                {n.text}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Loading preview…</div>
      )}

      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
