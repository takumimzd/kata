// ============================================================
//  kata — テキストリンクの設定ダイアログ
//  contenteditable の外 (body 直下) に portal で出す。エディタ内に置くと
//  ツールバーの backdrop-filter が position:fixed の基準になってしまい、
//  画面いっぱいに広がらないため。
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';
import { normalizeLinkUrl } from './link';
import styles from './LinkDialog.module.css';

interface LinkDialogProps {
  /** 既存リンクの URL (新規設定なら空文字) */
  initialUrl: string;
  /** 既にリンクが設定されていて、解除できる状態か */
  canRemove: boolean;
  onApply: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function LinkDialog({
  initialUrl,
  canRemove,
  onApply,
  onRemove,
  onClose,
}: LinkDialogProps) {
  const [value, setValue] = useState(initialUrl);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const valid = normalizeLinkUrl(value) !== null;

  const submit = () => {
    setTouched(true);
    if (valid) onApply(value);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal
        aria-label="リンクを設定"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <h3 className={styles.title}>リンクを設定</h3>
          <button type="button" className={styles.close} aria-label="閉じる" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <label className={styles.field}>
          <span className={styles.label}>URL</span>
          <input
            ref={inputRef}
            className={styles.input}
            type="url"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
          />
        </label>
        {touched && !valid && (
          <p className={styles.error}>http / https で開ける URL を入力してください</p>
        )}
        <div className={styles.actions}>
          {canRemove && (
            <button type="button" className={styles.remove} onClick={onRemove}>
              リンクを解除
            </button>
          )}
          <button type="button" className={styles.apply} onClick={submit}>
            適用
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
