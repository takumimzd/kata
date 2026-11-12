// ============================================================
//  kata — ModelessDialog (モードレスなダイアログ)
//  背景を覆わず、開いたまま後ろのページを読んだり操作したりできる浮動パネル。
//  ヘッダーをつかんで移動し、右下のつまみで大きさを変える (どちらも画面内に収める)。
//  つまみはキーボードでも操作できる (矢印キーで 16px ずつ。Shift で 64px)。
//  開くと中へフォーカスを移すが、Tab は閉じ込めない。Escape は中にフォーカスがあるときだけ閉じる。
// ============================================================
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { focusableIn } from '../lib/focus';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import styles from './ModelessDialog.module.css';

export interface ModelessDialogSize {
  width: number;
  height: number;
}

interface ModelessDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** 最初の大きさ (画面に収まらなければ縮める)。既定 420 × 560 */
  defaultSize?: ModelessDialogSize;
  /** 小さくできる限界。既定 320 × 240 */
  minSize?: ModelessDialogSize;
  className?: string;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 画面の端からの余白 (最初の位置と、画面に収めるときの余白) */
const MARGIN = 16;
const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;
const DEFAULT_SIZE: ModelessDialogSize = { width: 420, height: 560 };
const MIN_SIZE: ModelessDialogSize = { width: 320, height: 240 };

function viewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function clampNumber(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), Math.max(min, max));
}

/** 大きさを画面に収めてから、位置を画面に収める */
function fit(rect: Rect, min: ModelessDialogSize): Rect {
  const vp = viewport();
  const width = clampNumber(rect.width, Math.min(min.width, vp.width), vp.width);
  const height = clampNumber(rect.height, Math.min(min.height, vp.height), vp.height);
  return {
    width,
    height,
    x: clampNumber(rect.x, 0, vp.width - width),
    y: clampNumber(rect.y, 0, vp.height - height),
  };
}

/** 最初は画面の右下に置く */
function initialRect(size: ModelessDialogSize, min: ModelessDialogSize): Rect {
  const vp = viewport();
  const width = Math.min(size.width, vp.width - MARGIN * 2);
  const height = Math.min(size.height, vp.height - MARGIN * 2);
  return fit(
    { width, height, x: vp.width - width - MARGIN, y: vp.height - height - MARGIN },
    min,
  );
}

type DragKind = 'move' | 'resize';

export function ModelessDialog({
  title,
  onClose,
  children,
  defaultSize = DEFAULT_SIZE,
  minSize = MIN_SIZE,
  className,
}: ModelessDialogProps) {
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  // サーバ描画では window が無いので、位置はブラウザで決めてから描く
  const [rect, setRect] = useState<Rect | null>(null);
  const drag = useRef<{ kind: DragKind; px: number; py: number; start: Rect } | null>(null);
  const [dragging, setDragging] = useState<DragKind | null>(null);

  useLayoutEffect(() => {
    // 置くのは開いたときだけ (あとから defaultSize が変わっても動かさない)
    setRect((r) => r ?? initialRect(defaultSize, minSize));
  }, [defaultSize, minSize]);

  // 画面の大きさが変わったら収め直す
  useEffect(() => {
    const onResize = () => setRect((r) => (r ? fit(r, minSize) : r));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [minSize]);

  // 開いたら中へフォーカスを移し (中の要素が autoFocus 済みならそのまま)、
  // 閉じたとき中にフォーカスがあれば開く前の要素へ戻す
  const [previous] = useState(() =>
    typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null),
  );
  const opened = rect !== null;
  useEffect(() => {
    const root = rootRef.current;
    if (!opened || !root) return;
    if (!root.contains(document.activeElement)) {
      const body = root.querySelector<HTMLElement>(`.${styles.body}`);
      const target = (body && focusableIn(body)[0]) ?? root;
      target.focus({ preventScroll: true });
    }
    return () => {
      if (root.contains(document.activeElement) && previous?.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [opened, previous]);

  const startDrag = (kind: DragKind) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !rect) return;
    // ヘッダーの中のボタン (閉じる) を押したときは動かさない
    if (kind === 'move' && (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { kind, px: e.clientX, py: e.clientY, start: rect };
    setDragging(kind);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    const { start } = d;
    setRect(
      d.kind === 'move'
        ? fit({ ...start, x: start.x + dx, y: start.y + dy }, minSize)
        : fit({ ...start, width: start.width + dx, height: start.height + dy }, minSize),
    );
  };

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onResizeKey = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
      const delta: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const d = delta[e.key];
      if (!d) return;
      e.preventDefault();
      setRect((r) => (r ? fit({ ...r, width: r.width + d[0], height: r.height + d[1] }, minSize) : r));
    },
    [minSize],
  );

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.stopPropagation();
      onClose();
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={rootRef}
      className={cn(styles.dialog, dragging && styles.dragging, className)}
      role="dialog"
      aria-modal={false}
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      style={
        rect
          ? { left: rect.x, top: rect.y, width: rect.width, height: rect.height }
          : { visibility: 'hidden' }
      }
    >
      <div
        className={styles.head}
        onPointerDown={startDrag('move')}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <Icon name="grip" size={16} className={styles.grip} />
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <IconButton label="閉じる" size="sm" onClick={onClose}>
          <Icon name="close" size={18} />
        </IconButton>
      </div>
      <div className={styles.body}>{children}</div>
      <button
        type="button"
        className={styles.resize}
        aria-label="大きさを変える（矢印キー）"
        onPointerDown={startDrag('resize')}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onResizeKey}
      />
    </div>,
    document.body,
  );
}
