// ============================================================
//  kata — 画像のドラッグ&ドロップ受け口
//  ファイルを持ってきている間だけ枠を出して、
//  ここに落とせば入ることを分かるようにする。
// ============================================================
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Icon } from '../Icon';
import { useImageConfig } from './ImageContext';
import styles from './ImageDropZone.module.css';
import { hasDraggedImage, imageFilesOf } from './imageDrag';
import { INSERT_IMAGES_COMMAND } from './ImagePlugin';

interface ImageDropZoneProps {
  /** ドロップを受け付ける範囲 (エディタ全体) */
  containerRef: RefObject<HTMLElement | null>;
}

export function ImageDropZone({ containerRef }: ImageDropZoneProps) {
  const [editor] = useLexicalComposerContext();
  const config = useImageConfig();
  const [over, setOver] = useState(false);
  /**
   * dragenter / dragleave は子要素をまたぐたびに発火するので、
   * 出入りを数えて 0 になったときだけ枠を消す。
   */
  const depth = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!config || !container) return;

    const reset = () => {
      depth.current = 0;
      setOver(false);
    };

    const onEnter = (event: DragEvent) => {
      if (!hasDraggedImage(event.dataTransfer)) return;
      depth.current += 1;
      setOver(true);
    };

    const onLeave = (event: DragEvent) => {
      if (!hasDraggedImage(event.dataTransfer)) return;
      depth.current -= 1;
      if (depth.current <= 0) reset();
    };

    const onDragOver = (event: DragEvent) => {
      if (!hasDraggedImage(event.dataTransfer)) return;
      // preventDefault しないとブラウザがドロップを受け付けない
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    };

    const onDrop = (event: DragEvent) => {
      const files = imageFilesOf(event.dataTransfer);
      reset();
      if (files.length === 0) return;
      // 画像のドロップは Lexical のテキスト処理に渡さない
      event.preventDefault();
      event.stopPropagation();
      editor.dispatchCommand(INSERT_IMAGES_COMMAND, files);
    };

    container.addEventListener('dragenter', onEnter);
    container.addEventListener('dragleave', onLeave);
    // capture で受けて contenteditable より先に処理する
    container.addEventListener('dragover', onDragOver, true);
    container.addEventListener('drop', onDrop, true);
    // 枠外で離された / 中断されたときの取りこぼしを拾う
    window.addEventListener('dragend', reset);
    window.addEventListener('drop', reset);

    return () => {
      container.removeEventListener('dragenter', onEnter);
      container.removeEventListener('dragleave', onLeave);
      container.removeEventListener('dragover', onDragOver, true);
      container.removeEventListener('drop', onDrop, true);
      window.removeEventListener('dragend', reset);
      window.removeEventListener('drop', reset);
    };
  }, [editor, config, containerRef]);

  if (!config || !over) return null;

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.badge}>
        <Icon name="image" size={22} />
        <span>ここにドロップして画像を追加</span>
      </div>
    </div>
  );
}
