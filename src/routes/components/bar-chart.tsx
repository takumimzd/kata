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
    <Doc title="BarChart" lede="SVG 棒グラフ。常に枠 (タイトル / 説明 / 右上の数値 / 任意のタブ) でラップされた状態で提供される。">
      <Demo>
        <BarChart title="Gym Visits" sub="月ごと" value="計 71回" data={DATA} />
      </Demo>
      <Code>{`<BarChart title="Gym Visits" sub="月ごと" value="計 71回" data={data} />`}</Code>
      <PropsTable
        rows={[
          { name: 'data', type: 'ChartPoint[]', desc: '{ label, value } の配列' },
          { name: 'color', type: 'string', def: `'var(--accent)'`, desc: '棒の色' },
          { name: 'height', type: 'number', def: '170', desc: '高さ px' },
          { name: 'title / sub / value', type: '枠', desc: 'タイトル / 説明 / 右上の数値' },
          { name: 'valueTone', type: `'accent' | 'clay' | 'danger'`, def: `'accent'`, desc: '数値の配色' },
          { name: 'tabs / activeTab / onTabChange', type: '枠', desc: 'タブ行 (省略可)' },
        ]}
      />
    </Doc>
  );
}
