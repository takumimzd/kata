import { $createLinkNode, $isLinkNode, LinkNode } from '@lexical/link';
import { $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import {
  BOLD_ITALIC_STAR,
  BOLD_STAR,
  CHECK_LIST,
  ITALIC_STAR,
  UNORDERED_LIST,
} from '@lexical/markdown';
import type { ElementTransformer, TextMatchTransformer } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { $createHeadingNode, $isHeadingNode, HeadingNode } from '@lexical/rich-text';
import type { HeadingTagType } from '@lexical/rich-text';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { $findMatchingParent } from '@lexical/utils';
import {
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { BookmarkConfigContext } from './BookmarkContext';
import type { BookmarkConfig } from './BookmarkContext';
import { BookmarkNode } from './BookmarkNode';
import { EditorToolbar } from './EditorToolbar';
import { ImageConfigContext } from './ImageContext';
import type { ImageConfig, ImageUploadResult } from './ImageContext';
import { ImageDropZone } from './ImageDropZone';
import { ImageNode } from './ImageNode';
import { ImagePlugin } from './ImagePlugin';
import { $blocksToNodes, $nodesToBlocks } from './lexical-blocks';
import { isValidLinkUrl, LINK_ATTRIBUTES, normalizeLinkUrl } from './link';
import styles from './RichTextEditor.module.css';
import type { EditorBlock, EditorBookmark, EditorImage } from './types';
import { MAX_INDENT } from './types';

export type {
  EditorBlock,
  EditorBlockType,
  EditorBookmark,
  EditorImage,
  EditorSpan,
} from './types';
export type { ImageUploadResult } from './ImageContext';
export { MAX_INDENT, createBookmarkBlock, createEditorBlock } from './types';
export { findUrlsInText, isValidLinkUrl, normalizeLinkUrl } from './link';

/** 1 回の操作で受け付ける画像の既定枚数 */
const DEFAULT_MAX_IMAGES_PER_INSERT = 8;

/** 見出しは H1 / H2 / H3 のみ対応する独自トランスフォーマー (`# `, `## `, `### `) */
const HEADING_H1_H2_H3: ElementTransformer = {
  dependencies: [HeadingNode],
  export: (node, exportChildren) => {
    if (!$isHeadingNode(node)) return null;
    const level = Number(node.getTag().slice(1));
    return `${'#'.repeat(level)} ${exportChildren(node)}`;
  },
  regExp: /^(#{1,3})\s/,
  replace: (parentNode, children, match) => {
    const level = match[1]?.length ?? 1;
    const tag = `h${Math.min(3, level)}` as HeadingTagType;
    const node = $createHeadingNode(tag);
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  },
  type: 'element',
};

/**
 * 仕切り線 (`---`) を入力したら段落を HorizontalRuleNode に置き換えるトランスフォーマー。
 * ダッシュ 3 つを入力して Enter を押した瞬間に発火する。
 */
const HORIZONTAL_RULE: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node) => ($isHorizontalRuleNode(node) ? '---' : null),
  regExp: /^---\s?$/,
  replace: (parentNode, _children, _match, isImport) => {
    const hr = $createHorizontalRuleNode();
    // 末尾に挿入するときは、続けて書けるよう段落を残したまま前へ差し込む
    if (isImport || parentNode.getNextSibling() != null) {
      parentNode.replace(hr);
    } else {
      parentNode.insertBefore(hr);
    }
    hr.selectNext();
  },
  triggerOnEnter: true,
  type: 'element',
};

/**
 * `[表示テキスト](URL)` をテキストリンクに変換するトランスフォーマー。
 * @lexical/markdown の LINK を使わず自前で持つのは、必ず別タブで開く属性を
 * 付けたいのと、http(s) 以外のスキームを弾きたいため。
 */
const LINK: TextMatchTransformer = {
  dependencies: [LinkNode],
  export: (node) => {
    if (!$isLinkNode(node)) return null;
    return `[${node.getTextContent()}](${node.getURL()})`;
  },
  importRegExp: /\[([^[\]]+)\]\(([^()\s]+)\)/,
  regExp: /\[([^[\]]+)\]\(([^()\s]+)\)$/,
  replace: (textNode, match) => {
    const label = match[1] ?? '';
    const url = normalizeLinkUrl(match[2] ?? '');
    // リンクにできない URL のときは書いた通りの文字列のまま残す
    if (url === null) return;
    const link = $createLinkNode(url, LINK_ATTRIBUTES);
    const inner = $createTextNode(label);
    inner.setFormat(textNode.getFormat());
    link.append(inner);
    textNode.replace(link);
  },
  trigger: ')',
  type: 'text-match',
};

/**
 * マークダウン風ショートカット:
 * 見出し (H1/H2/H3) / 箇条書き / チェックボックス / 仕切り線 と、
 * 文字装飾 (`**太字**` `*斜体*`)、テキストリンク (`[表示テキスト](URL)`) を有効化。
 * アンダースコア版 (`__` `_`) は普通の文章で誤爆しやすいので入れない。
 */
const TRANSFORMERS = [
  HEADING_H1_H2_H3,
  HORIZONTAL_RULE,
  UNORDERED_LIST,
  CHECK_LIST,
  BOLD_ITALIC_STAR,
  BOLD_STAR,
  ITALIC_STAR,
  LINK,
];

/** Tab でのインデントはリスト / チェックボックス内のみ許可する (段落は対象外) */
function $selectionInList(): boolean {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return false;
  return $findMatchingParent(selection.anchor.getNode(), $isListItemNode) != null;
}

const theme = {
  paragraph: styles.paragraph,
  heading: { h1: styles.h1, h2: styles.h2, h3: styles.h3 },
  text: { bold: styles.bold, italic: styles.italic },
  link: styles.link,
  hr: styles.hr,
  hrSelected: styles.hrSelected,
  list: {
    ul: styles.ul,
    listitem: styles.listItem,
    listitemChecked: styles.checkedItem,
    listitemUnchecked: styles.uncheckedItem,
    nested: { listitem: styles.nestedItem },
  },
};

interface RichTextEditorProps {
  value: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
  /** 空のときに表示するプレースホルダー文言 */
  placeholder?: string;
  /** マウント直後に末尾へオートフォーカスする */
  autoFocusEnd?: boolean;
  /** Lexical の namespace。複数エディタを区別したいときに指定する */
  namespace?: string;
  className?: string;
  /**
   * 画像 ID から表示用 URL を解決する。
   * onUploadImage と揃って指定されたときだけ画像機能が有効になる。
   */
  resolveImageUrl?: (image: EditorImage) => string;
  /** ファイルをアップロードして実体の情報を返す */
  onUploadImage?: (file: File) => Promise<ImageUploadResult>;
  /** アップロードに失敗したときの通知 (トースト表示など) */
  onImageError?: (error: unknown) => void;
  /** 1 回の操作で受け付ける最大枚数 (既定 8) */
  maxImagesPerInsert?: number;
  /**
   * ブックマーク (OGP カード) ブロックの中身を描く。
   * OGP の取得はアプリ側の責務なので、URL からカードの見た目を返してもらう。
   * 未指定のときは URL だけの素朴なカードになる。
   *
   * この関数の参照が変わると表示中のカードが描き直される
   * (OGP が後から届いたときに反映させるため)。毎回作り直したくなければ
   * 呼び出し側で useCallback に包む。
   */
  renderBookmark?: (bookmark: EditorBookmark) => ReactNode;
}

/** 編集状態の変化を EditorBlock[] へ書き戻す */
function SyncPlugin({ onChange }: { onChange: (blocks: EditorBlock[]) => void }) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  return (
    <OnChangePlugin
      ignoreSelectionChange
      onChange={(editorState) => {
        editorState.read(() => onChangeRef.current($nodesToBlocks()));
      }}
    />
  );
}

/** キャレット行を見える位置に収めるときの上下の余白 (px) */
const CARET_SCROLL_MARGIN = 24;

/** 縦にスクロールできる最も近い祖先を探す */
function scrollableAncestor(element: HTMLElement): HTMLElement | null {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node;
    }
  }
  return null;
}

/** キャレットのある行の要素 */
function caretLineElement(root: HTMLElement): HTMLElement | null {
  const selection = root.ownerDocument.defaultView?.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const start = selection.getRangeAt(0).startContainer;
  const element = start.nodeType === Node.TEXT_NODE ? start.parentElement : start;
  if (!(element instanceof HTMLElement) || !root.contains(element)) return null;
  return element;
}

/**
 * 表示領域が縮んだときにキャレットを見える位置へ戻す。
 *
 * モバイルでソフトキーボードが開くと visual viewport が縮み、本文の
 * スクロール領域も同時に縮む。スクロール位置はそのままなので、画面の下寄りを
 * タップして書き始めるとキャレットのある行がキーボードの裏に隠れてしまう。
 */
function KeepCaretVisiblePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const onResize = () => {
      const root = editor.getRootElement();
      // 本文を編集中のときだけ追従する
      if (!root || root.ownerDocument.activeElement !== root) return;
      // 縮んだあとのレイアウトで測りたいので次のフレームまで待つ
      requestAnimationFrame(() => {
        const line = caretLineElement(root);
        if (!line) return;
        const scroller = scrollableAncestor(root);
        if (!scroller) {
          line.scrollIntoView({ block: 'nearest' });
          return;
        }
        // 縁に貼り付くと窮屈なので、上下に少し余白を残して寄せる
        const lineRect = line.getBoundingClientRect();
        const viewRect = scroller.getBoundingClientRect();
        const below = lineRect.bottom - (viewRect.bottom - CARET_SCROLL_MARGIN);
        const above = viewRect.top + CARET_SCROLL_MARGIN - lineRect.top;
        if (below > 0) scroller.scrollTop += below;
        else if (above > 0) scroller.scrollTop -= above;
      });
    };
    viewport.addEventListener('resize', onResize);
    return () => viewport.removeEventListener('resize', onResize);
  }, [editor]);
  return null;
}

/** マウント直後に末尾へキャレットを置く */
function AutoFocusEndPlugin({ enabled }: { enabled: boolean }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      editor.focus(() => {
        editor.update(() => $getRoot().selectEnd());
      });
    }, 60);
    return () => clearTimeout(timer);
  }, [editor, enabled]);
  return null;
}

/** 本文 (スクロール領域)。下の余白クリックで末尾にフォーカスする */
function EditorBody({ placeholder }: { placeholder: string }) {
  const [editor] = useLexicalComposerContext();
  return (
    <div
      className={styles.body}
      onMouseDown={(e) => {
        // 本文 (contenteditable) より下の余白をタップしたときだけ末尾にフォーカス
        // する。横方向の余白 (行の右側など) はブラウザ既定のキャレット配置に任せて、
        // 意図しないメモ末尾へのジャンプを避ける。
        if (e.target !== e.currentTarget) return;
        const contentEl = e.currentTarget.firstElementChild;
        if (contentEl instanceof HTMLElement) {
          const last = contentEl.lastElementChild;
          if (last instanceof HTMLElement && e.clientY <= last.getBoundingClientRect().bottom) {
            return;
          }
        }
        e.preventDefault();
        editor.focus(() => editor.update(() => $getRoot().selectEnd()));
      }}
    >
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={styles.content}
            aria-placeholder={placeholder}
            placeholder={
              placeholder ? <div className={styles.placeholder}>{placeholder}</div> : () => null
            }
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </div>
  );
}

/**
 * iOS Safari 対策。
 * チェックボックス項目 (`role="checkbox"`, `tabindex="-1"` が付いた `<li>`) の
 * マーカーより右側 (テキスト行の末尾など) をタップしたとき、ブラウザ標準の
 * フォーカス処理では li 自体にフォーカスが移り、キャレットが一瞬乗って
 * すぐ消える不具合が出る。ここで pointerdown を捕捉し、対象の項目末尾へ
 * 明示的にキャレットを置くことで安定させる。
 */
function ChecklistCaretFix() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      // テキスト自体 (span 等) 上のタップはブラウザ既定のキャレット配置に任せる。
      // 対象は「行の右端の余白」など li 自体をヒットしたケースだけ。
      if (!(target instanceof HTMLLIElement)) return;
      if (target.getAttribute('role') !== 'checkbox') return;
      const rect = target.getBoundingClientRect();
      const before = window.getComputedStyle(target, '::before');
      const beforeWidth = parseFloat(before.width) || 0;
      // Lexical のチェックリストプラグインがタッチ時に 32px 余分にヒット判定を
      // 広げているのに合わせ、その領域より外側だけ自前で処理する。
      const markerRightEdge = rect.left + beforeWidth + 32;
      if (event.clientX <= markerRightEdge) return;
      event.preventDefault();
      const rootElement = editor.getRootElement();
      editor.update(() => {
        const node = $getNearestNodeFromDOMNode(target);
        if ($isListItemNode(node)) node.selectEnd();
      });
      if (rootElement && rootElement.ownerDocument.activeElement !== rootElement) {
        rootElement.focus({ preventScroll: true });
      }
    };
    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener('pointerdown', onPointerDown, { capture: true });
      }
      if (rootElement !== null) {
        rootElement.addEventListener('pointerdown', onPointerDown, { capture: true });
      }
    });
  }, [editor]);
  return null;
}

/**
 * ブロックベースのリッチテキストエディタ。
 * Lexical への依存はこのモジュール内に閉じており、外部とは EditorBlock[] でやり取りする。
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = '',
  autoFocusEnd,
  namespace = 'kata-rich-text-editor',
  className,
  resolveImageUrl,
  onUploadImage,
  onImageError,
  maxImagesPerInsert = DEFAULT_MAX_IMAGES_PER_INSERT,
  renderBookmark,
}: RichTextEditorProps) {
  // 初期状態の構築はマウント時の value のみを使う (以後は Lexical が真実の状態)
  const initialBlocksRef = useRef(value);
  const editorRef = useRef<HTMLDivElement>(null);

  // 画像の解決とアップロードが揃って初めて画像機能を有効にする。
  // 未指定なら ImagePlugin もツールバーの画像ボタンも出ないため、
  // これまでどおりテキスト専用のエディタとして動く。
  const imageEnabled = resolveImageUrl !== undefined && onUploadImage !== undefined;
  // ハンドラは ref 越しに呼ぶ。呼び出し側がインラインの関数を渡しても
  // context の同一性が保たれ、プラグインの再登録が起きない。
  const handlersRef = useRef({ resolveImageUrl, onUploadImage, onImageError });
  handlersRef.current = { resolveImageUrl, onUploadImage, onImageError };
  const imageConfig = useMemo<ImageConfig | null>(() => {
    if (!imageEnabled) return null;
    return {
      resolveImageUrl: (image) => handlersRef.current.resolveImageUrl?.(image) ?? '',
      onUploadImage: (file) => {
        const upload = handlersRef.current.onUploadImage;
        return upload
          ? upload(file)
          : Promise.reject(new Error('onUploadImage が設定されていません'));
      },
      onImageError: (error) => handlersRef.current.onImageError?.(error),
      maxImagesPerInsert,
    };
  }, [imageEnabled, maxImagesPerInsert]);

  // 画像のハンドラと違い、こちらは ref に隠さず参照をそのまま context に流す。
  // カードの中身は OGP の取得結果で後から変わるので、renderBookmark が
  // 新しくなったことを描画中のカードへ伝える必要がある。
  const bookmarkConfig = useMemo<BookmarkConfig | null>(
    () => (renderBookmark ? { renderBookmark } : null),
    [renderBookmark],
  );

  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace,
      theme,
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        HorizontalRuleNode,
        ImageNode,
        LinkNode,
        BookmarkNode,
      ],
      onError: (error: Error) => {
        throw error;
      },
      editorState: () => {
        const root = $getRoot();
        if (root.getFirstChild() !== null) return;
        for (const node of $blocksToNodes(initialBlocksRef.current)) root.append(node);
      },
    }),
    [namespace],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ImageConfigContext.Provider value={imageConfig}>
        <BookmarkConfigContext.Provider value={bookmarkConfig}>
          {/* ドロップは本文だけでなくエディタ全体で受ける (下部の余白に落としても入る) */}
          <div ref={editorRef} className={cn(styles.editor, className)}>
            <EditorToolbar />
            <EditorBody placeholder={placeholder} />
            <ImageDropZone containerRef={editorRef} />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          {/* リンクは行き先を問わず別タブで開く (書きかけのメモを離れないため) */}
          <LinkPlugin validateUrl={isValidLinkUrl} attributes={LINK_ATTRIBUTES} />
          <ClickableLinkPlugin newTab />
          {/* チェックボックスのトグル時に li にフォーカスを移さない (モバイルで
              意図しないスクロールが走るのを避ける) */}
          <CheckListPlugin disableTakeFocusOnClick />
          <HorizontalRulePlugin />
          <TabIndentationPlugin maxIndent={MAX_INDENT} $canIndent={$selectionInList} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <SyncPlugin onChange={onChange} />
          <AutoFocusEndPlugin enabled={autoFocusEnd ?? false} />
          <ChecklistCaretFix />
          <KeepCaretVisiblePlugin />
          <ImagePlugin />
        </BookmarkConfigContext.Provider>
      </ImageConfigContext.Provider>
    </LexicalComposer>
  );
}
