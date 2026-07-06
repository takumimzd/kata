import { createFileRoute } from '@tanstack/react-router';
import { StackedBarChart, type StackedPoint, type StackedSeries } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/stacked-bar-chart')({
  component: StackedBarChartPage,
});

const SERIES: StackedSeries[] = [
  { key: 'chest', label: '胸', color: 'var(--accent)' },
  { key: 'back', label: '背中', color: 'var(--accent-line)' },
  { key: 'legs', label: '脚', color: 'var(--accent-soft)' },
];

const DATA: StackedPoint[] = [
  { label: '1月', values: { chest: 8, back: 4, legs: 6 } },
  { label: '2月', values: { chest: 12, back: 6, legs: 8 } },
  { label: '3月', values: { chest: 6, back: 10, legs: 5 } },
  { label: '4月', values: { chest: 15, back: 8, legs: 10 } },
  { label: '5月', values: { chest: 11, back: 12, legs: 9 } },
  { label: '6月', values: { chest: 18, back: 10, legs: 12 } },
];

function StackedBarChartPage() {
  return (
    <Doc
      title="StackedBarChart"
      lede="複数系列を積み上げた棒グラフ。系列ごとに key と色を渡し、data の各点は label + 各 key の値を持つ。常に枠 (タイトル / 説明 / 数値) でラップされる。"
    >
      <Demo>
        <div style={{ maxWidth: 460 }}>
          <StackedBarChart
            title="部位別トレーニング"
            sub="月ごとの回数"
            value="計 170 回"
            series={SERIES}
            data={DATA}
          />
        </div>
      </Demo>
      <Code>{`const series: StackedSeries[] = [
  { key: 'chest', label: '胸', color: 'var(--accent)' },
  { key: 'back',  label: '背中', color: 'var(--accent-line)' },
  { key: 'legs',  label: '脚', color: 'var(--accent-soft)' },
];

<StackedBarChart
  title="部位別トレーニング"
  sub="月ごとの回数"
  series={series}
  data={[{ label: '1月', values: { chest: 8, back: 4, legs: 6 } }, ...]}
  showTotal
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'series', type: 'StackedSeries[]', desc: '{ key, label, color } の配列' },
          { name: 'data', type: 'StackedPoint[]', desc: '{ label, values: Record<key, number> }' },
          { name: 'height', type: 'number', def: '190', desc: '高さ px' },
          { name: 'showTotal', type: 'boolean', def: 'true', desc: '棒の上に合計値を出すか' },
          { name: 'title / sub / value', type: '枠', desc: 'ChartCard の見出し / 説明 / 右上数値' },
        ]}
      />
    </Doc>
  );
}
