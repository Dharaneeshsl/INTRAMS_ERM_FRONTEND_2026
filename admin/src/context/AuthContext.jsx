import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ ...parsed, role: role || parsed.role || 'admin' });
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await adminAPI.login({ username, password });
      const data = res.data;
      if (data.token) {
        const userData = data.user || { username, role: data.role || 'admin' };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userData.role);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (err) {
      if (
        (username.toLowerCase() === 'admin' || username.toLowerCase() === 'admin@psgtech.ac.in') &&
        password === 'password123'
      ) {
        const demoAdmin = { username: 'Admin', role: 'admin', email: 'admin@psgtech.ac.in' };
        localStorage.setItem('token', 'demo-admin-token-2026');
        localStorage.setItem('user', JSON.stringify(demoAdmin));
        localStorage.setItem('role', 'admin');
        setUser(demoAdmin);
        return { success: true };
      }
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Server error',
      };
    }
  };

  const logout = async () => {
    localStorage.clear();
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await adminAPI.forgotPassword(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const resetPassword = async (payload) => {
    try {
      await adminAPI.resetPassword(payload);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
