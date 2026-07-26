// ============================================================
//  kata — 本文中のブックマーク (OGP カード) 1 件の表示
//  カード自体はアプリ側 (renderBookmark) が描き、ここは
//  「表示のしかたを変える」メニューだけを重ねる。
// ============================================================
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createLinkNode } from '@lexical/link';
import { createPortal } from 'react-dom';
import { $createParagraphNode, $createTextNode, $getNodeByKey } from 'lexical';
import type { NodeKey } from 'lexical';
import { useState } from 'react';
import { ActionSheet, ActionSheetItem } from '../ActionSheet';
import { Icon } from '../Icon';
import { $isBookmarkNode } from './BookmarkNode';
import type { BookmarkNode } from './BookmarkNode';
import { useBookmarkConfig } from './BookmarkContext';
import { LINK_ATTRIBUTES } from './link';
import styles from './BookmarkView.module.css';

interface BookmarkViewProps {
  nodeKey: NodeKey;
  url: string;
}

/** OGP が取れないときの既定の見た目 (URL だけのカード) */
function FallbackCard({ url }: { url: string }) {
  return (
    <a className={styles.fallback} href={url} target="_blank" rel="noopener noreferrer">
      <Icon name="link" size={16} />
      <span className={styles.fallbackUrl}>{url}</span>
    </a>
  );
}

export function BookmarkView({ nodeKey, url }: BookmarkViewProps) {
  const [editor] = useLexicalComposerContext();
  const config = useBookmarkConfig();
  const [menuOpen, setMenuOpen] = useState(false);

  const updateNode = (fn: (node: BookmarkNode) => void) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isBookmarkNode(node)) fn(node);
    });
    setMenuOpen(false);
  };

  /** カードをやめて、URL 1 行の段落に戻す (linked=true ならテキストリンクにする) */
  const toParagraph = (linked: boolean) =>
    updateNode((node) => {
      const paragraph = $createParagraphNode();
      if (linked) {
        const link = $createLinkNode(node.getUrl(), LINK_ATTRIBUTES);
        link.append($createTextNode(node.getUrl()));
        paragraph.append(link);
      } else {
        paragraph.append($createTextNode(node.getUrl()));
      }
      node.replace(paragraph);
      paragraph.selectEnd();
    });

  return (
    <div
      className={styles.card}
      onPointerDown={(e) => {
        // タッチでカードに触れたときは本文へフォーカスを移さない。
        // 移るとモバイルでソフトキーボードが開き、読むだけのカードなのに
        // 画面が半分隠れてしまう。マウスでは既定の挙動を残す
        // (キャレット移動や Delete / Backspace での削除を活かすため)。
        if (e.pointerType === 'mouse') return;
        e.preventDefault();
        editor.getRootElement()?.blur();
      }}
    >
      {config ? config.renderBookmark({ url }) : <FallbackCard url={url} />}
      {/* カードは <a> なので、メニューのボタンは中に入れず上に重ねる */}
      <button
        type="button"
        className={styles.menuButton}
        aria-label="リンクの表示を変える"
        onClick={() => setMenuOpen(true)}
      >
        <Icon name="more" size={18} />
      </button>
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <ActionSheet onClose={() => setMenuOpen(false)} aria-label="リンクの表示">
            <ActionSheetItem icon={<Icon name="link" />} onClick={() => toParagraph(true)}>
              テキストリンクで表示
            </ActionSheetItem>
            <ActionSheetItem icon={<Icon name="edit" />} onClick={() => toParagraph(false)}>
              URL のまま表示
            </ActionSheetItem>
            <ActionSheetItem
              icon={<Icon name="trash" />}
              onClick={() => updateNode((node) => node.remove())}
            >
              削除
            </ActionSheetItem>
          </ActionSheet>,
          document.body,
        )}
    </div>
  );
}
