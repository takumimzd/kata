import {
  $createListItemNode,
  $createListNode,
  $isListItemNode,
  $isListNode,
  ListItemNode,
  ListNode,
} from '@lexical/list';
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import type { HeadingTagType } from '@lexical/rich-text';
import { $createParagraphNode, $createTextNode, $getRoot, $isElementNode } from 'lexical';
import type { ElementNode, LexicalNode } from 'lexical';
import type { EditorBlock, EditorBlockType } from './types';
import { createEditorBlock } from './types';

function isListBlock(type: EditorBlockType): boolean {
  return type === 'li' || type === 'todo';
}

/** 見出し / 段落 / 仕切り線などのリーフ要素を作る */
function $createLeaf(block: EditorBlock): LexicalNode {
  const type = block.type;
  if (type === 'hr') return $createHorizontalRuleNode();
  if (type === 'h1' || type === 'h2' || type === 'h3') {
    const node = $createHeadingNode(type as HeadingTagType);
    if (block.text) node.append($createTextNode(block.text));
    return node;
  }
  const node = $createParagraphNode();
  if (block.text) node.append($createTextNode(block.text));
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
    if (block.text) li.append($createTextNode(block.text));

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

/** ListItemNode 直下のテキスト (入れ子リストを除いた自分自身の文字列) */
function $ownText(item: ListItemNode): string {
  return item
    .getChildren()
    .filter((child) => !$isListNode(child))
    .map((child) => child.getTextContent())
    .join('');
}

function $appendListBlocks(list: ListNode, depth: number, out: EditorBlock[]): void {
  const type: EditorBlockType = list.getListType() === 'check' ? 'todo' : 'li';
  for (const item of list.getChildren()) {
    if (!$isListItemNode(item)) continue;
    const nested = item.getChildren().filter($isListNode);
    const text = $ownText(item);
    // ラッパー (テキストなし & 入れ子のみ) は自身を出力せず子リストへ降りる
    if (nested.length > 0 && text === '') {
      for (const child of nested) $appendListBlocks(child, depth + 1, out);
      continue;
    }
    const block = createEditorBlock(
      type,
      text,
      type === 'todo' ? item.getChecked() === true : false,
      depth,
    );
    out.push(block);
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
    out.push(createEditorBlock(type, node.getTextContent()));
    return;
  }
  if ($isListNode(node)) {
    $appendListBlocks(node, 0, out);
    return;
  }
  // 段落・その他の要素は通常段落として扱う
  const text = $isElementNode(node) ? (node as ElementNode).getTextContent() : node.getTextContent();
  out.push(createEditorBlock('p', text));
}

/** 現在の Lexical 状態を EditorBlock[] へシリアライズする (editorState.read 内で呼ぶ) */
export function $nodesToBlocks(): EditorBlock[] {
  const out: EditorBlock[] = [];
  for (const child of $getRoot().getChildren()) $appendBlock(child, out);
  if (out.length === 0) out.push(createEditorBlock('p', ''));
  return out;
}
