/** エディタが扱うブロックの書式種別 */
export type EditorBlockType = 'p' | 'h1' | 'h2' | 'li' | 'todo';

/** li / todo のネスト階層の最大深さ */
export const MAX_INDENT = 6;

/**
 * リッチテキストの 1 行 (1 ブロック)。
 * エディタの入出力フォーマットで、特定のドメインには依存しない。
 */
export interface EditorBlock {
  id: string;
  type: EditorBlockType;
  text: string;
  /** todo ブロックの完了状態 (他の種別では常に false) */
  checked: boolean;
  /** li / todo のネスト深さ (0 = 最上位)。ネスト不可の種別では常に 0 */
  indent: number;
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
