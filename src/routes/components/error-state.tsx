import { createFileRoute } from '@tanstack/react-router';
import { Button, ErrorState, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/error-state')({
  component: ErrorStatePage,
});

function ErrorStatePage() {
  return (
    <Doc
      title="ErrorState"
      lede="500 / 404 / 403 などのフルページエラー表示。code (大きな数字)・icon・title・message・actions を縦積みし、600 / 880px のブレークポイントで余白とタイポを段階的に広げる。tone で系統色を切り替える。"
    >
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 500 (danger) */}
          <div style={{ border: '1px dashed var(--line-2)', borderRadius: 12 }}>
            <ErrorState
              tone="danger"
              code="500"
              title="サーバーで問題が発生しました"
              message="一時的な障害の可能性があります。しばらく待ってからもう一度お試しください。"
              actions={
                <>
                  <Button variant="primary" onClick={() => location.reload()}>
                    再読み込み
                  </Button>
                  <Button variant="text">ホームに戻る</Button>
                </>
              }
            />
          </div>

          {/* 404 (default) */}
          <div style={{ border: '1px dashed var(--line-2)', borderRadius: 12 }}>
            <ErrorState
              code="404"
              title="ページが見つかりません"
              message="URL が変更されたか、削除された可能性があります。"
              actions={<Button variant="primary">ホームに戻る</Button>}
            />
          </div>

          {/* 403 (warn) — icon 併用 */}
          <div style={{ border: '1px dashed var(--line-2)', borderRadius: 12 }}>
            <ErrorState
              tone="warn"
              icon={<Icon name="settings" size={40} />}
              title="このページを表示する権限がありません"
              message="アクセスが制限されています。管理者に権限の付与を依頼してください。"
              actions={<Button variant="secondary">ログインし直す</Button>}
            />
          </div>
        </div>
      </Demo>
      <Code>{`<ErrorState
  tone="danger"        // 'default' | 'danger' | 'warn'
  code="500"
  title="サーバーで問題が発生しました"
  message="しばらく待ってから再度お試しください。"
  actions={
    <>
      <Button onClick={() => location.reload()}>再読み込み</Button>
      <Button variant="text">ホームに戻る</Button>
    </>
  }
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'code', type: 'ReactNode', desc: 'ステータスコードなどの装飾数字 (例: "500")。省略可' },
          { name: 'icon', type: 'ReactNode', desc: 'code の代わり/併用で表示する丸バッジ内アイコン' },
          { name: 'title', type: 'ReactNode', desc: '見出し (h1)' },
          { name: 'message', type: 'ReactNode', desc: '補足の説明文' },
          { name: 'actions', type: 'ReactNode', desc: 'ボタン等のアクション (1〜2 個推奨)' },
          { name: 'tone', type: `'default' | 'danger' | 'warn'`, def: `'default'`, desc: '系統色。danger=500 系、warn=403 権限系向け' },
        ]}
      />
    </Doc>
  );
}
