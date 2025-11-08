import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Cambia 'MJV_PROYECTO_TARVEL' por el nombre exacto de tu repositorio en GitHub
  base: process.env.NODE_ENV === 'production' ? '/MJV_PROYECTO_TARVEL/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})