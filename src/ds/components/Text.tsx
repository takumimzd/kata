// ============================================================
//  kata — Text (本文系テキスト)
//  variant で種類を出し分ける。ページ見出しは PageTitle、
//  セクション見出しは SectionTitle を使う (Text の対象外)。
// ============================================================
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './Text.module.css';

export type TextVariant = 'body' | 'bodyStrong' | 'sub' | 'caption' | 'label' | 'num';

interface TextProps extends HTMLAttributes<HTMLElement> {
  /** テキストの種類。既定は body */
  variant?: TextVariant;
  /** 描画する要素。既定は span */
  as?: ElementType;
  children: ReactNode;
}

const VARIANT: Record<TextVariant, string | undefined> = {
  body: styles.body,
  bodyStrong: styles.bodyStrong,
  sub: styles.sub,
  caption: styles.caption,
  label: styles.label,
  num: styles.num,
};

export function Text({ variant = 'body', as: Tag = 'span', className, children, ...rest }: TextProps) {
  return (
    <Tag className={cn(VARIANT[variant], className)} {...rest}>
      {children}
    </Tag>
  );
}
