import React, { useState, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { adminAPI } from '../api';
import { FileText, Download, Loader2 } from 'lucide-react';

function RolePdf() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [loading, setLoading] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: '#020617' },
    },
    fpsLimit: 120,
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.2 },
      move: { enable: true, speed: 1 },
      number: { value: 60 },
      opacity: { value: 0.3 },
    },
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getRoleWisePDF(selectedRole);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedRole}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate role PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col pt-24 px-4 sm:px-6">
      <Particles id="rolepdf-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 max-w-xl w-full mx-auto bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
        <FileText className="w-12 h-12 text-sky-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Role-Wise PDF Export</h1>
        <p className="text-gray-600 text-sm mb-6">Generate summary reports tailored by user role permissions</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-900"
            >
              <option value="admin">Admin Summary</option>
              <option value="procurement">Procurement Summary</option>
              <option value="member">Member Summary</option>
            </select>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default RolePdf;
