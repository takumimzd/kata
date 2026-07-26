import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { EditorBookmark } from './types';

/**
 * ブックマーク (OGP カード) の描画設定。
 * OGP の取得はアプリ側の責務なので、カードの中身は renderBookmark に委ねる。
 * DecoratorNode の decorate() には props を渡せないため context 経由で配る。
 */
export interface BookmarkConfig {
  renderBookmark: (bookmark: EditorBookmark) => ReactNode;
}

export const BookmarkConfigContext = createContext<BookmarkConfig | null>(null);

/** カードの中身を描く関数 (未指定なら null = 既定の見た目にフォールバック) */
export function useBookmarkConfig(): BookmarkConfig | null {
  return useContext(BookmarkConfigContext);
}
