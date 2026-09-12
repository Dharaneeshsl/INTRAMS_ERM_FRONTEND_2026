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
      color: { value: '#000000' },
    },
    fpsLimit: 120,
    particles: {
      color: { value: '#38bdf8' },
      links: { color: '#0284c7', distance: 150, enable: true, opacity: 0.25 },
      move: { enable: true, speed: 0.8 },
      number: { value: 60 },
      opacity: { value: 0.35 },
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
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden px-4 ocean-gradient-bg">
      <Particles id="forgot-pass-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-sky-500/20 p-8">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-white font-heading">INTRAMS Admin Reset</h1>
          <p className="text-sky-300/70 text-xs mt-1">Enter your registered email address to receive reset instructions</p>
        </div>

        {message && <div className="mb-4 p-3 bg-emerald-950/60 text-emerald-300 text-sm rounded-xl border border-emerald-500/30">{message}</div>}
        {error && <div className="mb-4 p-3 bg-rose-950/60 text-rose-300 text-sm rounded-xl border border-rose-500/30">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="admin@psgtech.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl outline-none text-white focus:ring-2 focus:ring-sky-500 placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
