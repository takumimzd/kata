// ============================================================
//  kata — DatePicker
//  ネイティブ <input type="date"> の代替。値は "YYYY-MM-DD"。
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { parseYmd, today as todayFn, WEEKDAYS } from '../../lib/date';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  /** これより後の日付は選択不可 */
  max?: string;
  /** これより前の日付は選択不可 */
  min?: string;
}

function fmtTrigger(s: string): string {
  const d = parseYmd(s);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}/${mm}/${dd} (${WEEKDAYS[d.getDay()]})`;
}

export function DatePicker({ value, onChange, max, min }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => value.slice(0, 7)); // YYYY-MM
  const wrapRef = useRef<HTMLDivElement>(null);

  // 開くたびに選択値の月を表示
  useEffect(() => {
    if (open) setView(value.slice(0, 7));
  }, [open, value]);

  // 外側クリック / Escape で閉じる
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const [y, m] = view.split('-').map(Number);
  const startDow = new Date(y, m - 1, 1).getDay();
  const days = new Date(y, m, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const shift = (delta: number) => {
    const dt = new Date(y, m - 1 + delta, 1);
    setView(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`);
  };
  const maxMonth = max?.slice(0, 7);
  const minMonth = min?.slice(0, 7);
  const canNext = !maxMonth || view < maxMonth;
  const canPrev = !minMonth || view > minMonth;

  const pick = (d: number) => {
    onChange(`${view}-${String(d).padStart(2, '0')}`);
    setOpen(false);
  };

  const today = todayFn();

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="calendar" size={16} className={styles.calIcon} />
        <span className={styles.value}>{fmtTrigger(value)}</span>
        <Icon name="chevron" size={16} className={cn(styles.chev, open && styles.chevOpen)} />
      </button>

      {open && (
        <div className={styles.pop} role="dialog" aria-label="日付を選択">
          <div className={styles.head}>
            <IconButton label="前の月" onClick={() => shift(-1)} disabled={!canPrev}>
              <Icon name="chevron" size={18} className={styles.flip} />
            </IconButton>
            <span className={styles.title}>
              {y}年 {m}月
            </span>
            <IconButton label="次の月" onClick={() => shift(1)} disabled={!canNext}>
              <Icon name="chevron" size={18} />
            </IconButton>
          </div>
          <div className={cn(styles.grid, styles.dowRow)}>
            {WEEKDAYS.map((d, i) => (
              <span key={d} className={cn(styles.dowc, i === 0 && styles.sun, i === 6 && styles.sat)}>
                {d}
              </span>
            ))}
          </div>
          <div className={styles.grid}>
            {cells.map((d, i) => {
              if (d == null) return <span key={`e${i}`} className={styles.empty} />;
              const ds = `${view}-${String(d).padStart(2, '0')}`;
              const disabled = (!!max && ds > max) || (!!min && ds < min);
              const selected = ds === value;
              const isToday = ds === today;
              return (
                <button
                  type="button"
                  key={ds}
                  disabled={disabled}
                  className={cn(
                    styles.cell,
                    selected && styles.selected,
                    isToday && !selected && styles.today,
                  )}
                  onClick={() => pick(d)}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
