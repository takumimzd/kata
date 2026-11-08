// ============================================================
//  kata — Menu (開いた状態のドロップダウンメニュー)
//  トリガーボタンとは分離した「開くメニュー」だけを提供する。
//  利用側が position:relative なラッパでトリガーと並べ、開閉状態を制御する。
//  キーボード: 開くと先頭の項目へフォーカスし、↑↓ / Home / End で移動、
//  Esc・Tab で閉じてトリガーへ戻る (トリガーには aria-haspopup / aria-expanded を付ける)。
//  例:
//    <div style={{ position: 'relative' }}>
//      <button onPointerDown={(e) => { e.stopPropagation(); setOpen(v => !v) }}>…</button>
//      {open && (
//        <Menu onClose={() => setOpen(false)}>
//          <MenuItem icon={<Icon name="pin" />} onClick={onPin}>ピン留め</MenuItem>
//          <MenuItem icon={<Icon name="trash" />} danger onClick={onDelete}>削除</MenuItem>
//        </Menu>
//      )}
//    </div>
// ============================================================
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import styles from './Menu.module.css';

/** MenuItem 選択時にメニューを閉じるためのコールバックを配る */
const MenuCloseContext = createContext<() => void>(() => {});

interface MenuProps {
  /** 閉じる要求 (外側クリック / Esc・Tab / 項目選択時に呼ばれる) */
  onClose: () => void;
  /** トリガーに対する寄せ方向。既定は右寄せ */
  align?: 'left' | 'right';
  children: ReactNode;
  className?: string;
}

export function Menu({ onClose, align = 'right', children, className }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 開いた時点のフォーカス (= トリガー)。エフェクトの中で読むと、開発時の
  // 二重実行で先頭の項目を拾ってしまうので、最初の描画で覚えておく
  const [trigger] = useState(() =>
    typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null),
  );

  // 外側のクリックで閉じる。マウント後に登録するので、開いた瞬間の
  // クリックでは閉じない (パネル内の pointerdown は stopPropagation で除外)。
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [onClose]);

  // 開いたら先頭の項目へ。閉じたとき、フォーカスが行き場を失っていればトリガーへ戻す
  useEffect(() => {
    items(ref.current)[0]?.focus({ preventScroll: true });
    return () => {
      const active = document.activeElement;
      if ((!active || active === document.body) && trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [trigger]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = items(ref.current);
    const i = list.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    if (e.key === 'ArrowDown') next = list[(i + 1) % list.length];
    else if (e.key === 'ArrowUp') next = list[(i - 1 + list.length) % list.length];
    else if (e.key === 'Home') next = list[0];
    else if (e.key === 'End') next = list[list.length - 1];
    else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
      return;
    } else return;
    e.preventDefault();
    next?.focus();
  };

  return (
    <MenuCloseContext.Provider value={onClose}>
      <div
        ref={ref}
        className={cn(styles.menu, align === 'left' ? styles.left : styles.right, className)}
        role="menu"
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </MenuCloseContext.Provider>
  );
}

function items(root: HTMLElement | null): HTMLElement[] {
  return root ? Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];
}

interface MenuItemProps {
  /** 行頭のアイコンなど */
  icon?: ReactNode;
  /** 破壊的操作 (削除など) は赤系で表示する */
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function MenuItem({ icon, danger = false, onClick, children }: MenuItemProps) {
  const close = useContext(MenuCloseContext);
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={cn(styles.item, danger && styles.danger)}
      onClick={() => {
        close();
        onClick();
      }}
    >
      {icon}
      {children}
    </button>
  );
}
