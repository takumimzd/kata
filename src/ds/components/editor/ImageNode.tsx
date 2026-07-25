// ============================================================
//  kata — 画像ブロックの Lexical ノード
//  画像の実体は持たず ID だけを保持し、URL への解決は
//  RichTextEditor の resolveImageUrl に委ねる。
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
import { ImageView } from './ImageView';
import styles from './ImageView.module.css';
import type { EditorImage } from './types';
import { clampImageWidthPct } from './types';

export interface SerializedImageNode extends SerializedLexicalNode {
  /** null はアップロード未完了。エディタ間のコピペでは実体が無いので落とす */
  image: EditorImage | null;
}

/**
 * 本文中の画像 1 枚。
 *
 * `__image` が null の間は「アップロード中 (未確定)」を表し、
 * lexical-blocks の $nodesToBlocks はこの状態のノードを出力しない。
 * これによりアップロード完了前の画像が利用側の自動保存に乗ることを防ぐ。
 */
export class ImageNode extends DecoratorNode<ReactNode> {
  /** 確定済みの画像情報。null = アップロード中 */
  __image: EditorImage | null;
  /** アップロード中に見せるローカルプレビュー (objectURL) */
  __previewUrl: string | null;

  static getType(): string {
    return 'kata-image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__image, node.__previewUrl, node.__key);
  }

  constructor(image: EditorImage | null, previewUrl: string | null = null, key?: NodeKey) {
    super(key);
    this.__image = image;
    this.__previewUrl = previewUrl;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(null).updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    const self = super.updateFromJSON(serializedNode);
    const image = serializedNode.image;
    self.__image = image
      ? { ...image, widthPct: clampImageWidthPct(image.widthPct) }
      : null;
    return self;
  }

  exportJSON(): SerializedImageNode {
    return { ...super.exportJSON(), image: this.__image };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = styles.host ?? '';
    return div;
  }

  updateDOM(): false {
    // 中身は React (ImageView) が描くので DOM を作り直す必要はない
    return false;
  }

  isInline(): false {
    return false;
  }

  /** 画像情報 (アップロード中は null) */
  getImage(): EditorImage | null {
    return this.getLatest().__image;
  }

  getPreviewUrl(): string | null {
    return this.getLatest().__previewUrl;
  }

  /** アップロード完了時に呼ぶ。ここで初めて $nodesToBlocks の出力対象になる */
  setImage(image: EditorImage): this {
    const self = this.getWritable();
    self.__image = { ...image, widthPct: clampImageWidthPct(image.widthPct) };
    self.__previewUrl = null;
    return self;
  }

  /** 表示幅 (%) の変更。アップロード中は何もしない */
  setWidthPct(widthPct: number): this {
    const self = this.getWritable();
    if (self.__image) {
      self.__image = { ...self.__image, widthPct: clampImageWidthPct(widthPct) };
    }
    return self;
  }

  decorate(): ReactNode {
    // ノードが dirty になるたび decorate が呼ばれるので、
    // 状態は props で渡してしまう (ImageView 側での購読が不要になる)
    return <ImageView nodeKey={this.getKey()} image={this.__image} previewUrl={this.__previewUrl} />;
  }

  /** 画像は本文テキストに含めない (タイトルや検索に混ざらないようにする) */
  getTextContent(): string {
    return '';
  }
}

export function $createImageNode(image: EditorImage | null, previewUrl: string | null = null): ImageNode {
  return new ImageNode(image, previewUrl);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
