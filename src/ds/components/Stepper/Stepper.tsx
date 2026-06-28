// ============================================================
//  kata — Stepper (数値の +/- 調整)
// ============================================================
import { Icon } from '../Icon/Icon';
import styles from './Stepper.module.css';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  /** 1 回の増減量 */
  step?: number;
  min?: number;
  max?: number;
  /** 値の後ろに付ける単位 */
  suffix?: string;
  /** 小数桁数 */
  decimals?: number;
}

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  suffix = '',
  decimals = 0,
}: StepperProps) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(Math.min(max ?? Infinity, +(value + step).toFixed(2)));
  const disp = decimals > 0 ? Number(value).toFixed(decimals) : value;
  return (
    <div className={styles.stepper}>
      <button type="button" onClick={dec} aria-label="減らす">
        <Icon name="minus" size={16} />
      </button>
      <span className={styles.val}>
        {disp}
        {suffix}
      </span>
      <button type="button" onClick={inc} aria-label="増やす">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
