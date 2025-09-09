import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/publish-or-perish/',
  build: {
    // Allow build to continue despite TypeScript errors
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        warn(warning)
      }
    }
  }
})
