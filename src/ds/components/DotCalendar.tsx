// ============================================================
//  kata — DotCalendar (月カレンダー + 系列ドット + 凡例)
//  Calendar に「系列ごとの色ドット」と凡例を重ねた定番構成。
//  記録日・イベント日など、日付の集合を色で示す用途に使う。
// ============================================================
import { Calendar } from './Calendar';
import styles from './DotCalendar.module.css';

export interface CalendarSeries {
  id: string;
  /** 凡例に出すラベル */
  label: string;
  /** ドットの色 (CSS color) */
  color: string;
  /** マークする日付 "YYYY-MM-DD" の集合 */
  dates: ReadonlySet<string>;
}

interface DotCalendarProps {
  /** 表示する月 "YYYY-MM" */
  month: string;
  /** 今日 "YYYY-MM-DD" */
  today?: string;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  series: CalendarSeries[];
  /** 凡例を表示する (既定 true) */
  showLegend?: boolean;
  /** 日付クリック (指定するとセルがボタンになる) */
  onSelectDay?: (date: string) => void;
}

export function DotCalendar({
  month,
  today,
  onPrev,
  onNext,
  canPrev,
  canNext,
  series,
  showLegend = true,
  onSelectDay,
}: DotCalendarProps) {
  return (
    <div className={styles.wrap}>
      <Calendar
        month={month}
        today={today}
        onPrev={onPrev}
        onNext={onNext}
        canPrev={canPrev}
        canNext={canNext}
        onSelectDay={onSelectDay}
        renderDay={(ds) => (
          <>
            {series.map((s) =>
              s.dates.has(ds) ? <span key={s.id} className={styles.dot} style={{ background: s.color }} /> : null,
            )}
          </>
        )}
      />
      {showLegend && (
        <div className={styles.legend}>
          {series.map((s) => (
            <span key={s.id}>
              <i className={styles.dot} style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
