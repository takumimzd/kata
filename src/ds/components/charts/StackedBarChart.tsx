// ============================================================
//  kata — StackedBarChart (積み上げ棒グラフ)
//  data: { label, values: Record<seriesKey, number> }[]。凡例付き。
// ============================================================
import { ChartCard, type ChartFrameProps } from './ChartCard';
import styles from './charts.module.css';
import { useChartWidth } from './util';

export interface StackedSeries {
  key: string;
  label: string;
  color: string;
}

export interface StackedPoint {
  label: string;
  values: Record<string, number>;
}

interface StackedBarChartProps extends ChartFrameProps {
  data: StackedPoint[];
  series: StackedSeries[];
  height?: number;
  /** 合計値を棒の上に出すか */
  showTotal?: boolean;
}

export function StackedBarChart({
  data,
  series,
  height = 190,
  showTotal = true,
  ...frame
}: StackedBarChartProps) {
  const { ref, width: w } = useChartWidth(400);

  if (!data || data.length === 0 || series.length === 0) {
    return (
      <ChartCard {...frame}>
        <div ref={ref} className={styles.empty}>
          データがありません
        </div>
      </ChartCard>
    );
  }

  const padL = 30;
  const padR = 10;
  const padT = 16;
  const padB = 26;
  const innerW = Math.max(10, w - padL - padR);
  const innerH = height - padT - padB;
  const totals = data.map((d) => series.reduce((s, sr) => s + (d.values[sr.key] ?? 0), 0));
  const max = Math.max(...totals, 1) * 1.15;
  const slot = innerW / data.length;
  const bw = Math.min(slot * 0.5, 46);
  const hOf = (v: number) => (v / max) * innerH;

  return (
    <ChartCard {...frame}>
      <div ref={ref} className={styles.wrap}>
        <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
          {[0.5, 1].map((f, i) => (
            <line
              key={i}
              x1={padL}
              y1={padT + innerH - innerH * f}
              x2={w - padR}
              y2={padT + innerH - innerH * f}
              stroke="var(--line)"
            />
          ))}
          {data.map((d, i) => {
            const x = padL + slot * i + (slot - bw) / 2;
            let yCursor = padT + innerH;
            return (
              <g key={`${d.label}-${i}`}>
                {series.map((sr) => {
                  const v = d.values[sr.key] ?? 0;
                  if (v <= 0) return null;
                  const h = hOf(v);
                  yCursor -= h;
                  return (
                    <rect key={sr.key} x={x} y={yCursor} width={bw} height={Math.max(0, h)} fill={sr.color}>
                      <title>{`${d.label} ${sr.label}: ${Math.round(v).toLocaleString()}`}</title>
                    </rect>
                  );
                })}
                {showTotal && totals[i]! > 0 && (
                  <text x={x + bw / 2} y={yCursor - 7} textAnchor="middle" className={styles.barval}>
                    {Math.round(totals[i]!).toLocaleString()}
                  </text>
                )}
                <text x={x + bw / 2} y={height - 8} textAnchor="middle" className={styles.axis}>
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className={styles.legend}>
        {series.map((sr) => (
          <span key={sr.key} className={styles.legendItem}>
            <i style={{ background: sr.color }} />
            {sr.label}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}
