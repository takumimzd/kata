import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PinPad } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/pin-pad')({
  component: PinPadPage,
});

function PinPadPage() {
  const [pin, setPin] = useState(0);
  const [shake, setShake] = useState(false);

  function press() {
    setPin((c) => {
      if (c >= 4) {
        setShake(true);
        setTimeout(() => setShake(false), 420);
        return 0;
      }
      return c + 1;
    });
  }

  return (
    <Doc title="PinPad" lede="PIN / パスコード入力のドット + テンキー。表示専用で、入力ロジックは利用側が持つ。">
      <Demo>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          <PinPad
            enteredCount={pin}
            shake={shake}
            onPress={press}
            onErase={() => setPin((c) => Math.max(0, c - 1))}
          />
        </div>
      </Demo>
      <Code>{`<PinPad
  length={4}
  enteredCount={count}
  shake={shake}
  onPress={onPress}
  onErase={onErase}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'length', type: 'number', def: '4', desc: 'PIN の桁数 (ドット数)' },
          { name: 'enteredCount', type: 'number', desc: '入力済みの桁数' },
          { name: 'shake', type: 'boolean', desc: '失敗時に揺らす' },
          { name: 'onPress', type: '(digit: string) => void', desc: '数字キー押下' },
          { name: 'onErase', type: '() => void', desc: '削除キー押下' },
        ]}
      />
    </Doc>
  );
}
