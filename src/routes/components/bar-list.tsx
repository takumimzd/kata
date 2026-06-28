import { createFileRoute } from '@tanstack/react-router';
import { BarList, type BarListItem } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/bar-list')({
  component: BarListPage,
});

const DATA: BarListItem[] = [
  { label: 'ビタミンD', value: 28 },
  { label: 'マグネシウム', value: 21 },
  { label: '亜鉛', value: 16 },
  { label: 'オメガ3', value: 9 },
  { label: 'ビタミンC', value: 4 },
];

function BarListPage() {
  return (
    <Doc title="BarList" lede="ラベル + 横バー + 値のランキング表示。品目ごとの回数などに。常に枠 (タイトル等) でラップされる。">
      <Demo>
        <div style={{ maxWidth: 420 }}>
          <BarList title="Supplement Items" sub="品目ごとの服用回数" value="5品目" data={DATA} unit="回" />
        </div>
      </Demo>
      <Code>{`<BarList title="Supplement Items" sub="品目ごとの服用回数" data={data} unit="回" />`}</Code>
      <PropsTable
        rows={[
          { name: 'data', type: 'BarListItem[]', desc: '{ label, value } の配列' },
          { name: 'unit', type: 'string', desc: '値の単位' },
          { name: 'color', type: 'string', def: `'var(--accent)'`, desc: 'バーの色' },
          { name: 'max', type: 'number', desc: '100% とみなす値 (既定は最大値)' },
          { name: 'title / sub / value', type: '枠', desc: 'タイトル / 説明 / 右上の数値' },
          { name: 'tabs / activeTab / onTabChange', type: '枠', desc: 'タブ行 (省略可)' },
        ]}
      />
    </Doc>
  );
}
