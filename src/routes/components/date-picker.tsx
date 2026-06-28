import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { DatePicker, today } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/date-picker')({
  component: DatePickerPage,
});

function DatePickerPage() {
  const [date, setDate] = useState(today());
  return (
    <Doc title="DatePicker" lede="ネイティブ input[type=date] の代替。カレンダーポップオーバーで選択する。値は YYYY-MM-DD。">
      <Demo>
        <div style={{ maxWidth: 300 }}>
          <DatePicker value={date} onChange={setDate} max={today()} />
        </div>
      </Demo>
      <Code>{`const [date, setDate] = useState(today());
<DatePicker value={date} onChange={setDate} max={today()} />`}</Code>
      <PropsTable
        rows={[
          { name: 'value', type: 'string', desc: '"YYYY-MM-DD"' },
          { name: 'onChange', type: '(v: string) => void', desc: '選択時コールバック' },
          { name: 'min / max', type: 'string', desc: '選択可能範囲' },
        ]}
      />
    </Doc>
  );
}
