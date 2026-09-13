import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedNetworkBackground from './layout/AnimatedNetworkBackground';
import Button from './ui/Button';
import Input from './ui/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Enter your email address.');
      return;
    }
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) setMessage('If this email is registered, reset instructions have been sent.');
    else setError('Unable to request a password reset. Please try again.');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <AnimatedNetworkBackground />
      <div className="relative z-10 w-full max-w-sm bg-[var(--surface)]/95 border border-[var(--border)] rounded-xl p-6">
        <button type="button" onClick={() => navigate('/login')} className="text-[13px] text-slate-400 hover:text-white mb-4">
          Back to login
        </button>
        <h1 className="font-heading text-xl font-semibold text-white mb-1">Reset password</h1>
        <p className="text-[13px] text-slate-500 mb-5">Enter the email on your admin account.</p>
        {message && <p className="mb-3 text-[13px] text-emerald-300">{message}</p>}
        {error && <p className="mb-3 text-[13px] text-rose-300">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" loading={loading} className="w-full">
            Send reset instructions
          </Button>
        </form>
      </div>
    </div>
  );
}
