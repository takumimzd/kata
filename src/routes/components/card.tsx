import { createFileRoute } from '@tanstack/react-router';
import { Card, SectionTitle } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/card')({
  component: CardPage,
});

function CardPage() {
  return (
    <Doc title="Card" lede="surface + 罫線 + 角丸 + 影 の基本的な面。中身のレイアウトは自由。">
      <Demo>
        <div style={{ maxWidth: 360 }}>
          <Card>
            <SectionTitle meta="3 件">最近の記録</SectionTitle>
            <p style={{ marginTop: 10, fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.7 }}>
              カードの中に任意の要素を置けます。余白は 20px。
            </p>
          </Card>
        </div>
      </Demo>
      <Code>{`<Card>
  <SectionTitle meta="3 件">最近の記録</SectionTitle>
  ...
</Card>`}</Code>
      <PropsTable
        rows={[
          { name: 'children', type: 'ReactNode', desc: 'カードの中身' },
          { name: '...rest', type: 'div 属性', desc: 'className / onClick など' },
        ]}
      />
    </Doc>
  );
}
