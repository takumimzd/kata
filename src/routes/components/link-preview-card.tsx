import { createFileRoute } from '@tanstack/react-router';
import { LinkPreviewCard } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/link-preview-card')({
  component: LinkPreviewCardPage,
});

/** デモ用のダミー og:image (外部通信なしで見た目を確認できるよう data URI にしてある) */
const SAMPLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628">
     <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stop-color="#6f7bd8"/><stop offset="1" stop-color="#2f3350"/>
     </linearGradient></defs>
     <rect width="1200" height="628" fill="url(#g)"/>
     <text x="60" y="340" font-family="sans-serif" font-size="84" fill="#fff">kata</text>
   </svg>`,
)}`;

function LinkPreviewCardPage() {
  return (
    <Doc
      title="LinkPreviewCard"
      lede="リンクの OGP (画像・タイトル・説明) を出すカード。取得は行わず、渡された値を表示するだけの部品。リンクは常に別タブで開く。"
    >
      <Demo>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ width: 320 }}>
            <LinkPreviewCard
              preview={{
                url: 'https://example.com/articles/kata',
                title: '型 (kata) — 個人開発のためのデザインシステム',
                description:
                  '同じ手ざわりのアプリを何本も作るための、トークンと部品の集まり。CSS Modules + tsx のまま配る。',
                imageUrl: SAMPLE_IMAGE,
              }}
            />
          </div>
          <div style={{ width: 320 }}>
            <LinkPreviewCard
              preview={{
                url: 'https://example.com/notes/no-image',
                title: '画像が取れなかったとき',
                description: 'og:image が無ければテキストだけのカードになる。',
              }}
            />
          </div>
        </div>
      </Demo>
      <Code>{`<LinkPreviewCard
  preview={{ url, title, description, imageUrl }}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'preview.url', type: 'string', desc: 'リンク先 (カードを押すと別タブで開く)' },
          { name: 'preview.title', type: 'string?', desc: 'og:title。無いときはホスト名を見出しにする' },
          { name: 'preview.description', type: 'string?', desc: 'og:description (2 行で省略)' },
          { name: 'preview.imageUrl', type: 'string?', desc: 'og:image。無い/読めないときは画像なしの形' },
          { name: 'className', type: 'string?', desc: '外側の a に足すクラス' },
        ]}
      />
    </Doc>
  );
}
