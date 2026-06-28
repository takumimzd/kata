// ============================================================
//  kata — ConfirmDialog (Context + hook)
//  window.confirm の代替。useConfirm() で Promise<boolean> を得る。
// ============================================================
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from './forms/Button';
import { Icon } from './Icon';
import styles from './ConfirmDialog.module.css';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 破壊的操作 (削除など) は true。アイコン・ボタンが危険色になる */
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpts(options);
      }),
    [],
  );

  const close = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOpts(null);
  }, []);

  useEffect(() => {
    if (!opts) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Enter') close(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [opts, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {opts && (
        <div className={styles.overlay} onClick={() => close(false)}>
          <div
            className={styles.dialog}
            role="alertdialog"
            aria-modal
            onClick={(e) => e.stopPropagation()}
          >
            <span className={cn(styles.icon, opts.danger && styles.danger)}>
              <Icon name={opts.danger ? 'trash' : 'check'} size={22} />
            </span>
            <h3 className={styles.title}>{opts.title}</h3>
            {opts.message && <p className={styles.message}>{opts.message}</p>}
            <div className={styles.actions}>
              <Button variant="text" onClick={() => close(false)}>
                {opts.cancelLabel ?? 'キャンセル'}
              </Button>
              <Button variant={opts.danger ? 'danger' : 'primary'} onClick={() => close(true)}>
                {opts.danger && <Icon name="trash" size={16} />}
                {opts.confirmLabel ?? 'OK'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
