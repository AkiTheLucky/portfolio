import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://akithelucky.github.io',
  base: '/portfolio',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
