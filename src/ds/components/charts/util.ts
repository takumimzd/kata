import { useEffect, useRef, useState } from 'react';

/** コンテナ幅を ResizeObserver で追従する (レスポンシブ SVG 用) */
export function useChartWidth(initial = 400) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

/** なめらかなパスを生成 (Catmull-Rom 風の単純スムージング) */
export function smoothPath(points: { x: number; y: number }[]): string {
  const first = points[0];
  if (!first) return '';
  if (points.length < 2) return `M ${first.x} ${first.y}`;
  let d = `M ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1]!;
    const p1 = points[i]!;
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y} ${cx} ${p1.y} ${p1.x} ${p1.y}`;
  }
  return d;
}
