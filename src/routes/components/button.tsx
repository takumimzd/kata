import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Icon, type ButtonVariant } from 'kata';
import { ComponentDoc, Section } from '~/catalog/ComponentDoc';
import { Code, Demo, PropsTable, Row } from '~/catalog/parts';
import cdoc from '~/catalog/component-doc.module.css';

export const Route = createFileRoute('/components/button')({
  component: ButtonPage,
});

function ButtonPage() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [block, setBlock] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withIcon, setWithIcon] = useState(true);
  const [label, setLabel] = useState('保存する');

  return (
    <ComponentDoc
      slug="button"
      lede={
        <>
          variant でスタイルを切り替える基本ボタン。アイコンは children に渡し、
          リンクにボタンの見た目を与えるには <code>buttonClassName()</code> を使う。
          深緑アクセントは primary と mini のみに絞る。
        </>
      }
      meta={{ variant: '6 種', props: '3 / + rest', deps: 'なし', a11y: 'native button' }}
    >
      <Section n="01" title="デモ" en="live preview" meta="6 variants · 1 disabled">
        <div className={cdoc.demo}>
          <div className={cdoc.demoHead}>
            <span className={cdoc.demoHeadDot} />
            <span className={cdoc.demoHeadLbl}>Playground</span>
            <span className={cdoc.demoHeadTag}>霧 kiri</span>
          </div>
          <div style={{ padding: '32px 28px', minHeight: 140, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
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
          </div>
        </div>
      </Section>

      <Section n="02" title="variant 一覧" en="specimen" meta="6 種 · primary → mini">
        <div className={cdoc.vgrid}>
          <div className={cdoc.vrow}>
            <div className={cdoc.vlabel}>
              <span className={cdoc.vname}>primary</span>
              <span className={cdoc.vdesc}>深緑塗り · 主アクション</span>
            </div>
            <div className={cdoc.vcell}>
              <Button variant="primary">保存する</Button>
              <Button variant="primary" disabled>
                無効
              </Button>
            </div>
          </div>
          <div className={cdoc.vrow}>
            <div className={cdoc.vlabel}>
              <span className={cdoc.vname}>secondary</span>
              <span className={cdoc.vdesc}>面 + 罫線 · 中立</span>
            </div>
            <div className={cdoc.vcell}>
              <Button variant="secondary">キャンセル</Button>
            </div>
          </div>
          <div className={cdoc.vrow}>
            <div className={cdoc.vlabel}>
              <span className={cdoc.vname}>text</span>
              <span className={cdoc.vdesc}>背景なし · 補助</span>
            </div>
            <div className={cdoc.vcell}>
              <Button variant="text">あとで</Button>
            </div>
          </div>
          <div className={cdoc.vrow}>
            <div className={cdoc.vlabel}>
              <span className={cdoc.vname}>danger</span>
              <span className={cdoc.vdesc}>破壊的操作のみ</span>
            </div>
            <div className={cdoc.vcell}>
              <Button variant="danger">
                <Icon name="trash" size={16} />
                削除
              </Button>
            </div>
          </div>
          <div className={cdoc.vrow}>
            <div className={cdoc.vlabel}>
              <span className={cdoc.vname}>ghost</span>
              <span className={cdoc.vdesc}>クレイ罫線 · 控えめ</span>
            </div>
            <div className={cdoc.vcell}>
              <Button variant="ghost">
                <Icon name="trash" size={15} />
                取り消す
              </Button>
            </div>
          </div>
          <div className={cdoc.vrow}>
            <div className={cdoc.vlabel}>
              <span className={cdoc.vname}>mini</span>
              <span className={cdoc.vdesc}>小さな追加操作</span>
            </div>
            <div className={cdoc.vcell}>
              <Button variant="mini">複製</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section n="03" title="プレイグラウンド" en="interactive" meta="props をいじって挙動を確認">
        <div className={cdoc.pg}>
          <div className={cdoc.pgStage}>
            <Button variant={variant} block={block} disabled={disabled} style={block ? { width: '100%' } : undefined}>
              {withIcon && (
                <Icon
                  name={variant === 'danger' ? 'trash' : 'plus'}
                  size={variant === 'mini' ? 14 : 16}
                />
              )}
              {label || ' '}
            </Button>
          </div>
          <div className={cdoc.pgControls}>
            <div className={cdoc.ctl}>
              <span className={cdoc.ctlLbl}>variant</span>
              <div className={cdoc.seg}>
                {(
                  ['primary', 'secondary', 'text', 'danger', 'ghost', 'mini'] as const
                ).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={variant === v ? 'on' : ''}
                    onClick={() => setVariant(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className={cdoc.ctl}>
              <span className={cdoc.ctlLbl}>state · size</span>
              <div className={cdoc.switchRow}>
                <span className={cdoc.switchRowT}>block (横幅いっぱい)</span>
                <button
                  type="button"
                  className={`${cdoc.sw}${block ? ' on' : ''}`}
                  onClick={() => setBlock((b) => !b)}
                  aria-label="block"
                />
              </div>
              <div className={cdoc.switchRow}>
                <span className={cdoc.switchRowT}>disabled</span>
                <button
                  type="button"
                  className={`${cdoc.sw}${disabled ? ' on' : ''}`}
                  onClick={() => setDisabled((b) => !b)}
                  aria-label="disabled"
                />
              </div>
              <div className={cdoc.switchRow}>
                <span className={cdoc.switchRowT}>アイコン付き</span>
                <button
                  type="button"
                  className={`${cdoc.sw}${withIcon ? ' on' : ''}`}
                  onClick={() => setWithIcon((b) => !b)}
                  aria-label="icon"
                />
              </div>
            </div>
            <div className={cdoc.ctl}>
              <span className={cdoc.ctlLbl}>label</span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className={cdoc.ctlInput}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section n="04" title="使い方" en="usage · code" meta="TypeScript · React 19">
        <Code>{`// 主アクション
<Button variant="primary">保存する</Button>

// アイコン付き / 破壊的
<Button variant="danger">
  <Icon name="trash" size={16} />
  削除
</Button>

// リンクにボタンの見た目を与える
<Link to="/back" className={buttonClassName('text')}>戻る</Link>`}</Code>
      </Section>

      <Section n="05" title="props" en="api reference" meta="3 · + button 属性">
        <PropsTable
          rows={[
            {
              name: 'variant',
              type: `'primary' | 'secondary' | 'text' | 'danger' | 'ghost' | 'mini'`,
              def: `'primary'`,
              desc: '見た目のバリアント。ghost はクレイ罫線の控えめアクション。',
            },
            { name: 'block', type: 'boolean', def: 'false', desc: '横幅いっぱいに広げる。' },
            {
              name: '...rest',
              type: 'ButtonHTMLAttributes',
              desc: 'onClick / disabled / type / aria-* など、native button のすべての属性が渡せる。',
            },
          ]}
        />
      </Section>

      <Section n="06" title="使い分け" en="do & don't" meta="4 例">
        <div className={cdoc.dodont}>
          <div className={cdoc.dd}>
            <div className={`${cdoc.ddHead} ${cdoc.ddHeadDo}`}>
              <span
                className={cdoc.ddBox}
                style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
              >
                ○
              </span>
              推奨
            </div>
            <div className={cdoc.ddBody}>
              <div className={cdoc.ddPreview}>
                <Demo>
                  <Row>
                    <Button variant="primary">保存</Button>
                    <Button variant="text">キャンセル</Button>
                  </Row>
                </Demo>
              </div>
              <div className={cdoc.ddNote}>1 画面に primary は 1 つだけ。他は secondary / text で。</div>
            </div>
            <div className={cdoc.ddBody}>
              <div className={cdoc.ddPreview}>
                <Button variant="secondary">戻る</Button>
                <Button variant="danger">
                  <Icon name="trash" size={16} />
                  削除
                </Button>
              </div>
              <div className={cdoc.ddNote}>破壊的操作は必ず danger + 確認ダイアログを併用する。</div>
            </div>
          </div>
          <div className={cdoc.dd}>
            <div className={`${cdoc.ddHead} ${cdoc.ddHeadDont}`}>
              <span
                className={cdoc.ddBox}
                style={{ background: 'var(--danger)', color: 'var(--on-accent)' }}
              >
                ×
              </span>
              非推奨
            </div>
            <div className={cdoc.ddBody}>
              <div className={cdoc.ddPreview}>
                <Button variant="primary">保存</Button>
                <Button variant="primary">公開</Button>
                <Button variant="primary">共有</Button>
              </div>
              <div className={cdoc.ddNote}>primary を並べない。視線が分散して主アクションが伝わらない。</div>
            </div>
            <div className={cdoc.ddBody}>
              <div className={cdoc.ddPreview}>
                <Button variant="text">削除</Button>
              </div>
              <div className={cdoc.ddNote}>
                削除など重要な操作を text variant にしない。押しにくく気付きにくい。
              </div>
            </div>
          </div>
        </div>
      </Section>
    </ComponentDoc>
  );
}
