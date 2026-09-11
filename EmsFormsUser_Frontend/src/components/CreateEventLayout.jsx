import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import StepProgress from './StepProgress';
import Instructions from './Instructions';
import NewDescriptionPage from './NewDescriptionPage';
import RoundsPage from './RoundsPage';
import ItemsPage from './ItemsPage';
import ReviewSubmit from './ReviewSubmit';
import { userAPI } from '../api/api';
import { validateStep } from '../utils/stepValidation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function CreateEventLayout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    about: '',
    form: {
      day: '',
      slot: '',
      duration: '',
      participant_type: 'Solo',
      team_min: 1,
      team_max: 1,
      preferred_halls: '',
    },
    rounds: [{ name: 'Round 1', description: '', rules: [''] }],
    items: [],
  });

  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: '#000000' },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 1 },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.4 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const handleNext = () => {
    const { isValid, errors: validationErrors } = validateStep(currentStep, formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (dataToSubmit) => {
    setIsSubmitting(true);
    try {
      await userAPI.createEvent(dataToSubmit);
      alert('✅ Event Proposal Created Successfully!');
      navigate('/view-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col">
      <Particles id="create-event-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      <NavBar />

      <main className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <StepProgress currentStep={currentStep} totalSteps={5} />

        {currentStep === 1 && <Instructions onNext={handleNext} />}

        {currentStep === 2 && (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Event Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g. CodeStorm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline *</label>
                <input
                  type="text"
                  placeholder="e.g. The Ultimate Hackathon of INTRAMS"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
                />
                {errors.tagline && <p className="text-red-500 text-xs mt-1">{errors.tagline}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About Event *</label>
                <textarea
                  rows="4"
                  placeholder="Detailed description of the event concept and objectives..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
                />
                {errors.about && <p className="text-red-500 text-xs mt-1">{errors.about}</p>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <NewDescriptionPage formData={formData} setFormData={setFormData} errors={errors} />
        )}

        {currentStep === 4 && (
          <RoundsPage formData={formData} setFormData={setFormData} errors={errors} />
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <ItemsPage formData={formData} setFormData={setFormData} />
            <ReviewSubmit formData={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        )}

        {currentStep > 1 && currentStep < 5 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-orange-500 hover:to-yellow-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default CreateEventLayout;
