import { createFileRoute } from '@tanstack/react-router';
import { LineChart, type ChartPoint } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/line-chart')({
  component: LineChartPage,
});

const DATA: ChartPoint[] = [
  { label: '6/1', value: 68.2 },
  { label: '6/5', value: 67.8 },
  { label: '6/9', value: 68.0 },
  { label: '6/13', value: 67.3 },
  { label: '6/17', value: 66.9 },
  { label: '6/21', value: 67.1 },
  { label: '6/25', value: 66.4 },
];

function LineChartPage() {
  return (
    <Doc title="LineChart" lede="SVG ベースの折れ線チャート。グラデーション塗りとホバーのツールチップに対応。">
      <Demo>
        <LineChart data={DATA} unit="kg" />
      </Demo>
      <Code>{`const data = [{ label: '6/1', value: 68.2 }, { label: '6/5', value: 67.8 }];
<LineChart data={data} unit="kg" />`}</Code>
      <PropsTable
        rows={[
          { name: 'data', type: 'ChartPoint[]', desc: '{ label, value } の配列' },
          { name: 'unit', type: 'string', desc: 'ツールチップの単位' },
          { name: 'color', type: 'string', def: `'var(--accent)'`, desc: '線の色' },
          { name: 'height', type: 'number', def: '200', desc: '高さ px' },
          { name: 'yPad', type: 'number', def: '0.12', desc: '上下の余白率' },
          { name: 'format', type: '(v: number) => string', desc: '値の整形' },
        ]}
      />
    </Doc>
  );
}
