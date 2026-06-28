import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Icon, SearchSelect, type SearchSelectOption } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/search-select')({
  component: SearchSelectPage,
});

const OPTIONS: SearchSelectOption[] = [
  { value: 'bench', label: 'ベンチプレス', group: '胸', icon: <Icon name="dumbbell" size={15} /> },
  { value: 'pushup', label: '腕立て伏せ', group: '胸', icon: <Icon name="dumbbell" size={15} /> },
  { value: 'squat', label: 'スクワット', group: '下半身', icon: <Icon name="dumbbell" size={15} /> },
  { value: 'lunge', label: 'ランジ', group: '下半身', icon: <Icon name="dumbbell" size={15} /> },
  { value: 'run', label: 'ランニング', group: '有酸素', icon: <Icon name="flame" size={15} /> },
];

function SearchSelectPage() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Doc title="SearchSelect" lede="検索付きのセレクト (コンボボックス)。group で見出し分け、検索とキーボード操作に対応。closeOnSelect={false} で「選んで追加」を繰り返す用途にも使える。">
      <Demo>
        <div style={{ maxWidth: 340 }}>
          <SearchSelect
            options={OPTIONS}
            value={value}
            onSelect={setValue}
            placeholder="メニューを選択"
            triggerIcon={<Icon name="dumbbell" size={16} />}
            searchPlaceholder="検索"
          />
        </div>
      </Demo>
      <Code>{`<SearchSelect
  options={options}        // { value, label, group?, icon? }[]
  value={value}
  onSelect={setValue}
  placeholder="メニューを選択"
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'options', type: 'SearchSelectOption[]', desc: '{ value, label, group?, icon? }' },
          { name: 'onSelect', type: '(value: string) => void', desc: '選択コールバック' },
          { name: 'value', type: 'string', desc: '選択中の値 (単一選択表示)' },
          { name: 'placeholder', type: 'string', def: `'選択'`, desc: 'コントロールの表示' },
          { name: 'triggerIcon', type: 'ReactNode', desc: 'コントロール左のアイコン' },
          { name: 'filter', type: '(o, q) => boolean', desc: '絞り込み条件 (既定は部分一致)' },
          { name: 'closeOnSelect', type: 'boolean', def: 'true', desc: '選択後に閉じるか' },
          { name: 'optionTrailing', type: 'ReactNode', desc: '行右端 (hover で表示する +等)' },
        ]}
      />
    </Doc>
  );
}
