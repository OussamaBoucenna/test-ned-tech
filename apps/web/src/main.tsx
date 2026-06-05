import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { GlobalLoadingBar } from './components/GlobalLoadingBar';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { QueryProvider } from './providers/QueryProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ToastProvider is outermost so QueryProvider's error handler can raise toasts. */}
    <ToastProvider>
      <QueryProvider>
        <BrowserRouter>
          <AuthProvider>
            <GlobalLoadingBar />
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryProvider>
    </ToastProvider>
  </StrictMode>,
);
