'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      device_name: '24ghonta-web',
      redirect: false,
      callbackUrl: '/admin/dashboard',
    });

    setLoading(false);

    if (!result || result.error) {
      setError('Email অথবা password সঠিক নয়।');
      return;
    }

    router.replace('/admin/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="24Ghonta Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-center text-xl font-bold text-gray-800">Admin Login</h1>
          <p className="mb-6 text-center text-sm text-gray-500">Sign in to start your session</p>

          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-md border border-gray-300 py-2.5 pl-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 py-2.5 pl-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
