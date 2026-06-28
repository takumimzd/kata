// ============================================================
//  kata — LineChart (折れ線チャート)
//  data: { label, value }[]。ホバーでツールチップを表示する。
// ============================================================
import { useState } from 'react';
import { ChartCard, type ChartFrameProps } from './ChartCard';
import styles from './charts.module.css';
import type { ChartPoint } from './types';
import { smoothPath, useChartWidth } from './util';

interface LineChartProps extends ChartFrameProps {
  data: ChartPoint[];
  unit?: string;
  color?: string;
  height?: number;
  /** 上下の余白率 */
  yPad?: number;
  /** 値の整形 (軸/ツールチップ) */
  format?: (v: number) => string;
}

export function LineChart({
  data,
  unit = '',
  color = 'var(--accent)',
  height = 200,
  yPad = 0.12,
  format,
  ...frame
}: LineChartProps) {
  const { ref, width: w } = useChartWidth(600);
  const [hover, setHover] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <ChartCard {...frame}>
        <div ref={ref} className={styles.empty}>
          データがありません
        </div>
      </ChartCard>
    );
  }

  const padL = 38;
  const padR = 14;
  const padT = 14;
  const padB = 26;
  const innerW = Math.max(10, w - padL - padR);
  const innerH = height - padT - padB;

  const vals = data.map((d) => d.value);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  const range = max - min || 1;
  min -= range * yPad;
  max += range * yPad;

  const xAt = (i: number) =>
    padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yAt = (v: number) => padT + innerH - ((v - min) / (max - min)) * innerH;

  const points = data.map((d, i) => ({ x: xAt(i), y: yAt(d.value), ...d }));
  const linePath = smoothPath(points);
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;

  const ticks = [min + (max - min) * 0.5, max - (max - min) * yPad, min + (max - min) * yPad];
  const fmt = format ?? ((v: number) => v.toFixed(1));
  const gid = `kataLg_${Math.round(min * 100)}_${data.length}`;

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    let best = 0;
    let bd = Infinity;
    points.forEach((p, i) => {
      const dd = Math.abs(p.x - px);
      if (dd < bd) {
        bd = dd;
        best = i;
      }
    });
    setHover(best);
  }

  const xLabelIdx = [0, Math.floor((data.length - 1) / 2), data.length - 1].filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  return (
    <ChartCard {...frame}>
      <div ref={ref} className={styles.wrap}>
        <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={yAt(t)} x2={w - padR} y2={yAt(t)} stroke="var(--line)" />
            <text x={padL - 8} y={yAt(t) + 4} textAnchor="end" className={styles.axis}>
              {fmt(t)}
            </text>
          </g>
        ))}
        <path d={areaPath} fill={`url(#${gid})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {hover != null && (
          <g>
            <line
              x1={points[hover].x}
              y1={padT}
              x2={points[hover].x}
              y2={padT + innerH}
              stroke="var(--line-2)"
            />
            <circle
              cx={points[hover].x}
              cy={points[hover].y}
              r="4.5"
              fill={color}
              stroke="var(--surface)"
              strokeWidth="2"
            />
          </g>
        )}
        {xLabelIdx.map((i) => (
          <text key={i} x={xAt(i)} y={height - 8} textAnchor="middle" className={styles.axis}>
            {data[i].label}
          </text>
        ))}
      </svg>
      {hover != null && (
        <div className={styles.tip} style={{ left: `${(points[hover].x / w) * 100}%` }}>
          <div className={styles.tipDate}>{data[hover].label}</div>
          <div className={styles.tipVal}>
            {fmt(data[hover].value)}
            <span>{unit}</span>
          </div>
        </div>
      )}
      </div>
    </ChartCard>
  );
}
