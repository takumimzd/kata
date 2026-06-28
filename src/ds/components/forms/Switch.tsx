// ============================================================
//  kata — Switch (オン/オフ トグル)
// ============================================================
import { cn } from '../../lib/cn';
import styles from './Switch.module.css';

interface SwitchProps {
  on: boolean;
  onChange: (value: boolean) => void;
  /** スクリーンリーダー向けラベル */
  label?: string;
  disabled?: boolean;
}

export function Switch({ on, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      className={cn(styles.toggle, on && styles.on)}
      onClick={() => onChange(!on)}
    >
      <span className={styles.knob} />
    </button>
  );
}
