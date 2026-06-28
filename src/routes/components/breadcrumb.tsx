import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Breadcrumb, Icon, type BreadcrumbItem } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/breadcrumb')({
  component: BreadcrumbPage,
});

const PATH = ['すべて', '仕事', 'プロジェクト A'];

function BreadcrumbPage() {
  const [depth, setDepth] = useState(PATH.length);
  const items: BreadcrumbItem[] = PATH.slice(0, depth).map((label, i) => ({
    key: label,
    label,
    icon: i === 0 ? <Icon name="folder" size={16} /> : undefined,
    current: i === depth - 1,
    onClick: () => setDepth(i + 1),
  }));

  return (
    <Doc title="Breadcrumb" lede="階層ナビ。各段クリックで遷移し、区切りはシェブロン。highlight / data でドラッグ&ドロップのドロップ先などにも転用できる。">
      <Demo>
        <Breadcrumb items={items} />
      </Demo>
      <Code>{`const items: BreadcrumbItem[] = path.map((f, i) => ({
  key: f.id,
  label: f.name,
  current: i === path.length - 1,
  onClick: () => navigate(f.id),
}));

<Breadcrumb items={items} />`}</Code>
      <PropsTable
        rows={[
          { name: 'items', type: 'BreadcrumbItem[]', desc: 'key / label / icon? / current? / onClick? / highlight? / data?' },
          { name: 'item.current', type: 'boolean', desc: '現在地 (強調・aria-current)' },
          { name: 'item.highlight', type: 'boolean', desc: '一時的な強調 (ドロップ先など)' },
          { name: 'item.data', type: 'Record<string,string>', desc: '各段へ付与する属性 (data-* など)' },
        ]}
      />
    </Doc>
  );
}
