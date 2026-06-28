// ============================================================
//  kata — SideNav (サイドナビ)
//  フラットなリンクに加え、入れ子のアコーディオン (ディレクトリ) に対応。
//  ルーター非依存: リンクの描画は renderLink で委譲する。
// ============================================================
import { Fragment, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './Icon';
import styles from './SideNav.module.css';

export interface SideNavLink {
  key: string;
  /** 遷移先 (renderLink にそのまま渡す) */
  to: string;
  label: ReactNode;
  icon?: ReactNode;
  /** 完全一致でのみアクティブ扱いにするか (renderLink 側で利用) */
  exact?: boolean;
}

export interface SideNavGroup {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  /** 初期状態で開いておくか */
  defaultOpen?: boolean;
  children: SideNavLink[];
}

export type SideNavItem = SideNavLink | SideNavGroup;

export interface SideNavRenderCtx {
  /** リンク要素に必ず付けるクラス */
  className: string;
  /** アクティブ時に追加するクラス */
  activeClassName: string;
  /** アイコン + ラベルの中身 (DS 側で組み立て済み) */
  content: ReactNode;
}

interface SideNavProps {
  items: SideNavItem[];
  /** リンク描画の委譲。<a> や router の <Link> を返す */
  renderLink: (link: SideNavLink, ctx: SideNavRenderCtx) => ReactNode;
  /** 最下部にピン留めする領域 */
  footer?: ReactNode;
  className?: string;
}

function isGroup(item: SideNavItem): item is SideNavGroup {
  return (item as SideNavGroup).children !== undefined;
}

function linkContent(link: SideNavLink): ReactNode {
  return (
    <>
      {link.icon}
      <span className={styles.label}>{link.label}</span>
    </>
  );
}

export function SideNav({ items, renderLink, footer, className }: SideNavProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const it of items) if (isGroup(it)) init[it.key] = it.defaultOpen ?? false;
    return init;
  });

  return (
    <div className={cn(styles.root, className)}>
      <nav className={styles.nav}>
        {items.map((it) =>
          isGroup(it) ? (
            <div key={it.key} className={styles.group}>
              <button
                type="button"
                className={styles.groupHeader}
                aria-expanded={open[it.key] ?? false}
                onClick={() => setOpen((o) => ({ ...o, [it.key]: !o[it.key] }))}
              >
                {it.icon}
                <span className={styles.label}>{it.label}</span>
                <Icon
                  name="chevron"
                  size={15}
                  className={cn(styles.chev, open[it.key] && styles.chevOpen)}
                />
              </button>
              {open[it.key] && (
                <div className={styles.panel}>
                  {it.children.map((c) => (
                    <Fragment key={c.key}>
                      {renderLink(c, {
                        className: styles.childLink,
                        activeClassName: styles.on,
                        content: linkContent(c),
                      })}
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Fragment key={it.key}>
              {renderLink(it, {
                className: styles.link,
                activeClassName: styles.on,
                content: linkContent(it),
              })}
            </Fragment>
          ),
        )}
      </nav>
      {footer && <div className={styles.foot}>{footer}</div>}
    </div>
  );
}
