import { $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import { CHECK_LIST, UNORDERED_LIST } from '@lexical/markdown';
import type { ElementTransformer } from '@lexical/markdown';
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
  $getNearestNodeFromDOMNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '../../lib/cn';
import { EditorToolbar } from './EditorToolbar';
import { ImageConfigContext } from './ImageContext';
import type { ImageConfig, ImageUploadResult } from './ImageContext';
import { ImageDropZone } from './ImageDropZone';
import { ImageNode } from './ImageNode';
import { ImagePlugin } from './ImagePlugin';
import { $blocksToNodes, $nodesToBlocks } from './lexical-blocks';
import styles from './RichTextEditor.module.css';
import type { EditorBlock, EditorImage } from './types';
import { MAX_INDENT } from './types';

export type { EditorBlock, EditorBlockType, EditorImage } from './types';
export type { ImageUploadResult } from './ImageContext';
export { MAX_INDENT, createEditorBlock } from './types';

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
 * マークダウン風ショートカット:
 * 見出し (H1/H2/H3) / 箇条書き / チェックボックス / 仕切り線 のみ有効化。
 */
const TRANSFORMERS = [HEADING_H1_H2_H3, HORIZONTAL_RULE, UNORDERED_LIST, CHECK_LIST];

/** Tab でのインデントはリスト / チェックボックス内のみ許可する (段落は対象外) */
function $selectionInList(): boolean {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return false;
  return $findMatchingParent(selection.anchor.getNode(), $isListItemNode) != null;
}

const theme = {
  paragraph: styles.paragraph,
  heading: { h1: styles.h1, h2: styles.h2, h3: styles.h3 },
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

  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace,
      theme,
      nodes: [HeadingNode, ListNode, ListItemNode, HorizontalRuleNode, ImageNode],
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
        {/* ドロップは本文だけでなくエディタ全体で受ける (下部の余白に落としても入る) */}
        <div ref={editorRef} className={cn(styles.editor, className)}>
          <EditorToolbar />
          <EditorBody placeholder={placeholder} />
          <ImageDropZone containerRef={editorRef} />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        {/* チェックボックスのトグル時に li にフォーカスを移さない (モバイルで
            意図しないスクロールが走るのを避ける) */}
        <CheckListPlugin disableTakeFocusOnClick />
        <HorizontalRulePlugin />
        <TabIndentationPlugin maxIndent={MAX_INDENT} $canIndent={$selectionInList} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <SyncPlugin onChange={onChange} />
        <AutoFocusEndPlugin enabled={autoFocusEnd ?? false} />
        <ChecklistCaretFix />
        <ImagePlugin />
      </ImageConfigContext.Provider>
    </LexicalComposer>
  );
}
