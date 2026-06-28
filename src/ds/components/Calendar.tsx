// ============================================================
//  kata — Calendar (月グリッド)
//  月の表示と前後移動の土台。日付セルの中身 (マーカー等) は
//  renderDay で注入する。凡例などドメイン固有の表示は利用側で。
// ============================================================
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { WEEKDAYS } from '../lib/date';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import styles from './Calendar.module.css';

interface CalendarProps {
  /** 表示する月 "YYYY-MM" */
  month: string;
  /** 今日 "YYYY-MM-DD" (ハイライト/未来判定に使用) */
  today?: string;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  /** 各日付セルの番号下に出す内容 (マーカー等) */
  renderDay?: (date: string) => ReactNode;
  /** 日付クリック (指定するとセルがボタンになる) */
  onSelectDay?: (date: string) => void;
}

export function Calendar({
  month,
  today,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  renderDay,
  onSelectDay,
}: CalendarProps) {
  const [y, m] = month.split('-').map(Number);
  const startDow = new Date(y, m - 1, 1).getDay();
  const days = new Date(y, m, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  return (
    <div className={styles.cal}>
      <div className={styles.head}>
        <IconButton label="前の月" onClick={onPrev} disabled={!canPrev}>
          <Icon name="chevron" size={18} className={styles.flip} />
        </IconButton>
        <span className={styles.title}>
          {y}年 {m}月
        </span>
        <IconButton label="次の月" onClick={onNext} disabled={!canNext}>
          <Icon name="chevron" size={18} />
        </IconButton>
      </div>

      <div className={cn(styles.grid, styles.dowRow)}>
        {WEEKDAYS.map((d, i) => (
          <span key={d} className={cn(styles.dowc, i === 0 && styles.sun, i === 6 && styles.sat)}>
            {d}
          </span>
        ))}
      </div>

      <div className={styles.grid}>
        {cells.map((d, i) => {
          if (d == null) return <span key={`e${i}`} className={cn(styles.cell, styles.empty)} />;
          const ds = `${month}-${String(d).padStart(2, '0')}`;
          const isToday = today != null && ds === today;
          const future = today != null && ds > today;
          const cls = cn(styles.cell, isToday && styles.today, future && styles.future);
          const content = (
            <>
              <span className={styles.num}>{d}</span>
              {renderDay && <span className={styles.dayContent}>{renderDay(ds)}</span>}
            </>
          );
          return onSelectDay ? (
            <button key={ds} type="button" className={cls} onClick={() => onSelectDay(ds)}>
              {content}
            </button>
          ) : (
            <div key={ds} className={cls}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
