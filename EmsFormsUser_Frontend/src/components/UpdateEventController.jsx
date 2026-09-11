import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import NewDescriptionPage from './NewDescriptionPage';
import RoundsPage from './RoundsPage';
import ItemsPage from './ItemsPage';
import ReviewSubmit from './ReviewSubmit';
import { userAPI } from '../api/api';
import { validateStep } from '../utils/stepValidation';
import { ArrowLeft, Loader2, Info, Calendar, Layers, Package, CheckCircle } from 'lucide-react';

function UpdateEventController() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: '#020617' } },
    fpsLimit: 120,
    particles: {
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { enable: true, speed: 0.8 },
      number: { density: { enable: true, area: 800 }, value: 70 },
      opacity: { value: 0.35 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  useEffect(() => {
    if (!formData && id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await userAPI.getEventById(id);
      const data = res.data?.data || res.data;
      if (data) {
        setFormData({
          name: data.name || '',
          tagline: data.tagline || '',
          about: data.about || '',
          form: data.form || {
            day: '',
            slot: '',
            duration: '',
            participant_type: 'Solo',
            team_min: 1,
            team_max: 1,
            preferred_halls: '',
          },
          rounds: data.rounds || [{ name: 'Round 1', description: '', rules: [''] }],
          items: data.items || [],
        });
      }
    } catch (err) {
      alert('Failed to load event data');
      navigate('/view-events');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    // Validate Basic Info (Step 2)
    const { isValid: basicValid, errors: basicErrors } = validateStep(2, updatedData || formData);
    // Validate Venue & Logistics (Step 3)
    const { isValid: descValid, errors: descErrors } = validateStep(3, updatedData || formData);
    // Validate Rounds (Step 4)
    const { isValid: roundsValid, errors: roundsErrors } = validateStep(4, updatedData || formData);

    if (!basicValid || !descValid || !roundsValid) {
      setErrors({ ...basicErrors, ...descErrors, ...roundsErrors });
      alert('⚠️ Please fix the validation errors before updating.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await userAPI.updateEvent(id, updatedData || formData);
      alert('✅ Event Proposal Updated Successfully!');
      navigate('/view-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'logistics', label: 'Venue & Logistics', icon: Calendar },
    { id: 'rounds', label: 'Rounds & Rules', icon: Layers },
    { id: 'items', label: 'Logistics Items', icon: Package },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen relative bg-black text-white overflow-hidden flex flex-col">
      <Particles id="update-event-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      <NavBar />

      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel Edit
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Update Event Proposal</h1>
        </div>

        {/* Section Editing Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-zinc-900/80 p-2 rounded-2xl border border-zinc-800 backdrop-blur-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Basic Info */}
        {activeTab === 'basic' && (
          <div className="bg-zinc-900/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-zinc-400" /> Basic Event Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1">Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g. CodeStorm"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white outline-none text-white"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1">Tagline *</label>
                <input
                  type="text"
                  placeholder="e.g. The Ultimate Coding Battle"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white outline-none text-white"
                />
                {errors.tagline && <p className="text-red-400 text-xs mt-1">{errors.tagline}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1">About Event *</label>
                <textarea
                  rows="4"
                  placeholder="Detailed description of the event concept and objectives..."
                  value={formData.about || ''}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-white outline-none text-white"
                />
                {errors.about && <p className="text-red-400 text-xs mt-1">{errors.about}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveTab('logistics')}
                className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-zinc-200 transition-all"
              >
                Next: Venue & Logistics →
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Logistics & Venue */}
        {activeTab === 'logistics' && (
          <div>
            <NewDescriptionPage formData={formData} setFormData={setFormData} errors={errors} />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setActiveTab('basic')}
                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl text-sm hover:bg-zinc-700 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveTab('rounds')}
                className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-zinc-200 transition-all"
              >
                Next: Rounds & Rules →
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Rounds & Rules */}
        {activeTab === 'rounds' && (
          <div>
            <RoundsPage formData={formData} setFormData={setFormData} errors={errors} />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setActiveTab('logistics')}
                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl text-sm hover:bg-zinc-700 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-zinc-200 transition-all"
              >
                Next: Logistics Items →
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Items */}
        {activeTab === 'items' && (
          <div>
            <ItemsPage formData={formData} setFormData={setFormData} />
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setActiveTab('rounds')}
                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl text-sm hover:bg-zinc-700 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-zinc-200 transition-all"
              >
                Next: Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Review & Submit */}
        {activeTab === 'review' && (
          <div>
            <ReviewSubmit formData={formData} onSubmit={handleUpdate} isSubmitting={isSubmitting} isEdit={true} />
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setActiveTab('items')}
                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl text-sm hover:bg-zinc-700 transition-all"
              >
                ← Back to Items
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UpdateEventController;
