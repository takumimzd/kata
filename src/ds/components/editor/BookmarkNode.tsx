// ============================================================
//  kata — ブックマーク (OGP カード) ブロックの Lexical ノード
//  持つのは URL だけ。カードに何を描くかは RichTextEditor の
//  renderBookmark (= アプリ側の OGP 取得) に委ねる。
// ============================================================
import { DecoratorNode } from 'lexical';
import type {
  EditorConfig,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';
import type { ReactNode } from 'react';
import { BookmarkView } from './BookmarkView';
import styles from './BookmarkView.module.css';

export interface SerializedBookmarkNode extends SerializedLexicalNode {
  url: string;
}

/** 本文中のリンク 1 件を、カード表示のブロックとして置く */
export class BookmarkNode extends DecoratorNode<ReactNode> {
  __url: string;

  static getType(): string {
    return 'kata-bookmark';
  }

  static clone(node: BookmarkNode): BookmarkNode {
    return new BookmarkNode(node.__url, node.__key);
  }

  constructor(url: string, key?: NodeKey) {
    super(key);
    this.__url = url;
  }

  static importJSON(serializedNode: SerializedBookmarkNode): BookmarkNode {
    return $createBookmarkNode('').updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedBookmarkNode>): this {
    const self = super.updateFromJSON(serializedNode);
    self.__url = serializedNode.url;
    return self;
  }

  exportJSON(): SerializedBookmarkNode {
    return { ...super.exportJSON(), url: this.__url };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = styles.host ?? '';
    return div;
  }

  updateDOM(): false {
    // 中身は React (BookmarkView) が描くので DOM を作り直す必要はない
    return false;
  }

  isInline(): false {
    return false;
  }

  getUrl(): string {
    return this.getLatest().__url;
  }

  decorate(): ReactNode {
    return <BookmarkView nodeKey={this.getKey()} url={this.__url} />;
  }

  /**
   * カードでも URL は読める情報なので本文テキストに含める。
   * 利用側のタイトル・プレビュー・検索が「何のリンクか」を失わずに済む。
   */
  getTextContent(): string {
    return this.__url;
  }
}

export function $createBookmarkNode(url: string): BookmarkNode {
  return new BookmarkNode(url);
}

export function $isBookmarkNode(node: LexicalNode | null | undefined): node is BookmarkNode {
  return node instanceof BookmarkNode;
}
