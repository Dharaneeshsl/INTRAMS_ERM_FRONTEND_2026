export const sessionManager = {
  saveDraft: (eventData) => {
    try {
      localStorage.setItem('eventFormDraft', JSON.stringify(eventData));
      return true;
    } catch (_) {
      return false;
    }
  },
  getDraft: () => {
    try {
      const draft = localStorage.getItem('eventFormDraft');
      return draft ? JSON.parse(draft) : null;
    } catch (_) {
      localStorage.removeItem('eventFormDraft');
      return null;
    }
  },
  clearDraft: () => {
    localStorage.removeItem('eventFormDraft');
  }
};
