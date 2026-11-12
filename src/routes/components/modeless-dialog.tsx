import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Field, ModelessDialog, Textarea } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/modeless-dialog')({
  component: ModelessDialogPage,
});

function ModelessDialogPage() {
  const [open, setOpen] = useState(false);
  return (
    <Doc
      title="ModelessDialog"
      lede="背景を覆わない浮動パネル。開いたまま後ろのページを読んだり操作したりできる。ヘッダーをつかんで移動し、右下のつまみ（矢印キーでも可）で大きさを変える。Escape は中にフォーカスがあるときだけ閉じる。"
    >
      <Demo>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        {open && (
          <ModelessDialog title="メモ" onClose={() => setOpen(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ margin: 0, fontSize: 13 }}>
                後ろのページをスクロールしたり、文字を選んだりしたまま書ける。
              </p>
              <Field label="内容">
                <Textarea rows={6} />
              </Field>
              <Button onClick={() => setOpen(false)}>閉じる</Button>
            </div>
          </ModelessDialog>
        )}
      </Demo>
      <Code>{`{open && (
  <ModelessDialog title="メモ" onClose={() => setOpen(false)}>
    ...
  </ModelessDialog>
)}`}</Code>
      <PropsTable
        rows={[
          { name: 'title', type: 'string', desc: 'ヘッダーのタイトル (ここをつかんで移動する)' },
          { name: 'onClose', type: '() => void', desc: '閉じる (× / 中にフォーカスがあるときの Escape)' },
          { name: 'children', type: 'ReactNode', desc: '本文 (はみ出したら本文だけスクロール)' },
          {
            name: 'defaultSize',
            type: '{ width, height }',
            desc: '最初の大きさ。既定 420 × 560。画面に収まらなければ縮める。最初は右下に置く',
          },
          { name: 'minSize', type: '{ width, height }', desc: '小さくできる限界。既定 320 × 240' },
          { name: 'className', type: 'string', desc: 'パネルに足すクラス' },
        ]}
      />
    </Doc>
  );
}
