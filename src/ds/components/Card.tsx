// ============================================================
//  kata — Card (サーフェス容器)
// ============================================================
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div className={cn(styles.card, className)} {...rest}>
      {children}
    </div>
  );
}
