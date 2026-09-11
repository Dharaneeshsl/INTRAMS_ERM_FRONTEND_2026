import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useAuth } from '../context/AuthContext';
import { KeyRound, ArrowLeft, Send } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: 'linear-gradient(135deg, #FF9800 0%, #FFD600 100%)' },
    },
    fpsLimit: 120,
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.2 },
      move: { enable: true, speed: 1 },
      number: { value: 60 },
      opacity: { value: 0.3 },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage('Password reset instructions have been sent to your email.');
    } else {
      setError(result.error || 'Failed to request password reset.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-accent-orange via-accent-yellow to-yellow-400 overflow-hidden px-4">
      <Particles id="forgot-pass-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-accent-orange to-accent-yellow rounded-2xl mx-auto mb-3 flex items-center justify-center text-white shadow-lg">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">INTRAMS ERM Forms</h1>
          <p className="text-gray-600 text-xs mt-1">Enter your registered email address to receive reset instructions</p>
        </div>

        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
