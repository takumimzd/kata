import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import page from '~/catalog/page.module.css';
import styles from '~/catalog/principles.module.css';
import { Code } from '~/catalog/parts';

export const Route = createFileRoute('/principles')({
  component: PrinciplesPage,
});

const PRINCIPLES: Array<{ title: string; body: string }> = [
  {
    title: 'CSS Modules + CSS変数',
    body: 'スタイルはコンポーネント単位でスコープ。デザイントークンは CSS カスタムプロパティで提供し、color-mix() で派生色を動的に生成する。',
  },
  {
    title: 'ライブラリ非依存',
    body: 'Tailwind / styled-components / cva / clsx は使わない。クラス合成は cn() ヘルパー (filter + join) のみ。依存を最小に保つ。',
  },
  {
    title: 'ソース配布',
    body: 'ビルド済みではなく CSS Modules ソースをそのまま配布し、利用側の Vite でコンパイルする。git 依存で参照する。',
  },
  {
    title: '日本語に最適化',
    body: 'Zen Kaku Gothic New を本文、Space Grotesk を数字に。palt で日本語を詰め、tnum で数字を等幅に揃える。',
  },
  {
    title: 'ライト / ダーク',
    body: '霧 (kiri) をライト既定、墨 (sumi) をダークパレットに。data-theme で切り替え、ライト/ダーク/システム追従は useAppearance で管理する。',
  },
  {
    title: 'サービス横断で再利用',
    body: '特定アプリに依存しない汎用デザインシステム。複数の個人開発サービスから共有して使う。',
  },
];

const TOKENS: Array<{ name: string; use: string }> = [
  { name: '--bg / --bg-2', use: 'ページ背景' },
  { name: '--surface / -2 / -3', use: 'カード・面・押下' },
  { name: '--text / -dim / -faint', use: '本文 / 副文 / 薄字' },
  { name: '--accent / -2', use: 'アクセント / ホバー' },
  { name: '--on-accent', use: 'アクセント上の文字' },
  { name: '--accent-soft / -line', use: 'アクセントの薄塗り / 罫' },
  { name: '--danger / -soft / -line', use: '危険操作 (赤)' },
  { name: '--clay / -soft', use: '中性の強調色' },
  { name: '--line / -2', use: '罫線 (淡 / 通常)' },
  { name: '--fill-1 / -2', use: '中性の塗り (淡 / 通常)' },
  { name: '--space-1〜10', use: '余白 (4pxグリッド)' },
  { name: '--radius-xs〜xl / -full', use: '角丸 (6〜24 / 丸)' },
  { name: '--shadow / -sm', use: '影' },
  { name: '--ja / --num / --display', use: '本文 / 数字 / 表示' },
];

function Section({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <section className={page.section}>
      <div className={page.sectionTitle}>
        <h2>{title}</h2>
        <span>{meta}</span>
      </div>
      {children}
    </section>
  );
}

function PrinciplesPage() {
  return (
    <div className={page.page}>
      <header className={page.head}>
        <span className={page.eyebrow}>about</span>
        <h1 className={page.h1}>特徴と設計思想</h1>
        <p className={page.lede}>
          kata がどんな原則で作られ、どう拡張するか。トークンの使い方、ディレクトリ・命名規約、
          新しいコンポーネントの追加手順をまとめる。
        </p>
      </header>

      <Section title="設計思想" meta="principles">
        <div className={page.featureGrid}>
          {PRINCIPLES.map((p) => (
            <div key={p.title} className={`${page.card} ${page.feature}`}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="デザイントークン" meta="tokens">
        <p style={{ fontSize: 13.5, lineHeight: 1.8, color: 'var(--text-dim)' }}>
          全トークンは CSS カスタムプロパティ。テーマ (霧 / 墨) は <code>:root</code> と
          <code> data-theme=&apos;sumi&apos;</code> で背景・前景・アクセント・danger のみ上書きし、
          派生トークン (soft / line など) は <code>color-mix()</code> で自動生成するためテーマ側では
          触らない。値の一覧は「トークン」ページを参照。
        </p>
        <div className={styles.tokens}>
          {TOKENS.map((t) => (
            <div key={t.name} className={styles.token}>
              <code>{t.name}</code>
              <span>{t.use}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="規約" meta="conventions">
        <p style={{ fontSize: 13.5, lineHeight: 1.8, color: 'var(--text-dim)' }}>
          表示・ナビ・オーバーレイ系は <code>src/ds/components/</code> 直下にフラットで
          <code> Name.tsx</code> + <code>Name.module.css</code> を置く。<code>forms/</code> /
          <code> charts/</code> / <code>editor/</code> だけはサブフォルダにまとめ、<code>index.ts</code>
          バレルで束ねる。公開 API <code>import &#123; X &#125; from &apos;kata&apos;</code> は構成と無関係に不変。
          クラス合成はテンプレートリテラルを直書きせず <code>cn()</code> を使う。
        </p>
        <Code>{`src/ds/
├─ components/
│  ├─ Button.tsx          // 直下フラット (表示/アクション/ナビ/オーバーレイ)
│  ├─ Button.module.css
│  ├─ Card.tsx
│  ├─ forms/              // 入力系はサブフォルダ + index.ts
│  │  ├─ Field.tsx
│  │  └─ index.ts
│  ├─ charts/             // チャート系
│  └─ editor/             // RichTextEditor (Lexical)
├─ lib/                   // cn() / date / theme
├─ styles/                // reset / tokens / utilities
└─ index.ts               // パッケージ公開エントリ

// クラス合成 (直下は ../lib、forms 内は ../../lib)
import { cn } from '../lib/cn';
className={cn(styles.btn, styles[variant], block && styles.block)}`}</Code>
      </Section>

      <Section title="コンポーネントの追加手順" meta="how to">
        <ol className={styles.steps}>
          <li>
            <code>src/ds/components/</code> に <code>Name.tsx</code> + <code>Name.module.css</code>
            を作る (入力系なら <code>forms/</code> 内 + バレルに追記)。色・余白・角丸は必ずトークン
            (<code>var(--...)</code>) を使い、生の hex や px を直書きしない。
          </li>
          <li>
            <code>src/ds/index.ts</code> から <code>export</code> して公開 API に追加する。
          </li>
          <li>
            カタログに載せる: <code>src/catalog/components-registry.ts</code> に
            <code> entry(slug, name, desc, group)</code> を 1 行追加し、
            <code> src/routes/components/&lt;slug&gt;.tsx</code> を作る (Doc + Demo + Code +
            PropsTable)。
          </li>
          <li>
            <code>pnpm typecheck</code> / <code>pnpm lint</code> / <code>pnpm build</code> が
            通ることを確認する。ナビのカテゴリ・アコーディオンと一覧には registry の
            <code> group</code> から自動で並ぶ。
          </li>
        </ol>
      </Section>

      <Section title="アクセシビリティとレスポンシブ" meta="a11y / responsive">
        <div className={page.featureGrid}>
          <div className={`${page.card} ${page.feature}`}>
            <h3>アクセシビリティ</h3>
            <p>
              IconButton は <code>label</code> (aria-label) 必須。モーダル/ダイアログは role と
              Escape、ConfirmDialog は Enter での確定にも対応。フォーカス可視は color-scheme に追従。
            </p>
          </div>
          <div className={`${page.card} ${page.feature}`}>
            <h3>レスポンシブ</h3>
            <p>
              ブレークポイントは 600 / 880 / 1200px。モバイルファーストで、880px を境にサイドバー
              などのレイアウトを切り替える。
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
