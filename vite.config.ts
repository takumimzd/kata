import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    // tsconfig の paths (~/* -> ./src/*, kata -> ./src/ds) を Vite ネイティブで解決する。
    tsconfigPaths: true,
  },
  plugins: [
    // カタログはデータ取得の無いドキュメントサイトなので、全ルートを prerender して
    // 静的サイトとして配信する (Vercel は dist/client を静的ホスティング)。
    // crawlLinks: '/' からナビ・一覧のリンクを辿って全ページを静的生成する。
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true },
    }),
    viteReact(),
  ],
});
