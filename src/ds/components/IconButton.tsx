// ============================================================
//  kata — IconButton
//  正方/円形のアイコンボタン。アイコンは children に渡す。
//  a11y のため label (aria-label) を必須にしている。
// ============================================================
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './IconButton.module.css';

export type IconButtonShape = 'square' | 'round';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'default' | 'accent' | 'danger' | 'ghost';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** スクリーンリーダー向けのラベル (必須) */
  label: string;
  /** 形状。既定は角丸スクエア */
  shape?: IconButtonShape;
  /** サイズ。sm=30 / md=34 / lg=40。既定は md */
  size?: IconButtonSize;
  /** 配色。default=中立 / accent=アクセント塗り / danger=赤 / ghost=ホバーでクレイ。既定は default */
  variant?: IconButtonVariant;
  children: ReactNode;
}

const SHAPE: Record<IconButtonShape, string | undefined> = {
  square: styles.square,
  round: styles.round,
};
const SIZE: Record<IconButtonSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};
const VARIANT: Record<IconButtonVariant, string | undefined> = {
  default: undefined,
  accent: styles.accent,
  danger: styles.danger,
  ghost: styles.ghost,
};

export function IconButton({
  label,
  shape = 'square',
  size = 'md',
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
      className={cn(styles.iconBtn, SHAPE[shape], SIZE[size], VARIANT[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
