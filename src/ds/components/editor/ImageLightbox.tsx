// ============================================================
//  kata — 画像の全画面ビューア
//  contenteditable の外 (body 直下) に portal で出すことで、
//  エディタのキャレットや選択に干渉しないようにしている。
// ============================================================
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';
import styles from './ImageLightbox.module.css';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    // 開いている間は背後のスクロールを止める
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal aria-label={alt || '画像'}>
      {/* ズーム用のスクロール領域。ピンチズームはブラウザ標準に任せる */}
      <div className={styles.viewport} onClick={onClose}>
        <img className={styles.image} src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
      </div>
      <button type="button" className={styles.close} aria-label="閉じる" onClick={onClose}>
        <Icon name="close" size={22} />
      </button>
    </div>,
    document.body,
  );
}
