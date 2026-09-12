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
    contacts: {
      secretary: { name: '', roll_number: '', mobile: '' },
      convenors: [{ name: '', roll_number: '', mobile: '' }],
      faculty_advisor: { name: '', designation: '', department: '', mobile: '' }
    }
  });

  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: '#020617' },
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
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 0.8 },
      number: { density: { enable: true, area: 800 }, value: 70 },
      opacity: { value: 0.3 },
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
    <div className="min-h-screen relative bg-[#020617] overflow-hidden flex flex-col ocean-gradient-bg">
      <Particles id="create-event-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
      <NavBar />

      <main className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <StepProgress currentStep={currentStep} totalSteps={5} onStepClick={(step) => setCurrentStep(step)} />

        {currentStep === 1 && <Instructions onNext={handleNext} />}

        {currentStep === 2 && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-white">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">Basic Proposal Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-sky-200/90 mb-1">Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g. CodeStorm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none text-white placeholder-slate-500 transition-all"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-sky-200/90 mb-1">Tagline *</label>
                <input
                  type="text"
                  placeholder="e.g. Navigating Technical Frontiers"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none text-white placeholder-slate-500 transition-all"
                />
                {errors.tagline && <p className="text-red-400 text-xs mt-1">{errors.tagline}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-sky-200/90 mb-1">About Event *</label>
                <textarea
                  rows="4"
                  placeholder="Detailed description of the event concept and objectives..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none text-white placeholder-slate-500 transition-all"
                />
                {errors.about && <p className="text-red-400 text-xs mt-1">{errors.about}</p>}
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-sky-500/20 transition-all transform hover:scale-[1.02]"
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
