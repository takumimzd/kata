// ============================================================
//  kata — Breadcrumb (パンくず)
//  階層ナビ。各段はクリックで遷移する。区切りはシェブロン。
//  highlight / data でドラッグ&ドロップのドロップ先などにも転用できる。
// ============================================================
import { Fragment, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './Icon';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  key: string;
  label: ReactNode;
  /** ラベル左のアイコン (任意) */
  icon?: ReactNode;
  /** 現在地。クリック不可・強調表示になる */
  current?: boolean;
  onClick?: () => void;
  /** ドロップ先などとして一時的に強調する */
  highlight?: boolean;
  /** 各クラムへ付与する追加属性 (例: { 'data-drop-id': id }) */
  data?: Record<string, string>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  'aria-label'?: string;
}

export function Breadcrumb({ items, className, 'aria-label': ariaLabel = 'パンくず' }: BreadcrumbProps) {
  return (
    <nav className={cn(styles.bar, className)} aria-label={ariaLabel}>
      {items.map((item, i) => (
        <Fragment key={item.key}>
          {i > 0 && (
            <span className={styles.sep} aria-hidden="true">
              <Icon name="chevron" size={14} />
            </span>
          )}
          <button
            type="button"
            className={cn(
              styles.crumb,
              item.current && styles.current,
              item.highlight && styles.highlight,
            )}
            onClick={item.onClick}
            aria-current={item.current ? 'true' : undefined}
            {...item.data}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        </Fragment>
      ))}
    </nav>
  );
}
