import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  const token = localStorage.getItem('token');
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role ?? localStorage.getItem('role') ?? 'member';
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    const defaultHome = userRole === 'procurement' ? '/grant-items' : '/cards';
    return <Navigate to={defaultHome} replace />;
  }

  return <Layout>{children}</Layout>;
}

export default ProtectedRoute;
