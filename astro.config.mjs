import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [
    react({
      include: ['**/react/*', '**/components/**/*.{jsx,tsx}'],
    }),
    tailwind(),
    netlify(),
  ],
  output: 'server',
  adapter: netlify(),
});
