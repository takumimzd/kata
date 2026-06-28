import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Stepper } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/stepper')({
  component: StepperPage,
});

function StepperPage() {
  const [count, setCount] = useState(8);
  return (
    <Doc title="Stepper" lede="±ボタンで数値を増減する入力。単位や小数桁にも対応。">
      <Demo>
        <div style={{ maxWidth: 200 }}>
          <Stepper value={count} onChange={setCount} suffix=" 回" />
        </div>
      </Demo>
      <Code>{`const [count, setCount] = useState(8);
<Stepper value={count} onChange={setCount} suffix=" 回" />`}</Code>
      <PropsTable
        rows={[
          { name: 'value', type: 'number', desc: '現在値' },
          { name: 'onChange', type: '(v: number) => void', desc: '値変更コールバック' },
          { name: 'step', type: 'number', def: '1', desc: '増減量' },
          { name: 'min / max', type: 'number', def: 'min=0', desc: '範囲' },
          { name: 'suffix', type: 'string', desc: '単位の表示' },
          { name: 'decimals', type: 'number', def: '0', desc: '小数桁数' },
        ]}
      />
    </Doc>
  );
}
