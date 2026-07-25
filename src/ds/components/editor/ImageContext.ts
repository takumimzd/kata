import { createContext, useContext } from 'react';
import type { EditorImage } from './types';

/** アップロードが完了したときにアプリ側が返す情報 */
export interface ImageUploadResult {
  /** 実体を指す ID (URL の解決は resolveImageUrl 側で行う) */
  id: string;
  naturalWidth: number;
  naturalHeight: number;
  alt?: string;
}

/**
 * 画像機能の設定。RichTextEditor の props をそのまま流し込む。
 * DecoratorNode の decorate() には props を渡せないため context 経由で配る。
 */
export interface ImageConfig {
  resolveImageUrl: (image: EditorImage) => string;
  onUploadImage: (file: File) => Promise<ImageUploadResult>;
  onImageError?: (error: unknown) => void;
  maxImagesPerInsert: number;
}

export const ImageConfigContext = createContext<ImageConfig | null>(null);

/** 画像機能が有効なら設定を返す。無効なら null */
export function useImageConfig(): ImageConfig | null {
  return useContext(ImageConfigContext);
}
