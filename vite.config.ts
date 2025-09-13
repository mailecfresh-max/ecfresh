import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',   // 👈 ensures assets resolve correctly in production
  build: {
    outDir: 'dist',  // 👈 makes sure Vercel picks the right folder
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
