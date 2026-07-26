/**
 * リンク URL の正規化。エディタが作るリンクは必ずここを通す。
 *
 * - スキームを省略した入力 (`example.com`) は https 扱いにする
 * - `javascript:` `data:` など、押した瞬間にスクリプトが動く形式は弾く
 * - 妥当なときは入力された文字列をそのまま返す
 *   (`new URL().toString()` は末尾スラッシュを足すなど見た目を変えてしまうため)
 */
export function normalizeLinkUrl(raw: string): string | null {
  const value = raw.trim();
  if (value === '') return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  return candidate;
}

/** リンクとして解釈できる文字列か */
export function isValidLinkUrl(raw: string): boolean {
  return normalizeLinkUrl(raw) !== null;
}

/**
 * リンクノードに必ず付ける属性。
 * エディタから貼ったリンクは行き先を問わず別タブで開く
 * (書きかけのメモを離れずに済むように)。rel はタブ乗っ取り対策。
 */
export const LINK_ATTRIBUTES = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;
