import { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useLogout } from '../hooks/useAuthMutations';
import type { EmployeeQuery } from '../types';

/**
 * Protected home page. Renders the employee directory.
 *
 * TODO — implement the four sections from the spec (§2.2):
 *   A. Employee table with server-side pagination + status badges.
 *   B. Search (debounced ≥300ms) + department filter + reset.
 *   C. Create/Edit modal with client-side validation.
 *   D. Delete action with a confirmation dialog.
 *
 * Loading is shown globally (GlobalLoadingBar) and API errors surface globally
 * as toasts (QueryProvider), so this page only handles its own empty/data state.
 */
export function HomePage() {
  const logout = useLogout();
  const [query] = useState<EmployeeQuery>({ page: 1, limit: 10 });
  const { data } = useEmployees(query);

  return (
    <main className="home">
      <header className="home__header">
        <h1>Employee Directory</h1>
        <button onClick={() => logout.mutate()} disabled={logout.isPending}>
          {logout.isPending ? 'Logging out…' : 'Log out'}
        </button>
      </header>

      {/* TODO: Section B — search & department filter */}

      {data && data.items.length === 0 && <p>No employees found.</p>}

      {data && data.items.length > 0 && (
        <>
          {/* TODO: Section A — replace this placeholder with the real table */}
          <p>
            {data.meta.total} employees · page {data.meta.page} of {data.meta.totalPages}
          </p>
          <ul>
            {data.items.map((employee) => (
              <li key={employee.id}>
                {employee.fullName} — {employee.department.name} ({employee.status})
              </li>
            ))}
          </ul>
        </>
      )}

      {/* TODO: Section C — create/edit modal, Section D — delete confirmation */}
    </main>
  );
}
