// ============================================================
//  kata — Select (装飾したネイティブ select)
//  options を渡すか、children に <option> を直接置ける。
// ============================================================
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  children?: ReactNode;
}

export function Select({ options, children, className, ...rest }: SelectProps) {
  return (
    <div className={styles.wrap}>
      <select className={cn(styles.select, className)} {...rest}>
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
      <Icon name="chevron" size={16} className={styles.chev} />
    </div>
  );
}
