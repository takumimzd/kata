import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Calendar, today } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/calendar')({
  component: CalendarPage,
});

// デモ用: 適当な日にマーカーを出す
const MARKED = new Set(['03', '07', '08', '14', '20', '21', '25']);

function CalendarPage() {
  const [month, setMonth] = useState(() => today().slice(0, 7));

  const shift = (delta: number) => {
    const [y, m] = month.split('-').map(Number);
    const dt = new Date(y, m - 1 + delta, 1);
    setMonth(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <Doc title="Calendar" lede="月グリッドの土台。日付セルの中身 (マーカー等) は renderDay で注入する。凡例などドメイン固有の表示は利用側で組む。">
      <Demo>
        <div style={{ maxWidth: 360 }}>
          <Calendar
            month={month}
            today={today()}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            renderDay={(date) =>
              MARKED.has(date.slice(-2)) ? (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'block',
                  }}
                />
              ) : null
            }
          />
        </div>
      </Demo>
      <Code>{`<Calendar
  month={month}          // "YYYY-MM"
  today={today()}
  onPrev={() => shift(-1)}
  onNext={() => shift(1)}
  renderDay={(date) => marks.has(date) ? <Dot /> : null}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'month', type: 'string', desc: '"YYYY-MM"' },
          { name: 'today', type: 'string', desc: '"YYYY-MM-DD" (今日/未来判定)' },
          { name: 'onPrev / onNext', type: '() => void', desc: '月の移動' },
          { name: 'canPrev / canNext', type: 'boolean', def: 'true', desc: '移動の可否' },
          { name: 'renderDay', type: '(date) => ReactNode', desc: '日付セルに出す内容' },
          { name: 'onSelectDay', type: '(date) => void', desc: '指定するとセルがボタンに' },
        ]}
      />
    </Doc>
  );
}
