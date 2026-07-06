// カタログ全体で共有する各コンポーネントの静的サムネイル。
// 一覧ページのカード / モバイル画面 / コンポーネント詳細の「関連」で使い回す。
// 実物のライブデモは各コンポーネント詳細ページの Demo に置く。
import type { CSSProperties, ReactNode } from 'react';
import { Badge, Button, Chip, Icon, IconButton, Text } from 'kata';

const bar = (style: CSSProperties): CSSProperties => ({
  height: 4,
  background: 'var(--fill-2)',
  borderRadius: 2,
  ...style,
});

const line: CSSProperties = { height: 1, background: 'var(--line-2)' };

function CalGrid({ cell = 12, gap = 4, dots = false }: { cell?: number; gap?: number; dots?: boolean }) {
  const cells = [];
  for (let i = 0; i < 35; i++) {
    let bg = 'var(--fill-1)';
    if (dots) {
      const rand = (i * 7 + 3) % 11;
      if (rand < 2) bg = 'var(--accent)';
      else if (rand < 4) bg = 'var(--accent-line)';
      else if (rand < 6) bg = 'var(--accent-soft)';
    } else if (i === 15) {
      bg = 'var(--accent)';
    }
    cells.push(
      <div
        key={i}
        style={{ width: cell, height: cell, borderRadius: dots ? '50%' : 3, background: bg }}
      />,
    );
  }
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, gap }}>{cells}</div>;
}

// --- 各プレビュー ---
const previews: Record<string, () => ReactNode> = {
  button: () => <Button variant="primary">保存</Button>,
  'icon-button': () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton label="edit">
        <Icon name="edit" size={16} />
      </IconButton>
      <IconButton label="copy">
        <Icon name="copy" size={16} />
      </IconButton>
      <IconButton label="trash">
        <Icon name="trash" size={16} />
      </IconButton>
    </div>
  ),
  fab: () => (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'var(--accent)',
        color: 'var(--on-accent)',
        display: 'grid',
        placeItems: 'center',
        boxShadow: 'var(--shadow)',
      }}
    >
      <Icon name="plus" size={22} />
    </div>
  ),
  breadcrumb: () => (
    <div
      style={{
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        fontSize: 11.5,
        color: 'var(--text-dim)',
        fontFamily: 'var(--num)',
      }}
    >
      <span>概要</span>
      <span style={{ color: 'var(--text-faint)' }}>/</span>
      <span>コンポーネント</span>
      <span style={{ color: 'var(--text-faint)' }}>/</span>
      <span style={{ color: 'var(--text)', fontWeight: 600 }}>Button</span>
    </div>
  ),
  'action-sheet': () => (
    <div
      style={{
        position: 'relative',
        width: 130,
        height: 78,
        background: 'var(--surface-2)',
        border: '1px solid var(--line)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 46,
          background: 'var(--surface)',
          borderTop: '1px solid var(--line-2)',
          borderRadius: '10px 10px 0 0',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div
          style={{
            width: 30,
            height: 3,
            background: 'var(--text-faint)',
            borderRadius: 2,
            margin: '2px auto 6px',
            opacity: 0.5,
          }}
        />
        <div style={line} />
        <div style={line} />
      </div>
    </div>
  ),
  icon: () => (
    <div style={{ display: 'flex', gap: 12, color: 'var(--text)' }}>
      <Icon name="flame" size={22} />
      <Icon name="glass" size={22} />
      <Icon name="scale" size={22} />
      <Icon name="pill" size={22} />
    </div>
  ),
  text: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 150 }}>
      <div style={{ fontSize: 12.5, color: 'var(--text)', fontWeight: 600 }}>本文テキスト</div>
      <div style={bar({ width: '92%' })} />
      <div style={bar({ width: '80%' })} />
      <div style={bar({ width: '64%', background: 'var(--fill-1)' })} />
    </div>
  ),
  'page-title': () => (
    <div
      style={{
        fontFamily: 'var(--ja)',
        fontSize: 22,
        fontWeight: 700,
        color: 'var(--text)',
        letterSpacing: '0.01em',
      }}
    >
      見出し
    </div>
  ),
  'section-title': () => (
    <div style={{ width: 150 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}
      >
        SECTION
      </div>
      <div style={{ ...line, marginTop: 6 }} />
    </div>
  ),
  card: () => (
    <div
      style={{
        width: 130,
        height: 68,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 10,
        padding: 8,
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ height: 5, background: 'var(--fill-2)', width: '55%', borderRadius: 2 }} />
      <div style={{ height: 3, background: 'var(--fill-1)', width: '80%', borderRadius: 2 }} />
      <div style={{ height: 3, background: 'var(--fill-1)', width: '68%', borderRadius: 2 }} />
    </div>
  ),
  badge: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Badge variant="accent">完了</Badge>
      <Badge>継続 3日</Badge>
    </div>
  ),
  chip: () => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Chip active>筋トレ</Chip>
      <Chip>水分</Chip>
      <Chip>体重</Chip>
    </div>
  ),
  'progress-bar': () => (
    <div style={{ width: 160, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--num)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
        }}
      >
        <span>62%</span>
        <span>目標</span>
      </div>
      <div style={{ height: 6, background: 'var(--fill-1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: '62%', height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
      </div>
    </div>
  ),
  'goal-bar': () => (
    <div style={{ width: 160, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--num)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
        }}
      >
        <span>55kg</span>
        <span style={{ color: 'var(--accent)' }}>62kg</span>
        <span>70kg</span>
      </div>
      <div
        style={{
          position: 'relative',
          height: 6,
          background: 'var(--fill-1)',
          borderRadius: 3,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '30%',
            right: '20%',
            top: 0,
            bottom: 0,
            background: 'var(--accent-soft)',
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '55%',
            top: -3,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'var(--accent)',
            border: '2px solid var(--surface)',
          }}
        />
      </div>
    </div>
  ),
  'search-box': () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 160,
        padding: '7px 12px',
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 999,
        fontSize: 12,
        color: 'var(--text-faint)',
      }}
    >
      <Icon name="search" size={14} />
      <span>検索...</span>
    </div>
  ),
  calendar: () => <CalGrid />,
  'dot-calendar': () => <CalGrid cell={10} dots />,
  'pin-pad': () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: i < 3 ? 'var(--accent)' : 'var(--fill-2)',
            border: i >= 3 ? '1px solid var(--line-2)' : 'none',
          }}
        />,
      );
    }
    const nums = [];
    for (let i = 1; i <= 9; i++) {
      nums.push(
        <div
          key={i}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'var(--surface-2)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--num)',
            fontSize: 10,
            color: 'var(--text-dim)',
            fontWeight: 600,
          }}
        >
          {i}
        </div>,
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>{dots}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 22px)', gap: 4 }}>{nums}</div>
      </div>
    );
  },
  'icon-color-picker': () => (
    <div style={{ display: 'flex', gap: 6 }}>
      {(['var(--accent)', 'var(--clay)', 'var(--danger)', 'var(--text-dim)'] as const).map((c, i) => (
        <div
          key={c}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: c,
            border: i === 0 ? '2px solid var(--surface)' : 'none',
            boxShadow: i === 0 ? '0 0 0 2px var(--accent)' : 'none',
          }}
        />
      ))}
    </div>
  ),
  modal: () => (
    <div
      style={{
        width: 150,
        height: 82,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 10,
        padding: 10,
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)' }}>タイトル</div>
      <div style={{ height: 3, background: 'var(--fill-1)', width: '86%', borderRadius: 2 }} />
      <div style={{ height: 3, background: 'var(--fill-1)', width: '72%', borderRadius: 2 }} />
      <div style={{ display: 'flex', gap: 4, marginTop: 'auto', justifyContent: 'flex-end' }}>
        <div style={{ width: 32, height: 14, background: 'var(--fill-2)', borderRadius: 3 }} />
        <div style={{ width: 32, height: 14, background: 'var(--accent)', borderRadius: 3 }} />
      </div>
    </div>
  ),
  menu: () => (
    <div
      style={{
        width: 132,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 8,
        padding: 5,
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {['複製する', '共有する', '削除'].map((t, i) => (
        <div
          key={t}
          style={{
            padding: '4px 8px',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            fontSize: 10.5,
            color: i === 0 ? 'var(--text)' : 'var(--text-dim)',
            background: i === 0 ? 'var(--fill-1)' : 'transparent',
            borderRadius: 4,
          }}
        >
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
          <span>{t}</span>
        </div>
      ))}
    </div>
  ),
  'confirm-dialog': () => (
    <div
      style={{
        width: 150,
        height: 82,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 10,
        padding: 10,
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)' }}>削除しますか？</div>
      <div style={{ height: 3, background: 'var(--fill-1)', width: '76%', borderRadius: 2 }} />
      <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
        <div
          style={{ flex: 1, height: 16, background: 'var(--surface-2)', border: '1px solid var(--line-2)', borderRadius: 4 }}
        />
        <div style={{ flex: 1, height: 16, background: 'var(--danger)', borderRadius: 4 }} />
      </div>
    </div>
  ),
  toast: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        background: 'var(--clay)',
        color: 'var(--on-accent)',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-2)' }} />
      <span>保存しました</span>
    </div>
  ),
  'side-nav': () => (
    <div
      style={{
        width: 130,
        height: 84,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 8,
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {(
        [
          { on: false, t: '概要' },
          { on: false, t: '特徴' },
          { on: true, t: 'コンポーネント' },
          { on: false, t: 'トークン' },
        ] as const
      ).map((r) => (
        <div
          key={r.t}
          style={{
            padding: '3px 6px',
            fontSize: 10,
            color: r.on ? 'var(--accent)' : 'var(--text-dim)',
            background: r.on ? 'var(--accent-soft)' : 'transparent',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
          <span>{r.t}</span>
        </div>
      ))}
    </div>
  ),
  // ---- forms ----
  field: () => (
    <div style={{ width: 160, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>メールアドレス</div>
      <div
        style={{
          height: 26,
          background: 'var(--surface)',
          border: '1px solid var(--line-2)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 10.5,
          color: 'var(--text-faint)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        name@example.com
      </div>
    </div>
  ),
  input: () => (
    <div
      style={{
        width: 160,
        height: 30,
        background: 'var(--surface)',
        border: '1px solid var(--accent-line)',
        borderRadius: 6,
        padding: '5px 10px',
        fontSize: 12,
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      入力中...
    </div>
  ),
  stepper: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--line-2)',
        borderRadius: 6,
        background: 'var(--surface)',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--text-dim)',
          fontSize: 13,
          fontFamily: 'var(--num)',
        }}
      >
        −
      </div>
      <div
        style={{
          width: 36,
          height: 28,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--text)',
          fontSize: 13,
          fontFamily: 'var(--num)',
          fontWeight: 600,
          borderLeft: '1px solid var(--line-2)',
          borderRight: '1px solid var(--line-2)',
        }}
      >
        3
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--accent)',
          fontSize: 13,
          fontFamily: 'var(--num)',
        }}
      >
        +
      </div>
    </div>
  ),
  textarea: () => (
    <div
      style={{
        width: 160,
        height: 62,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 6,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ height: 3, background: 'var(--fill-2)', width: '86%', borderRadius: 2 }} />
      <div style={{ height: 3, background: 'var(--fill-2)', width: '92%', borderRadius: 2 }} />
      <div style={{ height: 3, background: 'var(--fill-1)', width: '56%', borderRadius: 2 }} />
    </div>
  ),
  select: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 160,
        height: 30,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 6,
        padding: '5px 10px',
        fontSize: 12,
        color: 'var(--text)',
      }}
    >
      <span>筋トレ</span>
      <span style={{ marginLeft: 'auto', color: 'var(--text-faint)', fontFamily: 'var(--num)' }}>⌄</span>
    </div>
  ),
  'search-select': () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 160,
        height: 30,
        background: 'var(--surface)',
        border: '1px solid var(--accent-line)',
        borderRadius: 6,
        padding: '5px 10px',
        fontSize: 12,
        gap: 6,
      }}
    >
      <Icon name="search" size={12} />
      <span style={{ color: 'var(--text)' }}>検索して選択</span>
      <span style={{ marginLeft: 'auto', color: 'var(--text-faint)', fontFamily: 'var(--num)' }}>⌄</span>
    </div>
  ),
  switch: () => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <div
        style={{
          width: 34,
          height: 20,
          background: 'var(--accent)',
          borderRadius: 999,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--on-accent)',
          }}
        />
      </div>
      <div
        style={{
          width: 34,
          height: 20,
          background: 'var(--fill-2)',
          borderRadius: 999,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--surface)',
          }}
        />
      </div>
    </div>
  ),
  'date-picker': () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 160,
        height: 30,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 6,
        padding: '5px 10px',
        fontSize: 12,
        color: 'var(--text)',
      }}
    >
      <Icon name="calendar" size={14} />
      <span style={{ fontFamily: 'var(--num)' }}>2026 / 07 / 06</span>
    </div>
  ),
  // ---- charts ----
  'bar-chart': () => {
    const heights = [22, 34, 18, 42, 28, 46, 32];
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 60 }}>
        {heights.map((h, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: h,
              background: i === 5 ? 'var(--accent)' : 'var(--accent-line)',
              borderRadius: '2px 2px 0 0',
            }}
          />
        ))}
      </div>
    );
  },
  'line-chart': () => {
    const pts = '4,52 26,38 50,44 74,20 98,30 122,14 146,26';
    return (
      <svg width="160" height="60" viewBox="0 0 160 60" style={{ overflow: 'visible' }}>
        <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={`4,60 ${pts} 146,60`} fill="var(--accent-soft)" stroke="none" />
      </svg>
    );
  },
  'bar-list': () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 160 }}>
      {[
        { l: '筋トレ', v: 90 },
        { l: '水分', v: 66 },
        { l: '睡眠', v: 44 },
      ].map((r) => (
        <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--text-dim)' }}>
          <span style={{ width: 34, fontFamily: 'var(--ja)' }}>{r.l}</span>
          <div style={{ flex: 1, height: 8, background: 'var(--fill-1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${r.v}%`, height: '100%', background: 'var(--accent)' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--num)',
              color: 'var(--text)',
              fontWeight: 600,
              width: 22,
              textAlign: 'right',
            }}
          >
            {r.v}
          </span>
        </div>
      ))}
    </div>
  ),
  heatmap: () => {
    const cells = [];
    for (let w = 0; w < 12; w++) {
      for (let d = 0; d < 7; d++) {
        const seed = (w * 7 + d) * 13;
        const rand = ((seed * 9301 + 49297) % 233280) / 233280;
        let bg = 'var(--fill-1)';
        if (rand > 0.85) bg = 'var(--accent)';
        else if (rand > 0.7) bg = 'var(--accent-line)';
        else if (rand > 0.5) bg = 'var(--accent-soft)';
        cells.push(
          <div
            key={`${w}-${d}`}
            style={{
              width: 8,
              height: 8,
              background: bg,
              borderRadius: 2,
            }}
          />
        );
      }
    }
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(7, 8px)',
          gridAutoFlow: 'column',
          gridAutoColumns: '8px',
          gap: 2,
        }}
      >
        {cells}
      </div>
    );
  },
  'stacked-bar-chart': () => {
    const bars = [
      [16, 10, 6],
      [22, 12, 8],
      [12, 18, 6],
      [30, 14, 8],
      [20, 20, 10],
      [24, 22, 12],
      [16, 26, 14],
    ];
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 60 }}>
        {bars.map((s, i) => {
          const [a = 0, b = 0, c = 0] = s;
          const total = a + b + c;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 10,
                height: total,
                borderRadius: '2px 2px 0 0',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: c, background: 'var(--accent-soft)' }} />
              <div style={{ height: b, background: 'var(--accent-line)' }} />
              <div style={{ height: a, background: 'var(--accent)' }} />
            </div>
          );
        })}
      </div>
    );
  },
  sparkline: () => {
    const pts = '2,26 14,22 26,28 38,14 50,20 62,10 74,16 86,6';
    return (
      <svg width="100" height="32" viewBox="0 0 90 32">
        <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={86} cy={6} r={2.2} fill="var(--accent)" />
      </svg>
    );
  },
  'tab-bar': () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 150,
        padding: '6px 6px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        boxShadow: 'var(--shadow-sm)',
        gap: 4,
      }}
    >
      {(
        [
          { l: '概要', on: true, name: 'home' },
          { l: '特徴', on: false, name: 'book' },
          { l: '部品', on: false, name: 'note' },
        ] as const
      ).map((t) => (
        <div
          key={t.l}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            color: t.on ? 'var(--accent)' : 'var(--text-dim)',
            fontFamily: 'var(--num)',
            fontSize: 8.5,
            fontWeight: 600,
          }}
        >
          <Icon name={t.name} size={14} />
          <span style={{ fontFamily: 'var(--ja)' }}>{t.l}</span>
        </div>
      ))}
    </div>
  ),
  drawer: () => (
    <div
      style={{
        position: 'relative',
        width: 140,
        height: 82,
        background: 'var(--surface-2)',
        border: '1px solid var(--line)',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <div
        style={{
          width: 72,
          background: 'var(--bg-2)',
          borderRight: '1px solid var(--line-2)',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 2,
          }}
        >
          MENU
        </div>
        <div style={{ height: 4, background: 'var(--accent-soft)', borderRadius: 2, width: '90%' }} />
        <div style={{ height: 3, background: 'var(--fill-2)', borderRadius: 2, width: '75%' }} />
        <div style={{ height: 3, background: 'var(--fill-2)', borderRadius: 2, width: '65%' }} />
        <div style={{ height: 3, background: 'var(--fill-1)', borderRadius: 2, width: '80%' }} />
      </div>
      <div style={{ flex: 1, background: 'color-mix(in srgb, #000 12%, transparent)' }} />
    </div>
  ),
  'hamburger-menu': () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 40,
          height: 32,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          borderRadius: 6,
        }}
      >
        <Icon name="menu" size={20} />
      </div>
      <span
        style={{
          fontSize: 9.5,
          color: 'var(--text-faint)',
          fontFamily: 'var(--num)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        tap → open
      </span>
    </div>
  ),
  // ---- editor ----
  'rich-text-editor': () => (
    <div
      style={{
        width: 170,
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 3,
          padding: 4,
          background: 'var(--surface-2)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        {['B', 'i', '⌐', '≡', '↩'].map((s) => (
          <div
            key={s}
            style={{
              width: 16,
              height: 16,
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--num)',
              fontSize: 9,
              fontWeight: 700,
              color: 'var(--text-dim)',
              borderRadius: 3,
            }}
          >
            {s}
          </div>
        ))}
      </div>
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ height: 4, background: 'var(--fill-2)', width: '85%', borderRadius: 2 }} />
        <div style={{ height: 4, background: 'var(--fill-2)', width: '70%', borderRadius: 2 }} />
        <div style={{ height: 4, background: 'var(--fill-1)', width: '50%', borderRadius: 2 }} />
      </div>
    </div>
  ),
};

export function preview(slug: string): ReactNode {
  const fn = previews[slug];
  if (fn) return fn();
  return <Text variant="caption">{slug}</Text>;
}
