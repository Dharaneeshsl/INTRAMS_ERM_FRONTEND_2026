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
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule, Venue & Parameters</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Day *</label>
          <select
            value={formData.form?.day || ''}
            onChange={(e) => handleChange('day', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
          >
            <option value="">Select Day</option>
            <option value="Day 1">Day 1</option>
            <option value="Day 2">Day 2</option>
            <option value="Day 3">Day 3</option>
            <option value="Both Days">Both Days</option>
          </select>
          {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time Slot *</label>
          <input
            type="text"
            placeholder="e.g. 09:30 AM - 12:30 PM"
            value={formData.form?.slot || ''}
            onChange={(e) => handleChange('slot', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
          />
          {errors.slot && <p className="text-red-500 text-xs mt-1">{errors.slot}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration *</label>
          <input
            type="text"
            placeholder="e.g. 3 Hours"
            value={formData.form?.duration || ''}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
          />
          {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Participant Type</label>
          <select
            value={formData.form?.participant_type || 'Solo'}
            onChange={(e) => handleChange('participant_type', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
          >
            <option value="Solo">Solo</option>
            <option value="Team">Team</option>
            <option value="Dual">Dual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Min Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.form?.team_min || 1}
            onChange={(e) => handleChange('team_min', parseInt(e.target.value) || 1)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.form?.team_max || 1}
            onChange={(e) => handleChange('team_max', parseInt(e.target.value) || 1)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Halls / Venues</label>
          <input
            type="text"
            placeholder="e.g. IT Block Lab 3, Main Auditorium"
            value={formData.form?.preferred_halls || ''}
            onChange={(e) => handleChange('preferred_halls', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange outline-none text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}

export default NewDescriptionPage;
