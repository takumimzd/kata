import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Field, Textarea } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/textarea')({
  component: TextareaPage,
});

function TextareaPage() {
  const [text, setText] = useState('');
  return (
    <Doc title="Textarea" lede="複数行のテキスト入力。縦方向のみリサイズ可。Field と組み合わせて使える。">
      <Demo>
        <div style={{ maxWidth: 380 }}>
          <Field label="メモ" hint="任意">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="自由に記入してください"
            />
          </Field>
        </div>
      </Demo>
      <Code>{`<Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="…" />`}</Code>
      <PropsTable
        rows={[
          { name: 'value', type: 'string', desc: '入力値' },
          { name: 'onChange', type: '(e) => void', desc: '変更イベント' },
          { name: 'placeholder', type: 'string', desc: 'プレースホルダ' },
          { name: '...rest', type: 'textarea 属性', desc: 'rows / maxLength など' },
        ]}
      />
    </Doc>
  );
}
