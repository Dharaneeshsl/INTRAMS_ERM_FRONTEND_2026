import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  login: (credentials) => api.post('/user/login', credentials),
  getProfile: () => api.get('/user/profile'),
  getEvents: () => api.get('/user/events'),
  getMyEvents: () => api.get('/user/events'),
  getEventById: (id) => api.get(`/user/events/${id}`),
  createEvent: (eventData) => api.post('/user/events', eventData),
  updateEvent: (id, eventData) => api.put(`/user/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/user/events/${id}`),
  requestEditAccess: (id, message) => api.post(`/user/events/${id}/request-edit`, { message }),
  getItems: () => api.get('/user/items'),
  // Annexures API
  getAnnexures: (eventId) => api.get(`/user/events/${eventId}/annexures`),
  uploadAnnexure: (eventId, formData) => api.post(`/user/events/${eventId}/annexures`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAnnexure: (annexureId) => api.delete(`/user/annexures/${annexureId}`)
};

export default api;
