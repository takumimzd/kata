// ============================================================
//  kata — SectionTitle (ラベル + ヘアライン罫)
// ============================================================
import type { ReactNode } from 'react';
import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  children: ReactNode;
  /** 右側に出す補足 (件数など) */
  meta?: ReactNode;
  /** 右端のアクション (ボタンなど) */
  action?: ReactNode;
}

export function SectionTitle({ children, meta, action }: SectionTitleProps) {
  return (
    <div className={styles.title}>
      <h3>{children}</h3>
      <span className={styles.rule} />
      {meta && <span className={styles.meta}>{meta}</span>}
      {action}
    </div>
  );
}
