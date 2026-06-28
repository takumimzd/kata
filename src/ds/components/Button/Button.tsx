// ============================================================
//  kata — Button
//  variant でスタイルを切り替える。アイコンは children に渡す。
// ============================================================
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger' | 'mini';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 見た目のバリアント。既定は primary */
  variant?: ButtonVariant;
  /** 横幅いっぱいに広げる */
  block?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  block = false,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.btn, styles[variant], block && styles.block, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
