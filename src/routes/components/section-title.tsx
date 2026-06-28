import { createFileRoute } from '@tanstack/react-router';
import { Button, SectionTitle } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/section-title')({
  component: SectionTitlePage,
});

function SectionTitlePage() {
  return (
    <Doc title="SectionTitle" lede="ラベルとヘアライン罫からなるセクション見出し。右側に補足やアクションを置ける。">
      <Demo>
        <SectionTitle meta="12 件" action={<Button variant="mini">追加</Button>}>
          最近の記録
        </SectionTitle>
      </Demo>
      <Code>{`<SectionTitle meta="12 件" action={<Button variant="mini">追加</Button>}>
  最近の記録
</SectionTitle>`}</Code>
      <PropsTable
        rows={[
          { name: 'children', type: 'ReactNode', desc: '見出しテキスト' },
          { name: 'meta', type: 'ReactNode', desc: '右側の補足' },
          { name: 'action', type: 'ReactNode', desc: '右端のアクション' },
        ]}
      />
    </Doc>
  );
}
