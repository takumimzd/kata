import { $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import { CHECK_LIST, UNORDERED_LIST } from '@lexical/markdown';
import type { ElementTransformer } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { $createHeadingNode, $isHeadingNode, HeadingNode } from '@lexical/rich-text';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { $findMatchingParent } from '@lexical/utils';
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '../../lib/cn';
import { EditorToolbar } from './EditorToolbar';
import { $blocksToNodes, $nodesToBlocks } from './lexical-blocks';
import styles from './RichTextEditor.module.css';
import type { EditorBlock } from './types';
import { MAX_INDENT } from './types';

export type { EditorBlock, EditorBlockType } from './types';
export { MAX_INDENT, createEditorBlock } from './types';

/** 見出しは H1 / H2 のみ対応する独自トランスフォーマー (`# `, `## `) */
const HEADING_H1_H2: ElementTransformer = {
  dependencies: [HeadingNode],
  export: (node, exportChildren) => {
    if (!$isHeadingNode(node)) return null;
    const level = Number(node.getTag().slice(1));
    return `${'#'.repeat(level)} ${exportChildren(node)}`;
  },
  regExp: /^(#{1,2})\s/,
  replace: (parentNode, children, match) => {
    const node = $createHeadingNode(match[1]?.length === 1 ? 'h1' : 'h2');
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  },
  type: 'element',
};

/** マークダウン風ショートカット: 見出し(H1/H2) / 箇条書き / チェックボックスのみ有効化 */
const TRANSFORMERS = [HEADING_H1_H2, UNORDERED_LIST, CHECK_LIST];

/** Tab でのインデントはリスト / チェックボックス内のみ許可する (段落は対象外) */
function $selectionInList(): boolean {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return false;
  return $findMatchingParent(selection.anchor.getNode(), $isListItemNode) != null;
}

const theme = {
  paragraph: styles.paragraph,
  heading: { h1: styles.h1, h2: styles.h2 },
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
        if (e.target !== e.currentTarget) return;
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
}: RichTextEditorProps) {
  // 初期状態の構築はマウント時の value のみを使う (以後は Lexical が真実の状態)
  const initialBlocksRef = useRef(value);
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace,
      theme,
      nodes: [HeadingNode, ListNode, ListItemNode],
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
      <div className={cn(styles.editor, className)}>
        <EditorToolbar />
        <EditorBody placeholder={placeholder} />
      </div>
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin maxIndent={MAX_INDENT} $canIndent={$selectionInList} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <SyncPlugin onChange={onChange} />
      <AutoFocusEndPlugin enabled={autoFocusEnd ?? false} />
    </LexicalComposer>
  );
}
