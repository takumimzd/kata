import { $createLinkNode, $isLinkNode, LinkNode } from '@lexical/link';
import {
  $createListItemNode,
  $createListNode,
  $isListItemNode,
  $isListNode,
  ListNode,
} from '@lexical/list';
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import type { HeadingTagType } from '@lexical/rich-text';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isElementNode,
  $isTextNode,
} from 'lexical';
import type { ElementNode, LexicalNode } from 'lexical';
import { $createBookmarkNode, $isBookmarkNode } from './BookmarkNode';
import { $createImageNode, $isImageNode } from './ImageNode';
import { LINK_ATTRIBUTES } from './link';
import type { EditorBlock, EditorBlockType, EditorSpan } from './types';
import {
  createBookmarkBlock,
  createEditorBlock,
  createImageBlock,
  hasInlineFormat,
  spansToText,
} from './types';

function isListBlock(type: EditorBlockType): boolean {
  return type === 'li' || type === 'todo';
}

/** ブロックの本文を装飾つきで要素に流し込む */
function $appendInline(node: ElementNode, block: EditorBlock): void {
  const spans = block.spans;
  if (!spans || spans.length === 0) {
    if (block.text) node.append($createTextNode(block.text));
    return;
  }
  // 直前に開いたリンク。続けて同じ URL の断片が来たら 1 つにまとめる
  let openLink: { url: string; node: LinkNode } | null = null;
  for (const span of spans) {
    if (!span.text) continue;
    const text = $createTextNode(span.text);
    if (span.bold) text.toggleFormat('bold');
    if (span.italic) text.toggleFormat('italic');
    if (span.link !== undefined) {
      if (openLink === null || openLink.url !== span.link) {
        const link = $createLinkNode(span.link, LINK_ATTRIBUTES);
        node.append(link);
        openLink = { url: span.link, node: link };
      }
      openLink.node.append(text);
      continue;
    }
    openLink = null;
    node.append(text);
  }
}

/** 隣り合う同じ装飾の断片はひとつにまとめる */
function pushSpan(out: EditorSpan[], span: EditorSpan): void {
  if (span.text === '') return;
  const last = out[out.length - 1];
  if (last && last.bold === span.bold && last.italic === span.italic && last.link === span.link) {
    last.text += span.text;
    return;
  }
  out.push(span);
}

/** 要素の直下にある断片を装飾つきで取り出す (入れ子リストは対象外) */
function $spansOf(node: ElementNode): EditorSpan[] {
  const out: EditorSpan[] = [];
  for (const child of node.getChildren()) {
    if ($isListNode(child)) continue;
    if ($isTextNode(child)) {
      const span: EditorSpan = { text: child.getTextContent() };
      if (child.hasFormat('bold')) span.bold = true;
      if (child.hasFormat('italic')) span.italic = true;
      pushSpan(out, span);
      continue;
    }
    // リンクは要素なので、中の断片を link 付きで取り出す
    if ($isLinkNode(child)) {
      const url = child.getURL();
      for (const inner of child.getChildren()) {
        const span: EditorSpan = { text: inner.getTextContent(), link: url };
        if ($isTextNode(inner)) {
          if (inner.hasFormat('bold')) span.bold = true;
          if (inner.hasFormat('italic')) span.italic = true;
        }
        pushSpan(out, span);
      }
      continue;
    }
    // 改行など装飾を持たない要素は、テキストとしてだけ拾う
    pushSpan(out, { text: child.getTextContent() });
  }
  return out;
}

/** 装飾があるときだけ spans を添えてブロックを作る */
function inlineBlock(
  type: EditorBlockType,
  spans: EditorSpan[],
  checked = false,
  indent = 0,
): EditorBlock {
  const block = createEditorBlock(type, spansToText(spans), checked, indent);
  return hasInlineFormat(spans) ? { ...block, spans } : block;
}

/** 見出し / 段落 / 仕切り線などのリーフ要素を作る */
function $createLeaf(block: EditorBlock): LexicalNode {
  const type = block.type;
  if (type === 'hr') return $createHorizontalRuleNode();
  // image / bookmark は $blocksToNodes 側で中身の有無を確認済み
  if (type === 'image' && block.image) return $createImageNode(block.image);
  if (type === 'bookmark' && block.bookmark) return $createBookmarkNode(block.bookmark.url);
  if (type === 'h1' || type === 'h2' || type === 'h3') {
    const node = $createHeadingNode(type as HeadingTagType);
    $appendInline(node, block);
    return node;
  }
  const node = $createParagraphNode();
  $appendInline(node, block);
  return node;
}

interface OpenList {
  list: ListNode;
  indent: number;
  listType: 'bullet' | 'check';
}

/**
 * 連続する li / todo ブロック (フラットな indent 付き) を
 * Lexical のネストしたリスト構造に組み立てる。
 * - 同じ階層・同じ種別は 1 つの ListNode にまとめる
 * - 深い階層は親 ListItemNode (ラッパー) の中の ListNode として入れ子にする
 */
function $buildLists(items: EditorBlock[]): ListNode[] {
  const roots: ListNode[] = [];
  const stack: OpenList[] = [];

  for (const block of items) {
    const indent = Math.max(0, block.indent);
    const listType = block.type === 'todo' ? 'check' : 'bullet';
    const li = $createListItemNode();
    if (listType === 'check') li.setChecked(block.checked);
    $appendInline(li, block);

    // この階層より深い開きリストを閉じる
    while (stack.length > 0 && (stack[stack.length - 1]?.indent ?? 0) > indent) stack.pop();

    const top = stack[stack.length - 1];
    if (top && top.indent === indent && top.listType === listType) {
      // 同じ階層・同じ種別 → 既存リストに追加
      top.list.append(li);
      continue;
    }
    if (top && top.indent === indent) {
      // 同じ階層で種別違い → 現在のリストを閉じて兄弟リストを開く
      stack.pop();
    }

    const list = $createListNode(listType);
    list.append(li);
    const parent = stack[stack.length - 1];
    if (parent) {
      // 親リストの末尾にラッパー ListItemNode を足し、その中に入れ子リストを置く
      const wrapper = $createListItemNode();
      wrapper.append(list);
      parent.list.append(wrapper);
    } else {
      roots.push(list);
    }
    stack.push({ list, indent, listType });
  }

  return roots;
}

/** EditorBlock[] を Lexical のルート直下に並べるノード列へ変換する */
export function $blocksToNodes(blocks: EditorBlock[]): LexicalNode[] {
  const nodes: LexicalNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (!block) {
      i += 1;
      continue;
    }
    if (block.type === 'image' && !block.image) {
      // 実体を持たない画像ブロックは復元できないので捨てる
      i += 1;
      continue;
    }
    if (block.type === 'bookmark' && !block.bookmark) {
      // URL を持たないブックマークは復元できないので捨てる
      i += 1;
      continue;
    }
    if (isListBlock(block.type)) {
      const start = i;
      while (i < blocks.length && isListBlock(blocks[i]?.type ?? 'p')) i += 1;
      nodes.push(...$buildLists(blocks.slice(start, i)));
    } else {
      nodes.push($createLeaf(block));
      i += 1;
    }
  }
  if (nodes.length === 0) nodes.push($createParagraphNode());
  return nodes;
}

function $appendListBlocks(list: ListNode, depth: number, out: EditorBlock[]): void {
  const type: EditorBlockType = list.getListType() === 'check' ? 'todo' : 'li';
  for (const item of list.getChildren()) {
    if (!$isListItemNode(item)) continue;
    const nested = item.getChildren().filter($isListNode);
    // 入れ子リストを除いた、この項目自身の本文
    const spans = $spansOf(item);
    // ラッパー (テキストなし & 入れ子のみ) は自身を出力せず子リストへ降りる
    if (nested.length > 0 && spansToText(spans) === '') {
      for (const child of nested) $appendListBlocks(child, depth + 1, out);
      continue;
    }
    out.push(inlineBlock(type, spans, type === 'todo' && item.getChecked() === true, depth));
    for (const child of nested) $appendListBlocks(child, depth + 1, out);
  }
}

function $appendBlock(node: LexicalNode, out: EditorBlock[]): void {
  if ($isHorizontalRuleNode(node)) {
    out.push(createEditorBlock('hr'));
    return;
  }
  if ($isHeadingNode(node)) {
    const tag = node.getTag();
    const type: EditorBlockType = tag === 'h1' ? 'h1' : tag === 'h3' ? 'h3' : 'h2';
    out.push(inlineBlock(type, $spansOf(node)));
    return;
  }
  if ($isImageNode(node)) {
    const image = node.getImage();
    // アップロード中 (未確定) の画像は出力しない。
    // こうしておくと利用側の自動保存が「まだ実体のない画像」を保存せずに済む。
    if (image) out.push(createImageBlock(image));
    return;
  }
  if ($isBookmarkNode(node)) {
    out.push(createBookmarkBlock(node.getUrl()));
    return;
  }
  if ($isListNode(node)) {
    $appendListBlocks(node, 0, out);
    return;
  }
  // 段落・その他の要素は通常段落として扱う
  if ($isElementNode(node)) {
    out.push(inlineBlock('p', $spansOf(node)));
    return;
  }
  out.push(createEditorBlock('p', node.getTextContent()));
}

/** 現在の Lexical 状態を EditorBlock[] へシリアライズする (editorState.read 内で呼ぶ) */
export function $nodesToBlocks(): EditorBlock[] {
  const out: EditorBlock[] = [];
  for (const child of $getRoot().getChildren()) $appendBlock(child, out);
  if (out.length === 0) out.push(createEditorBlock('p', ''));
  return out;
}
