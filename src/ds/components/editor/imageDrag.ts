/** ドラッグ / ペーストで運ばれてきたファイルの判定 */

/** DataTransfer から画像ファイルだけを取り出す */
export function imageFilesOf(data: DataTransfer | null | undefined): File[] {
  if (!data) return [];
  return Array.from(data.files).filter((file) => file.type.startsWith('image/'));
}

/**
 * ドラッグ中に画像を運んでいるか。
 * dragenter / dragover の時点では files の中身を読めない (セキュリティ上の制限) ため、
 * items の kind / type と types を見て判断する。
 */
export function hasDraggedImage(data: DataTransfer | null | undefined): boolean {
  if (!data) return false;
  if (Array.from(data.items).some((item) => item.kind === 'file' && item.type.startsWith('image/'))) {
    return true;
  }
  return data.types.includes('Files');
}
