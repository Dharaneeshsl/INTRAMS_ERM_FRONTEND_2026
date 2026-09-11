import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/login';
import ForgotPassword from './components/ForgotPassword';
import EventCards from './components/info';
import InfoDeep from './components/info-deep';
import Add from './components/adduser';
import Items from './components/items';
import Stocks from './components/stocks';
import Stats from './components/stats';
import GrantItems from './components/grantItems';
import GrantEventItems from './components/grantEventItems';
import GrantLogs from './components/grantLogs';
import EditAccess from './components/editaccess';
import RolePdf from './components/rolePdf';
import Logs from './components/Logs';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/cards"
        element={
          <ProtectedRoute allowedRoles={['admin', 'member']}>
            <EventCards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/info-deep/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'member']}>
            <InfoDeep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Add />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Items />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stocks"
        element={
          <ProtectedRoute allowedRoles={['admin', 'procurement']}>
            <Stocks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grant-items"
        element={
          <ProtectedRoute allowedRoles={['admin', 'procurement']}>
            <GrantItems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grant-event-items/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'procurement']}>
            <GrantEventItems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grant-logs"
        element={
          <ProtectedRoute allowedRoles={['admin', 'procurement']}>
            <GrantLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-access"
        element={
          <ProtectedRoute allowedRoles={['admin', 'member']}>
            <EditAccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/role-pdf"
        element={
          <ProtectedRoute allowedRoles={['admin', 'member']}>
            <RolePdf />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Logs />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/cards" replace />} />
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
