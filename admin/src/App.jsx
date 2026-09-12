import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Login = lazy(() => import('./components/login'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const EventCards = lazy(() => import('./components/info'));
const InfoDeep = lazy(() => import('./components/info-deep'));
const Add = lazy(() => import('./components/adduser'));
const Items = lazy(() => import('./components/items'));
const Stocks = lazy(() => import('./components/stocks'));
const Stats = lazy(() => import('./components/stats'));
const LabConfirmation = lazy(() => import('./components/labConfirmation'));
const GrantItems = lazy(() => import('./components/grantItems'));
const GrantEventItems = lazy(() => import('./components/grantEventItems'));
const GrantLogs = lazy(() => import('./components/grantLogs'));
const EditAccess = lazy(() => import('./components/editaccess'));
const RolePdf = lazy(() => import('./components/rolePdf'));
const Procurements = lazy(() => import('./components/procurements'));

function PageLoader() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-950 text-sky-400">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-400" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
        path="/lab-confirmation"
        element={
          <ProtectedRoute allowedRoles={['admin', 'member']}>
            <LabConfirmation />
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
        path="/procurements"
        element={
          <ProtectedRoute allowedRoles={['admin', 'procurement']}>
            <Procurements />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/cards" replace />} />
    </Routes>
    </Suspense>
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
