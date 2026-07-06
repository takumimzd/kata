import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { cn, Icon, SideNav, type SideNavItem, type SideNavLink, type SideNavRenderCtx } from 'kata';
import { COMPONENTS, GROUPS } from './components-registry';
import { SearchOverlay } from './SearchOverlay';
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

/** ナビ項目を組み立てる。src/ds/components/ の構成に対応 */
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
    {
      key: 'components',
      label: 'コンポーネント',
      icon: <Icon name="note" size={18} />,
      defaultOpen: activeGroup !== null,
      children: componentChildren,
    },
  ];
}

const CONTENT_ID = 'content';

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'kiri') delete root.dataset.theme;
  else root.dataset.theme = theme;
}

/** モバイル用ボトムタブバーの 4 タブ */
type MobileTab = 'overview' | 'principles' | 'tokens' | 'components';

function activeMobileTab(pathname: string): MobileTab {
  if (pathname === '/') return 'overview';
  if (pathname.startsWith('/principles')) return 'principles';
  if (pathname.startsWith('/tokens')) return 'tokens';
  if (pathname.startsWith('/components')) return 'components';
  return 'overview';
}

export function Chrome({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('kiri');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useLocation({ select: (l) => l.pathname });
  const activeGroup = activeGroupKey(pathname);
  const currentTab = activeMobileTab(pathname);

  /** TanStack Router の <Link> で SideNav のリンクを描画する */
  function renderLink(link: SideNavLink, ctx: SideNavRenderCtx): ReactNode {
    return (
      <Link
        to={link.to}
        hash={CONTENT_ID}
        className={ctx.className}
        activeProps={{ className: cn(ctx.className, ctx.activeClassName) }}
        activeOptions={{ exact: link.exact }}
        onClick={() => setDrawerOpen(false)}
      >
        {ctx.content}
      </Link>
    );
  }

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const next = stored && THEMES.includes(stored) ? stored : 'kiri';
    setTheme(next);
    applyTheme(next);
  }, []);

  // ページ遷移でドロワー / 検索を閉じる
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Cmd/Ctrl+K で検索を開く / Esc で閉じる
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (e.key === '/' && !searchOpen) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable) return;
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  // ドロワー開閉時に body スクロールを制御
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [drawerOpen]);

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
      {/* モバイル top bar (>= 880px では非表示) */}
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.topbarBtn}
          aria-label="メニューを開く"
          onClick={() => setDrawerOpen(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className={styles.topbarBrand}>
          <span className={styles.topbarMark}>型</span>
          <span className={styles.topbarName}>kata</span>
        </div>
        <span className={styles.topbarSpacer} />
        <button
          type="button"
          className={styles.topbarBtn}
          aria-label="コンポーネントを検索"
          onClick={() => setSearchOpen(true)}
        >
          <Icon name="search" size={18} />
        </button>
      </header>

      <div className={styles.shellInner}>
        {drawerOpen && <div className={styles.backdrop} onClick={() => setDrawerOpen(false)} />}
        <aside className={`${styles.sidebar}${drawerOpen ? ` ${styles.open}` : ''}`}>
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

      {/* モバイルボトムタブ (>= 880px では非表示) */}
      <nav className={styles.tabbar} aria-label="モバイルナビ">
        <Link
          to="/"
          hash={CONTENT_ID}
          className={`${styles.tab}${currentTab === 'overview' ? ` ${styles.tabOn}` : ''}`}
          aria-current={currentTab === 'overview' ? 'page' : undefined}
        >
          <Icon name="home" size={20} />
          <span className={styles.tabLab}>概要</span>
        </Link>
        <Link
          to="/principles"
          hash={CONTENT_ID}
          className={`${styles.tab}${currentTab === 'principles' ? ` ${styles.tabOn}` : ''}`}
          aria-current={currentTab === 'principles' ? 'page' : undefined}
        >
          <Icon name="book" size={20} />
          <span className={styles.tabLab}>特徴</span>
        </Link>
        <Link
          to="/tokens"
          hash={CONTENT_ID}
          className={`${styles.tab}${currentTab === 'tokens' ? ` ${styles.tabOn}` : ''}`}
          aria-current={currentTab === 'tokens' ? 'page' : undefined}
        >
          <Icon name="chart" size={20} />
          <span className={styles.tabLab}>トークン</span>
        </Link>
        <Link
          to="/components"
          hash={CONTENT_ID}
          className={`${styles.tab}${currentTab === 'components' ? ` ${styles.tabOn}` : ''}`}
          aria-current={currentTab === 'components' ? 'page' : undefined}
        >
          <Icon name="note" size={20} />
          <span className={styles.tabLab}>部品</span>
        </Link>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
