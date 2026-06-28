import { createFileRoute } from '@tanstack/react-router';
import { Icon, type IconName } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';
import styles from '~/catalog/icon-grid.module.css';

export const Route = createFileRoute('/components/icon')({
  component: IconPage,
});

const ICON_NAMES: IconName[] = [
  'home', 'plus', 'minus', 'check', 'close', 'chevron', 'back', 'search', 'trash',
  'edit', 'copy', 'calendar', 'history', 'chart', 'dumbbell', 'glass', 'flame', 'scale',
  'question', 'link', 'pen', 'note', 'pill', 'bottle', 'sun', 'moon', 'monitor', 'settings',
  'book', 'folder', 'pin', 'more', 'list', 'todo', 'indent', 'outdent', 'undo', 'redo',
];

function IconPage() {
  return (
    <Doc
      title="Icon"
      lede="全 38 種を 24×24 / currentColor / stroke ベースに正規化。色は currentColor なので親の color に追従する。"
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
          { name: 'name', type: 'IconName', desc: '38 種から指定' },
          { name: 'size', type: 'number', def: '22', desc: '一辺の px' },
          { name: 'stroke', type: 'number', def: '1.8', desc: '線の太さ' },
          { name: 'className', type: 'string', desc: '回転などの付加スタイル' },
        ]}
      />
    </Doc>
  );
}
