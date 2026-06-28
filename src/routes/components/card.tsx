import { createFileRoute } from '@tanstack/react-router';
import { Card } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/card')({
  component: CardPage,
});

function CardPage() {
  return (
    <Doc title="Card" lede="surface + 罫線 + 角丸 + 影 の基本的な面。padding は s/m/l のトークンで切り替える。中身のレイアウトは利用側で自由に組む。">
      <Demo>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Card padding="s" style={{ width: 150 }}>
            <strong style={{ fontSize: 13 }}>padding s</strong>
            <p style={{ marginTop: 6, fontSize: 12, color: 'var(--text-dim)' }}>14px</p>
          </Card>
          <Card padding="m" style={{ width: 150 }}>
            <strong style={{ fontSize: 13 }}>padding m</strong>
            <p style={{ marginTop: 6, fontSize: 12, color: 'var(--text-dim)' }}>20px (既定)</p>
          </Card>
          <Card padding="l" style={{ width: 150 }}>
            <strong style={{ fontSize: 13 }}>padding l</strong>
            <p style={{ marginTop: 6, fontSize: 12, color: 'var(--text-dim)' }}>28px</p>
          </Card>
        </div>
      </Demo>
      <Code>{`<Card padding="m">...</Card>   // s=14 / m=20 / l=28px`}</Code>
      <PropsTable
        rows={[
          { name: 'padding', type: `'s' | 'm' | 'l'`, def: `'m'`, desc: '内側の余白 (14 / 20 / 28px)' },
          { name: 'children', type: 'ReactNode', desc: 'カードの中身' },
          { name: '...rest', type: 'div 属性', desc: 'className / onClick など' },
        ]}
      />
    </Doc>
  );
}
