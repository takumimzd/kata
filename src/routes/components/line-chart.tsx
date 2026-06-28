import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { LineChart, type ChartPoint, type ChartTab } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/line-chart')({
  component: LineChartPage,
});

const TABS: ChartTab[] = [
  { value: 'legpress', label: 'レッグプレス' },
  { value: 'abs', label: 'アブドミナル' },
  { value: 'chest', label: 'チェストプレス' },
];

const SERIES: Record<string, ChartPoint[]> = {
  legpress: [
    { label: '6/1', value: 80 },
    { label: '6/10', value: 90 },
    { label: '6/20', value: 100 },
  ],
  abs: [
    { label: '6/1', value: 20 },
    { label: '6/10', value: 25 },
    { label: '6/20', value: 30 },
  ],
  chest: [
    { label: '6/1', value: 40 },
    { label: '6/10', value: 45 },
    { label: '6/20', value: 55 },
  ],
};

function LineChartPage() {
  const [tab, setTab] = useState('legpress');
  return (
    <Doc title="LineChart" lede="SVG 折れ線。グラデーション塗りとホバーのツールチップ。常に枠 (タイトル / 説明 / 数値 / タブ) でラップされる。">
      <Demo>
        <div style={{ maxWidth: 460 }}>
          <LineChart
            title="Menu Progress"
            sub={TABS.find((t) => t.value === tab)?.label}
            value="+20kg"
            tabs={TABS}
            activeTab={tab}
            onTabChange={setTab}
            data={SERIES[tab] ?? []}
            unit="kg"
          />
        </div>
      </Demo>
      <Code>{`<LineChart
  title="Menu Progress"
  sub={currentLabel}
  value="+20kg"
  tabs={tabs}
  activeTab={tab}
  onTabChange={setTab}
  data={series}
  unit="kg"
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'data', type: 'ChartPoint[]', desc: '{ label, value } の配列' },
          { name: 'unit', type: 'string', desc: 'ツールチップの単位' },
          { name: 'color', type: 'string', def: `'var(--accent)'`, desc: '線の色' },
          { name: 'height', type: 'number', def: '200', desc: '高さ px' },
          { name: 'title / sub / value', type: '枠', desc: 'タイトル / 説明 / 右上の数値' },
          { name: 'tabs / activeTab / onTabChange', type: '枠', desc: 'タブ行 (省略可)' },
        ]}
      />
    </Doc>
  );
}
