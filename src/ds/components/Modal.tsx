// ============================================================
//  kata — Modal (ボトムシート)
//  モバイルは下部シート、880px 以上では中央ダイアログ。
//  Escape / 背景クリックで閉じる。
// ============================================================
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
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
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <div className={styles.head}>
          <h3>{title}</h3>
          <IconButton label="閉じる" onClick={onClose}>
            <Icon name="close" size={20} />
          </IconButton>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
