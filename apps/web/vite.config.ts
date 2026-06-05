import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
    // In Docker the bind-mounted FS doesn't emit native change events, so
    // fall back to polling for hot reload (enabled via the compose env var).
    watch: process.env.CHOKIDAR_USEPOLLING
      ? { usePolling: true }
      : undefined,
  },
});
