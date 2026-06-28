import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SearchBox } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/search-box')({
  component: SearchBoxPage,
});

function SearchBoxPage() {
  const [query, setQuery] = useState('');
  return (
    <Doc title="SearchBox" lede="丸型の検索入力。値があるときだけクリアボタンが出る。">
      <Demo>
        <div style={{ maxWidth: 340 }}>
          <SearchBox value={query} onChange={setQuery} />
        </div>
      </Demo>
      <Code>{`const [query, setQuery] = useState('');
<SearchBox value={query} onChange={setQuery} />`}</Code>
      <PropsTable
        rows={[
          { name: 'value', type: 'string', desc: '入力値' },
          { name: 'onChange', type: '(v: string) => void', desc: '変更コールバック' },
          { name: 'placeholder', type: 'string', def: `'検索'`, desc: 'プレースホルダ' },
        ]}
      />
    </Doc>
  );
}
