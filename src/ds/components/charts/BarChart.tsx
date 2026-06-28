// ============================================================
//  kata — BarChart (棒グラフ)
//  data: { label, value }[]。幅はコンテナに追従する。
// ============================================================
import { ChartCard, type ChartFrameProps } from './ChartCard';
import styles from './charts.module.css';
import type { ChartPoint } from './types';
import { useChartWidth } from './util';

interface BarChartProps extends ChartFrameProps {
  data: ChartPoint[];
  color?: string;
  height?: number;
}

export function BarChart({
  data,
  color = 'var(--accent)',
  height = 170,
  ...frame
}: BarChartProps) {
  const { ref, width: w } = useChartWidth(400);

  if (!data || data.length === 0) {
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
  const max = Math.max(...data.map((d) => d.value), 1) * 1.15;
  const slot = innerW / data.length;
  const bw = Math.min(slot * 0.5, 46);
  const yAt = (v: number) => padT + innerH - (v / max) * innerH;

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
          const y = yAt(d.value);
          const h = padT + innerH - y;
          return (
            <g key={`${d.label}-${i}`}>
              <rect x={x} y={y} width={bw} height={Math.max(0, h)} rx="4" fill={color} />
              <text x={x + bw / 2} y={y - 7} textAnchor="middle" className={styles.barval}>
                {d.value}
              </text>
              <text x={x + bw / 2} y={height - 8} textAnchor="middle" className={styles.axis}>
                {d.label}
              </text>
            </g>
          );
        })}
        </svg>
      </div>
    </ChartCard>
  );
}
