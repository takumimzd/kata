import { createFileRoute } from '@tanstack/react-router';
import { GoalBar } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/goal-bar')({
  component: GoalBarPage,
});

function GoalBarPage() {
  const km = (v: number) => `${v}km`;
  return (
    <Doc
      title="GoalBar"
      lede="ラベル + 現在値/目標 + 状態ワード + ProgressBar の定番構成。min (これ以上で達成) / max (これ以下をキープ) / 両方 (範囲) に対応。"
    >
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
          <GoalBar label="今週のランニング" value={8} min={15} achieved={false} over={false} ratio={8 / 15} format={km} />
          <GoalBar label="今週のランニング" value={16} min={15} achieved over={false} ratio={1} format={km} />
          <GoalBar label="今月の外食" value={2} max={4} achieved over={false} ratio={2 / 4} format={(v) => `${v}回`} />
          <GoalBar label="今月の外食" value={6} max={4} achieved={false} over ratio={1} format={(v) => `${v}回`} />
          <GoalBar label="今日の睡眠" value={7} min={6} max={9} achieved over={false} ratio={7 / 9} format={(v) => `${v}時間`} />
        </div>
      </Demo>
      <Code>{`<GoalBar
  label="今週のランニング"
  value={8}
  min={15}              // これ以上で達成 (max はこれ以下をキープ)
  achieved={false}
  over={false}
  ratio={8 / 15}
  format={(v) => \`\${v}km\`}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'label', type: 'string', desc: '左上のラベル' },
          { name: 'value', type: 'number', desc: '現在値' },
          { name: 'min / max', type: 'number | null', desc: '下限目標 / 上限目標 (どちらか、または両方)' },
          { name: 'achieved / over', type: 'boolean', desc: '達成 / 上限超過' },
          { name: 'ratio', type: 'number', desc: '進捗率 0〜1' },
          { name: 'format', type: '(v) => string', def: 'String', desc: '値の整形 (単位付与など)' },
        ]}
      />
    </Doc>
  );
}
