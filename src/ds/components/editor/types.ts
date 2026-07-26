/** エディタが扱うブロックの書式種別 */
export type EditorBlockType = 'p' | 'h1' | 'h2' | 'h3' | 'hr' | 'li' | 'todo' | 'image';

/** li / todo のネスト階層の最大深さ */
export const MAX_INDENT = 6;

/** 画像の表示幅 (本文カラム幅に対する %) の下限・上限と刻み */
export const MIN_IMAGE_WIDTH_PCT = 10;
export const MAX_IMAGE_WIDTH_PCT = 100;
export const IMAGE_WIDTH_STEP_PCT = 5;

/**
 * 画像ブロックの中身。
 * 実体をどこに保存するかはアプリ側の責務なので、ここでは ID しか持たない
 * (ID から表示 URL への変換は RichTextEditor の resolveImageUrl に委ねる)。
 */
export interface EditorImage {
  id: string;
  /** 元画像の実寸。読み込み前にアスペクト比を確保するために使う */
  naturalWidth: number;
  naturalHeight: number;
  /**
   * 表示幅。本文カラム幅に対する % (10–100)。
   * px ではなく % なのは、同じ内容をスマホ幅と広い画面の双方で開くため。
   */
  widthPct: number;
  alt: string;
}

/** 文字装飾を持つ本文の断片 */
export interface EditorSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  /**
   * リンク先 URL。設定された断片はリンクとして表示され、常に別タブで開く。
   * 隣り合う同じ URL の断片は 1 つのリンクとして復元される。
   */
  link?: string;
}

/**
 * リッチテキストの 1 行 (1 ブロック)。
 * エディタの入出力フォーマットで、特定のドメインには依存しない。
 */
export interface EditorBlock {
  id: string;
  type: EditorBlockType;
  /**
   * 装飾を除いた素のテキスト。spans があるときはその連結と必ず一致する。
   * 利用側がタイトルやプレビュー、検索に使うのはこちら。
   */
  text: string;
  /** todo ブロックの完了状態 (他の種別では常に false) */
  checked: boolean;
  /** li / todo のネスト深さ (0 = 最上位)。ネスト不可の種別では常に 0 */
  indent: number;
  /** type === 'image' のときだけ入る */
  image?: EditorImage;
  /**
   * 装飾つきの本文。装飾が 1 つも無いブロックでは持たない
   * (既存データをそのまま読めるようにするため任意項目にしてある)。
   */
  spans?: EditorSpan[];
}

/** spans を連結した素のテキスト */
export function spansToText(spans: EditorSpan[]): string {
  return spans.map((span) => span.text).join('');
}

/** 装飾が 1 つでも付いているか (spans を持たせるかの判断に使う) */
export function hasInlineFormat(spans: EditorSpan[]): boolean {
  return spans.some(
    (span) => span.bold === true || span.italic === true || span.link !== undefined,
  );
}

let uidCounter = 0;

/**
 * ブロック ID 生成。非 HTTPS 環境 (LAN 上のスマホ確認など) でも
 * 動かしたいので crypto.randomUUID には依存しない。
 */
function uid(): string {
  uidCounter += 1;
  return `b${Date.now().toString(36)}${uidCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function createEditorBlock(
  type: EditorBlockType = 'p',
  text = '',
  checked = false,
  indent = 0,
): EditorBlock {
  return { id: uid(), type, text, checked, indent };
}

/**
 * 画像ブロックを作る。
 * text は常に空にしておく: 利用側がタイトルやプレビューを text から導出しても
 * 画像が混ざらないようにするため。
 */
export function createImageBlock(image: EditorImage): EditorBlock {
  return { id: uid(), type: 'image', text: '', checked: false, indent: 0, image };
}

/** 表示幅を有効範囲に丸める */
export function clampImageWidthPct(value: number): number {
  if (!Number.isFinite(value)) return MAX_IMAGE_WIDTH_PCT;
  return Math.min(MAX_IMAGE_WIDTH_PCT, Math.max(MIN_IMAGE_WIDTH_PCT, Math.round(value)));
}
