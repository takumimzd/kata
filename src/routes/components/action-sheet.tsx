import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ActionSheet, ActionSheetItem, Button, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/action-sheet')({
  component: ActionSheetPage,
});

function ActionSheetPage() {
  const [open, setOpen] = useState(false);
  return (
    <Doc title="ActionSheet" lede="画面下からせり上がるシート (デスクトップでは中央にポップ)。中身は自由。選択肢には ActionSheetItem を使う。タイトル付きのフォームは Modal を使う。">
      <Demo>
        <Button onClick={() => setOpen(true)}>シートを開く</Button>
        {open && (
          <ActionSheet onClose={() => setOpen(false)} aria-label="新規作成">
            <ActionSheetItem icon={<Icon name="note" />} onClick={() => setOpen(false)}>
              新規メモ
            </ActionSheetItem>
            <ActionSheetItem icon={<Icon name="folder" />} onClick={() => setOpen(false)}>
              新規フォルダ
            </ActionSheetItem>
            <Button variant="text" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
          </ActionSheet>
        )}
      </Demo>
      <Code>{`{open && (
  <ActionSheet onClose={() => setOpen(false)}>
    <ActionSheetItem icon={<Icon name="note" />} onClick={onNote}>新規メモ</ActionSheetItem>
    <ActionSheetItem icon={<Icon name="folder" />} onClick={onFolder}>新規フォルダ</ActionSheetItem>
  </ActionSheet>
)}`}</Code>
      <PropsTable
        rows={[
          { name: 'ActionSheet · onClose', type: '() => void', desc: '外側クリック / Esc で呼ばれる' },
          { name: 'ActionSheet · children', type: 'ReactNode', desc: 'シートの中身' },
          { name: 'ActionSheetItem · icon', type: 'ReactNode', desc: 'タイル内アイコン' },
          { name: 'ActionSheetItem · onClick', type: '() => void', desc: '選択時の処理' },
          { name: 'ActionSheetItem · disabled', type: 'boolean', def: 'false', desc: '無効化' },
        ]}
      />
    </Doc>
  );
}
