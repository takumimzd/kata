import { createFileRoute } from '@tanstack/react-router';
import { Badge } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';

export const Route = createFileRoute('/components/badge')({
  component: BadgePage,
});

function BadgePage() {
  return (
    <Doc title="Badge" lede="状態を表す小さなラベル。variant で配色を切り替える。">
      <Demo>
        <Row>
          <Badge>標準</Badge>
          <Badge variant="accent">記録済み</Badge>
          <Badge variant="warn">お休み中</Badge>
          <Badge variant="danger">超過</Badge>
        </Row>
      </Demo>
      <Code>{`<Badge variant="warn">お休み中</Badge>`}</Code>
      <PropsTable
        rows={[
          { name: 'variant', type: `'neutral' | 'accent' | 'danger' | 'warn'`, def: `'neutral'`, desc: '配色' },
          { name: 'children', type: 'ReactNode', desc: 'ラベル' },
        ]}
      />
    </Doc>
  );
}
