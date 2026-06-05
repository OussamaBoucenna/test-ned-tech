import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuthMutations';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.EMPLOYEES, label: 'Directory', icon: <DirectoryIcon /> },
  { to: ROUTES.LOGS, label: 'Logs', icon: <LogsIcon /> },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const logout = useLogout();
  const location = useLocation();
  const activeItem = NAV_ITEMS.find((item) => item.to === location.pathname);
  const pageTitle = activeItem?.label ?? 'Workspace';

  return (
    <div className="min-h-screen bg-transparent text-slate-100 md:flex">
      <aside className="border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur md:min-h-screen md:w-72 md:border-r md:border-b-0 md:px-5 md:py-6">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-amber-300 shadow-[0_18px_36px_rgba(252,211,77,0.24)]">
            <BrandIcon />
          </span>
          <div>
            <strong className="block text-lg font-bold tracking-tight text-white">TechCorp</strong>
            <span className="block text-sm text-slate-400">HR Admin Panel</span>
          </div>
        </div>

        <nav className="mt-5 flex flex-wrap gap-2 md:mt-10 md:flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'border-amber-300 bg-amber-300 text-slate-950 shadow-[0_16px_30px_rgba(252,211,77,0.2)]'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30 hover:bg-cyan-400/5 hover:text-white'
                }`
              }
            >
              <span className="inline-flex h-5 w-5 items-center justify-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/10 bg-slate-950/55 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">
                Operations Workspace
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-white">
                {pageTitle}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 md:justify-start">
              <div>
                <div className="text-sm font-semibold text-white">{user?.name ?? 'Account'}</div>
                <div className="text-xs text-slate-400">Active secure session</div>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                {logout.isPending ? 'Logging out...' : 'Log out'}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function BrandIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#082f49" />
      <path d="M3 9h18M9 9v12" stroke="#fef3c7" strokeWidth="1.6" />
    </svg>
  );
}

function DirectoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 20a5 5 0 0 1 10 0M16 11a3 3 0 1 0 0-6M20 20a5 5 0 0 0-4-4.9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function LogsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
