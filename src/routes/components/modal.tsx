import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Field, Input, Modal } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/modal')({
  component: ModalPage,
});

function ModalPage() {
  const [open, setOpen] = useState(false);
  return (
    <Doc title="Modal" lede="モバイルは下部シート、880px 以上では中央ダイアログ。Escape / 背景クリックで閉じる。">
      <Demo>
        <Button onClick={() => setOpen(true)}>モーダルを開く</Button>
        {open && (
          <Modal title="記録を追加" onClose={() => setOpen(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="タイトル">
                <Input placeholder="例: 朝のランニング" />
              </Field>
              <Button block onClick={() => setOpen(false)}>
                保存する
              </Button>
            </div>
          </Modal>
        )}
      </Demo>
      <Code>{`{open && (
  <Modal title="記録を追加" onClose={() => setOpen(false)}>
    ...
  </Modal>
)}`}</Code>
      <PropsTable
        rows={[
          { name: 'title', type: 'string', desc: 'ヘッダーのタイトル' },
          { name: 'onClose', type: '() => void', desc: '閉じる (Esc / 背景クリックでも発火)' },
          { name: 'children', type: 'ReactNode', desc: '本文' },
        ]}
      />
    </Doc>
  );
}
