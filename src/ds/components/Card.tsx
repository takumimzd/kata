// ============================================================
//  kata — Card (サーフェス容器)
//  padding は s / m / l のトークンで切り替える。
// ============================================================
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './Card.module.css';

export type CardPadding = 's' | 'm' | 'l';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 内側の余白 (スペーシングトークン)。s=12 / m=20 / l=28px。既定は m */
  padding?: CardPadding;
  children: ReactNode;
}

const PADDING = { s: styles.padS, m: styles.padM, l: styles.padL };

export function Card({ padding = 'm', className, children, ...rest }: CardProps) {
  return (
    <div className={cn(styles.card, PADDING[padding], className)} {...rest}>
      {children}
    </div>
  );
}
