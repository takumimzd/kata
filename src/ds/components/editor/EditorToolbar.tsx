import { $isLinkNode, $toggleLink } from '@lexical/link';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  $isListItemNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import type { HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import type { BaseSelection } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '../Icon';
import { cn } from '../../lib/cn';
import { useImageConfig } from './ImageContext';
import { INSERT_IMAGES_COMMAND } from './ImagePlugin';
import { $createBookmarkNode } from './BookmarkNode';
import { LinkDialog } from './LinkDialog';
import type { LinkDisplay } from './LinkDialog';
import { LINK_ATTRIBUTES, normalizeLinkUrl, urlAt } from './link';
import styles from './EditorToolbar.module.css';

type ActiveType = 'p' | 'h1' | 'h2' | 'h3' | 'li' | 'todo';

const HEADINGS: { type: HeadingTagType; label: string; name: string }[] = [
  { type: 'h1', label: 'H1', name: '見出し1' },
  { type: 'h2', label: 'H2', name: '見出し2' },
  { type: 'h3', label: 'H3', name: '見出し3' },
];

const LISTS: { type: 'li' | 'todo'; icon: IconName; name: string }[] = [
  { type: 'li', icon: 'list', name: '箇条書き' },
  { type: 'todo', icon: 'todo', name: 'チェックボックス' },
];

/** 選択位置のブロック種別を判定する (editorState.read 内で呼ぶ) */
function $activeType(): ActiveType {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return 'p';
  const anchor = selection.anchor.getNode();
  if ($findMatchingParent(anchor, $isListItemNode)) {
    const list = $getNearestNodeOfType(anchor, ListNode);
    return list?.getListType() === 'check' ? 'todo' : 'li';
  }
  const top = anchor.getKey() === 'root' ? anchor : anchor.getTopLevelElement();
  if (top && $isHeadingNode(top)) {
    const tag = top.getTag();
    return tag === 'h1' ? 'h1' : tag === 'h3' ? 'h3' : 'h2';
  }
  return 'p';
}

/** 選択位置にかかっているリンクの URL (無ければ null。editorState.read 内で呼ぶ) */
function $selectedLinkUrl(): string | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return null;
  const node = $findMatchingParent(selection.anchor.getNode(), $isLinkNode);
  return $isLinkNode(node) ? node.getURL() : null;
}

/**
 * キャレットが乗っている「素の URL」(リンクを張っていない URL 文字列)。
 * 何もせず書いた URL からでも表示を選べるようにするために見る。
 */
function $plainUrlAtCaret(): string | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return null;
  const node = selection.anchor.getNode();
  if (!$isTextNode(node)) return null;
  if ($findMatchingParent(node, $isLinkNode) !== null) return null;
  return urlAt(node.getTextContent(), selection.anchor.offset)?.url ?? null;
}

/**
 * 表示を変える対象 (リンク全体 / キャレット上の素の URL) を選択状態にする。
 * どちらでもなければ、いま選ばれている範囲をそのまま対象にする。
 */
function $selectLinkTarget(): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;
  const link = $findMatchingParent(selection.anchor.getNode(), $isLinkNode);
  if ($isLinkNode(link)) {
    link.select(0, link.getChildrenSize());
    return;
  }
  if (!selection.isCollapsed()) return;
  const node = selection.anchor.getNode();
  if (!$isTextNode(node)) return;
  const match = urlAt(node.getTextContent(), selection.anchor.offset);
  if (match) node.select(match.start, match.end);
}

/** 対象を消し、その位置にブックマーク (カード) ブロックを置く */
function $replaceWithBookmark(url: string): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;
  const top = selection.anchor.getNode().getTopLevelElement();
  selection.removeText();
  const bookmark = $createBookmarkNode(url);
  // 対象だけの段落だったならその段落ごと差し替える (空行を残さない)
  if ($isParagraphNode(top) && top.getTextContentSize() === 0) {
    top.replace(bookmark);
  } else {
    $insertNodeToNearestRoot(bookmark);
  }
  // カードの後ろは必ず書ける行にしておく
  if (bookmark.getNextSibling() === null) bookmark.insertAfter($createParagraphNode());
  bookmark.selectNext();
}

/** 書式トグルとネスト階層の変更を行う補助バー */
export function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState<ActiveType>('p');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  // 文字装飾は真偽値を別々に持つ。まとめて 1 つの state にすると
  // 毎回新しいオブジェクトになり、変化が無くても再描画されてしまう。
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  // 選択位置に掛かっているリンクの URL (掛かっていなければ null)
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  // キャレットが乗っている素の URL (リンクを張っていない URL 文字列)
  const [plainUrl, setPlainUrl] = useState<string | null>(null);
  // テキストが選ばれているか (選択範囲があるときだけ新しいリンクを張れる)
  const [hasSelection, setHasSelection] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  // ダイアログを開くとエディタからフォーカスが外れるので、開く直前の選択を控えておく
  const savedSelectionRef = useRef<BaseSelection | null>(null);
  // 画像機能が有効なときだけ画像ボタンを出す
  const imageConfig = useImageConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const read = () =>
      editor.getEditorState().read(() => {
        setActive($activeType());
        const selection = $getSelection();
        const range = $isRangeSelection(selection) ? selection : null;
        setBold(range?.hasFormat('bold') === true);
        setItalic(range?.hasFormat('italic') === true);
        setLinkUrl($selectedLinkUrl());
        setPlainUrl($plainUrlAtCaret());
        setHasSelection(range !== null && !range.isCollapsed());
      });
    read();
    return mergeRegister(
      editor.registerUpdateListener(read),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  const setHeading = (type: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $setBlocksType(selection, () =>
        active === type ? $createParagraphNode() : $createHeadingNode(type),
      );
    });
  };

  const insertHorizontalRule = () => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  };

  const setList = (type: 'li' | 'todo') => {
    if (active === type) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else if (type === 'li') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
  };

  const changeIndent = (dir: 1 | -1) => {
    editor.dispatchCommand(dir > 0 ? INDENT_CONTENT_COMMAND : OUTDENT_CONTENT_COMMAND, undefined);
  };

  /** 開く直前の選択を控えてからリンク設定ダイアログを出す */
  const openLinkDialog = () => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      savedSelectionRef.current = selection ? selection.clone() : null;
    });
    setLinkDialogOpen(true);
  };

  /** ダイアログを開いたときの選択に戻してから変更を当てる */
  const withSavedSelection = (run: () => void) => {
    editor.update(() => {
      const saved = savedSelectionRef.current;
      if (saved) $setSelection(saved.clone());
      run();
    });
    setLinkDialogOpen(false);
    editor.focus();
  };

  const applyLink = (raw: string, display: LinkDisplay) => {
    const url = normalizeLinkUrl(raw);
    if (url === null) return;
    withSavedSelection(() => {
      $selectLinkTarget();
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (display === 'card') {
        $replaceWithBookmark(url);
        return;
      }
      if (display === 'url') {
        // リンクを外し、見えている文字列を URL そのものに置き換える
        $toggleLink(null);
        const after = $getSelection();
        if ($isRangeSelection(after)) after.insertText(url);
        return;
      }
      // 対象が無い (どこも選ばれていない) ときは何もしない
      if (!selection.isCollapsed()) $toggleLink(url, LINK_ATTRIBUTES);
    });
  };

  const removeLink = () => {
    withSavedSelection(() => {
      $selectLinkTarget();
      $toggleLink(null);
    });
  };

  const pickImages = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (files.length > 0) editor.dispatchCommand(INSERT_IMAGES_COMMAND, files);
  };

  // ネストは箇条書き / チェックボックスの行でのみ有効
  const canIndent = active === 'li' || active === 'todo';

  return (
    <div className={styles.toolbar}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.button}
          aria-label="元に戻す"
          disabled={!canUndo}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <Icon name="undo" size={20} />
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label="やり直す"
          disabled={!canRedo}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <Icon name="redo" size={20} />
        </button>
        <span className={styles.divider} aria-hidden="true" />
        {HEADINGS.map((item) => (
          <button
            key={item.type}
            type="button"
            className={cn(styles.button, active === item.type && styles.buttonOn)}
            aria-label={item.name}
            aria-pressed={active === item.type}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setHeading(item.type)}
          >
            {item.label}
          </button>
        ))}
        <span className={styles.divider} aria-hidden="true" />
        <button
          type="button"
          className={cn(styles.button, styles.boldLabel, bold && styles.buttonOn)}
          aria-label="太字"
          aria-pressed={bold}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          B
        </button>
        <button
          type="button"
          className={cn(styles.button, styles.italicLabel, italic && styles.buttonOn)}
          aria-label="斜体"
          aria-pressed={italic}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          I
        </button>
        {/* 選択したテキストにリンクを張る。リンクの上にキャレットがあるときは編集・解除 */}
        <button
          type="button"
          className={cn(styles.button, linkUrl !== null && styles.buttonOn)}
          aria-label="リンクを設定"
          aria-pressed={linkUrl !== null}
          disabled={!hasSelection && linkUrl === null && plainUrl === null}
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkDialog}
        >
          <Icon name="link" size={20} />
        </button>
        <span className={styles.divider} aria-hidden="true" />
        {LISTS.map((item) => (
          <button
            key={item.type}
            type="button"
            className={cn(styles.button, active === item.type && styles.buttonOn)}
            aria-label={item.name}
            aria-pressed={active === item.type}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setList(item.type)}
          >
            <Icon name={item.icon} size={20} />
          </button>
        ))}
        <button
          type="button"
          className={styles.button}
          aria-label="仕切り線を挿入"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertHorizontalRule}
        >
          <Icon name="divider" size={20} />
        </button>
        {imageConfig && (
          <>
            <button
              type="button"
              className={styles.button}
              aria-label="画像を挿入"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="image" size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                pickImages(e.target.files);
                // 同じファイルを続けて選べるように毎回リセットする
                e.target.value = '';
              }}
            />
          </>
        )}
        <span className={styles.divider} aria-hidden="true" />
        <button
          type="button"
          className={styles.button}
          aria-label="ネストを解除"
          disabled={!canIndent}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => changeIndent(-1)}
        >
          <Icon name="outdent" size={20} />
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label="ネストする"
          disabled={!canIndent}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => changeIndent(1)}
        >
          <Icon name="indent" size={20} />
        </button>
      </div>
      {linkDialogOpen && (
        <LinkDialog
          initialUrl={linkUrl ?? plainUrl ?? ''}
          initialDisplay={linkUrl !== null ? 'link' : plainUrl !== null ? 'url' : 'link'}
          canRemove={linkUrl !== null}
          onApply={applyLink}
          onRemove={removeLink}
          onClose={() => setLinkDialogOpen(false)}
        />
      )}
    </div>
  );
}
