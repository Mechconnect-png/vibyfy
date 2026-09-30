import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  envPrefix: ['VITE_', 'ANALYTICS_'],
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('/react/') || id.includes('/react-dom/')) {
              return 'vendor_react';
            }
            if (id.includes('firebase')) return 'vendor_firebase';
            if (id.includes('framer-motion')) return 'vendor_motion';
            if (id.includes('recharts')) return 'vendor_charts';
            if (id.includes('howler')) return 'vendor_audio';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor_icons';
          }
        },
      },
    },
  },
})