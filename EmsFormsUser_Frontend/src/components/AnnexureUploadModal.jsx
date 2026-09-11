import React, { useState, useEffect } from 'react';
import { userAPI } from '../api/api';
import { UploadCloud, FileText, Trash2, Loader2, AlertCircle, X, Download } from 'lucide-react';

function AnnexureUploadModal({ eventId, eventName, onClose }) {
  const [annexures, setAnnexures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAnnexures();
  }, [eventId]);

  const fetchAnnexures = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userAPI.getAnnexures(eventId);
      setAnnexures(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch annexures');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit');
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await userAPI.uploadAnnexure(eventId, formData);
      setFile(null);
      fetchAnnexures();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file attachment');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (annexureId) => {
    if (!window.confirm('Are you sure you want to delete this annexure?')) return;
    setDeletingId(annexureId);
    try {
      await userAPI.deleteAnnexure(annexureId);
      fetchAnnexures();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete attachment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Annexure Attachments</h2>
          <p className="text-sky-300/70 text-xs mt-1">Manage documents, certificates, or diagrams for proposal: <span className="font-semibold text-sky-400">{eventName}</span></p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-2xl p-5 text-center transition-all bg-slate-950/40">
          <UploadCloud className="w-10 h-10 mx-auto text-sky-400 mb-2" />
          <p className="text-sm font-semibold text-slate-200">Upload proposal document</p>
          <p className="text-xs text-slate-400 mb-3">PDF, DOC, DOCX, PNG, JPG (Max 10MB)</p>

          <input
            type="file"
            id="annexure-file-input"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="flex items-center justify-center gap-3">
            <label
              htmlFor="annexure-file-input"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl cursor-pointer transition-all border border-slate-700"
            >
              {file ? file.name : 'Choose File'}
            </label>

            {file && (
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Attachment'}
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* List of Attachments */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uploaded Documents ({annexures.length})</h3>
          {loading ? (
            <div className="text-center py-6 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
              <p className="text-xs">Loading annexures...</p>
            </div>
          ) : annexures.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No attachments uploaded yet.</p>
          ) : (
            annexures.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-sky-400 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{item.original_name || item.file_name}</p>
                    <p className="text-[10px] text-slate-400">{(item.file_size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`http://localhost:5000${item.file_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg text-xs transition-colors disabled:opacity-50"
                  >
                    {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnexureUploadModal;
