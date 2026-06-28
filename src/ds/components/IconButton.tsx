// ============================================================
//  kata — IconButton
//  34x34 の正方アイコンボタン。アイコンは children に渡す。
//  a11y のため label (aria-label) を必須にしている。
// ============================================================
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './IconButton.module.css';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** スクリーンリーダー向けのラベル (必須) */
  label: string;
  /** hover 時の強調色。既定は中立、danger は赤 */
  variant?: 'default' | 'danger';
  children: ReactNode;
}

export function IconButton({
  label,
  variant = 'default',
  className,
  type = 'button',
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(styles.iconBtn, variant === 'danger' && styles.danger, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
