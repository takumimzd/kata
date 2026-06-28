import { createFileRoute } from '@tanstack/react-router';
import { Fab, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/fab')({
  component: FabPage,
});

function FabPage() {
  return (
    <Doc title="Fab" lede="画面右下に固定配置する円形アクセントボタン。主要な新規作成アクションに使う。位置は className / style で上書きできる。">
      <Demo>
        {/* デモでは固定配置を相対配置に上書きして枠内に収める */}
        <div style={{ position: 'relative', height: 96 }}>
          <Fab label="新規作成" style={{ position: 'absolute', right: 12, bottom: 12 }}>
            <Icon name="plus" />
          </Fab>
        </div>
      </Demo>
      <Code>{`<Fab label="新規作成" onClick={onCreate}>
  <Icon name="plus" />
</Fab>`}</Code>
      <PropsTable
        rows={[
          { name: 'label', type: 'string', desc: 'aria-label (必須)' },
          { name: 'children', type: 'ReactNode', desc: 'アイコン' },
          { name: '...rest', type: 'button 属性', desc: 'onClick / className / style など' },
        ]}
      />
    </Doc>
  );
}
