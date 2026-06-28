// ============================================================
//  kata — SearchSelect (検索付きセレクト / コンボボックス)
//  グループ分け・検索・キーボード操作に対応。
//  複数追加用途は closeOnSelect={false} で開いたまま使える。
// ============================================================
import { useMemo, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon';
import styles from './SearchSelect.module.css';

export interface SearchSelectOption {
  value: string;
  label: string;
  /** 同じ group の項目は見出し付きでまとめる */
  group?: string;
  /** 行頭に出すアイコン */
  icon?: ReactNode;
}

interface SearchSelectProps {
  options: SearchSelectOption[];
  onSelect: (value: string) => void;
  /** 選択中の値 (単一選択表示)。未指定なら placeholder を常時表示 */
  value?: string;
  placeholder?: string;
  /** コントロール左のアイコン */
  triggerIcon?: ReactNode;
  searchPlaceholder?: string;
  /** 絞り込み条件。既定はラベルの部分一致 (大文字小文字無視) */
  filter?: (option: SearchSelectOption, query: string) => boolean;
  /** 選択後に閉じるか (既定 true)。複数追加なら false */
  closeOnSelect?: boolean;
  emptyLabel?: ReactNode;
  /** 各オプション右端に出す内容 (hover で表示する + など) */
  optionTrailing?: ReactNode;
}

function defaultFilter(o: SearchSelectOption, q: string): boolean {
  return o.label.toLowerCase().includes(q.toLowerCase());
}

export function SearchSelect({
  options,
  onSelect,
  value,
  placeholder = '選択',
  triggerIcon,
  searchPlaceholder = '検索',
  filter = defaultFilter,
  closeOnSelect = true,
  emptyLabel = '該当する項目がありません',
  optionTrailing,
}: SearchSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const groups = useMemo(() => {
    const q = query.trim();
    const byGroup = new Map<string, SearchSelectOption[]>();
    for (const o of options) {
      if (q && !filter(o, q)) continue;
      const key = o.group ?? '';
      const list = byGroup.get(key) ?? [];
      list.push(o);
      byGroup.set(key, list);
    }
    return [...byGroup.entries()].map(([group, items]) => ({ group, items }));
  }, [options, query, filter]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const selected = value != null ? options.find((o) => o.value === value) : undefined;

  const pick = (v: string) => {
    onSelect(v);
    setQuery('');
    if (closeOnSelect) setOpen(false);
  };

  return (
    <div
      className={styles.select}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={cn(styles.control, open && styles.controlOpen)}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {triggerIcon}
        <span className={styles.controlLabel}>{selected ? selected.label : placeholder}</span>
        <Icon name="chevron" size={16} className={cn(styles.chevron, open && styles.chevronOpen)} />
      </button>

      {open && (
        <div className={styles.panel} role="listbox">
          <div className={styles.search}>
            <Icon name="search" size={15} />
            <input
              value={query}
              placeholder={searchPlaceholder}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const first = groups[0]?.items[0];
                  if (first) pick(first.value);
                }
              }}
            />
            {query && (
              <button
                type="button"
                className={styles.clear}
                aria-label="検索をクリア"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setQuery('')}
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>

          <div className={styles.list}>
            {total === 0 ? (
              <div className={styles.empty}>{emptyLabel}</div>
            ) : (
              groups.map((g) => (
                <div key={g.group} className={styles.group}>
                  {g.group && <div className={styles.groupLabel}>{g.group}</div>}
                  {g.items.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={styles.option}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(o.value)}
                    >
                      {o.icon}
                      <span className={styles.optionLabel}>{o.label}</span>
                      {optionTrailing && <span className={styles.trailing}>{optionTrailing}</span>}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
