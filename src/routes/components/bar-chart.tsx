import { createFileRoute } from '@tanstack/react-router';
import { BarChart, type ChartPoint } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/bar-chart')({
  component: BarChartPage,
});

const DATA: ChartPoint[] = [
  { label: '1月', value: 8 },
  { label: '2月', value: 12 },
  { label: '3月', value: 7 },
  { label: '4月', value: 15 },
  { label: '5月', value: 11 },
  { label: '6月', value: 18 },
];

function BarChartPage() {
  return (
    <Doc title="BarChart" lede="SVG ベースの棒グラフ。幅はコンテナに追従し、棒の上に値ラベルが出る。">
      <Demo>
        <BarChart data={DATA} />
      </Demo>
      <Code>{`const data = [{ label: '1月', value: 8 }, { label: '2月', value: 12 }];
<BarChart data={data} />`}</Code>
      <PropsTable
        rows={[
          { name: 'data', type: 'ChartPoint[]', desc: '{ label, value } の配列' },
          { name: 'color', type: 'string', def: `'var(--accent)'`, desc: '棒の色' },
          { name: 'height', type: 'number', def: '170', desc: '高さ px' },
        ]}
      />
    </Doc>
  );
}
