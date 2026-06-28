import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { createEditorBlock, RichTextEditor, type EditorBlock } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/rich-text-editor')({
  component: RichTextEditorPage,
});

function initialBlocks(): EditorBlock[] {
  return [
    createEditorBlock('h1', '買い物メモ'),
    createEditorBlock('p', 'Markdown 風に「# 」や「- 」「[] 」で書式が切り替わる。'),
    createEditorBlock('li', '牛乳'),
    createEditorBlock('li', 'パン'),
    createEditorBlock('todo', '卵を買う', true),
    createEditorBlock('todo', 'コーヒー豆を買う', false),
  ];
}

function RichTextEditorPage() {
  // Lexical / contentEditable は SSR しないようマウント後にのみ描画する
  const [mounted, setMounted] = useState(false);
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  useEffect(() => setMounted(true), []);

  return (
    <Doc
      title="RichTextEditor"
      lede="Lexical ベースのブロックエディタ。見出し (H1/H2) / 箇条書き / チェックボックス / ネストに対応。外部とは EditorBlock[] でやり取りし、Lexical 依存は内部に閉じている。"
    >
      <Demo>
        {/* エディタ自体は枠を持たないので、デモでは高さ付きの枠ボックスに収める */}
        <div
          style={{
            height: 360,
            display: 'flex',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}
        >
          {mounted && (
            <RichTextEditor value={blocks} onChange={setBlocks} placeholder="入力してください" />
          )}
        </div>
      </Demo>
      <Code>{`const [blocks, setBlocks] = useState<EditorBlock[]>(() => [
  createEditorBlock('h1', '買い物メモ'),
  createEditorBlock('todo', '卵を買う', true),
]);

<RichTextEditor value={blocks} onChange={setBlocks} placeholder="入力してください" />`}</Code>
      <PropsTable
        rows={[
          { name: 'value', type: 'EditorBlock[]', desc: '初期ブロック (マウント時のみ反映)' },
          { name: 'onChange', type: '(blocks: EditorBlock[]) => void', desc: '編集内容のコールバック' },
          { name: 'placeholder', type: 'string', desc: '空のときの表示' },
          { name: 'autoFocusEnd', type: 'boolean', def: 'false', desc: 'マウント後に末尾へフォーカス' },
          { name: 'namespace', type: 'string', desc: '複数エディタの区別用' },
          { name: 'className', type: 'string', desc: '枠への追加クラス' },
        ]}
      />
    </Doc>
  );
}
