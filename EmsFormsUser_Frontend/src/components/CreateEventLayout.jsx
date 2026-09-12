import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import StepProgress from './StepProgress';
import Instructions from './Instructions';
import NewDescriptionPage from './NewDescriptionPage';
import RoundsPage from './RoundsPage';
import PersonnelDetailsPage from './PersonnelDetailsPage';
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
      num_rounds: 1,
    },
    rounds: [
      { name: 'Round 1', description: '', rules: [''], num_participants: 50, has_tie_breaker: false }
    ],
    items: [],
    contacts: {
      secretaries: [
        { name: '', roll_number: '', mobile: '', department: '', year: '' },
        { name: '', roll_number: '', mobile: '', department: '', year: '' }
      ],
      secretary: { name: '', roll_number: '', mobile: '', department: '', year: '' },
      convenors: [
        { name: '', roll_number: '', mobile: '', department: '', year: '' },
        { name: '', roll_number: '', mobile: '', department: '', year: '' }
      ],
      volunteers: [
        { name: '', roll_number: '', mobile: '', department: '', year: '' },
        { name: '', roll_number: '', mobile: '', department: '', year: '' }
      ],
      faculty_advisor: { name: '', designation: '', department: '', mobile: '' },
      judge: { name: '', designation: '', mobile: '' }
    }
  });

  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: '#020617' } },
    fpsLimit: 120,
    interactivity: {
      events: { onClick: { enable: true, mode: 'push' }, onHover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { push: { quantity: 4 }, repulse: { distance: 200, duration: 0.4 } },
    },
    particles: {
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 0.8 },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.3 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      if (!formData.name.trim() || !formData.about.trim()) {
        alert('Please fill in required Event Name and Description.');
        return;
      }
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
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#020617] overflow-hidden flex flex-row ocean-gradient-bg text-slate-100">
      <Particles id="create-event-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <NavBar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 overflow-y-auto">
          <StepProgress currentStep={currentStep} totalSteps={5} onStepClick={(step) => setCurrentStep(step)} />

          {/* STEP 1: Instructions */}
          {currentStep === 1 && <Instructions onNext={handleNext} />}

          {/* STEP 2: Basic Event & Round Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-xl text-slate-900 space-y-4">
                <h2 className="text-2xl font-extrabold text-black font-heading uppercase border-b border-slate-200 pb-3">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Event Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Tech Symposium 2026"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tagline <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Innovate, Create, Inspire."
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      About <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g., A comprehensive technical event showcasing innovation and creativity in technology..."
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Number of Rounds <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g., 3"
                      value={formData.form?.num_rounds || formData.rounds?.length || 1}
                      onChange={(e) => {
                        const num = Math.max(1, parseInt(e.target.value) || 1);
                        setFormData((prev) => {
                          const currentRounds = [...(prev.rounds || [])];
                          while (currentRounds.length < num) {
                            currentRounds.push({
                              name: `Round ${currentRounds.length + 1}`,
                              description: '',
                              rules: [''],
                              num_participants: 50,
                              has_tie_breaker: false,
                            });
                          }
                          const updatedRounds = currentRounds.slice(0, num);
                          return {
                            ...prev,
                            form: { ...prev.form, num_rounds: num },
                            rounds: updatedRounds,
                          };
                        });
                      }}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              <RoundsPage formData={formData} setFormData={setFormData} errors={errors} />
            </div>
          )}

          {/* STEP 3: Personnel Details */}
          {currentStep === 3 && (
            <PersonnelDetailsPage formData={formData} setFormData={setFormData} errors={errors} />
          )}

          {/* STEP 4: Venue, Schedule & Items */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <NewDescriptionPage formData={formData} setFormData={setFormData} errors={errors} />
              <ItemsPage formData={formData} setFormData={setFormData} />
            </div>
          )}

          {/* STEP 5: Review & Final Submit */}
          {currentStep === 5 && (
            <ReviewSubmit formData={formData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          )}

          {/* Navigation Controls */}
          {currentStep > 1 && currentStep < 5 && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> BACK
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all transform hover:scale-[1.02]"
              >
                NEXT <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CreateEventLayout;
