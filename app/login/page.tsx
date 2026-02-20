'use client';

import { useState, FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!auth) throw new Error('Firebase is not configured.');
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // AuthGuard will redirect to '/' once onAuthStateChanged fires
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.message || 'Something went wrong.';
      const code = err.code || 'unknown';
      console.log('Error code:', code);

      // Simplify Firebase error messages
      if (msg.includes('email-already-in-use') || code === 'auth/email-already-in-use') setError('An account with this email already exists.');
      else if (msg.includes('user-not-found') || code === 'auth/user-not-found') setError('No account found with this email.');
      else if (msg.includes('wrong-password') || code === 'auth/wrong-password') setError('Incorrect password.');
      else if (msg.includes('weak-password') || code === 'auth/weak-password') setError('Password must be at least 6 characters.');
      else if (msg.includes('invalid-email') || code === 'auth/invalid-email') setError('Please enter a valid email address.');
      else if (msg.includes('invalid-credential') || code === 'auth/invalid-credential') setError('Incorrect email or password.');
      else if (msg.includes('operation-not-allowed') || code === 'auth/operation-not-allowed') setError('Email/Password sign-in is not enabled in Firebase Console.');
      else setError(`Error: ${msg} (${code})`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card animate-scale-in">
        {/* Logo */}
        <div className="auth-logo">
          <div className="sidebar-logo-icon" style={{ width: 52, height: 52, borderRadius: 14 }}>
            <Flame size={26} color="#fff" />
          </div>
          <span className="sidebar-logo-text" style={{ fontSize: '1.5rem' }}>CaloriAI</span>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 6 }}>
            {mode === 'signin'
              ? 'Sign in to your account to continue.'
              : 'Start tracking your nutrition today.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="auth-tab-bar">
          <button
            className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); setError(''); }}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
            type="button"
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                className="auth-input"
                type={showPass ? 'text' : 'password'}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? (
              <div className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
