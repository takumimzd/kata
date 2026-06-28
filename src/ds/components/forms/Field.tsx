// ============================================================
//  kata — Field / Input
//  Field: ラベル + コントロール + ヒント/エラーのラッパー
//  Input: フィールド見た目のテキスト入力
// ============================================================
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
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

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(styles.input, className)} {...rest} />;
}
