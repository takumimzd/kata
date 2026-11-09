// ============================================================
//  kata — ProgressBar (進捗バー)
//  トラック + フィル。value/max から割合を出す。
// ============================================================
import { cn } from '../lib/cn';
import styles from './ProgressBar.module.css';

export type ProgressTone = 'accent' | 'progress' | 'over';

interface ProgressBarProps {
  value: number;
  max?: number;
  /** フィルの配色。accent=達成色 / progress=途中 / over=超過(警告) */
  tone?: ProgressTone;
  /** バーの高さ px */
  height?: number;
  /**
   * スクリーンリーダー向けの名前。渡すと role="progressbar" として値を伝える。
   * 省略時は飾り扱い (近くに数値を文字で出している場合)
   */
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 1,
  tone = 'accent',
  height = 6,
  label,
  className,
}: ProgressBarProps) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const a11y = label
    ? {
        role: 'progressbar',
        'aria-label': label,
        'aria-valuemin': 0,
        'aria-valuemax': max,
        'aria-valuenow': Math.max(0, Math.min(max, value)),
      }
    : { 'aria-hidden': true };
  return (
    <div className={cn(styles.track, className)} style={{ height }} {...a11y}>
      <div className={cn(styles.fill, styles[tone])} style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}
