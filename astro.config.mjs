import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      include: ['**/components/**/*.{jsx,tsx}'],
      exclude: ['**/node_modules/**/*', '**/dist/**/*']
    }),
    tailwind()
  ],
  output: 'server',
  adapter: vercel(),
  server: {
    host: true, // Allow connections from all IPs
    port: 3000
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['@headlessui/react', 'framer-motion'],
            'three-vendor': ['three']
          }
        }
      }
    },
    server: {
      host: true, // Allow connections from all IPs
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**', '**/.astro/**']
      }
    },
    optimizeDeps: {
      exclude: ['@supabase/supabase-js']
    },
    ssr: {
      noExternal: ['@motionone/dom']
    }
  }
});
