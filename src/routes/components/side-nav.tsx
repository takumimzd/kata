import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { cn, Icon, SideNav, type SideNavItem, type SideNavLink, type SideNavRenderCtx } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/side-nav')({
  component: SideNavPage,
});

const ITEMS: SideNavItem[] = [
  { key: 'home', to: '#home', label: 'ホーム', icon: <Icon name="home" size={18} /> },
  {
    key: 'records',
    label: '記録',
    icon: <Icon name="note" size={18} />,
    defaultOpen: true,
    children: [
      { key: 'workout', to: '#workout', label: '筋トレ' },
      { key: 'reading', to: '#reading', label: '読書' },
      { key: 'blog', to: '#blog', label: 'ブログ' },
    ],
  },
  { key: 'settings', to: '#settings', label: '設定', icon: <Icon name="settings" size={18} /> },
];

function SideNavPage() {
  // デモではルーター無しでアクティブ状態を再現する
  const [active, setActive] = useState('workout');

  const renderLink = (link: SideNavLink, ctx: SideNavRenderCtx) => (
    <a
      href={link.to}
      className={cn(ctx.className, active === link.key && ctx.activeClassName)}
      onClick={(e) => {
        e.preventDefault();
        setActive(link.key);
      }}
    >
      {ctx.content}
    </a>
  );

  return (
    <Doc title="SideNav" lede="サイドナビ。フラットなリンクに加え、入れ子のアコーディオン (ディレクトリ) に対応する。リンク描画は renderLink に委譲するためルーター非依存。">
      <Demo>
        <div
          style={{
            width: 248,
            maxWidth: '100%',
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            padding: 12,
            minHeight: 280,
            display: 'flex',
          }}
        >
          <SideNav items={ITEMS} renderLink={renderLink} />
        </div>
      </Demo>
      <Code>{`const items: SideNavItem[] = [
  { key: 'home', to: '/', label: 'ホーム', icon: <Icon name="home" size={18} /> },
  { key: 'records', label: '記録', defaultOpen: true, children: [
    { key: 'workout', to: '/workout', label: '筋トレ' },
  ]},
];

<SideNav
  items={items}
  renderLink={(link, ctx) => (
    <Link to={link.to} className={ctx.className}
      activeProps={{ className: cn(ctx.className, ctx.activeClassName) }}>
      {ctx.content}
    </Link>
  )}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'items', type: 'SideNavItem[]', desc: 'リンク or アコーディオングループの配列' },
          { name: 'renderLink', type: '(link, ctx) => ReactNode', desc: 'リンク描画の委譲 (router の Link を返す)' },
          { name: 'footer', type: 'ReactNode', desc: '最下部にピン留めする領域' },
          { name: 'className', type: 'string', desc: 'ルート要素への追加クラス' },
        ]}
      />
    </Doc>
  );
}
