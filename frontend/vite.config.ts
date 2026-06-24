import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/hospitals': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/queue': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
      '/tokens': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
      '/triage': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      }
    }
  }
})
