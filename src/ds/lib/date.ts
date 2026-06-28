// ============================================================
//  kata — 日付ユーティリティ (DatePicker 等で使用)
//  値の表現は "YYYY-MM-DD" のローカル日付文字列。
// ============================================================

/** 日本語の曜日 (日曜始まり) */
export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

/** "YYYY-MM-DD" をローカルタイムの Date に変換する (UTC ずれを避ける) */
export function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Date を "YYYY-MM-DD" に整形する */
export function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 今日の日付を "YYYY-MM-DD" で返す */
export function today(): string {
  return toYmd(new Date());
}
