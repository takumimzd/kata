// ============================================================
//  kata — ダイアログのフォーカス管理
//  開いたら中へフォーカスを移し、Tab を中で循環させ、閉じたら元の要素へ戻す。
// ============================================================
import { useEffect, useState, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/** 要素内のフォーカスできる要素 (見えているものだけ) */
export function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

/**
 * モーダルなダイアログのフォーカスを管理する。
 * @param initial 最初にフォーカスする要素。省略時は中の先頭の要素 (なければダイアログ自身)
 */
export function useDialogFocus(
  ref: RefObject<HTMLElement | null>,
  initial?: RefObject<HTMLElement | null>,
) {
  // 開く前のフォーカス。エフェクトの中で読むと開発時の二重実行で
  // ダイアログの中の要素を拾ってしまうので、最初の描画で覚えておく
  const [previous] = useState(() =>
    typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null),
  );

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const target = initial?.current ?? focusableIn(root)[0] ?? root;
    target.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusableIn(root);
      if (items.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // 閉じたら開く前の要素へ戻す (消えていれば何もしない)
      if (previous && previous.isConnected) previous.focus({ preventScroll: true });
    };
    // 開いたときに 1 回だけ (ref は変わらない)
  }, [ref, initial, previous]);
}
