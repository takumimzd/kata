// ============================================================
//  kata — 画像の挿入プラグイン
//  挿入コマンドとペーストを受け、未確定ノードを先に置いてから
//  アップロードを走らせる。
//  (ドラッグ&ドロップの受け口は ImageDropZone 側)
// ============================================================
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  PASTE_COMMAND,
} from 'lexical';
import type { LexicalCommand, NodeKey } from 'lexical';
import { useEffect } from 'react';
import { useImageConfig } from './ImageContext';
import { imageFilesOf } from './imageDrag';
import { $createImageNode, $isImageNode } from './ImageNode';
import { MAX_IMAGE_WIDTH_PCT } from './types';

/** ファイルを本文に挿入する。ツールバーの画像ボタンとドロップから dispatch される */
export const INSERT_IMAGES_COMMAND: LexicalCommand<File[]> = createCommand('INSERT_IMAGES');

/**
 * 画像機能を有効にするプラグイン。
 * ImageConfigContext (= RichTextEditor の resolveImageUrl / onUploadImage) が
 * 無いときは何も登録しないので、テキスト専用の挙動は一切変わらない。
 */
export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  const config = useImageConfig();

  useEffect(() => {
    if (!config) return;

    /** アップロードを待ち、挿入済みのノードを確定させる (失敗したら取り除く) */
    const finish = async (key: NodeKey, file: File, previewUrl: string) => {
      try {
        const result = await config.onUploadImage(file);
        // 画面を離れたあとに解決することもあるので、ノードの生存を確認してから書き込む
        editor.update(() => {
          const node = $getNodeByKey(key);
          if (!$isImageNode(node)) return;
          node.setImage({
            id: result.id,
            naturalWidth: result.naturalWidth,
            naturalHeight: result.naturalHeight,
            widthPct: MAX_IMAGE_WIDTH_PCT,
            alt: result.alt ?? '',
          });
        });
      } catch (error) {
        editor.update(() => {
          const node = $getNodeByKey(key);
          if ($isImageNode(node)) node.remove();
        });
        config.onImageError?.(error);
      } finally {
        URL.revokeObjectURL(previewUrl);
      }
    };

    /** 1 枚ぶんの挿入。まず未確定ノードを置き、そこからアップロードを走らせる */
    const insertOne = (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      editor.update(() => {
        const node = $createImageNode(null, previewUrl);
        $insertNodeToNearestRoot(node);
        // キーの取得と後続処理はこのクロージャの中で行う。
        // dispatchCommand の内側は既に editor.update の最中で、
        // ネストした editor.update は遅延実行されるため、
        // 呼び出しの直後にキーを読もうとすると undefined になる。
        void finish(node.getKey(), file, previewUrl);
      });
    };

    const insertFiles = (files: File[]): boolean => {
      if (files.length === 0) return false;
      for (const file of files.slice(0, config.maxImagesPerInsert)) insertOne(file);
      return true;
    };

    return mergeRegister(
      editor.registerCommand(INSERT_IMAGES_COMMAND, insertFiles, COMMAND_PRIORITY_EDITOR),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          if (!(event instanceof ClipboardEvent)) return false;
          const files = imageFilesOf(event.clipboardData);
          if (files.length === 0) return false;
          // 画像を含むペーストはテキスト側の処理に渡さない
          event.preventDefault();
          return insertFiles(files);
        },
        COMMAND_PRIORITY_NORMAL,
      ),
    );
  }, [editor, config]);

  return null;
}
