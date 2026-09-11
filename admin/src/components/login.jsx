import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: { value: '#000000' },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 1 },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.4 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/cards');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden px-4">
      <Particles id="admin-login-particles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-md bg-zinc-950/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-800 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white text-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white">INTRAMS Admin Sign In</h2>
          <p className="text-zinc-400 text-sm mt-1">Sign in with administrative credentials</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-800 text-red-300 rounded-xl p-4 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-white focus:bg-zinc-800 transition-all outline-none text-white placeholder-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-white focus:bg-zinc-800 transition-all outline-none text-white placeholder-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
