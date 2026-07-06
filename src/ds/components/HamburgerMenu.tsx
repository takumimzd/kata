// ============================================================
//  kata — HamburgerMenu
//  ハンバーガーアイコンボタン + Drawer の複合コンポーネント。
//  制御 / 非制御の両モードに対応。押すと Drawer が左 (or 右) から開く。
//  中身は children にそのまま渡す (SideNav / TabBar など何でも入る)。
// ============================================================
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Drawer, type DrawerSide } from './Drawer';
import { Icon } from './Icon';
import styles from './HamburgerMenu.module.css';

interface HamburgerMenuProps {
  /** ドロワーの中身 (メニュー本体) */
  children: ReactNode;
  /** せり出す辺。既定 left */
  side?: DrawerSide;
  /** ドロワーのヘッダータイトル */
  title?: ReactNode;
  /** ドロワー下部にピン留めする領域 (テーマ切替など) */
  drawerFooter?: ReactNode;
  /** 制御モード。省略時は内部 state で開閉。 */
  open?: boolean;
  /** 制御モード時の開閉ハンドラ */
  onOpenChange?: (open: boolean) => void;
  /** aria-label (trigger 用)。既定 "メニュー" */
  triggerLabel?: string;
  /** trigger のアイコンサイズ。既定 20 */
  iconSize?: number;
  /** trigger のカスタムクラス */
  triggerClassName?: string;
}

export function HamburgerMenu({
  children,
  side = 'left',
  title,
  drawerFooter,
  open: controlled,
  onOpenChange,
  triggerLabel = 'メニュー',
  iconSize = 20,
  triggerClassName,
}: HamburgerMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlled !== undefined;
  const open = isControlled ? !!controlled : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <>
      <button
        type="button"
        aria-label={triggerLabel}
        aria-expanded={open}
        className={cn(styles.trigger, open && styles.triggerActive, triggerClassName)}
        onClick={() => setOpen(!open)}
      >
        <Icon name="menu" size={iconSize} />
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} side={side} title={title} footer={drawerFooter}>
        {children}
      </Drawer>
    </>
  );
}
