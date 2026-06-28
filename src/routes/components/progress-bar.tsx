import { createFileRoute } from '@tanstack/react-router';
import { ProgressBar } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/progress-bar')({
  component: ProgressBarPage,
});

function ProgressBarPage() {
  return (
    <Doc title="ProgressBar" lede="トラック + フィルの進捗バー。value/max から割合を出す。tone で配色 (達成/途中/超過)。">
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
          <ProgressBar value={3} max={5} tone="progress" />
          <ProgressBar value={5} max={5} tone="accent" />
          <ProgressBar value={7} max={5} tone="over" />
        </div>
      </Demo>
      <Code>{`<ProgressBar value={3} max={5} tone="progress" />`}</Code>
      <PropsTable
        rows={[
          { name: 'value', type: 'number', desc: '現在値' },
          { name: 'max', type: 'number', def: '1', desc: '100% とみなす値' },
          { name: 'tone', type: `'accent' | 'progress' | 'over'`, def: `'accent'`, desc: '配色' },
          { name: 'height', type: 'number', def: '6', desc: '高さ px' },
        ]}
      />
    </Doc>
  );
}
