import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import {
  COMPONENTS,
  GROUPS,
  type CompEntry,
  type GroupKey,
} from '~/catalog/components-registry';
import { preview } from '~/catalog/previews';
import styles from '~/catalog/overview.module.css';

export const Route = createFileRoute('/')({
  component: OverviewPage,
});

// docs/design/Catalog.dc.html の feat 列に対応。
const FEATURES: Array<{ title: string; body: string; num: string }> = [
  {
    num: '壱',
    title: 'CSS Modules + CSS 変数',
    body: 'スタイルはコンポーネント単位でスコープ。トークンは CSS カスタムプロパティで提供し、color-mix() で派生色を動的に生成する。テーマ側はベース色のみ上書きし、派生は触らない。',
  },
  {
    num: '弐',
    title: 'ライブラリ非依存',
    body: 'Tailwind / styled-components / cva / clsx は使わない。クラス合成は cn() ヘルパー (filter + join) のみ。依存を最小に保ち、長く使える基盤を目指す。',
  },
  {
    num: '参',
    title: 'ライト / ダーク',
    body: '霧 (kiri) をライト既定、墨 (sumi) をダークパレットに。data-theme で切り替え、ライト / ダーク / システム追従は useAppearance で管理する。',
  },
  {
    num: '四',
    title: '日本語に最適化',
    body: 'Zen Kaku Gothic New を本文に、Space Grotesk を数字に。palt で日本語を詰め、tnum で数字を等幅に揃える。読み心地とテーブルの整列を両立。',
  },
  {
    num: '五',
    title: 'サービス横断で再利用',
    body: '特定のアプリに依存しない汎用デザインシステム。健康・習慣・記録系のパーソナルアプリを共通の型で作れるよう、複数の個人開発サービスから共有して使う。',
  },
  {
    num: '六',
    title: 'ソース配布 (git 依存)',
    body: 'CSS Modules ソースをそのまま配布し、利用側の Vite でコンパイル。github:takumimzd/kata を git 依存で参照し、タグやブランチでバージョンを固定する。',
  },
];

const GROUP_KANJI: Record<GroupKey, string> = {
  root: '壱',
  forms: '弐',
  charts: '参',
  editor: '四',
};

const GROUP_META: Record<GroupKey, string> = {
  root: '表示 / ナビ / オーバーレイ',
  forms: '入力系',
  charts: '数字を見せる',
  editor: 'Lexical ベース',
};

type Filter = 'all' | GroupKey;

interface Enriched extends CompEntry {
  idx: string;
  visible: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function OverviewPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const total = COMPONENTS.length;

  const enriched: Enriched[] = useMemo(() => {
    const q = query.toLowerCase();
    return COMPONENTS.map((c, i) => {
      const matchQ =
        !q ||
        c.slug.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q);
      const matchF = filter === 'all' || c.group === filter;
      return {
        ...c,
        idx: `${pad(i + 1)} / ${pad(total)}`,
        visible: matchQ && matchF,
      };
    });
  }, [filter, query, total]);

  const visibleCount = enriched.filter((c) => c.visible).length;
  const groupCounts: Record<GroupKey, number> = { root: 0, forms: 0, charts: 0, editor: 0 };
  COMPONENTS.forEach((c) => {
    groupCounts[c.group]++;
  });

  return (
    <div className={styles.page}>
      {/* ============ HERO ============ */}
      <section id="hero" className={styles.hero}>
        <div className={styles.watermark} aria-hidden>
          型
        </div>
        <div className={styles.heroInner}>
          <div className={styles.meta}>
            <span className={styles.metaKey}>Design System</span>
            <span className={styles.metaVer}>v0.1 · 2026</span>
            <span className={styles.metaTag}>個人開発の共通言語</span>
          </div>

          <div className={styles.wrap}>
            <div className={styles.big}>
              <h1 className={styles.title}>
                型 <span className={styles.titleEn}>— kata</span>
              </h1>
              <p className={styles.lede}>
                個人開発のサービス間で共有する汎用デザインシステム。トークン・コンポーネント・カタログを 1
                リポジトリにまとめ、各サービスから git 依存で利用する。
                <span className={styles.ledeStrong}>静かに、続けやすく、要素は最小限に。</span>
              </p>

              <div className={styles.cta}>
                <a href="#components" className={styles.ctaPrimary}>
                  コンポーネントを見る <span style={{ opacity: 0.7 }}>→</span>
                </a>
                <a href="#principles" className={styles.ctaSecondary}>
                  特徴 · principles
                </a>
                <a
                  href="https://github.com/takumimzd/kata"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.ctaLink}
                >
                  GitHub ↗
                </a>
              </div>
            </div>

            <div className={styles.sideInfo}>
              <div className={styles.eyebrow}>meta</div>
              <dl className={styles.dl}>
                <dt>基盤</dt>
                <dd className="num">React 19 · CSS Modules</dd>
                <dt>タイポ</dt>
                <dd>
                  Zen Kaku Gothic New / <span style={{ fontFamily: 'var(--num)' }}>Space Grotesk</span>
                </dd>
                <dt>配布</dt>
                <dd>git 依存 (ソース)</dd>
                <dt>対応</dt>
                <dd>霧 kiri · 墨 sumi</dd>
                <dt>領域</dt>
                <dd style={{ color: 'var(--text-dim)' }}>健康 · 習慣 · 記録</dd>
              </dl>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{total}</span>
              <span className={styles.statCap}>部品 · parts</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statCap}>グループ · groups</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>65</span>
              <span className={styles.statCap}>アイコン · icons</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>2</span>
              <span className={styles.statCap}>テーマ · themes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>1</span>
              <span className={styles.statCap}>アクセント色 · accent</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>
                4<span className={styles.statUnit}>px</span>
              </span>
              <span className={styles.statCap}>グリッド · grid</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRINCIPLES ============ */}
      <section id="principles">
        <div className={styles.chap}>
          <span className={styles.chapKanji}>弐</span>
          <div>
            <div className={styles.chapJp}>特徴</div>
            <div className={styles.chapEn}>principles · 06</div>
          </div>
          <div className={styles.chapSide}>
            design principles
            <br />
            <span className={styles.chapSideDim}>kata が守るルール</span>
          </div>
        </div>

        <div className={styles.feats}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={styles.feat}>
              <span className={styles.featN}>
                {pad(i + 1)} / {pad(FEATURES.length)}
              </span>
              <span className={styles.featT}>{f.title}</span>
              <span className={styles.featB}>{f.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ COMPONENTS ============ */}
      <section id="components">
        <div className={styles.chap}>
          <span className={styles.chapKanji}>参</span>
          <div>
            <div className={styles.chapJp}>
              コンポーネント <span style={{ fontFamily: 'var(--num)', fontWeight: 500, fontSize: 15, color: 'var(--text-dim)', marginLeft: 8 }}>型録</span>
            </div>
            <div className={styles.chapEn}>components catalog · {total}</div>
          </div>
          <div className={styles.chapSide}>
            全 {total} 品
            <br />
            <span className={styles.chapSideDim}>4 グループに分類</span>
          </div>
        </div>

        <div className={styles.tools}>
          <div className={styles.toolsRow}>
            <label className={styles.searchIn}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.searchIcon}
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="text"
                placeholder="コンポーネントを検索（例: button, chart, calendar）"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className={styles.searchCount}>
                {visibleCount} / {total}
              </span>
            </label>

            <div className={styles.chipRow}>
              <button
                type="button"
                className={`${styles.fchip}${filter === 'all' ? ` ${styles.fchipOn}` : ''}`}
                onClick={() => setFilter('all')}
              >
                すべて <span className={styles.fchipN}>{pad(total)}</span>
              </button>
              {GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  className={`${styles.fchip}${filter === g.key ? ` ${styles.fchipOn}` : ''}`}
                  onClick={() => setFilter(g.key)}
                >
                  {g.label} <span className={styles.fchipN}>{pad(groupCounts[g.key])}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.groups}>
          {GROUPS.map((g, gi) => {
            const items = enriched.filter((c) => c.group === g.key);
            const anyVisible = items.some((c) => c.visible);
            if (!anyVisible) return null;
            return (
              <div key={g.key}>
                <div className={styles.ganchor} id={`g-${g.key}`}>
                  <span className={styles.gKan}>{GROUP_KANJI[g.key]}</span>
                  <span className={styles.gJp}>{g.label}</span>
                  <span className={styles.gEn}>
                    {g.meta} · {g.key === 'root' ? 'root' : g.key}
                  </span>
                  <span className={styles.gMeta}>
                    {pad(groupCounts[g.key])} 品 · {GROUP_META[g.key]}
                  </span>
                </div>
                <div
                  className={styles.grid}
                  style={{ paddingBottom: gi === GROUPS.length - 1 ? 0 : undefined }}
                >
                  {items.map(
                    (c) =>
                      c.visible && (
                        <Link key={c.slug} to={c.to} className={styles.cc}>
                          <div className={styles.ccPreview}>
                            {preview(c.slug)}
                            <span className={styles.ccCap}>{c.slug}</span>
                          </div>
                          <span className={styles.ccIdx}>{c.idx}</span>
                          <span className={styles.ccTag}>{c.group}</span>
                          <div className={styles.ccBody}>
                            <span className={styles.ccName}>{c.name}</span>
                            <span className={styles.ccDesc}>{c.desc}</span>
                          </div>
                        </Link>
                      ),
                  )}
                </div>
              </div>
            );
          })}

          {visibleCount === 0 && (
            <div className={styles.empty}>
              「{query}」に一致するコンポーネントはありません。
            </div>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className={styles.footer}>
        <div className={styles.footerL}>
          <div className={styles.footerBrand}>
            <span className={styles.footerMark}>型</span>
            <span className={styles.footerName}>kata design system</span>
          </div>
          <div className={styles.footerDesc}>
            個人開発サービスの共通言語。
            <br />
            MIT · <span style={{ fontFamily: 'var(--num)' }}>github.com/takumimzd/kata</span>
          </div>
        </div>
        <div className={styles.footerR}>v0.1 · 2026 · kataroku</div>
      </footer>
    </div>
  );
}
