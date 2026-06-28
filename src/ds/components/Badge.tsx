// ============================================================
//  kata — Badge (状態ラベル)
// ============================================================
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './Badge.module.css';

export type BadgeVariant = 'neutral' | 'accent' | 'danger' | 'warn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)} {...rest}>
      {children}
    </span>
  );
}
