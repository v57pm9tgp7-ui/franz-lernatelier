import { defineConfig } from 'vite';

// Local browser verification. Production continues to use src/index.js + public.
export default defineConfig({
  root: 'public',
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] }
});
