export const validateStep = (step, formData) => {
  switch (step) {
    case 1:
      // Instructions step is informational
      return { isValid: true, errors: {} };

    case 2: {
      // Basic Event Details
      const errors = {};
      if (!formData.name?.trim()) errors.name = 'Event name is required';
      if (!formData.tagline?.trim()) errors.tagline = 'Tagline is required';
      if (!formData.about?.trim()) errors.about = 'About event is required';
      return { isValid: Object.keys(errors).length === 0, errors };
    }

    case 3: {
      // Event Description & Schedule/Venue
      const errors = {};
      if (!formData.form?.day) errors.day = 'Select event day';
      if (!formData.form?.slot?.trim()) errors.slot = 'Slot info is required';
      if (!formData.form?.duration?.trim()) errors.duration = 'Duration is required';
      return { isValid: Object.keys(errors).length === 0, errors };
    }

    case 4: {
      // Rounds
      const errors = {};
      if (!formData.rounds || formData.rounds.length === 0) {
        errors.rounds = 'At least one round is required';
      } else {
        formData.rounds.forEach((round, idx) => {
          if (!round.name?.trim()) errors[`round_${idx}_name`] = `Round ${idx + 1} name required`;
          if (!round.description?.trim()) errors[`round_${idx}_desc`] = `Round ${idx + 1} description required`;
        });
      }
      return { isValid: Object.keys(errors).length === 0, errors };
    }

    case 5: {
      // Items / Equipment (optional or standard)
      return { isValid: true, errors: {} };
    }

    default:
      return { isValid: true, errors: {} };
  }
};
