// ============================================================
//  kata — 本文中の画像 1 枚の表示
//  選択 → サイズ変更 (ドラッグ / プリセット) / 全画面 / 削除
// ============================================================
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import type { NodeKey } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon';
import { useImageConfig } from './ImageContext';
import { $isImageNode } from './ImageNode';
import type { ImageNode } from './ImageNode';
import { ImageLightbox } from './ImageLightbox';
import styles from './ImageView.module.css';
import type { EditorImage } from './types';
import { clampImageWidthPct, IMAGE_WIDTH_STEP_PCT } from './types';

/** サイズのプリセット (ハンドルを掴みにくいスマホ向けの逃げ道) */
const PRESETS: { label: string; pct: number }[] = [
  { label: 'S', pct: 33 },
  { label: 'M', pct: 66 },
  { label: 'L', pct: 100 },
];

interface ImageViewProps {
  nodeKey: NodeKey;
  /** null = アップロード中 */
  image: EditorImage | null;
  /** アップロード中に見せる objectURL */
  previewUrl: string | null;
}

interface DragState {
  startX: number;
  startWidth: number;
  containerWidth: number;
}

/** IMAGE_WIDTH_STEP_PCT 刻みに丸める */
function snap(pct: number): number {
  return clampImageWidthPct(Math.round(pct / IMAGE_WIDTH_STEP_PCT) * IMAGE_WIDTH_STEP_PCT);
}

export function ImageView({ nodeKey, image, previewUrl }: ImageViewProps) {
  const [editor] = useLexicalComposerContext();
  const [, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
  const config = useImageConfig();
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  /**
   * 操作バーとハンドルを出すかどうか。
   * Lexical の NodeSelection は更新のたびに外れてしまい表示の拠り所にできないので、
   * 見た目の状態はここで持つ (NodeSelection はキーボード削除の判定にだけ使う)。
   */
  const [active, setActive] = useState(false);
  /** ドラッグ中だけ使う暫定の幅。確定は pointerup の 1 回だけ */
  const [draftPct, setDraftPct] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const uploading = image === null;
  const src = image && config ? config.resolveImageUrl(image) : previewUrl;
  const alt = image?.alt ?? '';
  const widthPct = draftPct ?? image?.widthPct ?? 100;

  const updateNode = useCallback(
    (fn: (node: ImageNode) => void) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) fn(node);
      });
    },
    [editor, nodeKey],
  );

  const applyWidth = useCallback(
    (pct: number) => updateNode((node) => node.setWidthPct(pct)),
    [updateNode],
  );
  const removeSelf = useCallback(() => updateNode((node) => node.remove()), [updateNode]);

  /** 画像を操作対象にする。NodeSelection はキーボード削除のために張る */
  const activate = useCallback(() => {
    setActive(true);
    setSelected(true);
  }, [setSelected]);

  const deactivate = useCallback(() => {
    setActive(false);
    clearSelected();
  }, [clearSelected]);

  // アップロード中のプレビュー (objectURL) は完了時に解放されるので、
  // 表示が実 URL に切り替わったら読み込み失敗の表示をリセットする
  useEffect(() => setLoadFailed(false), [src]);

  // 画像の外を触ったら操作を終える (Lexical の選択解除だけでは追随しきれない)
  useEffect(() => {
    if (!active || lightboxOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root && event.target instanceof Node && root.contains(event.target)) return;
      deactivate();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') deactivate();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
    // 全画面表示の間は Escape をライトボックスに譲る
  }, [active, lightboxOpen, deactivate]);

  // 操作中は Delete / Backspace で削除できる。
  // 誤って本文の文字を消さないよう、画像が選択されているときだけ処理する。
  useEffect(() => {
    if (!active) return;
    const onDeleteKey = (event: KeyboardEvent) => {
      if (!$isNodeSelection($getSelection())) return false;
      event.preventDefault();
      removeSelf();
      return true;
    };
    return mergeRegister(
      editor.registerCommand(KEY_DELETE_COMMAND, onDeleteKey, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDeleteKey, COMMAND_PRIORITY_LOW),
    );
  }, [editor, active, removeSelf]);

  // --- サイズ変更ハンドルのドラッグ ---
  const onHandleDown = (e: ReactPointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const el = rootRef.current;
    const container = el?.parentElement;
    if (!el || !container) return;
    const containerWidth = container.getBoundingClientRect().width;
    if (containerWidth <= 0) return;
    dragRef.current = {
      startX: e.clientX,
      startWidth: el.getBoundingClientRect().width,
      containerWidth,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraftPct(widthPct);
  };

  const onHandleMove = (e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const nextWidth = drag.startWidth + (e.clientX - drag.startX);
    setDraftPct(snap((nextWidth / drag.containerWidth) * 100));
  };

  const onHandleUp = (e: ReactPointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    // ここで 1 回だけ確定する → onChange (= 利用側の自動保存) が連打されない
    if (draftPct !== null && draftPct !== image?.widthPct) applyWidth(draftPct);
    setDraftPct(null);
  };

  if (!src) return null;

  return (
    <>
      <div
        ref={rootRef}
        className={cn(styles.figure, active && styles.selected, uploading && styles.uploading)}
        style={{
          width: `${widthPct}%`,
          // 読み込み前から高さを確保してレイアウトのがたつきを防ぐ
          aspectRatio: image ? `${image.naturalWidth} / ${image.naturalHeight}` : undefined,
        }}
      >
        {loadFailed ? (
          <div className={styles.broken}>画像を読み込めませんでした</div>
        ) : (
          <img
            className={styles.image}
            src={src}
            alt={alt}
            draggable={false}
            onError={() => setLoadFailed(true)}
            onClick={(e) => {
              e.stopPropagation();
              if (!uploading) activate();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (!uploading) setLightboxOpen(true);
            }}
          />
        )}

        {uploading && (
          <div className={styles.progress}>
            <span className={styles.spinner} aria-hidden="true" />
            <span>アップロード中…</span>
          </div>
        )}

        {active && !uploading && (
          <>
            <div className={styles.bar} contentEditable={false}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={cn(styles.barButton, widthPct === preset.pct && styles.barButtonOn)}
                  aria-label={`幅 ${preset.pct}%`}
                  aria-pressed={widthPct === preset.pct}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyWidth(preset.pct)}
                >
                  {preset.label}
                </button>
              ))}
              <span className={styles.barDivider} aria-hidden="true" />
              <button
                type="button"
                className={styles.barButton}
                aria-label="全画面で表示"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLightboxOpen(true)}
              >
                <Icon name="expand" size={17} />
              </button>
              <button
                type="button"
                className={cn(styles.barButton, styles.barDanger)}
                aria-label="画像を削除"
                onMouseDown={(e) => e.preventDefault()}
                onClick={removeSelf}
              >
                <Icon name="trash" size={17} />
              </button>
            </div>
            <span
              className={styles.handle}
              role="slider"
              aria-label="画像の幅"
              aria-valuemin={10}
              aria-valuemax={100}
              aria-valuenow={widthPct}
              tabIndex={0}
              onPointerDown={onHandleDown}
              onPointerMove={onHandleMove}
              onPointerUp={onHandleUp}
              onPointerCancel={onHandleUp}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  applyWidth(widthPct + (e.key === 'ArrowRight' ? 1 : -1) * IMAGE_WIDTH_STEP_PCT);
                }
              }}
            />
          </>
        )}
      </div>

      {lightboxOpen && (
        <ImageLightbox src={src} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
