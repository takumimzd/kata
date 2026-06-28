// ============================================================
//  kata — Field (ラベル + コントロール + ヒント/エラーのラッパー)
//  入力欄は Input を組み合わせて使う。
// ============================================================
import type { ReactNode } from 'react';
import styles from './Field.module.css';

interface FieldProps {
  label: ReactNode;
  /** ラベル左に出すアイコンなど */
  icon?: ReactNode;
  /** 補足テキスト */
  hint?: ReactNode;
  /** エラーテキスト (あれば hint より優先) */
  error?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}

export function Field({ label, icon, hint, error, htmlFor, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {icon}
        {label}
      </label>
      {children}
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </div>
  );
}
