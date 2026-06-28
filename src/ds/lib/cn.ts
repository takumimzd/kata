/**
 * クラス名を合成するヘルパー。
 * `[a, b].filter(Boolean).join(' ')` を関数化したもの。
 * 外部ライブラリ (clsx / cva) は使わない方針。
 *
 * @example
 * cn(styles.row, active && styles.active, danger ? styles.danger : '')
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
