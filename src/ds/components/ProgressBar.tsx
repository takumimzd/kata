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
  className?: string;
}

export function ProgressBar({
  value,
  max = 1,
  tone = 'accent',
  height = 6,
  className,
}: ProgressBarProps) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div className={cn(styles.track, className)} style={{ height }}>
      <div className={cn(styles.fill, styles[tone])} style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}
