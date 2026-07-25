// ============================================================
//  kata — 画像の挿入プラグイン
//  ツールバー / ペースト / ドロップの 3 経路から画像を受け取り、
//  未確定ノードを先に置いてからアップロードを走らせる。
// ============================================================
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  PASTE_COMMAND,
} from 'lexical';
import type { LexicalCommand, NodeKey } from 'lexical';
import { useEffect } from 'react';
import { useImageConfig } from './ImageContext';
import { $createImageNode, $isImageNode } from './ImageNode';
import { MAX_IMAGE_WIDTH_PCT } from './types';

/** ファイルを本文に挿入する。ツールバーの画像ボタンから dispatch される */
export const INSERT_IMAGES_COMMAND: LexicalCommand<File[]> = createCommand('INSERT_IMAGES');

/** DataTransfer から画像ファイルだけを取り出す */
function imageFilesOf(data: DataTransfer | null | undefined): File[] {
  if (!data) return [];
  return Array.from(data.files).filter((file) => file.type.startsWith('image/'));
}

/**
 * ドラッグ中の判定。
 * dragover の時点では files の中身が取れない (セキュリティ上の制限) ので、
 * items の kind / type と types を見る。
 */
function hasDraggedImage(data: DataTransfer | null | undefined): boolean {
  if (!data) return false;
  if (Array.from(data.items).some((item) => item.kind === 'file' && item.type.startsWith('image/'))) {
    return true;
  }
  return data.types.includes('Files');
}

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

    /** 1 枚ぶんのアップロード。未確定ノード → 実体確定、の順に進む */
    const upload = async (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      let inserted: NodeKey | undefined;
      editor.update(() => {
        const node = $createImageNode(null, previewUrl);
        $insertNodeToNearestRoot(node);
        inserted = node.getKey();
      });
      const key = inserted;
      if (key === undefined) {
        URL.revokeObjectURL(previewUrl);
        return;
      }

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

    const insertFiles = (files: File[]): boolean => {
      if (files.length === 0) return false;
      for (const file of files.slice(0, config.maxImagesPerInsert)) void upload(file);
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
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          if (!hasDraggedImage(event.dataTransfer)) return false;
          // preventDefault しないとブラウザがドロップを受け付けない
          event.preventDefault();
          return true;
        },
        COMMAND_PRIORITY_NORMAL,
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          const files = imageFilesOf(event.dataTransfer);
          if (files.length === 0) return false;
          event.preventDefault();
          return insertFiles(files);
        },
        COMMAND_PRIORITY_NORMAL,
      ),
    );
  }, [editor, config]);

  return null;
}
