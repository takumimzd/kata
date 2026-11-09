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
  /** 見出しのレベル。ページ内の見出しの階層に合わせる。既定は 3 */
  level?: 2 | 3 | 4;
}

export function SectionTitle({ children, meta, action, level = 3 }: SectionTitleProps) {
  const Heading = `h${level}` as const;
  return (
    <div className={styles.title}>
      <Heading className={styles.heading}>{children}</Heading>
      <span className={styles.rule} />
      {meta && <span className={styles.meta}>{meta}</span>}
      {action}
    </div>
  );
}
