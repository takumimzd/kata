import { createFileRoute } from '@tanstack/react-router';
import { Button, Icon } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';

export const Route = createFileRoute('/components/button')({
  component: ButtonPage,
});

function ButtonPage() {
  return (
    <Doc title="Button" lede="variant でスタイルを切り替える基本ボタン。アイコンは children に渡す。">
      <Demo>
        <Row>
          <Button variant="primary">保存する</Button>
          <Button variant="secondary">キャンセル</Button>
          <Button variant="text">あとで</Button>
          <Button variant="danger">
            <Icon name="trash" size={16} />
            削除
          </Button>
          <Button variant="ghost">
            <Icon name="trash" size={15} />
            取り消す
          </Button>
          <Button variant="mini">複製</Button>
          <Button variant="primary" disabled>
            無効
          </Button>
        </Row>
      </Demo>
      <Code>{`<Button variant="primary">保存する</Button>
<Button variant="danger"><Icon name="trash" size={16} />削除</Button>
<Button variant="mini">複製</Button>

// リンクにボタンの見た目を与える
<Link to="/back" className={buttonClassName('text')}>戻る</Link>`}</Code>
      <PropsTable
        rows={[
          { name: 'variant', type: `'primary' | 'secondary' | 'text' | 'danger' | 'ghost' | 'mini'`, def: `'primary'`, desc: '見た目のバリアント。ghost はクレイ罫線の控えめアクション' },
          { name: 'block', type: 'boolean', def: 'false', desc: '横幅いっぱいに広げる' },
          { name: '...rest', type: 'button 属性', desc: 'onClick / disabled / type など' },
        ]}
      />
    </Doc>
  );
}
