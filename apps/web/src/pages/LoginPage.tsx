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
    <main className="login">
      <div className="login__panel">
        <header className="login__header">
          <span className="login__logo" aria-hidden="true">
            {/* Directory / table icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#1f2937" />
              <path d="M3 9h18M9 9v12" stroke="#fbbf24" strokeWidth="1.6" />
            </svg>
          </span>
          <h1 className="login__title">Employee Directory</h1>
          <p className="login__subtitle">Welcome back. Access the NedTech network.</p>
        </header>

        <form className="login__card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email" className="field__label">
              Corporate Email
            </label>
            <div className="field__control">
              <MailIcon />
              <input
                id="email"
                type="email"
                placeholder="name@nedtech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <div className="field__labelRow">
              <label htmlFor="password" className="field__label">
                Security Key
              </label>
              <button type="button" className="field__link" tabIndex={-1}>
                Recovery options
              </button>
            </div>
            <div className="field__control">
              <LockIcon />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
          </div>

          <label className="login__remember">
            <input type="checkbox" />
            Keep session active for 30 days
          </label>

          <button type="submit" className="login__submit" disabled={login.isPending}>
            {login.isPending ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="login__divider">
            <span>Enterprise SSO</span>
          </div>

          <div className="login__sso">
            <button type="button" className="sso-button" disabled>
              <span className="sso-button__brand">Google</span>
            </button>
            <button type="button" className="sso-button" disabled>
              <span className="sso-button__brand">Microsoft</span>
            </button>
          </div>
        </form>

        <p className="login__footer">
          Access issue? <a href="#contact">Contact Infrastructure Team</a>
        </p>
      </div>
    </main>
  );
}

/* --- Inline icons  --- */

function MailIcon() {
  return (
    <svg className="field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
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
