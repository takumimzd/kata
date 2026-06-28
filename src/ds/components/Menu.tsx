// ============================================================
//  kata — Menu (開いた状態のドロップダウンメニュー)
//  トリガーボタンとは分離した「開くメニュー」だけを提供する。
//  利用側が position:relative なラッパでトリガーと並べ、開閉状態を制御する。
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
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import styles from './Menu.module.css';

/** MenuItem 選択時にメニューを閉じるためのコールバックを配る */
const MenuCloseContext = createContext<() => void>(() => {});

interface MenuProps {
  /** 閉じる要求 (外側クリック / キー入力 / 項目選択時に呼ばれる) */
  onClose: () => void;
  /** トリガーに対する寄せ方向。既定は右寄せ */
  align?: 'left' | 'right';
  children: ReactNode;
  className?: string;
}

export function Menu({ onClose, align = 'right', children, className }: MenuProps) {
  // 外側のクリック / キー入力で閉じる。マウント後に登録するので、開いた瞬間の
  // クリックでは閉じない (パネル内の pointerdown は stopPropagation で除外)。
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', close);
    };
  }, [onClose]);

  return (
    <MenuCloseContext.Provider value={onClose}>
      <div
        className={cn(styles.menu, align === 'left' ? styles.left : styles.right, className)}
        role="menu"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </MenuCloseContext.Provider>
  );
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
