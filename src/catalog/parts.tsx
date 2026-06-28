// カタログ用の共通パーツ (ライブデモ枠・コード・props表)
import type { ReactNode } from 'react';
import styles from './parts.module.css';

export function Demo({ children }: { children: ReactNode }) {
  return <div className={styles.demo}>{children}</div>;
}

export function Row({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export function Code({ children }: { children: string }) {
  return (
    <pre className={styles.code}>
      <code>{children}</code>
    </pre>
  );
}

export interface PropRow {
  name: string;
  type: string;
  def?: string;
  desc: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>prop</th>
            <th>型</th>
            <th>既定</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className={styles.pName}>{r.name}</td>
              <td className={styles.pType}>{r.type}</td>
              <td className={styles.pType}>{r.def ?? '—'}</td>
              <td>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
