// ============================================================
//  kata — Modal (ボトムシート)
//  モバイルは下部シート、880px 以上では中央ダイアログ。
//  Escape / 背景クリックで閉じる。開くと中へフォーカスを移し、
//  Tab は中で循環し、閉じると開く前の要素へフォーカスを戻す。
// ============================================================
import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { useDialogFocus } from '../lib/focus';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  useDialogFocus(sheetRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.head}>
          <h2 id={titleId}>{title}</h2>
          <IconButton label="閉じる" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
