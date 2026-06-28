import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Switch } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';

export const Route = createFileRoute('/components/switch')({
  component: SwitchPage,
});

function SwitchPage() {
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);
  return (
    <Doc title="Switch" lede="オン/オフを切り替えるトグル。role=switch でアクセシブル。">
      <Demo>
        <Row>
          <Switch on={on} onChange={setOn} label="通知" />
          <Switch on={off} onChange={setOff} label="お休み" />
          <Switch on onChange={() => {}} label="無効(オン)" disabled />
          <Switch on={false} onChange={() => {}} label="無効(オフ)" disabled />
        </Row>
      </Demo>
      <Code>{`const [on, setOn] = useState(true);
<Switch on={on} onChange={setOn} label="通知" />`}</Code>
      <PropsTable
        rows={[
          { name: 'on', type: 'boolean', desc: 'オン状態' },
          { name: 'onChange', type: '(v: boolean) => void', desc: '切り替えコールバック' },
          { name: 'label', type: 'string', desc: 'aria-label' },
          { name: 'disabled', type: 'boolean', def: 'false', desc: '無効化' },
        ]}
      />
    </Doc>
  );
}
