import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Drawer, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';

export const Route = createFileRoute('/components/drawer')({
  component: DrawerPage,
});

function DrawerPage() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <Doc
      title="Drawer"
      lede="画面左 (または右) 端からせり出すオーバーレイパネル。モバイルのハンバーガーメニューや設定パネルに。Esc / 背景クリックで閉じる。"
    >
      <Demo>
        <Row>
          <Button variant="secondary" onClick={() => setLeftOpen(true)}>
            <Icon name="menu" size={16} />
            左からドロワー
          </Button>
          <Button variant="secondary" onClick={() => setRightOpen(true)}>
            右からドロワー
            <Icon name="chevron" size={16} />
          </Button>
        </Row>
        <Drawer open={leftOpen} onClose={() => setLeftOpen(false)} side="left" title="メニュー">
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            この Drawer には SideNav や任意の React ノードを入れられる。<br />
            外側クリック / Esc / 閉じるボタンで onClose が発火する。
          </div>
          <Button variant="text" onClick={() => setLeftOpen(false)}>
            閉じる
          </Button>
        </Drawer>
        <Drawer open={rightOpen} onClose={() => setRightOpen(false)} side="right" title="設定">
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            右端からのパネル。設定 UI などに。
          </div>
          <Button variant="text" onClick={() => setRightOpen(false)}>
            閉じる
          </Button>
        </Drawer>
      </Demo>
      <Code>{`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>メニュー</Button>
<Drawer open={open} onClose={() => setOpen(false)} title="メニュー">
  <SideNav items={...} renderLink={...} />
</Drawer>`}</Code>
      <PropsTable
        rows={[
          { name: 'open', type: 'boolean', desc: '開閉状態 (制御)' },
          { name: 'onClose', type: '() => void', desc: '背景 / Esc / 閉じるボタンで発火' },
          { name: 'side', type: `'left' | 'right'`, def: `'left'`, desc: 'せり出す辺' },
          { name: 'title', type: 'ReactNode', desc: 'ヘッダーのタイトル (指定時のみヘッダー表示)' },
          { name: 'showCloseButton', type: 'boolean', def: 'true', desc: 'title 指定時に×ボタンを出すか' },
          { name: 'footer', type: 'ReactNode', desc: 'ボディ下にピン留めする領域 (テーマ切替など)' },
          { name: 'ariaLabel', type: 'string', desc: 'title なし時の aria-label' },
        ]}
      />
    </Doc>
  );
}
