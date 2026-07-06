import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import {
  cn,
  HamburgerMenu,
  Icon,
  SideNav,
  TabBar,
  type SideNavItem,
  type SideNavLink,
  type SideNavRenderCtx,
  type TabBarItem,
  type TabBarRenderCtx,
} from 'kata';
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

const MOBILE_TABS: Array<{ key: MobileTab; to: string; label: string; icon: ReactNode }> = [
  { key: 'overview', to: '/', label: '概要', icon: <Icon name="home" size={20} /> },
  { key: 'principles', to: '/principles', label: '特徴', icon: <Icon name="book" size={20} /> },
  { key: 'tokens', to: '/tokens', label: 'トークン', icon: <Icon name="chart" size={20} /> },
  { key: 'components', to: '/components', label: '部品', icon: <Icon name="note" size={20} /> },
];

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

  // Cmd/Ctrl+K で検索を開く
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

  const sideNavContent = (
    <SideNav
      key={activeGroup ?? 'none'}
      items={buildNavItems(activeGroup)}
      renderLink={renderLink}
      footer={themePicker}
    />
  );

  const mobileTabItems: TabBarItem[] = MOBILE_TABS.map((t) => ({
    key: t.key,
    label: t.label,
    icon: t.icon,
    active: currentTab === t.key,
  }));

  function renderTabItem(item: TabBarItem, ctx: TabBarRenderCtx): ReactNode {
    const spec = MOBILE_TABS.find((t) => t.key === item.key);
    if (!spec) return null;
    return (
      <Link
        to={spec.to}
        hash={CONTENT_ID}
        className={ctx.className}
        aria-current={ctx.active ? 'page' : undefined}
      >
        {ctx.content}
      </Link>
    );
  }

  return (
    <div className={styles.shell}>
      {/* モバイル top bar (>= 880px では非表示) */}
      <header className={styles.topbar}>
        <HamburgerMenu
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          triggerLabel="メニューを開く"
        >
          <div className={styles.drawerHead}>
            <span className={styles.topbarMark}>型</span>
            <span className={styles.topbarName}>kata</span>
          </div>
          {sideNavContent}
        </HamburgerMenu>
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
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>型</span>
            <span className={styles.brandText}>kata</span>
            <span className={styles.brandSub}>design system</span>
          </div>
          {sideNavContent}
        </aside>

        <main id={CONTENT_ID} className={styles.content}>
          {children}
        </main>
      </div>

      <TabBar
        variant="floating"
        ariaLabel="モバイルナビ"
        items={mobileTabItems}
        renderItem={renderTabItem}
        className={styles.mobileTabBar}
      />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
