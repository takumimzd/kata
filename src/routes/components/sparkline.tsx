import { createFileRoute } from '@tanstack/react-router';
import { Sparkline } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/sparkline')({
  component: SparklinePage,
});

const DATA = [4, 6, 5, 8, 7, 9, 8, 11, 10, 13];

function SparklinePage() {
  return (
    <Doc title="Sparkline" lede="カード内などに置く小さな折れ線。データは数値の配列。点が 2 未満なら描画しない。">
      <Demo>
        <div style={{ maxWidth: 180 }}>
          <Sparkline data={DATA} width={160} height={44} />
        </div>
      </Demo>
      <Code>{`<Sparkline data={[4, 6, 5, 8, 7, 9, 8, 11]} width={160} height={44} />`}</Code>
      <PropsTable
        rows={[
          { name: 'data', type: 'number[]', desc: '数値の配列 (2 点以上)' },
          { name: 'color', type: 'string', def: `'var(--accent)'`, desc: '線の色' },
          { name: 'width', type: 'number', def: '120', desc: '幅 px' },
          { name: 'height', type: 'number', def: '40', desc: '高さ px' },
        ]}
      />
    </Doc>
  );
}
