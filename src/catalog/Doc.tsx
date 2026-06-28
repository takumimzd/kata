// 1 コンポーネント = 1 ページの共通レイアウト
import type { ReactNode } from 'react';
import page from './page.module.css';

interface DocProps {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}

export function Doc({ eyebrow = 'component', title, lede, children }: DocProps) {
  return (
    <div className={page.page}>
      <header className={page.head}>
        <span className={page.eyebrow}>{eyebrow}</span>
        <h1 className={page.h1}>{title}</h1>
        {lede && <p className={page.lede}>{lede}</p>}
      </header>
      {children}
    </div>
  );
}
