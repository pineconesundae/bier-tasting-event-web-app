import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cp, mkdir } from 'node:fs/promises';

function packageWorker() {
  return {
    name: 'package-cloudflare-worker',
    async closeBundle() {
      await mkdir('dist/server', { recursive: true });
      await mkdir('dist/.openai/drizzle', { recursive: true });
      await cp('worker/index.js', 'dist/server/index.js');
      await cp('worker/signup.js', 'dist/server/signup.js');
      await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
      await cp('migrations/0001_create_signups.sql', 'dist/.openai/drizzle/0001_create_signups.sql');
    },
  };
}

export default defineConfig({
  plugins: [react(), packageWorker()],
  server: { proxy: { '/api': 'http://localhost:8787' } },
});
