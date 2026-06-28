// ============================================================
//  kata — Fab (フローティングアクションボタン)
//  画面右下に固定配置する円形アクセントボタン。アイコンは children に。
//  位置は className / style で上書きできる。
// ============================================================
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './Fab.module.css';

interface FabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** スクリーンリーダー向けのラベル (必須) */
  label: string;
  children: ReactNode;
}

export function Fab({ label, className, type = 'button', children, ...rest }: FabProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(styles.fab, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
