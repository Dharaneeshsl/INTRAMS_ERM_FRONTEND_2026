import React from 'react';

function NewDescriptionPage({ formData, setFormData, errors = {} }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value,
      },
    }));
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100">
      <h2 className="text-2xl font-bold text-white mb-6 font-heading">Schedule, Venue & Parameters</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-sky-200/90 mb-1.5">Event Day *</label>
          <select
            value={formData.form?.day || ''}
            onChange={(e) => handleChange('day', e.target.value)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white transition-all"
          >
            <option value="" className="bg-slate-900 text-slate-400">Select Day</option>
            <option value="Day 1" className="bg-slate-900 text-white">Day 1</option>
            <option value="Day 2" className="bg-slate-900 text-white">Day 2</option>
            <option value="Day 3" className="bg-slate-900 text-white">Day 3</option>
            <option value="Both Days" className="bg-slate-900 text-white">Both Days</option>
          </select>
          {errors.day && <p className="text-rose-400 text-xs mt-1">{errors.day}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-sky-200/90 mb-1.5">Time Slot *</label>
          <input
            type="text"
            placeholder="e.g. 09:30 AM - 12:30 PM"
            value={formData.form?.slot || ''}
            onChange={(e) => handleChange('slot', e.target.value)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white placeholder-slate-500 transition-all"
          />
          {errors.slot && <p className="text-rose-400 text-xs mt-1">{errors.slot}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-sky-200/90 mb-1.5">Duration *</label>
          <input
            type="text"
            placeholder="e.g. 3 Hours"
            value={formData.form?.duration || ''}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white placeholder-slate-500 transition-all"
          />
          {errors.duration && <p className="text-rose-400 text-xs mt-1">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-sky-200/90 mb-1.5">Participant Type</label>
          <select
            value={formData.form?.participant_type || 'Solo'}
            onChange={(e) => handleChange('participant_type', e.target.value)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white transition-all"
          >
            <option value="Solo" className="bg-slate-900 text-white">Solo</option>
            <option value="Team" className="bg-slate-900 text-white">Team</option>
            <option value="Dual" className="bg-slate-900 text-white">Dual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-sky-200/90 mb-1.5">Min Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.form?.team_min || 1}
            onChange={(e) => handleChange('team_min', parseInt(e.target.value) || 1)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-sky-200/90 mb-1.5">Max Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.form?.team_max || 1}
            onChange={(e) => handleChange('team_max', parseInt(e.target.value) || 1)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white transition-all"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-sky-200/90 mb-1.5">Preferred Halls / Venues</label>
          <input
            type="text"
            placeholder="e.g. IT Block Lab 3, Main Auditorium"
            value={formData.form?.preferred_halls || ''}
            onChange={(e) => handleChange('preferred_halls', e.target.value)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white placeholder-slate-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

export default NewDescriptionPage;
