import { createFileRoute, Link } from '@tanstack/react-router';
import { COMPONENTS } from '~/catalog/components-registry';
import { Doc } from '~/catalog/Doc';
import styles from '~/catalog/components-index.module.css';

export const Route = createFileRoute('/components/')({
  component: ComponentsIndex,
});

function ComponentsIndex() {
  return (
    <Doc
      eyebrow="catalog"
      title="コンポーネント"
      lede="コア部品の一覧。各ページでライブデモ・使い方・props を確認できる。左メニューの「コンポーネント」からも辿れる。"
    >
      <div className={styles.grid}>
        {COMPONENTS.map((c) => (
          <Link key={c.slug} to={c.to} className={styles.card}>
            <span className={styles.name}>{c.name}</span>
            <span className={styles.desc}>{c.desc}</span>
          </Link>
        ))}
      </div>
    </Doc>
  );
}
