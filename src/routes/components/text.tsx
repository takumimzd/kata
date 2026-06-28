import { createFileRoute } from '@tanstack/react-router';
import { Text, type TextVariant } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/text')({
  component: TextPage,
});

const SAMPLES: Array<{ v: TextVariant; note: string }> = [
  { v: 'body', note: '標準本文 14px / 500' },
  { v: 'bodyStrong', note: '強調本文 14px / 700' },
  { v: 'sub', note: '副文 13px / text-dim' },
  { v: 'caption', note: 'キャプション 11px / text-faint' },
  { v: 'label', note: 'ラベル 12px / 600 / 字間' },
  { v: 'num', note: '数字 Space Grotesk / tnum' },
];

function TextPage() {
  return (
    <Doc title="Text" lede="アプリで表示する本文系テキストは Text を使う。variant で種類を出し分ける。ページ見出しは PageTitle、セクション見出しは SectionTitle (Text の対象外)。">
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SAMPLES.map((s) => (
            <div key={s.v} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <Text variant={s.v}>{s.v === 'num' ? '1,280' : 'あいうえお Aa 123'}</Text>
              <Text variant="caption">{s.note}</Text>
            </div>
          ))}
        </div>
      </Demo>
      <Code>{`<Text variant="body">本文</Text>
<Text variant="sub" as="p">副文の段落</Text>
<Text variant="num">1,280</Text>`}</Code>
      <PropsTable
        rows={[
          { name: 'variant', type: `'body' | 'bodyStrong' | 'sub' | 'caption' | 'label' | 'num'`, def: `'body'`, desc: 'テキストの種類' },
          { name: 'as', type: 'ElementType', def: `'span'`, desc: '描画する要素 (p / div など)' },
          { name: '...rest', type: 'HTML属性', desc: 'className / onClick など' },
        ]}
      />
    </Doc>
  );
}
