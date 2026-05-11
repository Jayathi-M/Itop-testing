import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Normalize Windows backslashes → forward slashes
          const normalizedId = id.replace(/\\/g, '/')

          // ── React core ────────────────────────────────────────────────────
          if (normalizedId.includes('node_modules/react/') ||
              normalizedId.includes('node_modules/react-dom/') ||
              normalizedId.includes('node_modules/react-router') ||
              normalizedId.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }

          // ── Animation / scroll ───────────────────────────────────────────
          if (normalizedId.includes('node_modules/gsap') ||
              normalizedId.includes('node_modules/@gsap') ||
              normalizedId.includes('node_modules/lenis')) {
            return 'vendor-animation'
          }

          // ── FontAwesome ──────────────────────────────────────────────────
          if (normalizedId.includes('node_modules/@fortawesome')) {
            return 'vendor-icons'
          }

          // ── html2canvas ──────────────────────────────────────────────────
          if (normalizedId.includes('node_modules/html2canvas')) {
            return 'vendor-html2canvas'
          }

          // ── DOMPurify ────────────────────────────────────────────────────
          if (normalizedId.includes('node_modules/dompurify') ||
              normalizedId.includes('node_modules/purify')) {
            return 'vendor-purify'
          }

          // ── Date / utility libs ──────────────────────────────────────────
          if (normalizedId.includes('node_modules/date-fns') ||
              normalizedId.includes('node_modules/dayjs') ||
              normalizedId.includes('node_modules/moment')) {
            return 'vendor-date'
          }

          // ── Axios / fetch helpers ────────────────────────────────────────
          if (normalizedId.includes('node_modules/axios') ||
              normalizedId.includes('node_modules/qs')) {
            return 'vendor-http'
          }

          // ── Core-js polyfills ────────────────────────────────────────────
          if (normalizedId.includes('node_modules/core-js')) {
            return 'vendor-polyfills'
          }

          // ── Everything else in node_modules ──────────────────────────────
          if (normalizedId.includes('node_modules/')) {
            return 'vendor-misc'
          }

          // App code → split per lazy import()
        },
      },
    },
  },
})