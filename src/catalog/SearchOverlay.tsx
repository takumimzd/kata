// カタログ全体の検索オーバーレイ。トップバーの虫めがねから呼ぶ。
// キー: ↑↓ で移動、Enter で遷移、Esc で閉じる、Cmd/Ctrl+K でも開く。
import { Link, useRouter } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COMPONENTS, GROUPS, type GroupKey } from './components-registry';
import styles from './SearchOverlay.module.css';

const GROUP_LABEL: Record<GroupKey, string> = {
  root: 'ベース',
  forms: 'フォーム',
  charts: 'チャート',
  editor: 'エディタ',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Hit {
  slug: string;
  name: string;
  desc: string;
  to: string;
  group: GroupKey;
}

function matches(text: string, q: string): boolean {
  if (!q) return true;
  return text.toLowerCase().includes(q);
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const hits: Hit[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPONENTS.filter(
      (c) => matches(c.name, q) || matches(c.slug, q) || matches(c.desc, q),
    ).map((c) => ({ slug: c.slug, name: c.name, desc: c.desc, to: c.to, group: c.group }));
  }, [query]);

  // オープン時にフォーカス & クエリリセット
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIdx(0);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // クエリが変わったら active を先頭に
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // active が変わったらリスト内でスクロール
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  // body スクロール止め
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(hits.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      const hit = hits[activeIdx];
      if (hit) {
        onClose();
        router.navigate({ to: hit.to });
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  // group ごとに hits を分ける (表示順は GROUPS の並び)
  const byGroup: Record<GroupKey, Hit[]> = { root: [], forms: [], charts: [], editor: [] };
  hits.forEach((h) => byGroup[h.group].push(h));

  let idxCursor = 0;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchRow}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.searchIcon}
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="コンポーネントを検索 (例: button, chart, calendar)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            className={styles.input}
          />
          <span className={styles.count}>
            {hits.length} / {COMPONENTS.length}
          </span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="閉じる">
            ESC
          </button>
        </div>

        <div className={styles.list} ref={listRef}>
          {hits.length === 0 ? (
            <div className={styles.empty}>
              「{query}」に一致するコンポーネントはありません。
            </div>
          ) : (
            GROUPS.map((g) => {
              const list = byGroup[g.key];
              if (list.length === 0) return null;
              return (
                <div key={g.key}>
                  <div className={styles.groupLabel}>
                    {GROUP_LABEL[g.key]} · {g.key}
                  </div>
                  {list.map((hit) => {
                    const idx = idxCursor++;
                    const active = idx === activeIdx;
                    return (
                      <Link
                        key={hit.slug}
                        to={hit.to}
                        data-idx={idx}
                        className={`${styles.item}${active ? ` ${styles.itemActive}` : ''}`}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIdx(idx)}
                      >
                        <span className={styles.itemName}>{hit.name}</span>
                        <span className={styles.itemDesc}>{hit.desc}</span>
                        <span className={styles.itemTag}>{hit.group}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className={styles.hint}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>移動
          </span>
          <span>
            <kbd>Enter</kbd>開く
          </span>
          <span>
            <kbd>Esc</kbd>閉じる
          </span>
        </div>
      </div>
    </div>
  );
}
