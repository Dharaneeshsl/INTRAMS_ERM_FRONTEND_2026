import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import HomePage from './components/HomePage';
import ViewEvents from './components/ViewEvents';
import EventDetails from './components/EventDetails';
import CreateEventLayout from './components/CreateEventLayout';
import UpdateEventController from './components/UpdateEventController';

import NotFound from './components/NotFound';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  // In dev environment, bypass signin barrier automatically if no user is logged in
  if (!user && import.meta.env.DEV) {
    const demoUser = { username: 'DemoClub', association_name: 'Demo Club' };
    localStorage.setItem('userToken', 'demo-token');
    localStorage.setItem('userData', JSON.stringify(demoUser));
  } else if (!user && !localStorage.getItem('userToken')) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-events"
        element={
          <ProtectedRoute>
            <ViewEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event/:id"
        element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-event"
        element={
          <ProtectedRoute>
            <CreateEventLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-event/:id"
        element={
          <ProtectedRoute>
            <UpdateEventController />
          </ProtectedRoute>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
