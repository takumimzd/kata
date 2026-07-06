import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { IconColorPicker, type IconPickerGroup } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/icon-color-picker')({
  component: IconColorPickerPage,
});

const GROUPS: IconPickerGroup[] = [
  { label: 'からだを動かす', icons: ['dumbbell', 'bike', 'shoe', 'mountain', 'bolt', 'heart'] },
  { label: 'たべる・のむ', icons: ['glass', 'coffee', 'drop', 'apple', 'utensils'] },
  { label: 'しるし', icons: ['flame', 'star', 'target', 'trophy', 'check', 'pin'] },
];

const COLORS = ['#c94f4f', '#d1784e', '#c9a227', '#7d9b4e', '#2f9e8f', '#3f8fb5', '#5b76c4', '#9b6dc4'];

function IconColorPickerPage() {
  const [value, setValue] = useState({ icon: 'flame', color: '#d1784e' });

  return (
    <Doc
      title="IconColorPicker"
      lede="アイコンと色をプレビューを見ながら同時に選ぶピッカー。候補 (groups / colors) は利用側が渡す。"
    >
      <Demo>
        <IconColorPicker
          icon={value.icon}
          color={value.color}
          name="ランニング"
          hint="一覧でこの見た目になります"
          groups={GROUPS}
          colors={COLORS}
          onChange={setValue}
        />
      </Demo>
      <Code>{`<IconColorPicker
  icon={icon}
  color={color}
  name={name}
  hint="一覧でこの見た目になります"
  groups={ICON_GROUPS}   // { label, icons: IconName[] }[]
  colors={COLOR_CHOICES}
  onChange={({ icon, color }) => ...}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'icon / color', type: 'string', desc: '選択中の値' },
          { name: 'name', type: 'string', desc: 'プレビューに出す名前' },
          { name: 'placeholder', type: 'string', def: `'名前'`, desc: '名前未入力時のプレビュー表示' },
          { name: 'hint', type: 'string', desc: 'プレビュー下の説明文 (任意)' },
          { name: 'groups', type: 'IconPickerGroup[]', desc: 'アイコン候補 (グループごと)' },
          { name: 'colors', type: 'string[]', desc: '色の候補' },
          { name: 'fallbackIcon', type: 'IconName', def: `'pin'`, desc: '未知のアイコン名のフォールバック' },
          { name: 'onChange', type: '({ icon, color }) => void', desc: '「この見た目にする」で確定' },
        ]}
      />
    </Doc>
  );
}
