import { createFileRoute } from '@tanstack/react-router';
import { Icon, IconButton } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';

export const Route = createFileRoute('/components/icon-button')({
  component: IconButtonPage,
});

function IconButtonPage() {
  return (
    <Doc title="IconButton" lede="34×34 の正方アイコンボタン。a11y のため label (aria-label) を必須にしている。">
      <Demo>
        <Row>
          <IconButton label="編集">
            <Icon name="edit" size={20} />
          </IconButton>
          <IconButton label="コピー">
            <Icon name="copy" size={20} />
          </IconButton>
          <IconButton label="削除" variant="danger">
            <Icon name="trash" size={20} />
          </IconButton>
          <IconButton label="無効" disabled>
            <Icon name="settings" size={20} />
          </IconButton>
        </Row>
      </Demo>
      <Code>{`<IconButton label="削除" variant="danger">
  <Icon name="trash" size={20} />
</IconButton>`}</Code>
      <PropsTable
        rows={[
          { name: 'label', type: 'string', desc: 'aria-label (必須)' },
          { name: 'variant', type: `'default' | 'danger'`, def: `'default'`, desc: 'hover 時の強調色' },
          { name: 'children', type: 'ReactNode', desc: 'アイコン要素' },
          { name: '...rest', type: 'button 属性', desc: 'onClick / disabled など' },
        ]}
      />
    </Doc>
  );
}
