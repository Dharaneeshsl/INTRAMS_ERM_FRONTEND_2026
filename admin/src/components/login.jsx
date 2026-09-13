import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedNetworkBackground from './layout/AnimatedNetworkBackground';
import Button from './ui/Button';
import Input from './ui/Input';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user || localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Enter both username and password.');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
      return;
    }

    setError(result.error || 'Invalid username or password');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      <AnimatedNetworkBackground />

      <div className="relative z-10 w-full max-w-[440px] rounded-xl border border-white/10 bg-[rgba(11,17,28,0.88)] p-6 shadow-[0_0_30px_rgba(14,165,233,0.08)] backdrop-blur-sm sm:p-8">
        <div className="mb-7 text-center">
          <div className="font-heading text-[17px] font-semibold uppercase tracking-[0.22em] text-white">INTRAMS</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Admin Portal</div>
        </div>

        <div className="mb-5 text-center">
          <h1 className="font-heading text-[26px] tracking-tight text-white">INTRAMS ADMIN LOGIN</h1>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-[12px] text-rose-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-[46px] h-4 w-4 text-slate-500" />
            <Input
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="pl-10"
              placeholder="Enter username"
            />
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-[46px] h-4 w-4 text-slate-500" />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="pl-10 pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-[44px] flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:text-cyan-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" loading={loading} className="mt-2 w-full justify-center py-3 text-[13px] uppercase tracking-[0.16em]">
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
        </form>
      </div>
    </div>
  );
}