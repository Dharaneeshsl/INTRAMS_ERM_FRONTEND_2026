import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';
import { userAPI } from '../api/api';
import ReviewSubmit from './ReviewSubmit';
import { ArrowLeft, Loader2 } from 'lucide-react';

function UpdateEventController() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!formData && id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await userAPI.getEventById(id);
      setFormData(res.data?.data || res.data);
    } catch (err) {
      alert('Failed to load event data');
      navigate('/view-events');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    setIsSubmitting(true);
    try {
      await userAPI.updateEvent(id, updatedData);
      alert('✅ Event Updated Successfully!');
      navigate('/view-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col">
      <NavBar />

      <main className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium mb-6 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel Edit
        </button>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Event Proposal</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">About</label>
              <textarea
                rows="4"
                value={formData.about || ''}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-900"
              />
            </div>
          </div>
        </div>

        <ReviewSubmit formData={formData} onSubmit={handleUpdate} isSubmitting={isSubmitting} isEdit={true} />
      </main>
    </div>
  );
}

export default UpdateEventController;
