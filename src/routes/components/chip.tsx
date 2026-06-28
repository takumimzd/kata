import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Chip, ChipGroup, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/chip')({
  component: ChipPage,
});

const ITEMS = ['筋トレ', '読書', 'ブログ', 'プロテイン'];

function ChipPage() {
  const [active, setActive] = useState('読書');
  return (
    <Doc title="Chip" lede="角丸の小ボタン・タグ。クイック追加やフィルタに。ChipGroup で折り返して並べる。">
      <Demo>
        <ChipGroup>
          {ITEMS.map((it) => (
            <Chip key={it} active={active === it} onClick={() => setActive(it)}>
              <Icon name="plus" size={14} />
              {it}
            </Chip>
          ))}
        </ChipGroup>
      </Demo>
      <Code>{`<ChipGroup>
  <Chip active={active === 'x'} onClick={...}>
    <Icon name="plus" size={14} />ラベル
  </Chip>
</ChipGroup>`}</Code>
      <PropsTable
        rows={[
          { name: 'active', type: 'boolean', def: 'false', desc: '選択中の見た目' },
          { name: 'children', type: 'ReactNode', desc: 'アイコン + ラベル' },
          { name: '...rest', type: 'button 属性', desc: 'onClick / disabled など' },
          { name: 'ChipGroup', type: '—', desc: 'チップを折り返して並べる行' },
        ]}
      />
    </Doc>
  );
}
