import { createFileRoute } from '@tanstack/react-router';
import { Icon, ICON_NAMES } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';
import styles from '~/catalog/icon-grid.module.css';

export const Route = createFileRoute('/components/icon')({
  component: IconPage,
});

function IconPage() {
  return (
    <Doc
      title="Icon"
      lede={`全 ${ICON_NAMES.length} 種を 24×24 / currentColor / stroke ベースに正規化。色は currentColor なので親の color に追従する。`}
    >
      <Demo>
        <div className={styles.grid}>
          {ICON_NAMES.map((n) => (
            <div key={n} className={styles.cell}>
              <Icon name={n} size={22} />
              <span className={styles.name}>{n}</span>
            </div>
          ))}
        </div>
      </Demo>
      <Code>{`<Icon name="flame" size={22} stroke={1.8} />`}</Code>
      <PropsTable
        rows={[
          { name: 'name', type: 'IconName', desc: `${ICON_NAMES.length} 種から指定 (一覧は ICON_NAMES)` },
          { name: 'size', type: 'number', def: '22', desc: '一辺の px' },
          { name: 'stroke', type: 'number', def: '1.8', desc: '線の太さ' },
          { name: 'className', type: 'string', desc: '回転などの付加スタイル' },
        ]}
      />
    </Doc>
  );
}
