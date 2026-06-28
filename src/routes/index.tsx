import { createFileRoute, Link } from '@tanstack/react-router';
import { COMPONENTS, groupedComponents } from '~/catalog/components-registry';
import styles from '~/catalog/page.module.css';

export const Route = createFileRoute('/')({
  component: OverviewPage,
});

const FEATURES: Array<{ title: string; body: string }> = [
  {
    title: 'CSS Modules + CSS変数',
    body: 'スタイルはコンポーネント単位でスコープ。トークンは CSS カスタムプロパティで提供し、color-mix() で派生色を動的生成する。',
  },
  {
    title: 'ライブラリ非依存',
    body: 'Tailwind / styled-components / cva / clsx は使わない。クラス合成は cn() ヘルパー (filter+join) のみ。依存を最小に保つ。',
  },
  {
    title: 'ライト / ダーク',
    body: '霧 (kiri) をライト既定、墨 (sumi) をダークパレットに。data-theme で切り替え、ライト/ダーク/システム追従は useAppearance で管理する。',
  },
  {
    title: '日本語に最適化',
    body: 'Zen Kaku Gothic New を本文に、Space Grotesk を数字に。palt で日本語を詰め、tnum で数字を等幅に揃える。',
  },
  {
    title: 'サービス横断で再利用',
    body: '特定のアプリに依存しない汎用デザインシステム。複数の個人開発サービスから git 依存で共有して使う。',
  },
  {
    title: 'ソース配布 (git依存)',
    body: 'CSS Modules ソースをそのまま配布し、利用側の Vite でコンパイル。github:takumimzd/kata を git 依存で参照する。',
  },
];

function OverviewPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className={styles.eyebrow}>design system</span>
        <h1 className={styles.h1}>型 — kata</h1>
        <p className={styles.lede}>
          個人開発のサービス間で共有する汎用デザインシステム。トークン・コンポーネント・その
          カタログを 1 つのリポジトリにまとめ、各サービスから git 依存で利用する。ダークテーマ
          の墨 (sumi) とは別物。
        </p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>特徴</h2>
          <span>design principles</span>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={`${styles.card} ${styles.feature}`}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>コンポーネント</h2>
          <span>{COMPONENTS.length} components</span>
        </div>
        <div className={styles.catGrid}>
          {groupedComponents().map(({ group, items }) => (
            <Link key={group.key} to="/components" className={`${styles.card} ${styles.catCard}`}>
              <div className={styles.catHead}>
                <h3>{group.label}</h3>
                <span>{items.length}</span>
              </div>
              <p>{items.map((c) => c.name).join(' · ')}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
