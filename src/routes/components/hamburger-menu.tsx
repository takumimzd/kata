import { createFileRoute } from '@tanstack/react-router';
import { HamburgerMenu, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';

export const Route = createFileRoute('/components/hamburger-menu')({
  component: HamburgerMenuPage,
});

function HamburgerMenuPage() {
  return (
    <Doc
      title="HamburgerMenu"
      lede="ハンバーガーアイコンボタン + Drawer の複合コンポーネント。押すと Drawer が左 (or 右) から開き、中身は children にそのまま渡す。制御 / 非制御の両モード対応。"
    >
      <Demo>
        <Row>
          <HamburgerMenu triggerLabel="メニュー" title="メニュー">
            <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7 }}>
              押すと左から Drawer が開く。
              <br />
              中身は SideNav / リンクリスト / フォーム、何でも入る。
            </div>
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <Icon name="home" size={16} />
              概要
            </a>
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 8,
                color: 'var(--text-dim)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              <Icon name="chart" size={16} />
              トークン
            </a>
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 8,
                color: 'var(--text-dim)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              <Icon name="note" size={16} />
              コンポーネント
            </a>
          </HamburgerMenu>

          <HamburgerMenu triggerLabel="右からのメニュー" side="right" title="設定">
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              side=&quot;right&quot; を渡すと右からせり出す。
            </div>
          </HamburgerMenu>

          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            ← ハンバーガーを押して開く
          </span>
        </Row>
      </Demo>
      <Code>{`// 非制御 (内部 state)
<HamburgerMenu triggerLabel="メニュー" title="メニュー">
  <SideNav items={...} renderLink={...} />
</HamburgerMenu>

// 制御モード
const [open, setOpen] = useState(false);
<HamburgerMenu
  open={open}
  onOpenChange={setOpen}
  triggerLabel="メニュー"
  title="メニュー"
  drawerFooter={<ThemePicker />}
>
  <SideNav ... />
</HamburgerMenu>`}</Code>
      <PropsTable
        rows={[
          { name: 'children', type: 'ReactNode', desc: 'Drawer の中身 (メニュー本体)' },
          { name: 'side', type: `'left' | 'right'`, def: `'left'`, desc: 'Drawer がせり出す辺' },
          { name: 'title', type: 'ReactNode', desc: 'Drawer ヘッダーのタイトル' },
          { name: 'drawerFooter', type: 'ReactNode', desc: 'Drawer 下部にピン留めする領域' },
          { name: 'open', type: 'boolean', desc: '制御モード時の開閉状態 (省略時は内部 state)' },
          { name: 'onOpenChange', type: '(open: boolean) => void', desc: '制御モード時のハンドラ' },
          { name: 'triggerLabel', type: 'string', def: `'メニュー'`, desc: 'trigger の aria-label' },
          { name: 'iconSize', type: 'number', def: '20', desc: 'trigger のアイコンサイズ' },
          { name: 'triggerClassName', type: 'string', desc: 'trigger のクラス' },
        ]}
      />
    </Doc>
  );
}
