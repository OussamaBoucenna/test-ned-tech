import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ROUTES } from './constants';
import { DirectoryPage } from './pages/DirectoryPage';
import { LoginPage } from './pages/LoginPage';
import { LogsPage } from './pages/LogsPage';

export function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Authenticated area — guarded and wrapped in the app shell. */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.EMPLOYEES} element={<DirectoryPage />} />
        <Route path={ROUTES.LOGS} element={<LogsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.EMPLOYEES} replace />} />
    </Routes>
  );
}
