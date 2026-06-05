import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
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

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            <BrandIcon />
          </span>
          <div>
            <strong className="sidebar__brandName">TechCorp</strong>
            <span className="sidebar__brandSub">HR Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app__main">
        <header className="topbar">
          <div className="topbar__title">Employee Directory</div>
          <div className="topbar__user">
            <span className="topbar__userName">{user?.name ?? 'Account'}</span>
            <button
              className="topbar__logout"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}

/* --- Icons (inline, no extra dependency) --- */

function BrandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#1f2937" />
      <path d="M3 9h18M9 9v12" stroke="#fbbf24" strokeWidth="1.6" />
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
