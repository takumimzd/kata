// ============================================================
//  kata — Textarea (複数行テキスト入力)
// ============================================================
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Textarea.module.css';

export function Textarea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(styles.textarea, className)} {...rest} />;
}
