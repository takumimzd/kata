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

/** 素の本文から拾う URL。誤検出を避けるためスキームつきのものだけを見る */
const URL_IN_TEXT = /https?:\/\/[^\s<>"'`]+/g

/** URL の末尾に紛れ込みやすい句読点・閉じ括弧 */
const URL_TAIL = /[.,;:!?'"、。，．）】」』〕>\]]/;

function countOf(value: string, char: string): number {
  let count = 0;
  for (const c of value) if (c === char) count += 1;
  return count;
}

/**
 * 「詳しくは https://example.com/a。」のように地の文へ続けて書かれた URL から、
 * 末尾の句読点を落とした長さを返す。
 * 閉じ括弧は対になる開き括弧があるときだけ URL の一部として残す。
 */
function urlLengthWithoutTail(raw: string): number {
  let end = raw.length;
  while (end > 0) {
    const last = raw[end - 1] ?? '';
    if (!URL_TAIL.test(last)) break;
    const head = raw.slice(0, end);
    if (last === ')' && countOf(head, '(') > countOf(head, ')')) break;
    end -= 1;
  }
  return end;
}

/** テキスト中で見つかった URL の位置 */
export interface UrlMatch {
  url: string;
  /** テキスト内の開始位置 */
  start: number;
  /** テキスト内の終了位置 (この手前まで) */
  end: number;
}

/** テキストに書かれた URL を出現順に返す */
export function findUrlsInText(text: string): UrlMatch[] {
  const out: UrlMatch[] = [];
  for (const match of text.matchAll(URL_IN_TEXT)) {
    const start = match.index;
    if (start === undefined) continue;
    const length = urlLengthWithoutTail(match[0]);
    const url = match[0].slice(0, length);
    if (normalizeLinkUrl(url) === null) continue;
    out.push({ url, start, end: start + length });
  }
  return out;
}

/** offset の位置に掛かっている URL (前後に接していれば拾う) */
export function urlAt(text: string, offset: number): UrlMatch | undefined {
  return findUrlsInText(text).find((m) => offset >= m.start && offset <= m.end);
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
