'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setStatus(null);

    try {
      const endpoint = mode === 'sign-up' ? '/api/auth/sign-up/email' : '/api/auth/sign-in/email';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'sign-up' ? { name, email, password } : { email, password })
      });

      if (!response.ok) {
        throw new Error('Authentication request failed.');
      }

      setStatus(mode === 'sign-up' ? 'Account created. Redirecting to settings…' : 'Signed in successfully. Redirecting to settings…');
      router.push('/app/settings');
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md p-6 lg:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
        {mode === 'sign-up' ? 'Create account' : 'Sign in'}
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
        {mode === 'sign-up' ? 'Create your CivicShield AI account' : 'Sign in to CivicShield AI'}
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        Email and password auth is now enabled. Google OAuth can be added later without changing the current account foundation.
      </p>
      <div className="mt-6 space-y-4">
        {mode === 'sign-up' ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white" htmlFor="name">Name</label>
            <Input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          </div>
        ) : null}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white" htmlFor="email">Email</label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white" htmlFor="password">Password</label>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
        </div>
        <Button onClick={handleSubmit} disabled={loading || !email || !password || (mode === 'sign-up' && !name.trim())} className="w-full">
          {loading ? 'Working…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
        </Button>
        {status ? <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p> : null}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {mode === 'sign-up' ? (
            <>
              Already have an account? <Link href="/auth/sign-in" className="text-blue-600 dark:text-blue-400">Sign in</Link>
            </>
          ) : (
            <>
              Need an account? <Link href="/auth/sign-up" className="text-blue-600 dark:text-blue-400">Create one</Link>
            </>
          )}
        </p>
      </div>
    </Card>
  );
}
