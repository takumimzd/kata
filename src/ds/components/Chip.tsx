// ============================================================
//  kata — Chip / ChipGroup (角丸の小ボタン・タグ)
// ============================================================
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './Chip.module.css';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 選択中の見た目にする */
  active?: boolean;
  children: ReactNode;
}

export function Chip({ active, className, type = 'button', children, ...rest }: ChipProps) {
  return (
    <button type={type} className={cn(styles.chip, active && styles.active, className)} {...rest}>
      {children}
    </button>
  );
}

/** チップを折り返して並べる行 */
export function ChipGroup({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(styles.group, className)} {...rest}>
      {children}
    </div>
  );
}
