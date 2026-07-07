// ============================================================
//  kata — ErrorState
//  500 / 404 / 403 などのフルページエラー表示。
//  code (大きな数字) と title / message / actions を縦積みし、
//  600 / 880px のブレークポイントで余白・タイポを段階的に広げる。
// ============================================================
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './ErrorState.module.css';

export type ErrorStateTone = 'default' | 'danger' | 'warn';

interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** ステータスコードなどの大きな装飾数字 (例: "500")。icon と併用可 */
  code?: ReactNode;
  /** code の代わり/併用に表示するアイコン (badge に入る) */
  icon?: ReactNode;
  /** 見出し (例: サーバーで問題が発生しました) */
  title: ReactNode;
  /** 補足文 (2 〜 3 行程度を想定) */
  message?: ReactNode;
  /** ボタンなどのアクション。1〜2 個を推奨 */
  actions?: ReactNode;
  /** 系統色。既定は default (中立)。danger は 500 / エラー、warn は 403 / 権限系向け */
  tone?: ErrorStateTone;
}

const TONE: Record<ErrorStateTone, string | undefined> = {
  default: undefined,
  danger: styles.toneDanger,
  warn: styles.toneWarn,
};

export function ErrorState({
  code,
  icon,
  title,
  message,
  actions,
  tone = 'default',
  className,
  ...rest
}: ErrorStateProps) {
  return (
    <div
      className={cn(styles.root, TONE[tone], className)}
      role="alert"
      aria-live="polite"
      {...rest}
    >
      {code != null && <div className={styles.code}>{code}</div>}
      {icon != null && <div className={styles.badge}>{icon}</div>}
      <h1 className={styles.title}>{title}</h1>
      {message != null && <p className={styles.message}>{message}</p>}
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
