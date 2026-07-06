// ============================================================
//  kata — Drawer
//  画面左 (または右) 端からせり出すオーバーレイパネル。
//  モバイルのハンバーガーメニューや設定パネルに使う。
//  外側クリック / Esc で閉じる。body スクロールは開いている間ロック。
// ============================================================
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import styles from './Drawer.module.css';

export type DrawerSide = 'left' | 'right';

interface DrawerProps {
  /** 開閉状態 */
  open: boolean;
  /** 閉じる要求 (背景クリック / Esc / 閉じるボタン) */
  onClose: () => void;
  /** せり出す辺。既定 left */
  side?: DrawerSide;
  /** ヘッダーに置くタイトル。省略時はヘッダー行を出さない */
  title?: ReactNode;
  /** 閉じるボタンを出すか。既定 true (title 指定時のみ表示される) */
  showCloseButton?: boolean;
  /** aria-label (title なしのとき用) */
  ariaLabel?: string;
  /** パネルのボディに入れる中身 */
  children: ReactNode;
  /** ヘッダーとボディの間に差し込むカスタム要素 (テーマ切替など) */
  footer?: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  side = 'left',
  title,
  showCloseButton = true,
  ariaLabel,
  children,
  footer,
  className,
}: DrawerProps) {
  // SSR 対策: portal 用のマウント判定
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Esc で閉じる
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // body スクロール抑止
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const content = (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : ariaLabel}
        className={cn(styles.panel, side === 'right' ? styles.right : styles.left, className)}
      >
        {title !== undefined && (
          <div className={styles.head}>
            <span className={styles.title}>{title}</span>
            {showCloseButton && (
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="閉じる"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer}
      </aside>
    </>
  );

  // 祖先の stacking context (sticky ヘッダー等) に閉じ込められないよう
  // portal で body 直下へ描画する。
  return createPortal(content, document.body);
}
