import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cp, mkdir } from 'node:fs/promises';

function packageWorker() {
  return {
    name: 'package-cloudflare-worker',
    async closeBundle() {
      await mkdir('dist/server', { recursive: true });
      await cp('worker/index.js', 'dist/server/index.js');
      await cp('worker/signup.js', 'dist/server/signup.js');
    },
  };
}

export default defineConfig({
  plugins: [react(), packageWorker()],
  server: { proxy: { '/api': 'http://localhost:8787' } },
});
