// ============================================================
//  kata — Input (フィールド見た目のテキスト入力)
// ============================================================
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Input.module.css';

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(styles.input, className)} {...rest} />;
}
