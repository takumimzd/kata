import { createFileRoute } from '@tanstack/react-router';
import { Field, Icon, Input } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/field')({
  component: FieldPage,
});

function FieldPage() {
  return (
    <Doc title="Field / Input" lede="Field はラベル + コントロール + ヒント/エラーのラッパー。Input はフィールド見た目のテキスト入力。">
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 340 }}>
          <Field label="タイトル" icon={<Icon name="pen" size={14} />} hint="32 文字まで">
            <Input placeholder="入力してください" />
          </Field>
          <Field label="メモ" error="必須項目です">
            <Input placeholder="必須" />
          </Field>
        </div>
      </Demo>
      <Code>{`<Field label="タイトル" hint="32 文字まで">
  <Input placeholder="入力してください" />
</Field>`}</Code>
      <PropsTable
        rows={[
          { name: 'label', type: 'ReactNode', desc: 'フィールドのラベル' },
          { name: 'icon', type: 'ReactNode', desc: 'ラベル左のアイコン' },
          { name: 'hint', type: 'ReactNode', desc: '補足テキスト' },
          { name: 'error', type: 'ReactNode', desc: 'エラー (hint より優先)' },
          { name: 'htmlFor', type: 'string', desc: 'label と入力の関連付け' },
        ]}
      />
    </Doc>
  );
}
