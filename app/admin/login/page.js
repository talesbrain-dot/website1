'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        setStatus('error');
        return;
      }
      const next = searchParams.get('next') || '/admin';
      router.push(next);
      router.refresh();
    } catch {
      setError('Could not reach the server.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm border border-ink/12 bg-white/50 p-8">
      <h1 className="font-display text-2xl text-ink font-medium mb-1.5">Staff login</h1>
      <p className="text-sm text-ink/55 mb-7">Sign in to view and manage enquiries.</p>

      <label className="field-label" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        required
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="field-input mb-2"
        placeholder="••••••••"
      />
      {status === 'error' && <p className="text-sm text-registration mb-4">{error}</p>}

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center mt-5 disabled:opacity-60">
        {status === 'loading' ? 'Signing in…' : 'Sign in'}
      </button>

      <Link href="/" className="block text-center text-sm text-ink/50 mt-6 hover:text-ink/80">
        &larr; Back to the website
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
