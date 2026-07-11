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
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useEffect, useState } from 'react';
import { Icon, type IconName } from '../Icon';
import { cn } from '../../lib/cn';
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

/** 書式トグルとネスト階層の変更を行う補助バー */
export function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState<ActiveType>('p');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const read = () => editor.getEditorState().read(() => setActive($activeType()));
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
    </div>
  );
}
