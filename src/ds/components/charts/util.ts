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
  if (points.length < 2) return points.length === 1 ? `M ${points[0].x} ${points[0].y}` : '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y} ${cx} ${p1.y} ${p1.x} ${p1.y}`;
  }
  return d;
}
