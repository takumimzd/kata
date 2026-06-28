// ============================================================
//  kata — PageTitle (ページ見出し h1)
//  モバイル 21px / 880px 以上で 24px。
// ============================================================
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './PageTitle.module.css';

interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function PageTitle({ children, className, ...rest }: PageTitleProps) {
  return (
    <h1 className={cn(styles.pageTitle, className)} {...rest}>
      {children}
    </h1>
  );
}
