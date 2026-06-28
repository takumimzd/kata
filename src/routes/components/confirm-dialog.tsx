import { createFileRoute } from '@tanstack/react-router';
import { Button, ConfirmProvider, ToastProvider, useConfirm, useToast } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';

export const Route = createFileRoute('/components/confirm-dialog')({
  component: ConfirmDialogPage,
});

function ConfirmDialogPage() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <Inner />
      </ConfirmProvider>
    </ToastProvider>
  );
}

function Inner() {
  const confirm = useConfirm();
  const { showToast } = useToast();

  async function run(danger: boolean) {
    const ok = await confirm(
      danger
        ? { title: '削除しますか？', message: 'この操作は取り消せません。', danger: true, confirmLabel: '削除' }
        : { title: '保存しますか？', confirmLabel: '保存' },
    );
    showToast(ok ? '確定しました' : 'キャンセルしました');
  }

  return (
    <Doc title="ConfirmDialog" lede="window.confirm の代替。ConfirmProvider 配下で useConfirm() を呼ぶと Promise<boolean> が返る。">
      <Demo>
        <Row>
          <Button variant="secondary" onClick={() => run(false)}>
            確認する
          </Button>
          <Button variant="danger" onClick={() => run(true)}>
            削除を確認
          </Button>
        </Row>
      </Demo>
      <Code>{`const confirm = useConfirm();
const ok = await confirm({ title: '削除しますか？', danger: true });`}</Code>
      <PropsTable
        rows={[
          { name: 'title', type: 'string', desc: 'タイトル' },
          { name: 'message', type: 'string', desc: '本文 (任意)' },
          { name: 'confirmLabel', type: 'string', def: `'OK'`, desc: '確定ボタン' },
          { name: 'cancelLabel', type: 'string', def: `'キャンセル'`, desc: '取消ボタン' },
          { name: 'danger', type: 'boolean', def: 'false', desc: '破壊的操作 (赤表示)' },
        ]}
      />
    </Doc>
  );
}
