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
  optimizeDeps: {
    exclude: ["pdfjs-dist"], // Để Vite không pre-bundle, giúp worker resolve đúng
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["lucide-react", "motion", "clsx", "tailwind-merge", "react-icons"],
          "vendor-utils": ["axios", "date-fns", "react-toastify"],
          "vendor-dnd": ["react-dnd", "react-dnd-html5-backend"],
          "pdf-worker": ["react-pdf"],
          "vendor-markdown": ["react-markdown"],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: 'window',
  },
  base: '/',
})
