// 1 コンポーネント = 1 ページの共通レイアウト。
// コンポーネント詳細ページ (/components/<slug>) では ComponentDoc のリッチな
// レイアウト (breadcrumb / meta strip / 関連 / prev/next / TOC) に自動で
// 差し替える。それ以外のページ (/components/, /principles など) は素の見出し
// + 本文の従来レイアウトを使う。
import { Children, isValidElement, type ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import { COMPONENTS } from './components-registry';
import { ComponentDoc, Section } from './ComponentDoc';
import { Code, Demo, PropsTable } from './parts';
import page from './page.module.css';

interface DocProps {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}

/** Demo / Code / PropsTable の子要素を「01 デモ / 02 使い方 / 03 props」の
 *  番号つき Section に自動でラップする。それ以外の要素はそのまま並べる。*/
function autoSection(children: ReactNode): ReactNode {
  let iDemo = 0;
  let iCode = 0;
  let iProps = 0;
  let cursor = 1;

  const list = Children.toArray(children);
  return list.map((child, i) => {
    if (!isValidElement(child)) return child;
    if (child.type === Demo) {
      iDemo = cursor++;
      return (
        <Section key={i} n={String(iDemo).padStart(2, '0')} title="デモ" en="live preview">
          {child}
        </Section>
      );
    }
    if (child.type === Code) {
      iCode = cursor++;
      return (
        <Section key={i} n={String(iCode).padStart(2, '0')} title="使い方" en="usage · code">
          {child}
        </Section>
      );
    }
    if (child.type === PropsTable) {
      iProps = cursor++;
      return (
        <Section
          key={i}
          n={String(iProps).padStart(2, '0')}
          title="props"
          en="api reference"
        >
          {child}
        </Section>
      );
    }
    return child;
  });
}

/** URL からコンポーネント slug を取り出す。/components/<slug> だけ拾う。 */
function slugFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/components\/([^/]+)\/?$/);
  if (!m) return null;
  const slug = m[1];
  return COMPONENTS.some((c) => c.slug === slug) ? slug ?? null : null;
}

export function Doc({ eyebrow = 'component', title, lede, children }: DocProps) {
  const pathname = useLocation({ select: (l) => l.pathname });
  const slug = slugFromPath(pathname);

  if (slug) {
    return (
      <ComponentDoc slug={slug} title={title} lede={lede}>
        {autoSection(children)}
      </ComponentDoc>
    );
  }

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
