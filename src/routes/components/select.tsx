import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Field, Select } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/select')({
  component: SelectPage,
});

const OPTIONS = [
  { value: 'gym', label: '筋トレ' },
  { value: 'reading', label: '読書' },
  { value: 'blog', label: 'ブログ' },
];

function SelectPage() {
  const [value, setValue] = useState('gym');
  return (
    <Doc title="Select" lede="装飾したネイティブ select。options を渡すか、children に <option> を直接置ける。ネイティブなのでモバイルでも扱いやすい。">
      <Demo>
        <div style={{ maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="習慣">
            <Select value={value} onChange={(e) => setValue(e.target.value)} options={OPTIONS} />
          </Field>
          <Field label="children で指定">
            <Select defaultValue="">
              <option value="">選択しない</option>
              <option value="a">項目 A</option>
              <option value="b">項目 B</option>
            </Select>
          </Field>
        </div>
      </Demo>
      <Code>{`<Select value={value} onChange={(e) => setValue(e.target.value)} options={OPTIONS} />`}</Code>
      <PropsTable
        rows={[
          { name: 'options', type: '{ value, label }[]', desc: '選択肢 (children でも可)' },
          { name: 'value / onChange', type: 'select 属性', desc: '制御コンポーネントとして使う' },
          { name: '...rest', type: 'select 属性', desc: 'disabled / defaultValue など' },
        ]}
      />
    </Doc>
  );
}
