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

  // Bypass signin barrier automatically for direct URL access
  if (!user) {
    const demoAdmin = { username: 'Admin', role: 'admin' };
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoAdmin));
    localStorage.setItem('role', 'admin');
  }

  return <Layout>{children}</Layout>;
}

export default ProtectedRoute;
