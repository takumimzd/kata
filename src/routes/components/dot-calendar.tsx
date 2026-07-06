import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { DotCalendar, today, type CalendarSeries } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/dot-calendar')({
  component: DotCalendarPage,
});

// デモ用: 2系列の記録日
function demoSeries(month: string): CalendarSeries[] {
  const d = (day: string) => `${month}-${day}`;
  return [
    { id: 'run', label: 'ランニング', color: 'var(--accent)', dates: new Set([d('03'), d('07'), d('14'), d('21')]) },
    { id: 'read', label: '読書', color: '#7b5ea7', dates: new Set([d('03'), d('08'), d('20'), d('25')]) },
  ];
}

function DotCalendarPage() {
  const [month, setMonth] = useState(() => today().slice(0, 7));

  const shift = (delta: number) => {
    const [y = 1970, m = 1] = month.split('-').map(Number);
    const dt = new Date(y, m - 1 + delta, 1);
    setMonth(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <Doc
      title="DotCalendar"
      lede="Calendar に系列ごとの色ドットと凡例を重ねた定番構成。記録日・イベント日など、日付の集合を色で示す。"
    >
      <Demo>
        <div style={{ maxWidth: 360 }}>
          <DotCalendar
            month={month}
            today={today()}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            series={demoSeries(month)}
          />
        </div>
      </Demo>
      <Code>{`<DotCalendar
  month={month}
  today={today()}
  onPrev={prev}
  onNext={next}
  series={[
    { id: 'run', label: 'ランニング', color: 'var(--accent)', dates: runDates },
    { id: 'read', label: '読書', color: '#7b5ea7', dates: readDates },
  ]}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'series', type: 'CalendarSeries[]', desc: 'id / label / color / dates (日付集合)' },
          { name: 'showLegend', type: 'boolean', def: 'true', desc: '凡例の表示' },
          { name: 'month / today / onPrev / onNext / canPrev / canNext / onSelectDay', type: 'Calendar と同じ', desc: '土台の Calendar に渡す' },
        ]}
      />
    </Doc>
  );
}
