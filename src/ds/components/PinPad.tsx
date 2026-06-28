// ============================================================
//  kata — PinPad (PIN/パスコード入力ドット + テンキー)
//  プレゼンテーション専用。入力ロジックは利用側で持つ。
// ============================================================
import { cn } from '../lib/cn';
import styles from './PinPad.module.css';

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

interface PinPadProps {
  /** PIN の桁数 (ドットの数)。既定は 4 */
  length?: number;
  /** 入力済みの桁数 */
  enteredCount: number;
  /** 認証失敗などで揺らす */
  shake: boolean;
  onPress: (digit: string) => void;
  onErase: () => void;
}

export function PinPad({ length = 4, enteredCount, shake, onPress, onErase }: PinPadProps) {
  return (
    <>
      <div className={cn(styles.dots, shake && styles.shake)}>
        {Array.from({ length }, (_, i) => (
          <div key={i} className={cn(styles.dot, i < enteredCount && styles.dotFilled)} />
        ))}
      </div>
      <div className={styles.pad}>
        {DIGITS.map((digit) => (
          <button key={digit} type="button" className={styles.key} onClick={() => onPress(digit)}>
            {digit}
          </button>
        ))}
        <div />
        <button type="button" className={styles.key} onClick={() => onPress('0')}>
          0
        </button>
        <button
          type="button"
          className={cn(styles.key, styles.keyGhost)}
          onClick={onErase}
          aria-label="1文字削除"
        >
          削除
        </button>
      </div>
    </>
  );
}
