import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { cn, Icon, SideNav, type SideNavItem, type SideNavLink, type SideNavRenderCtx } from 'kata';
import { COMPONENTS, GROUPS } from './components-registry';
import styles from './Chrome.module.css';

/** カタログで切り替えられるテーマ (kiri = ライト既定 / data-theme なし, sumi = ダーク) */
const THEMES = ['kiri', 'sumi'] as const;
type Theme = (typeof THEMES)[number];

const THEME_LABEL: Record<Theme, string> = {
  kiri: '霧 kiri（ライト）',
  sumi: '墨 sumi（ダーク）',
};

const THEME_KEY = 'kata.catalog.theme';

/** 現在のパスから所属カテゴリ key を求める (コンポーネントページ以外は null) */
function activeGroupKey(pathname: string): string | null {
  return COMPONENTS.find((c) => c.to === pathname)?.group ?? null;
}

/** group 内の各エントリを SideNav のリンクに変換 */
function linksOf(groupKey: string): SideNavLink[] {
  return COMPONENTS.filter((c) => c.group === groupKey).map(
    (c): SideNavLink => ({ key: c.slug, to: c.to, label: c.name }),
  );
}

/** ナビ項目を組み立てる。src/ds/components/ の構成に対応:
 *  「コンポーネント」直下に root 部品を並べ、forms/charts/editor をフォルダ(アコーディオン)にする。
 *  現在のページのフォルダのみ展開する。 */
function buildNavItems(activeGroup: string | null): SideNavItem[] {
  const componentChildren: SideNavItem[] = GROUPS.flatMap((g): SideNavItem[] =>
    g.folder
      ? [{ key: g.key, label: g.label, defaultOpen: g.key === activeGroup, children: linksOf(g.key) }]
      : linksOf(g.key),
  );

  return [
    { key: 'overview', to: '/', label: '概要', exact: true, icon: <Icon name="home" size={18} /> },
    { key: 'principles', to: '/principles', label: '特徴', icon: <Icon name="book" size={18} /> },
    { key: 'tokens', to: '/tokens', label: 'トークン', icon: <Icon name="chart" size={18} /> },
    { key: 'mobile', to: '/mobile', label: 'モバイル', icon: <Icon name="monitor" size={18} /> },
    {
      key: 'components',
      label: 'コンポーネント',
      icon: <Icon name="note" size={18} />,
      defaultOpen: activeGroup !== null,
      children: componentChildren,
    },
  ];
}

/** 本文要素の id。ナビリンクはこの id へのアンカー (hash) を付け、
 *  モバイルで「サイドメニューの上」ではなく本文へスクロールさせる。
 *  (scrollRestoration が先頭へ戻すのを、ルーター標準のハッシュスクロールで上書きする) */
const CONTENT_ID = 'content';

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'kiri') delete root.dataset.theme;
  else root.dataset.theme = theme;
}

export function Chrome({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('kiri');
  const pathname = useLocation({ select: (l) => l.pathname });
  const activeGroup = activeGroupKey(pathname);

  /** TanStack Router の <Link> で SideNav のリンクを描画する (本文へのアンカー付き) */
  function renderLink(link: SideNavLink, ctx: SideNavRenderCtx): ReactNode {
    return (
      <Link
        to={link.to}
        hash={CONTENT_ID}
        className={ctx.className}
        activeProps={{ className: cn(ctx.className, ctx.activeClassName) }}
        activeOptions={{ exact: link.exact }}
      >
        {ctx.content}
      </Link>
    );
  }

  // 初回マウントで保存値を反映 (SSR では既定の kiri)
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const next = stored && THEMES.includes(stored) ? stored : 'kiri';
    setTheme(next);
    applyTheme(next);
  }, []);

  function onPick(next: Theme) {
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // 永続化できない環境は無視
    }
  }

  const themePicker = (
    <div className={styles.themePicker}>
      <div className={styles.themeLabel}>テーマ</div>
      <div className={styles.themeGrid}>
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            className={`${styles.themeChip}${theme === t ? ` ${styles.themeChipOn}` : ''}`}
            data-theme={t === 'kiri' ? undefined : t}
            onClick={() => onPick(t)}
            title={THEME_LABEL[t]}
          >
            <span className={styles.themeSwatch} />
            {THEME_LABEL[t]}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>型</span>
          <span className={styles.brandText}>kata</span>
          <span className={styles.brandSub}>design system</span>
        </div>

        <SideNav
          key={activeGroup ?? 'none'}
          items={buildNavItems(activeGroup)}
          renderLink={renderLink}
          footer={themePicker}
        />
      </aside>

      <main id={CONTENT_ID} className={styles.content}>
        {children}
      </main>
    </div>
  );
}
