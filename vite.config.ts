import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    // tsconfig の paths (~/* -> ./src/*, sumi -> ./src/ds) を Vite ネイティブで解決する。
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    // Cloudflare プラグインは最後。SSR 環境をラップして cloudflare:workers を解決する。
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
  ],
});
