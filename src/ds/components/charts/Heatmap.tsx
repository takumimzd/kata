// ============================================================
//  kata — Heatmap (カレンダー草)
//  data: { date: 'YYYY-MM-DD', value }[]。週 = 列 (月曜はじまり)。
//  値は 0..max を levels 段階に量子化して色の濃さにする。
// ============================================================
import { useEffect, useRef } from 'react';
import { ChartCard, type ChartFrameProps } from './ChartCard';
import styles from './charts.module.css';

export interface HeatmapDatum {
  date: string;
  value: number;
}

interface HeatmapProps extends ChartFrameProps {
  data: HeatmapDatum[];
  /** 表示範囲 (YYYY-MM-DD)。from は週頭に切り下げられる */
  from: string;
  to: string;
  color?: string;
  /** 濃さの段階数 */
  levels?: number;
  /** セルの title (ツールチップ)。省略時は「日付: 値」 */
  cellTitle?: (date: string, value: number) => string;
}

const DAY = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ['月', '', '水', '', '金', '', ''];

function toDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

function toYmd(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 月曜はじまりの週頭へ切り下げ */
function mondayOf(d: Date): Date {
  const wd = (d.getDay() + 6) % 7; // 月=0
  return new Date(d.getTime() - wd * DAY);
}

export function Heatmap({
  data,
  from,
  to,
  color = 'var(--accent)',
  levels = 4,
  cellTitle,
  ...frame
}: HeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初期表示は右端 (直近) へ
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [from, to, data.length]);

  const byDate = new Map(data.map((d) => [d.date, d.value]));
  const max = Math.max(1, ...data.map((d) => d.value));

  // 週ごとの列を組み立てる
  const start = mondayOf(toDate(from));
  const end = toDate(to);
  const weeks: { date: string; inRange: boolean; value: number }[][] = [];
  for (let ws = start; ws.getTime() <= end.getTime(); ws = new Date(ws.getTime() + 7 * DAY)) {
    const col = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ws.getTime() + i * DAY);
      const ymd = toYmd(d);
      return {
        date: ymd,
        inRange: ymd >= from && ymd <= to,
        value: byDate.get(ymd) ?? 0,
      };
    });
    weeks.push(col);
  }

  // 月ラベル (月が変わる最初の週に付ける)
  const monthLabels = weeks.map((col, i) => {
    const first = toDate(col[0]!.date);
    if (i === 0) return `${first.getMonth() + 1}月`;
    const prev = toDate(weeks[i - 1]![0]!.date);
    return first.getMonth() !== prev.getMonth() ? `${first.getMonth() + 1}月` : '';
  });

  const levelOf = (v: number) => (v <= 0 ? 0 : Math.max(1, Math.ceil((v / max) * levels)));

  return (
    <ChartCard {...frame}>
      <div className={styles.hmRow}>
        <div className={styles.hmDows}>
          {WEEKDAY_LABELS.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <div ref={scrollRef} className={styles.hmScroll}>
          <div className={styles.hmMonths}>
            {monthLabels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
          <div className={styles.hmGrid}>
            {weeks.map((col, wi) => (
              <div key={wi} className={styles.hmWeek}>
                {col.map((c) => {
                  const lv = levelOf(c.value);
                  const pct = lv === 0 ? 0 : Math.round((lv / levels) * 100);
                  return (
                    <span
                      key={c.date}
                      className={styles.hmCell}
                      title={
                        c.inRange ? (cellTitle ? cellTitle(c.date, c.value) : `${c.date}: ${c.value}`) : undefined
                      }
                      style={
                        c.inRange
                          ? lv === 0
                            ? undefined
                            : { background: `color-mix(in srgb, ${color} ${pct}%, var(--surface-2, transparent))` }
                          : { visibility: 'hidden' }
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
