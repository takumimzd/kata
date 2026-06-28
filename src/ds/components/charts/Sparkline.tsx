// ============================================================
//  kata — Sparkline (ミニ折れ線)
//  data: number[]。カード内のトレンド表示などに使う。
// ============================================================
import styles from './charts.module.css';
import { smoothPath } from './util';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = 'var(--accent)', width = 120, height = 40 }: SparklineProps) {
  if (!data || data.length < 2) return null;
  let min = Math.min(...data);
  let max = Math.max(...data);
  const range = max - min || 1;
  min -= range * 0.15;
  max += range * 0.15;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / (max - min)) * height,
  }));
  const path = smoothPath(pts);
  const last = pts[pts.length - 1];
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={styles.spark}
    >
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="3" fill={color} />
    </svg>
  );
}
