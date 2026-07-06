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
  | 'menu'
  | 'undo'
  | 'redo'
  // ---- からだを動かす ----
  | 'bike'
  | 'mountain'
  | 'bolt'
  | 'shoe'
  | 'heart'
  // ---- たべる・のむ ----
  | 'coffee'
  | 'apple'
  | 'utensils'
  | 'drop'
  // ---- まなぶ・つくる ----
  | 'code'
  | 'palette'
  | 'music'
  | 'camera'
  | 'globe'
  | 'headphones'
  // ---- くらし ----
  | 'bed'
  | 'clock'
  | 'sparkle'
  | 'mail'
  | 'leaf'
  | 'tooth'
  | 'coin'
  | 'game'
  | 'smokingOff'
  // ---- しるし ----
  | 'star'
  | 'target'
  | 'trophy';

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
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
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
  // ---- からだを動かす ----
  bike: (
    <>
      <circle cx="6" cy="16.5" r="3.2" />
      <circle cx="18" cy="16.5" r="3.2" />
      <path d="M6 16.5L9 9h5.5" />
      <path d="M9.5 9l2.8 7.5h5.7L14.8 9" />
      <path d="M13.7 6.8h2.2" />
    </>
  ),
  mountain: <path d="M3 18.5L8.5 9.5l3 4.4L14.5 8 21 18.5z" />,
  bolt: <path d="M13 3l-8 10.5h6L10 21l8-10.5h-6z" />,
  shoe: (
    <>
      <path d="M3.5 18.5h17c0-1.6-1.2-2.7-3-3.3-2.6-.9-4.9-.9-7.1-3.1L8 9.7c-.6-.6-1.6-.4-1.9.5-.5 1.6-.6 4.5-.6 6.3z" />
      <path d="M11.5 13.5l1.4-1.4" />
      <path d="M14 15l1.2-1.2" />
    </>
  ),
  heart: (
    <path d="M12 19.5C7 15.5 4 12.6 4 9.4 4 7 5.8 5.2 8.1 5.2c1.5 0 2.9.8 3.9 2.1 1-1.3 2.4-2.1 3.9-2.1 2.3 0 4.1 1.8 4.1 4.2 0 3.2-3 6.1-8 10.1z" />
  ),
  // ---- たべる・のむ ----
  coffee: (
    <>
      <path d="M5 9.5h11v5.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
      <path d="M16 10.5h1.3a2.4 2.4 0 0 1 0 4.8H16" />
      <path d="M8.8 4v2.2" />
      <path d="M12.2 4v2.2" />
    </>
  ),
  apple: (
    <>
      <path d="M12 7.2c-1.2-1.5-3.1-1.9-4.7-1C5 7.6 4.4 10.4 5.7 13.5c1.3 3 3.4 5 5 5 .4 0 .9-.2 1.3-.5.4.3.9.5 1.3.5 1.6 0 3.7-2 5-5 1.3-3.1.7-5.9-1.6-7.3-1.6-.9-3.5-.5-4.7 1z" />
      <path d="M12 6.8c0-1.7 1.1-2.9 2.8-3.1" />
    </>
  ),
  utensils: (
    <>
      <path d="M6 3.5v4.5a2.5 2.5 0 0 0 5 0V3.5" />
      <path d="M8.5 10.5v10" />
      <path d="M17.5 3.5c-2 2-3 4.8-3 7.7 0 .8.6 1.3 1.4 1.3h1.6v8" />
    </>
  ),
  drop: <path d="M12 3.5c3.4 4.2 5.9 7.3 5.9 10.3a5.9 5.9 0 0 1-11.8 0c0-3 2.5-6.1 5.9-10.3z" />,
  // ---- まなぶ・つくる ----
  code: (
    <>
      <path d="M8.5 8l-4 4 4 4" />
      <path d="M15.5 8l4 4-4 4" />
      <path d="M13.2 5.5l-2.4 13" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 .2 17c1.3 0 1.9-.8 1.9-1.7 0-.8-.6-1.3-.6-2.1 0-1 .8-1.7 1.9-1.7h2a3 3 0 0 0 3.1-3c0-4.8-3.9-8.5-8.5-8.5z" />
      <circle cx="7.6" cy="10.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.6" cy="7.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="7.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="10.2" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  music: (
    <>
      <circle cx="7" cy="17.5" r="2.6" />
      <circle cx="16.5" cy="15.5" r="2.6" />
      <path d="M9.6 17.5V6.3l9.5-2v11.2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2.2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.4 2.3 3.7 5 3.7 8s-1.3 5.7-3.7 8c-2.4-2.3-3.7-5-3.7-8S9.6 6.3 12 4z" />
    </>
  ),
  headphones: (
    <>
      <path d="M4.5 16v-3.5a7.5 7.5 0 0 1 15 0V16" />
      <path d="M4.5 13.5H6A1.5 1.5 0 0 1 7.5 15v3A1.5 1.5 0 0 1 6 19.5H4.5z" />
      <path d="M19.5 13.5H18a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h1.5z" />
    </>
  ),
  // ---- くらし ----
  bed: (
    <>
      <path d="M3 6.5v12" />
      <path d="M3 13.5h18v5" />
      <path d="M21 13.5v-2a2 2 0 0 0-2-2h-8.5v4" />
      <circle cx="6.7" cy="11" r="1.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5c.7 4 2.1 6.8 8.5 8.5-6.4 1.7-7.8 4.5-8.5 8.5-.7-4-2.1-6.8-8.5-8.5 6.4-1.7 7.8-4.5 8.5-8.5z" />
  ),
  mail: (
    <>
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="M4 7.2l8 5.8 8-5.8" />
    </>
  ),
  leaf: (
    <>
      <path d="M5.5 18.5c0-8 5.5-13 13.5-13.5.3 8.5-4.5 13.8-13.5 13.5z" />
      <path d="M5.5 18.5C8.5 14 12 10.5 16 8" />
    </>
  ),
  tooth: (
    <path d="M12 5.6c-1-.8-2.4-1.4-3.7-1.2C6 4.8 4.7 6.7 5 9c.2 1.6 1 2.6 1.4 4 .5 1.7.6 3.6 1.3 5.3.3.7 1.3.8 1.7.1.6-1.2.8-3.3 2.6-3.3s2 2.1 2.6 3.3c.4.7 1.4.6 1.7-.1.7-1.7.8-3.6 1.3-5.3.4-1.4 1.2-2.4 1.4-4 .3-2.3-1-4.2-3.3-4.6-1.3-.2-2.7.4-3.7 1.2z" />
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 8l2.5 3.6L14.5 8" />
      <path d="M12 11.6v4.9" />
      <path d="M9.7 13.6h4.6" />
    </>
  ),
  game: (
    <>
      <path d="M7 8h10a4.5 4.5 0 0 1 4.5 4.5c0 2.5-2 4.6-4.5 4.5-1.4 0-2.7-.7-3.5-1.8h-3c-.8 1.1-2.1 1.8-3.5 1.8A4.5 4.5 0 0 1 2.5 12.5 4.5 4.5 0 0 1 7 8z" />
      <path d="M7.5 11v3" />
      <path d="M6 12.5h3" />
      <circle cx="15.7" cy="11.7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13.7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  smokingOff: (
    <>
      <path d="M3.5 14.5h11v3h-11z" />
      <path d="M16.8 14.5v3" />
      <path d="M17.5 10.5c1.6 0 2.9 1.3 2.9 3v.5" />
      <path d="M4.5 4.5l15 15" />
    </>
  ),
  // ---- しるし ----
  star: <path d="M12 3.6l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v6a4 4 0 0 1-8 0z" />
      <path d="M8 5.2H5v1.3A3.5 3.5 0 0 0 8.3 10" />
      <path d="M16 5.2h3v1.3A3.5 3.5 0 0 1 15.7 10" />
      <path d="M12 14v3.5" />
      <path d="M8.8 20.5h6.4" />
    </>
  ),
};

/** 全アイコン名 (カタログやピッカーでの列挙用) */
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

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
