import { createFileRoute } from '@tanstack/react-router';
import { Button, ToastProvider, useToast } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/toast')({
  component: ToastPage,
});

function ToastPage() {
  return (
    <ToastProvider>
      <Inner />
    </ToastProvider>
  );
}

function Inner() {
  const { showToast } = useToast();
  return (
    <Doc title="Toast" lede="画面上部に短く出る通知。ToastProvider 配下で useToast().showToast(message) を呼ぶ。">
      <Demo>
        <Button variant="secondary" onClick={() => showToast('保存しました')}>
          トーストを表示
        </Button>
      </Demo>
      <Code>{`const { showToast } = useToast();
showToast('保存しました');`}</Code>
      <PropsTable
        rows={[
          { name: 'showToast', type: '(message: string) => void', desc: '上部にトーストを表示 (2.2 秒で自動的に消える)' },
        ]}
      />
    </Doc>
  );
}
