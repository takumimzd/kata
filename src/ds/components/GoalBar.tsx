// ============================================================
//  kata — GoalBar (目標つき進捗行)
//  ラベル + 現在値/目標 + 状態ワード + ProgressBar の定番構成。
//  目標は min (これ以上で達成) / max (これ以下をキープ) / 両方 (範囲) に対応。
// ============================================================
import { cn } from '../lib/cn';
import { Icon } from './Icon';
import { ProgressBar, type ProgressTone } from './ProgressBar';
import styles from './GoalBar.module.css';

interface GoalBarProps {
  /** 左上のラベル (例 "今週のランニング") */
  label: string;
  /** 現在値 */
  value: number;
  /** 下限目標 (これ以上で達成) */
  min?: number | null;
  /** 上限目標 (これ以下をキープ) */
  max?: number | null;
  /** 達成しているか */
  achieved: boolean;
  /** 上限を超過しているか */
  over: boolean;
  /** 進捗率 0〜1 */
  ratio: number;
  /** 値の整形 (単位付与など)。既定は String(v) */
  format?: (v: number) => string;
}

export function GoalBar({ label, value, min, max, achieved, over, ratio, format }: GoalBarProps) {
  const fmt = format ?? ((v: number) => String(v));

  const targetLabel =
    min != null && max != null
      ? `${fmt(min)}〜${fmt(max)}`
      : min != null
        ? fmt(min)
        : `${fmt(max ?? 0)}まで`;

  const word =
    min != null
      ? achieved
        ? max != null && !over
          ? '範囲内'
          : '達成'
        : `あと${fmt(Math.max(0, min - value))}`
      : over
        ? `${fmt(value - (max ?? 0))}超過`
        : max === 0
          ? 'キープ中'
          : `残り${fmt((max ?? 0) - value)}`;

  const tone = over ? styles.goalOver : achieved ? styles.goalOk : styles.goalProg;
  const pbTone: ProgressTone = over ? 'over' : achieved ? 'accent' : 'progress';

  return (
    <div className={styles.goal}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={cn(styles.state, tone)}>
          {achieved && !over && <Icon name="check" size={13} />}
          <span className={styles.count}>
            {fmt(value)}
            <small>
              {' / '}
              {targetLabel}
            </small>
          </span>
          <span className={styles.word}>{word}</span>
        </span>
      </div>
      <ProgressBar value={ratio} tone={pbTone} />
    </div>
  );
}
