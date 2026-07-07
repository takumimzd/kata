import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, EmptyState, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/empty-state')({
  component: EmptyStatePage,
});

function EmptyStatePage() {
  return (
    <Doc
      title="EmptyState"
      lede="「まだ何もない」ことを示すブロック。カード内の小さな空欄には sm、画面ブロックには md、フルページ相当には lg を使う。size でパディング・アイコン・タイポが段階的に大きくなる。"
    >
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* size sm — カード内の小ブロック */}
          <Card>
            <EmptyState
              size="sm"
              icon={<Icon name="note" />}
              title="まだメモがありません"
              message="右上の + から追加できます"
            />
          </Card>

          {/* size md — 既定。画面のセクション向け */}
          <div style={{ border: '1px dashed var(--line-2)', borderRadius: 12 }}>
            <EmptyState
              icon={<Icon name="history" />}
              title="まだ記録がありません"
              message="最初の一件を追加すると、履歴とストリークがここに表示されます。"
              actions={<Button variant="primary">記録を追加</Button>}
            />
          </div>

          {/* size lg — フルページ */}
          <div style={{ border: '1px dashed var(--line-2)', borderRadius: 12 }}>
            <EmptyState
              size="lg"
              icon={<Icon name="target" />}
              title="習慣がひとつもありません"
              message="続けたいことを 1 つ登録して、今日から始めましょう。"
              actions={
                <>
                  <Button variant="primary">習慣を追加</Button>
                  <Button variant="text">サンプルを見る</Button>
                </>
              }
            />
          </div>
        </div>
      </Demo>
      <Code>{`<EmptyState
  size="md"                       // 'sm' | 'md' | 'lg'
  icon={<Icon name="history" />}
  title="まだ記録がありません"
  message="最初の一件を追加すると、履歴が表示されます。"
  actions={<Button>記録を追加</Button>}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'icon', type: 'ReactNode', desc: '装飾アイコン (丸バッジに入る)' },
          { name: 'title', type: 'ReactNode', desc: '見出し' },
          { name: 'message', type: 'ReactNode', desc: '補足の説明' },
          { name: 'actions', type: 'ReactNode', desc: 'ボタン等のアクション' },
          { name: 'size', type: `'sm' | 'md' | 'lg'`, def: `'md'`, desc: '密度。sm=カード内、md=画面ブロック、lg=フルページ' },
        ]}
      />
    </Doc>
  );
}
