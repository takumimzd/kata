import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Icon, TabBar, type TabBarItem } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/tab-bar')({
  component: TabBarPage,
});

function TabBarPage() {
  const [current, setCurrent] = useState<string>('overview');
  const items: TabBarItem[] = [
    { key: 'overview', label: '概要', icon: <Icon name="home" size={20} />, active: current === 'overview' },
    { key: 'principles', label: '特徴', icon: <Icon name="book" size={20} />, active: current === 'principles' },
    { key: 'tokens', label: 'トークン', icon: <Icon name="chart" size={20} />, active: current === 'tokens' },
    { key: 'components', label: '部品', icon: <Icon name="note" size={20} />, active: current === 'components' },
  ];

  return (
    <Doc
      title="TabBar"
      lede="モバイルのボトムタブや、画面内の水平タブ列に使う。リンクの実体は SideNav と同じく renderItem で委譲し、ルーター非依存。"
    >
      <Demo>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 380,
            height: 200,
            background: 'var(--bg-2)',
            border: '1px dashed var(--line-2)',
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            color: 'var(--text-faint)',
            fontFamily: 'var(--num)',
            fontSize: 12,
          }}
        >
          <span>画面内容 (dummy) · 選択中: {current}</span>
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
            <TabBar items={items} onSelect={setCurrent} variant="floating" ariaLabel="デモ用タブ" />
          </div>
        </div>
        <div style={{ marginTop: 20, maxWidth: 380 }}>
          <TabBar items={items} onSelect={setCurrent} variant="flat" ariaLabel="flat variant" />
        </div>
      </Demo>
      <Code>{`const items: TabBarItem[] = [
  { key: 'home', label: '概要', icon: <Icon name="home" />, active: tab === 'home' },
  { key: 'components', label: '部品', icon: <Icon name="note" />, active: tab === 'components' },
];

// button 実装 (onSelect)
<TabBar items={items} onSelect={setTab} />

// ルーターの <Link> に委譲する
<TabBar
  items={items}
  renderItem={(item, ctx) => (
    <Link to={pathOf(item.key)} className={ctx.className}>{ctx.content}</Link>
  )}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'items', type: 'TabBarItem[]', desc: '{ key, label?, icon?, active?, disabled? }' },
          { name: 'renderItem', type: '(item, ctx) => ReactNode', desc: '<Link> などで包む描画関数 (省略時は button)' },
          { name: 'onSelect', type: '(key: string) => void', desc: 'button モード時のクリック' },
          { name: 'variant', type: `'floating' | 'flat'`, def: `'floating'`, desc: 'floating=画面下フロート / flat=通常横並び' },
          { name: 'ariaLabel', type: 'string', desc: '<nav> の aria-label' },
        ]}
      />
    </Doc>
  );
}
