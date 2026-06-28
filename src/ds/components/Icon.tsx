// ============================================================
//  kata — ラインアイコン
//  全アイコンを 24x24 / currentColor / stroke ベースに正規化。
//  fill ベースの要素 (pin, more, list の点) は個別に fill 指定。
// ============================================================
import type { ReactNode } from 'react';

export type IconName =
  | 'home'
  | 'plus'
  | 'minus'
  | 'check'
  | 'close'
  | 'chevron'
  | 'back'
  | 'search'
  | 'trash'
  | 'edit'
  | 'copy'
  | 'calendar'
  | 'history'
  | 'chart'
  | 'dumbbell'
  | 'glass'
  | 'flame'
  | 'scale'
  | 'question'
  | 'link'
  | 'pen'
  | 'note'
  | 'pill'
  | 'bottle'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'settings'
  | 'book'
  | 'folder'
  | 'pin'
  | 'more'
  | 'list'
  | 'todo'
  | 'indent'
  | 'outdent'
  | 'undo'
  | 'redo';

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
}

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
  plus: <path d="M12 6v12M6 12h12" />,
  minus: <path d="M6 12h12" />,
  check: <path d="M5 12l5 5 9-11" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  back: <path d="M15 5l-7 7 7 7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </>
  ),
  trash: <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" />,
  edit: (
    <>
      <path d="M4 20h4l10-10-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V4h12" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  history: <path d="M5 7h14M5 12h14M5 17h9" />,
  chart: <path d="M5 19V10M12 19V5M19 19v-6" />,
  dumbbell: <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />,
  glass: (
    <>
      <path d="M7 4h10l-1.2 8.5a4 4 0 01-7.6 0L7 4z" />
      <path d="M12 17v3M9 20h6" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 3-2 4-2 7a3 3 0 006 0c0-1-.3-2-1-3 .3 2-1 3-1 3 .5-3-2-4-2-7z" />
      <path d="M8.5 13a3.5 3.5 0 107 0c0-2-1.5-3.5-3.5-6-2 2.5-3.5 4-3.5 6z" />
    </>
  ),
  scale: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 6l3 4" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3.4 2.2c-.9.5-1.2 1-1.2 1.9" />
      <path d="M12 16.9h.01" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5" />
    </>
  ),
  pen: <path d="M14 4l6 6M3 21l3.5-.5L20 7a2 2 0 0 0-3-3L3.5 17.5 3 21z" />,
  note: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </>
  ),
  pill: (
    <>
      <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z" />
      <path d="M8.5 8.5l7 7" />
    </>
  ),
  bottle: (
    <>
      <path d="M9 3h6v3l1 2.5V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8.5L9 6V3z" />
      <path d="M8 11h8" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  pin: (
    <path
      d="M15.2 3.1l5.6 5.6-2.2.6-3.6 3.6.4 4.1-2.3 2.3-3.6-3.6-4.6 4.6-.7-.7 4.6-4.6-3.6-3.6 2.3-2.3 4.1.4 3.6-3.6z"
      fill="currentColor"
      stroke="none"
    />
  ),
  more: (
    <>
      <circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),
  list: (
    <>
      <circle cx="5" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <path d="M10 6h9M10 12h9M10 18h9" />
    </>
  ),
  todo: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <path d="M8 12.2l2.8 2.8L16 9" />
    </>
  ),
  indent: (
    <>
      <path d="M4 5h16M10 10h10M10 14h10M4 19h16" />
      <path d="M4 9l3 3-3 3z" fill="currentColor" stroke="none" />
    </>
  ),
  outdent: (
    <>
      <path d="M4 5h16M10 10h10M10 14h10M4 19h16" />
      <path d="M7 9l-3 3 3 3z" fill="currentColor" stroke="none" />
    </>
  ),
  undo: (
    <>
      <path d="M9 8L5 12l4 4" />
      <path d="M5 12h9a5 5 0 0 1 0 10h-3" />
    </>
  ),
  redo: (
    <>
      <path d="M15 8l4 4-4 4" />
      <path d="M19 12h-9a5 5 0 0 0 0 10h3" />
    </>
  ),
};

export function Icon({ name, size = 22, stroke = 1.8, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
