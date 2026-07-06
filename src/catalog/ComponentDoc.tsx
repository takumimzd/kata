// 各コンポーネント詳細 (/components/<slug>) の共通レイアウト。
// 既存の Demo / Code / PropsTable の子要素はそのまま並び、
// - 上部: breadcrumb + index + meta strip
// - 下部: 関連コンポーネント + prev/next + 右レール TOC
// が自動で付加される。
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { COMPONENTS, GROUPS, type CompEntry, type GroupKey } from './components-registry';
import { preview } from './previews';
import styles from './component-doc.module.css';

const GROUP_LABEL: Record<GroupKey, string> = {
  root: 'ベース',
  forms: 'フォーム',
  charts: 'チャート',
  editor: 'エディタ',
};

function findEntry(slug: string): { entry: CompEntry; idx: number } | null {
  const idx = COMPONENTS.findIndex((c) => c.slug === slug);
  if (idx < 0) return null;
  const entry = COMPONENTS[idx];
  if (!entry) return null;
  return { entry, idx };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** 同じグループの前後 2 件を関連候補として取り出す (最大 3 件) */
function relatedOf(entry: CompEntry): CompEntry[] {
  const sameGroup = COMPONENTS.filter((c) => c.group === entry.group && c.slug !== entry.slug);
  return sameGroup.slice(0, 3);
}

interface SectionProps {
  n: string;
  title: string;
  en?: string;
  meta?: string;
  id?: string;
  children: ReactNode;
}

/** 「01 デモ」のような見出し + 内容ブロック。ComponentDoc 内で 5 番以降に手動で挿入して使う */
export function Section({ n, title, en, meta, id, children }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sec}>
        <span className={styles.secN}>{n}</span>
        <h2>{title}</h2>
        {en && <span className={styles.secEn}>{en}</span>}
        {meta && <span className={styles.secMeta}>{meta}</span>}
      </div>
      {children}
    </section>
  );
}

interface ComponentDocProps {
  /** components-registry の slug */
  slug: string;
  /** 主要見出し (通常はコンポーネント名) */
  title?: string;
  /** 概要 1〜2 文 */
  lede?: ReactNode;
  /** 追加メタ (props 数などページごとに書きたい場合) */
  meta?: {
    variant?: string;
    props?: string;
    deps?: string;
    a11y?: string;
  };
  /** 本文 (デモ / 使い方 / props など)。Section 見出しは自動で振らないので、
   *  必要ならこのプロップの各要素の直前に <Section> を書く。 */
  children: ReactNode;
}

/**
 * コンポーネント詳細ページ用のリッチな Doc ラッパー。
 * - 上部: breadcrumb + タイトル + meta strip
 * - 本文: children (Demo/Code/PropsTable などをそのまま並べる)
 * - 下部: 関連コンポーネント / prev/next
 * - 右レール: セクション見出しから自動抽出した TOC (Section を使ったときのみ)
 */
export function ComponentDoc({ slug, title, lede, meta, children }: ComponentDocProps) {
  const found = findEntry(slug);
  if (!found) {
    return <div>Unknown component: {slug}</div>;
  }
  const { entry, idx } = found;
  const total = COMPONENTS.length;
  const prev = idx > 0 ? COMPONENTS[idx - 1] : null;
  const next = idx + 1 < total ? COMPONENTS[idx + 1] : null;
  const related = relatedOf(entry);
  const groupLabel = GROUP_LABEL[entry.group];
  const groupMeta = GROUPS.find((g) => g.key === entry.group);

  const displayTitle = title ?? entry.name;
  const displayLede = lede ?? entry.desc;

  // children から Section を拾って TOC を組む
  const tocEntries: Array<{ n: string; title: string; id: string }> = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type !== Section) return;
    const props = child.props as SectionProps;
    tocEntries.push({
      n: props.n,
      title: props.title,
      id: props.id ?? `sec-${props.n.replace(/[^0-9]/g, '')}`,
    });
  });

  // 各 Section に id を割り当てる (既に id があれば尊重)
  const numberedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (child.type !== Section) return child;
    const props = child.props as SectionProps;
    if (props.id) return child;
    const id = `sec-${props.n.replace(/[^0-9]/g, '')}`;
    return (child as ReactElement<SectionProps>).props.id
      ? child
      : {
          ...child,
          props: { ...props, id },
        };
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.main}>
        <header className={styles.head}>
          <div className={styles.crumb}>
            <Link to="/">概要</Link>
            <span className={styles.crumbSep}>/</span>
            <Link to="/components">コンポーネント</Link>
            <span className={styles.crumbSep}>/</span>
            <span>{groupLabel}</span>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{entry.name}</span>
          </div>

          <div className={styles.headMain}>
            <div className={styles.headL}>
              <div className={styles.headTagRow}>
                <span className={styles.headIdx}>
                  {pad(idx + 1)} / {pad(total)}
                </span>
                <span className={styles.headGroup}>
                  {entry.group} · {groupMeta?.meta ?? ''}
                </span>
                <span className={styles.headUpdated}>last updated 2026·07·04</span>
              </div>
              <h1 className={styles.title}>{displayTitle}</h1>
              {displayLede && <p className={styles.lede}>{displayLede}</p>}
            </div>

            <div className={styles.headR}>
              <a
                href={`https://github.com/takumimzd/kata/blob/main/src/ds/components/${
                  entry.group === 'root' ? entry.name : `${entry.group}/${entry.name}`
                }.tsx`}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceBtn}
              >
                <span>source</span>
                <span style={{ color: 'var(--text-faint)' }}>↗</span>
              </a>
            </div>
          </div>

          <div className={styles.metaStrip}>
            <div className={styles.metaCell}>
              <div className={styles.metaEyebrow}>variant</div>
              <div className={styles.metaVal}>{meta?.variant ?? '—'}</div>
            </div>
            <div className={styles.metaCell}>
              <div className={styles.metaEyebrow}>props</div>
              <div className={styles.metaVal}>{meta?.props ?? '—'}</div>
            </div>
            <div className={styles.metaCell}>
              <div className={styles.metaEyebrow}>依存</div>
              <div className={styles.metaVal}>{meta?.deps ?? 'なし'}</div>
            </div>
            <div className={styles.metaCell}>
              <div className={styles.metaEyebrow}>A11y</div>
              <div className={styles.metaVal}>{meta?.a11y ?? 'native'}</div>
            </div>
          </div>
        </header>

        {numberedChildren}

        {related.length > 0 && (
          <Section n="関連" title="関連コンポーネント" en="related" meta="同じグループの家族">
            <div className={styles.rgrid}>
              {related.map((r) => (
                <Link key={r.slug} to={r.to} className={styles.rel}>
                  <div className={styles.relPv}>{preview(r.slug)}</div>
                  <div className={styles.relBody}>
                    <span className={styles.relName}>{r.name}</span>
                    <span className={styles.relDesc}>{r.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        <nav className={styles.pnav}>
          {prev ? (
            <Link to={prev.to} className={styles.pnavItem}>
              <span className={styles.pnavDir}>← 前</span>
              <span className={styles.pnavName}>
                {prev.name} <span className={styles.pnavIdx}>{pad(idx)}</span>
              </span>
              <span className={styles.pnavDesc}>{prev.desc}</span>
            </Link>
          ) : (
            <span className={`${styles.pnavItem} ${styles.pnavEmpty}`}>
              <span className={styles.pnavDir}>← 前</span>
              <span className={styles.pnavName}>最初</span>
            </span>
          )}
          {next ? (
            <Link to={next.to} className={`${styles.pnavItem} ${styles.pnavNext}`}>
              <span className={styles.pnavDir}>次 →</span>
              <span className={styles.pnavName}>
                {next.name} <span className={styles.pnavIdx}>{pad(idx + 2)}</span>
              </span>
              <span className={styles.pnavDesc}>{next.desc}</span>
            </Link>
          ) : (
            <span className={`${styles.pnavItem} ${styles.pnavNext} ${styles.pnavEmpty}`}>
              <span className={styles.pnavDir}>次 →</span>
              <span className={styles.pnavName}>最後</span>
            </span>
          )}
        </nav>
      </div>

      <aside className={styles.rail}>
        {tocEntries.length > 0 && (
          <>
            <div className={styles.tocEyebrow}>目次 · on this page</div>
            <div className={styles.toc}>
              {tocEntries.map((t) => (
                <a key={t.id} href={`#${t.id}`}>
                  {t.n} · {t.title}
                </a>
              ))}
            </div>
          </>
        )}

        <div className={styles.metaBox}>
          <div className={styles.tocEyebrow} style={{ paddingLeft: 0 }}>
            メタ · meta
          </div>
          <div className={styles.metaList}>
            <div>
              <span>ver.</span>
              <span>v0.1</span>
            </div>
            <div>
              <span>group</span>
              <span>{groupLabel}</span>
            </div>
            <div>
              <span>index</span>
              <span>
                {pad(idx + 1)} / {pad(total)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
