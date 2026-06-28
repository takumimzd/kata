// ============================================================
//  kata — BarList (横棒のランキングリスト)
//  ラベル + 横バー + 値。サプリ品目ごとの回数などに。
//  ChartCard の枠でラップして export する。
// ============================================================
import { ChartCard, type ChartFrameProps } from './ChartCard';
import styles from './BarList.module.css';

export interface BarListItem {
  label: string;
  value: number;
}

interface BarListProps extends ChartFrameProps {
  data: BarListItem[];
  /** 値の後ろに付ける単位 */
  unit?: string;
  /** バーの色 */
  color?: string;
  /** 100% とみなす最大値 (既定はデータの最大値) */
  max?: number;
}

export function BarList({ data, unit, color = 'var(--accent)', max, ...frame }: BarListProps) {
  const top = max ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <ChartCard {...frame}>
      <div className={styles.list}>
        {data.map((d) => (
          <div key={d.label} className={styles.row}>
            <span className={styles.name}>{d.label}</span>
            <span className={styles.track}>
              <span
                className={styles.fill}
                style={{ width: `${Math.round((d.value / top) * 100)}%`, background: color }}
              />
            </span>
            <span className={styles.count}>
              {d.value}
              {unit && <small>{unit}</small>}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
