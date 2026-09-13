import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedNetworkBackground from './layout/AnimatedNetworkBackground';
import Button from './ui/Button';
import Input from './ui/Input';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [step, setStep] = useState(initialToken ? 2 : 1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
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
    if (result.success) {
      setMessage('Password reset token sent to your email. Enter token below.');
      setStep(2);
    } else {
      setError(result.error || 'Unable to request a password reset. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!token) {
      setError('Please enter the reset token.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await resetPassword({ token, new_password: newPassword });
    setLoading(false);

    if (result.success) {
      setMessage('✅ Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error || 'Invalid or expired reset token.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <AnimatedNetworkBackground />
      <div className="relative z-10 w-full max-w-sm bg-[var(--surface)]/95 border border-[var(--border)] rounded-xl p-6">
        <button type="button" onClick={() => navigate('/login')} className="text-[13px] text-slate-400 hover:text-white mb-4">
          Back to login
        </button>

        <h1 className="font-heading text-xl font-semibold text-white mb-1">
          {step === 1 ? 'Reset Password' : 'Enter Reset Token'}
        </h1>
        <p className="text-[13px] text-slate-500 mb-5">
          {step === 1 ? 'Enter the email on your admin account.' : 'Provide your reset token and new password.'}
        </p>

        {message && <p className="mb-3 text-[13px] text-emerald-300 font-medium">{message}</p>}
        {error && <p className="mb-3 text-[13px] text-rose-300 font-medium">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" loading={loading} className="w-full">
              Send Reset Instructions
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input label="Reset Token" type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste 64-char token" />
            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 chars" />
            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
            <Button type="submit" loading={loading} className="w-full">
              Update Password
            </Button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); setMessage(''); }}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
            >
              Request new token
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

