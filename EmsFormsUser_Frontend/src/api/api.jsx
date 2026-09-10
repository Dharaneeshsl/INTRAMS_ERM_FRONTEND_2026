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

export const userAPI = {
  login: (credentials) => api.post('/user/login', credentials),
  getEvents: () => api.get('/user/events'),
  getEventById: (id) => api.get(`/user/events/${id}`),
  createEvent: (eventData) => api.post('/user/events', eventData),
  updateEvent: (id, eventData) => api.put(`/user/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/user/events/${id}`),
  requestEditAccess: (id, message) => api.post(`/user/events/${id}/request-edit`, { message }),
  getItems: () => api.get('/user/items'),
};

export default api;
