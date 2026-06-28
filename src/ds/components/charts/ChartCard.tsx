// ============================================================
//  kata — ChartCard (チャートの枠) ※内部用・非公開
//  BarChart / LineChart / BarList がこの枠で各チャートをラップして
//  export する。タイトル / 説明 / 右上の数値 / 任意のタブ行を持つ。
// ============================================================
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './ChartCard.module.css';

export interface ChartTab {
  value: string;
  label: string;
}

/** 各チャートに共通の枠まわり props */
export interface ChartFrameProps {
  title?: string;
  /** タイトル下の説明 */
  sub?: ReactNode;
  /** 右上の数値テキスト */
  value?: ReactNode;
  /** 右上数値の配色 */
  valueTone?: 'accent' | 'clay' | 'danger';
  /** タブ行 (省略時は出さない) */
  tabs?: ChartTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}

export function ChartCard({
  title,
  sub,
  value,
  valueTone = 'accent',
  tabs,
  activeTab,
  onTabChange,
  className,
  children,
}: ChartFrameProps & { children: ReactNode }) {
  const hasHead = title != null || sub != null || value != null;
  return (
    <div className={cn(styles.card, className)}>
      {hasHead && (
        <div className={styles.head}>
          <div className={styles.headText}>
            {title != null && <h4>{title}</h4>}
            {sub != null && <span className={styles.sub}>{sub}</span>}
          </div>
          {value != null && <div className={cn(styles.value, styles[valueTone])}>{value}</div>}
        </div>
      )}

      {tabs && tabs.length > 0 && (
        <div className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              className={cn(styles.tab, t.value === activeTab && styles.tabOn)}
              onClick={() => onTabChange?.(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
