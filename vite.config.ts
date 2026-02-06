import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["lucide-react", "motion", "clsx", "tailwind-merge"],
          "vendor-utils": ["axios", "date-fns", "react-toastify"],
          "pdf-worker": ["react-pdf"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: 'window',
  },
})
