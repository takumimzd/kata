// ============================================================
//  kata — ConfirmDialog (Context + hook)
//  window.confirm の代替。useConfirm() で Promise<boolean> を得る。
//  開くと中へフォーカスを移す (破壊的操作はキャンセル、それ以外は確定ボタン)。
//  Enter はフォーカス中のボタンを押すだけで、どこにいても確定する動きはしない。
// ============================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useDialogFocus } from '../lib/focus';
import { Button } from './Button';
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
  // 呼び出しごとに増やして、ダイアログを作り直す (フォーカスの移動と復帰をやり直す)
  const [serial, setSerial] = useState(0);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setSerial((n) => n + 1);
        setOpts(options);
      }),
    [],
  );

  const close = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOpts(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {opts && <ConfirmDialogView key={serial} opts={opts} close={close} />}
    </ConfirmContext.Provider>
  );
}

function ConfirmDialogView({
  opts,
  close,
}: {
  opts: ConfirmOptions;
  close: (value: boolean) => void;
}) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  // 取り消せない操作でうっかり確定しないよう、破壊的操作はキャンセルに置く
  useDialogFocus(dialogRef, opts.danger ? cancelRef : confirmRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <div className={styles.overlay} onClick={() => close(false)}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="alertdialog"
        aria-modal
        aria-labelledby={titleId}
        aria-describedby={opts.message ? messageId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={cn(styles.icon, opts.danger && styles.danger)}>
          <Icon name={opts.danger ? 'trash' : 'check'} size={22} />
        </span>
        <h2 id={titleId} className={styles.title}>
          {opts.title}
        </h2>
        {opts.message && (
          <p id={messageId} className={styles.message}>
            {opts.message}
          </p>
        )}
        <div className={styles.actions}>
          <Button ref={cancelRef} variant="text" onClick={() => close(false)}>
            {opts.cancelLabel ?? 'キャンセル'}
          </Button>
          <Button
            ref={confirmRef}
            variant={opts.danger ? 'danger' : 'primary'}
            onClick={() => close(true)}
          >
            {opts.danger && <Icon name="trash" size={16} />}
            {opts.confirmLabel ?? 'OK'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
