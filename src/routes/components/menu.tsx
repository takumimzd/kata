import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { IconButton, Icon, Menu, MenuItem } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/menu')({
  component: MenuPage,
});

function MenuPage() {
  const [open, setOpen] = useState(false);
  return (
    <Doc
      title="Menu"
      lede="開いた状態のドロップダウンメニュー。トリガーボタンとは分離していて、position:relative なラッパに並べ、開閉状態は利用側が制御する。項目選択・外側クリック・キー入力で閉じる。"
    >
      <Demo>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <IconButton
            label="メニュー"
            onPointerDown={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            <Icon name="more" size={20} />
          </IconButton>
          {open && (
            <Menu onClose={() => setOpen(false)} align="left">
              <MenuItem icon={<Icon name="pin" size={17} />} onClick={() => {}}>
                ピン留め
              </MenuItem>
              <MenuItem icon={<Icon name="copy" size={17} />} onClick={() => {}}>
                複製
              </MenuItem>
              <MenuItem icon={<Icon name="trash" size={17} />} danger onClick={() => {}}>
                削除
              </MenuItem>
            </Menu>
          )}
        </div>
      </Demo>
      <Code>{`const [open, setOpen] = useState(false);

<div style={{ position: 'relative' }}>
  <IconButton label="メニュー"
    onPointerDown={(e) => { e.stopPropagation(); setOpen((v) => !v); }}>
    <Icon name="more" />
  </IconButton>
  {open && (
    <Menu onClose={() => setOpen(false)}>
      <MenuItem icon={<Icon name="pin" />} onClick={onPin}>ピン留め</MenuItem>
      <MenuItem icon={<Icon name="trash" />} danger onClick={onDelete}>削除</MenuItem>
    </Menu>
  )}
</div>`}</Code>
      <PropsTable
        rows={[
          { name: 'Menu · onClose', type: '() => void', desc: '外側クリック / キー入力 / 項目選択で呼ばれる' },
          { name: 'Menu · align', type: `'left' | 'right'`, def: `'right'`, desc: 'トリガーに対する寄せ方向' },
          { name: 'Menu · className', type: 'string', desc: 'パネルへの追加クラス' },
          { name: 'MenuItem · icon', type: 'ReactNode', desc: '行頭アイコン' },
          { name: 'MenuItem · danger', type: 'boolean', def: 'false', desc: '破壊的操作は赤系' },
          { name: 'MenuItem · onClick', type: '() => void', desc: '選択時の処理 (選択後に自動で閉じる)' },
        ]}
      />
    </Doc>
  );
}
