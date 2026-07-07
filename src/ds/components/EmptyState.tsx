// ============================================================
//  kata — EmptyState
//  「まだ何もない」状態を示すブロック。カード内・画面ブロック
//  として置ける小さめ (sm/md) と、フルページ相当 (lg) を用意。
// ============================================================
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './EmptyState.module.css';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 装飾アイコン (Icon などを渡す。丸バッジに入る) */
  icon?: ReactNode;
  /** 見出し (例: まだ記録がありません) */
  title: ReactNode;
  /** 補足の説明 */
  message?: ReactNode;
  /** ボタンなどのアクション */
  actions?: ReactNode;
  /** サイズ。既定は md。sm はカード内の小ブロック向け、lg はフルページ向け */
  size?: EmptyStateSize;
}

const SIZE: Record<EmptyStateSize, string | undefined> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export function EmptyState({
  icon,
  title,
  message,
  actions,
  size = 'md',
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={cn(styles.root, SIZE[size], className)} {...rest}>
      {icon != null && <div className={styles.badge}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {message != null && <p className={styles.message}>{message}</p>}
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
