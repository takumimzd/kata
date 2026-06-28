// ============================================================
//  kata — ActionSheet (アクションシート)
//  画面下からせり上がるシート (デスクトップでは中央にポップ)。
//  中身は自由。選択肢には ActionSheetItem を使える。
//  タイトルが要るフォーム的なものは Modal を使う。
// ============================================================
import { useEffect, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './ActionSheet.module.css';

interface ActionSheetProps {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function ActionSheet({ onClose, children, className, 'aria-label': ariaLabel }: ActionSheetProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={styles.veil}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={cn(styles.sheet, className)} role="dialog" aria-modal="true" aria-label={ariaLabel}>
        {children}
      </div>
    </div>
  );
}

interface ActionSheetItemProps {
  /** 行頭のアイコン (タイル内に表示) */
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

/** アクションシート内の大きめの選択肢ボタン */
export function ActionSheetItem({ icon, onClick, disabled = false, children }: ActionSheetItemProps) {
  return (
    <button type="button" className={styles.option} onClick={onClick} disabled={disabled}>
      {icon && <span className={styles.optionIcon}>{icon}</span>}
      <span className={styles.optionTitle}>{children}</span>
    </button>
  );
}
