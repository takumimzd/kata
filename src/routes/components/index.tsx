import { createFileRoute, Link } from '@tanstack/react-router';
import { COMPONENTS, groupedComponents } from '~/catalog/components-registry';
import { Doc } from '~/catalog/Doc';
import styles from '~/catalog/components-index.module.css';

export const Route = createFileRoute('/components/')({
  component: ComponentsIndex,
});

function ComponentsIndex() {
  const groups = groupedComponents();
  return (
    <Doc
      eyebrow="catalog"
      title="コンポーネント"
      lede={`全 ${COMPONENTS.length} 部品を src/ds/components/ の構成どおりに分類。各ページでライブデモ・使い方・props を確認できる。左メニューからも辿れる。`}
    >
      {groups.map(({ group, items }) => (
        <section key={group.key} className={styles.group}>
          <div className={styles.groupTitle}>
            <h2>{group.label}</h2>
            <span>{group.meta}</span>
          </div>
          <div className={styles.grid}>
            {items.map((c) => (
              <Link key={c.slug} to={c.to} className={styles.card}>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.desc}>{c.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </Doc>
  );
}
