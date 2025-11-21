import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Cambia 'MJV_TRAVEL_SAFELY_PROYECTO' por el nombre exacto de tu repositorio en GitHub
  base: process.env.NODE_ENV === 'production' ? '/MJV_TRAVEL_SAFELY_PROYECTO/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})