'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabasePublic } from '@/lib/supabasePublicClient';

function LoginSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    setNotice('');

    const supabase = getSupabasePublic();
    if (!supabase) {
      setError('Login is not set up on this site yet — please contact the site owner.');
      setStatus('error');
      return;
    }

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setStatus('error');
        return;
      }
      if (!data.session) {
        setNotice('Account created. Please check your email to confirm before logging in.');
        setStatus('idle');
        setMode('login');
        return;
      }
      router.push(next);
      router.refresh();
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setStatus('error');
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm animate-fade-up">
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16 drop-shadow-[0_8px_16px_rgba(18,33,58,0.25)]">
          <Image src="/logo-mark.png" alt="Kamboj Press" fill className="object-contain" priority />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-3d p-8 pt-9">
        <div className="tab-slider flex mb-7">
          <div
            className="tab-slider-thumb"
            style={{ transform: mode === 'login' ? 'translateX(0%)' : 'translateX(calc(100% + 8px))' }}
          />
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-sm transition-colors duration-200 ${
              mode === 'login' ? 'text-paper' : 'text-ink/60 hover:text-ink'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-sm transition-colors duration-200 ${
              mode === 'signup' ? 'text-paper' : 'text-ink/60 hover:text-ink'
            }`}
          >
            Sign up
          </button>
        </div>

        <h1 className="font-display text-2xl text-ink font-medium mb-1.5 text-center">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-ink/55 mb-7 text-center">
          {mode === 'login'
            ? 'Log in to send an enquiry and track it.'
            : 'Takes a minute — needed before you can submit an enquiry.'}
        </p>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            mode === 'signup' ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <label className="field-label" htmlFor="name">Full name</label>
            <input
              id="name"
              required={mode === 'signup'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" placeholder="you@example.com" />
        </div>

        <div className="mb-2">
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input"
            placeholder="••••••••"
          />
        </div>

        {notice && <p className="text-sm text-brass-dark mt-3">{notice}</p>}
        {status === 'error' && <p className="text-sm text-registration mt-3">{error}</p>}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center mt-6 disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none">
          {status === 'loading' ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      <Link href="/" className="block text-center text-sm text-ink/50 mt-6 hover:text-ink/80 transition-colors">
        &larr; Back to the website
      </Link>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5 py-14 bg-paper-dark/30">
      <Suspense fallback={null}>
        <LoginSignupForm />
      </Suspense>
    </div>
  );
}
