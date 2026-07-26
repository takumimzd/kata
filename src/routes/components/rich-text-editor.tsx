import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  createBookmarkBlock,
  createEditorBlock,
  LinkPreviewCard,
  RichTextEditor,
  type EditorBlock,
  type EditorImage,
  type ImageUploadResult,
} from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/rich-text-editor')({
  component: RichTextEditorPage,
});

/**
 * デモ用の擬似アップロード。
 * 実アプリでは R2 などに送って ID を受け取るところを、ここでは
 * objectURL をメモリ上の表に持たせて ID として振る舞わせている。
 */
function useDemoImageStore() {
  const store = useRef(new Map<string, string>());

  const upload = async (file: File): Promise<ImageUploadResult> => {
    const url = URL.createObjectURL(file);
    const bitmap = await createImageBitmap(file);
    const id = `demo-${store.current.size + 1}`;
    store.current.set(id, url);
    // アップロードにかかる時間を模して、待っている見た目を確認できるようにする
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { id, naturalWidth: bitmap.width, naturalHeight: bitmap.height };
  };

  const resolve = (image: EditorImage) => store.current.get(image.id) ?? '';

  return { upload, resolve };
}

function initialBlocks(): EditorBlock[] {
  return [
    createEditorBlock('h1', '買い物メモ'),
    createEditorBlock('p', 'Markdown 風に「# 」や「- 」「[] 」で書式が切り替わる。'),
    createEditorBlock('li', '牛乳'),
    createEditorBlock('li', 'パン'),
    createEditorBlock('todo', '卵を買う', true),
    createEditorBlock('todo', 'コーヒー豆を買う', false),
    createEditorBlock('hr'),
    createEditorBlock('h3', 'メモ'),
    createEditorBlock('p', '「### 」で H3、「--- 」で仕切り線を挿入できる。'),
    linkBlock(),
    createBookmarkBlock('https://example.com/articles/kata'),
  ];
}

/** テキストリンクを含む段落 (spans に link を持たせると 1 つのリンクとして復元される) */
function linkBlock(): EditorBlock {
  const spans = [
    { text: 'リンクは ' },
    { text: '[表示テキスト](URL)', link: 'https://example.com' },
    { text: ' か、テキストを選んでツールバーの鎖アイコンから。' },
  ];
  return {
    ...createEditorBlock('p', spans.map((s) => s.text).join('')),
    spans,
  };
}

function RichTextEditorPage() {
  // Lexical / contentEditable は SSR しないようマウント後にのみ描画する
  const [mounted, setMounted] = useState(false);
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const images = useDemoImageStore();
  useEffect(() => setMounted(true), []);

  return (
    <Doc
      title="RichTextEditor"
      lede="Lexical ベースのブロックエディタ。見出し (H1/H2/H3) / 箇条書き / チェックボックス / 仕切り線 / ネスト / 画像 / リンクに対応。リンクは「URL のまま / テキストリンク / カード」の 3 通りから選べる。外部とは EditorBlock[] でやり取りし、Lexical 依存は内部に閉じている。"
    >
      <Demo>
        {/* エディタ自体は枠を持たないので、デモでは高さ付きの枠ボックスに収める */}
        <div
          style={{
            height: 360,
            display: 'flex',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}
        >
          {mounted && (
            <RichTextEditor
              value={blocks}
              onChange={setBlocks}
              placeholder="入力してください"
              resolveImageUrl={images.resolve}
              onUploadImage={images.upload}
              renderBookmark={(bookmark) => (
                <LinkPreviewCard
                  preview={{
                    url: bookmark.url,
                    title: '型 (kata) — 個人開発のためのデザインシステム',
                    description: 'カードの中身 (OGP の取得) はアプリ側の責務。ここではダミーを返している。',
                  }}
                />
              )}
            />
          )}
        </div>
      </Demo>
      <Code>{`const [blocks, setBlocks] = useState<EditorBlock[]>(() => [
  createEditorBlock('h1', '買い物メモ'),
  createEditorBlock('todo', '卵を買う', true),
]);

<RichTextEditor
  value={blocks}
  onChange={setBlocks}
  placeholder="入力してください"
  // 画像機能は resolveImageUrl と onUploadImage が揃ったときだけ有効になる
  resolveImageUrl={(image) => \`/api/images/\${image.id}\`}
  onUploadImage={async (file) => {
    const { id, width, height } = await uploadToServer(file);
    return { id, naturalWidth: width, naturalHeight: height };
  }}
  // カード表示の中身。OGP の取得はアプリ側で行い、見た目だけ返す
  renderBookmark={({ url }) => <LinkPreviewCard preview={ogpOf(url)} />}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'value', type: 'EditorBlock[]', desc: '初期ブロック (マウント時のみ反映)' },
          { name: 'onChange', type: '(blocks: EditorBlock[]) => void', desc: '編集内容のコールバック' },
          { name: 'placeholder', type: 'string', desc: '空のときの表示' },
          { name: 'autoFocusEnd', type: 'boolean', def: 'false', desc: 'マウント後に末尾へフォーカス' },
          { name: 'namespace', type: 'string', desc: '複数エディタの区別用' },
          { name: 'className', type: 'string', desc: '枠への追加クラス' },
          {
            name: 'resolveImageUrl',
            type: '(image: EditorImage) => string',
            desc: '画像 ID から表示 URL を解決する',
          },
          {
            name: 'onUploadImage',
            type: '(file: File) => Promise<ImageUploadResult>',
            desc: 'アップロードして実体の情報を返す。resolveImageUrl と揃うと画像機能が有効になる',
          },
          { name: 'onImageError', type: '(error: unknown) => void', desc: 'アップロード失敗の通知' },
          { name: 'maxImagesPerInsert', type: 'number', def: '8', desc: '1 回に受け付ける最大枚数' },
          {
            name: 'renderBookmark',
            type: '(bookmark: EditorBookmark) => ReactNode',
            desc: 'カード表示 (bookmark ブロック) の中身。未指定なら URL だけの素朴なカードになる',
          },
        ]}
      />
    </Doc>
  );
}
