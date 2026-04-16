import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '', '');
  
  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      proxy: env.VITE_API_URL ? undefined : {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        },
        '/socket.io': {
          target: 'http://localhost:5000',
          ws: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '')
    }
  });
});
