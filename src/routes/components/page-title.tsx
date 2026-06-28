import { createFileRoute } from '@tanstack/react-router';
import { PageTitle } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/page-title')({
  component: PageTitlePage,
});

function PageTitlePage() {
  return (
    <Doc title="PageTitle" lede="ページの主見出し (h1)。モバイル 21px / 880px 以上で 24px、weight 700。トップバーや画面ヘッダーに使う。">
      <Demo>
        <PageTitle>Analytics</PageTitle>
      </Demo>
      <Code>{`<PageTitle>Analytics</PageTitle>`}</Code>
      <PropsTable
        rows={[
          { name: 'children', type: 'ReactNode', desc: '見出しテキスト' },
          { name: '...rest', type: 'h1 属性', desc: 'className / id など' },
        ]}
      />
    </Doc>
  );
}
