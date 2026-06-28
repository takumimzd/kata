import { createFileRoute } from '@tanstack/react-router';
import { Input } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/input')({
  component: InputPage,
});

function InputPage() {
  return (
    <Doc title="Input" lede="フィールド見た目のテキスト入力。ネイティブ input の属性をそのまま受け取る。ラベルやヒントが要るときは Field でラップする。">
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}>
          <Input placeholder="プレースホルダ" />
          <Input defaultValue="入力済みの値" />
          <Input type="email" placeholder="email@example.com" />
          <Input placeholder="無効" disabled />
        </div>
      </Demo>
      <Code>{`<Input placeholder="プレースホルダ" />
<Input type="email" placeholder="email@example.com" />
<Input disabled />`}</Code>
      <PropsTable
        rows={[
          { name: 'type', type: 'string', def: `'text'`, desc: 'input の type (email / number など)' },
          { name: 'value / defaultValue', type: 'string', desc: '制御 / 非制御の値' },
          { name: 'placeholder', type: 'string', desc: 'プレースホルダ' },
          { name: 'disabled', type: 'boolean', def: 'false', desc: '無効化' },
          { name: '...rest', type: 'input 属性', desc: 'onChange / maxLength / name など' },
        ]}
      />
    </Doc>
  );
}
