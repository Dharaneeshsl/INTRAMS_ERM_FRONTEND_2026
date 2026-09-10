export const sessionManager = {
  saveDraft: (eventData) => {
    localStorage.setItem('eventFormDraft', JSON.stringify(eventData));
  },
  getDraft: () => {
    const draft = localStorage.getItem('eventFormDraft');
    return draft ? JSON.parse(draft) : null;
  },
  clearDraft: () => {
    localStorage.removeItem('eventFormDraft');
  }
};
