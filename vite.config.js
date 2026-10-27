import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { localAdminPlugin } from './tools/admin-local.js'
import { cloudflareStaticPlugin } from './tools/cloudflare-static.js'

export default defineConfig(({ mode }) => ({
  plugins: [react(), localAdminPlugin(mode === 'admin'), cloudflareStaticPlugin(mode === 'cloudflare')],
  ...(mode === 'admin' ? { server: { host: '127.0.0.1', port: 5174, strictPort: true } } : {}),
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/messaging'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}))
