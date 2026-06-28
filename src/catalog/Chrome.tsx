import { Link } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { cn, Icon, SideNav, type SideNavItem, type SideNavLink, type SideNavRenderCtx } from 'kata';
import { COMPONENTS } from './components-registry';
import styles from './Chrome.module.css';

/** カタログで切り替えられるテーマ (kiri = ライト既定 / data-theme なし, sumi = ダーク) */
const THEMES = ['kiri', 'sumi'] as const;
type Theme = (typeof THEMES)[number];

const THEME_LABEL: Record<Theme, string> = {
  kiri: '霧 kiri（ライト）',
  sumi: '墨 sumi（ダーク）',
};

const THEME_KEY = 'kata.catalog.theme';

const NAV_ITEMS: SideNavItem[] = [
  { key: 'overview', to: '/', label: '概要', exact: true, icon: <Icon name="home" size={18} /> },
  { key: 'principles', to: '/principles', label: '特徴', icon: <Icon name="book" size={18} /> },
  { key: 'tokens', to: '/tokens', label: 'トークン', icon: <Icon name="chart" size={18} /> },
  {
    key: 'components',
    label: 'コンポーネント',
    icon: <Icon name="note" size={18} />,
    defaultOpen: true,
    children: COMPONENTS.map((c): SideNavLink => ({ key: c.slug, to: c.to, label: c.name })),
  },
];

/** TanStack Router の <Link> で SideNav のリンクを描画する */
function renderLink(link: SideNavLink, ctx: SideNavRenderCtx): ReactNode {
  return (
    <Link
      to={link.to}
      className={ctx.className}
      activeProps={{ className: cn(ctx.className, ctx.activeClassName) }}
      activeOptions={{ exact: link.exact }}
    >
      {ctx.content}
    </Link>
  );
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'kiri') delete root.dataset.theme;
  else root.dataset.theme = theme;
}

export function Chrome({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('kiri');

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

        <SideNav items={NAV_ITEMS} renderLink={renderLink} footer={themePicker} />
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
