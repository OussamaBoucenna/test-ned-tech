import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useLogin } from '../hooks/useAuthMutations';

export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    login.mutate(
      { email, password },
      { onSuccess: () => navigate(ROUTES.EMPLOYEES, { replace: true }) },
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 md:px-6 md:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <section className="mx-auto w-full max-w-md">
          <header className="mb-6 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-amber-300 shadow-[0_18px_36px_rgba(252,211,77,0.24)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#082f49" />
                <path d="M3 9h18M9 9v12" stroke="#fef3c7" strokeWidth="1.6" />
              </svg>
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
              Employee Directory
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Welcome back. Access the NedTech network.
            </p>
          </header>

          <form
            className="rounded-[32px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur md:p-8"
            onSubmit={handleSubmit}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                >
                  Corporate Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-cyan-300/40">
                  <MailIcon />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@nedtech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                  >
                    Security Key
                  </label>
                  <button type="button" className="text-xs font-semibold text-slate-500">
                    Recovery options
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-cyan-300/40">
                  <LockIcon />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="........"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    className="text-slate-500 transition hover:text-slate-200"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_38px_rgba(252,211,77,0.22)] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={login.isPending}
            >
              {login.isPending ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              Enterprise SSO
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 opacity-70"
                disabled
              >
                Google
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 opacity-70"
                disabled
              >
                Microsoft
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Access issue?{' '}
            <a href="#contact" className="font-semibold text-amber-200">
              Contact Infrastructure Team
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      {off && <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.6" />}
    </svg>
  );
}
