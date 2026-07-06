// ============================================================
//  kata — TabBar
//  モバイルのボトムタブや、画面内の水平タブ列に使う。
//  リンクの実体はアプリ側でルーターに合わせて描画できるよう renderItem
//  で委譲する (SideNav と同じルーター非依存の設計)。
// ============================================================
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './TabBar.module.css';

export type TabBarVariant = 'floating' | 'flat';

export interface TabBarItem {
  /** 一意なキー */
  key: string;
  /** タブラベル (省略時はアイコンのみ) */
  label?: ReactNode;
  /** アイコン */
  icon?: ReactNode;
  /** 選択中フラグ (単一選択で true になるのは 1 つだけ想定) */
  active?: boolean;
  /** 無効化 (色を薄くしてクリック不可に) */
  disabled?: boolean;
}

export interface TabBarRenderCtx {
  /** 生成済みの中身 (icon + label) */
  content: ReactNode;
  /** 付与すべきクラス (active も反映済み) */
  className: string;
  /** active フラグ (aria-current 用) */
  active: boolean;
}

interface TabBarProps {
  items: TabBarItem[];
  /**
   * 各タブの描画関数。<Link>、<a>、<button> など好きな要素を返す。
   * onClick で完結する場合は省略でき、その場合は <button type="button"> になる。
   */
  renderItem?: (item: TabBarItem, ctx: TabBarRenderCtx) => ReactNode;
  /** タブクリック時 (renderItem を渡さない/button の場合に使う) */
  onSelect?: (key: string) => void;
  /** floating (画面下フロート) / flat (単なる水平タブ)。既定 floating */
  variant?: TabBarVariant;
  /** aria-label */
  ariaLabel?: string;
  className?: string;
}

function itemContent(item: TabBarItem): ReactNode {
  return (
    <>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      {item.label !== undefined && <span className={styles.label}>{item.label}</span>}
    </>
  );
}

export function TabBar({
  items,
  renderItem,
  onSelect,
  variant = 'floating',
  ariaLabel,
  className,
}: TabBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        styles.bar,
        variant === 'floating' ? styles.floating : styles.flat,
        className,
      )}
    >
      {items.map((item) => {
        const active = !!item.active;
        const hasLabel = item.label !== undefined;
        const cls = cn(
          styles.item,
          active && styles.itemActive,
          item.disabled && styles.itemDisabled,
          !hasLabel && styles.itemIconOnly,
        );
        const content = itemContent(item);

        if (renderItem) {
          return (
            <span key={item.key}>
              {renderItem(item, { content, className: cls, active })}
            </span>
          );
        }

        return (
          <button
            key={item.key}
            type="button"
            className={cls}
            aria-current={active ? 'page' : undefined}
            aria-disabled={item.disabled || undefined}
            onClick={() => !item.disabled && onSelect?.(item.key)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
