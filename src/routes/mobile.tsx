import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Badge, Button, Chip, Icon, IconButton } from 'kata';
import styles from '~/catalog/mobile.module.css';

export const Route = createFileRoute('/mobile')({
  component: MobilePage,
});

function Frame({
  label,
  sub,
  n,
  title,
  activeTab,
  children,
}: {
  label: string;
  sub: string;
  n: string;
  title: string;
  activeTab: 'overview' | 'principles' | 'tokens' | 'components';
  children: ReactNode;
}) {
  return (
    <div className={styles.fcol}>
      <span className={styles.flabel}>
        <span className={styles.flabelN}>{n}</span>
        <span className={styles.flabelSub}>
          {label} · {sub}
        </span>
      </span>
      <div className={styles.device}>
        <div className={styles.deviceSpeaker} />
        <div className={styles.deviceScreen}>
          <div className={styles.statusBar}>
            <span>9:41</span>
            <span className={styles.statusBarRight}>
              <span aria-hidden>􀟝</span>
              <span aria-hidden>􀛨</span>
              <span aria-hidden>􀛩</span>
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {children}
          </div>
          <TabBar active={activeTab} />
          <div className={styles.homeIndicator} />
        </div>
      </div>
      <span style={{ fontFamily: 'var(--num)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.06em' }}>
        {title}
      </span>
    </div>
  );
}

function TabBar({ active }: { active: 'overview' | 'principles' | 'tokens' | 'components' }) {
  const tabs = [
    { key: 'overview', label: '概要', icon: <Icon name="home" size={18} /> },
    { key: 'principles', label: '特徴', icon: <Icon name="book" size={18} /> },
    { key: 'tokens', label: 'トークン', icon: <Icon name="chart" size={18} /> },
    { key: 'components', label: '部品', icon: <Icon name="note" size={18} /> },
  ] as const;
  return (
    <div className={styles.tabbar}>
      {tabs.map((t) => (
        <div key={t.key} className={`${styles.tab}${active === t.key ? ` ${styles.tabOn}` : ''}`}>
          {t.icon}
          <span className={styles.tabLab}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

/** A — 概要 */
function ScreenOverview() {
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.mIconBtn}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div className={styles.mBrand}>
          <span className={styles.mMark}>型</span>
          <span className={styles.mBrandT}>kata</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <div className={styles.mIconBtn}>
            <Icon name="search" size={16} />
          </div>
        </div>
      </div>

      <div className={styles.mBody}>
        <div className={styles.mHero}>
          <div className={styles.eyebrow}>Design System · v0.1 · 2026</div>
          <h1 className={styles.mHeroTitle}>
            型 <span className={styles.mHeroTitleEn}>— kata</span>
          </h1>
          <p className={styles.mLede}>
            個人開発のサービス間で共有する汎用デザインシステム。
            <span className={styles.mLedeStrong}>静かに、続けやすく。</span>
          </p>
        </div>

        <div className={styles.mStats}>
          <div className={styles.mStat}>
            <div className={styles.mStatN}>37</div>
            <div className={styles.mStatL}>部品</div>
          </div>
          <div className={styles.mStat}>
            <div className={styles.mStatN}>4</div>
            <div className={styles.mStatL}>群</div>
          </div>
          <div className={styles.mStat}>
            <div className={styles.mStatN}>65</div>
            <div className={styles.mStatL}>アイコン</div>
          </div>
          <div className={styles.mStat}>
            <div className={styles.mStatN}>2</div>
            <div className={styles.mStatL}>テーマ</div>
          </div>
        </div>

        <a href="#" className={styles.mCta}>
          コンポーネントを見る <span style={{ opacity: 0.7 }}>→</span>
        </a>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK}>弐</span>
            <span className={styles.mSecHT}>特徴</span>
            <span className={styles.mSecHE}>principles</span>
            <span className={styles.mSecHMeta}>06</span>
          </div>
          <div className={styles.mFeats}>
            {[
              {
                n: '01/06',
                t: 'CSS Modules + CSS 変数',
                b: (
                  <>
                    スコープ化されたスタイル。<span style={{ fontFamily: 'var(--num)', color: 'var(--text)' }}>color-mix()</span>
                    で派生色を動的生成。
                  </>
                ),
              },
              {
                n: '02/06',
                t: 'ライブラリ非依存',
                b: (
                  <>
                    Tailwind / cva / clsx 不使用。<span style={{ fontFamily: 'var(--num)', color: 'var(--text)' }}>cn()</span>{' '}
                    のみ。
                  </>
                ),
              },
              {
                n: '03/06',
                t: '日本語に最適化',
                b: <>Zen Kaku Gothic New + Space Grotesk。palt / tnum。</>,
              },
            ].map((f) => (
              <div key={f.n} className={styles.mFeat}>
                <span className={styles.mFeatN}>{f.n}</span>
                <div>
                  <div className={styles.mFeatT}>{f.t}</div>
                  <div className={styles.mFeatB}>{f.b}</div>
                </div>
              </div>
            ))}
            <a href="#" className={styles.mFeatMore}>
              <span>すべての特徴を見る</span>
              <span style={{ color: 'var(--accent)' }}>→</span>
            </a>
          </div>
        </div>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK}>四</span>
            <span className={styles.mSecHT}>コンポーネント</span>
            <span className={styles.mSecHE}>catalog</span>
            <span className={styles.mSecHMeta}>37 品</span>
          </div>
          <div className={styles.mGroupGrid}>
            {[
              { k: '壱', n: 'ベース', c: 24, d: 'Button · Icon · Card · Chip …' },
              { k: '弐', n: 'フォーム', c: 8, d: 'Input · Select · Switch …' },
              { k: '参', n: 'チャート', c: 4, d: 'BarChart · LineChart …' },
              { k: '四', n: 'エディタ', c: 1, d: 'RichTextEditor' },
            ].map((g) => (
              <a key={g.k} href="#" className={styles.mGroupCard}>
                <div className={styles.mGroupCardH}>
                  <span className={styles.mGroupCardK}>{g.k}</span>
                  <span className={styles.mGroupCardN}>{g.n}</span>
                  <span className={styles.mGroupCardCount}>
                    {String(g.c).padStart(2, '0')}
                  </span>
                </div>
                <div className={styles.mGroupCardD}>{g.d}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/** B — カタログ */
function ScreenCatalog() {
  const previews: Array<{ id: string; nm: string; slug: string; el: ReactNode }> = [
    {
      id: '01',
      nm: 'Button',
      slug: 'button',
      el: <Button variant="primary">保存</Button>,
    },
    {
      id: '02',
      nm: 'IconButton',
      slug: 'icon-btn',
      el: (
        <div style={{ display: 'flex', gap: 4 }}>
          <IconButton label="edit">
            <Icon name="edit" size={12} />
          </IconButton>
          <IconButton label="copy">
            <Icon name="copy" size={12} />
          </IconButton>
        </div>
      ),
    },
    {
      id: '03',
      nm: 'Fab',
      slug: 'fab',
      el: (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'var(--shadow)',
          }}
        >
          <Icon name="plus" size={14} />
        </div>
      ),
    },
    {
      id: '06',
      nm: 'Icon',
      slug: 'icon',
      el: (
        <div style={{ display: 'flex', gap: 6 }}>
          <Icon name="flame" size={14} />
          <Icon name="glass" size={14} />
          <Icon name="scale" size={14} />
        </div>
      ),
    },
    {
      id: '11',
      nm: 'Badge',
      slug: 'badge',
      el: (
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge variant="accent">完了</Badge>
          <Badge>3 日</Badge>
        </div>
      ),
    },
    {
      id: '12',
      nm: 'Chip',
      slug: 'chip',
      el: (
        <div style={{ display: 'flex', gap: 3 }}>
          <Chip active>筋トレ</Chip>
          <Chip>水分</Chip>
        </div>
      ),
    },
    {
      id: '13',
      nm: 'ProgressBar',
      slug: 'progress',
      el: (
        <div
          style={{
            width: 100,
            height: 6,
            background: 'var(--fill-1)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '62%', height: '100%', background: 'var(--accent)' }} />
        </div>
      ),
    },
    {
      id: '36',
      nm: 'Sparkline',
      slug: 'spark',
      el: (
        <svg width="72" height="22" viewBox="0 0 90 26">
          <polyline
            points="2,20 14,16 26,20 38,10 50,14 62,6 74,10 86,4"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={86} cy={4} r={2} fill="var(--accent)" />
        </svg>
      ),
    },
  ];
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.mIconBtn}>
          <Icon name="back" size={18} />
        </div>
        <div className={styles.topbarTitle}>
          <span className={styles.topbarTitleE}>四 · Catalog</span>
          <span className={styles.topbarTitleT}>コンポーネント</span>
        </div>
        <div className={styles.mIconBtn}>
          <Icon name="more" size={18} />
        </div>
      </div>

      <div className={styles.mBody} style={{ gap: 12 }}>
        <div className={styles.mSearch}>
          <Icon name="search" size={14} />
          <span>コンポーネントを検索</span>
          <span className={styles.mSearchCount}>37 / 37</span>
        </div>

        <div className={styles.mFchipRow}>
          {(
            [
              { l: 'すべて', c: 37, on: true },
              { l: 'ベース', c: 24, on: false },
              { l: 'フォーム', c: 8, on: false },
              { l: 'チャート', c: 4, on: false },
              { l: 'エディタ', c: 1, on: false },
            ] as const
          ).map((c) => (
            <span key={c.l} className={`${styles.mFchip}${c.on ? ` ${styles.mFchipOn}` : ''}`}>
              {c.l} <span className={styles.mFchipN}>{String(c.c).padStart(2, '0')}</span>
            </span>
          ))}
        </div>

        <div className={styles.mGanchor}>
          <span className={styles.mGanchorK}>壱</span>
          <span className={styles.mGanchorJp}>ベース</span>
          <span className={styles.mGanchorEn}>root</span>
          <span className={styles.mGanchorMeta}>24 品</span>
        </div>

        <div className={styles.mCcGrid}>
          {previews.map((p) => (
            <div key={p.id} className={styles.mCc}>
              <div className={styles.mCcPv}>
                {p.el}
                <span className={styles.mCcCap}>{p.slug}</span>
              </div>
              <div className={styles.mCcBody}>
                <span className={styles.mCcIdx}>{p.id} · root</span>
                <span className={styles.mCcName}>{p.nm}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mMore}>↓ さらに 16 品</div>
      </div>
    </>
  );
}

/** C — 詳細 (Button) */
function ScreenDetail() {
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.mIconBtn}>
          <Icon name="back" size={18} />
        </div>
        <div className={styles.topbarTitle}>
          <span className={styles.topbarTitleE}>01 / 37 · root</span>
          <span className={styles.topbarTitleT} style={{ fontFamily: 'var(--num)' }}>
            Button
          </span>
        </div>
        <div className={styles.mIconBtn}>
          <Icon name="edit" size={16} />
        </div>
      </div>

      <div className={styles.mBody} style={{ gap: 16 }}>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          variant でスタイルを切り替える基本ボタン。アイコンは children に渡す。深緑アクセントは
          primary と mini のみ。
        </p>

        <div className={styles.mMetaStrip}>
          <div className={styles.mMetaCell}>
            <div className={styles.eyebrow} style={{ fontSize: 8.5 }}>
              variant
            </div>
            <div className={styles.mMetaN}>6</div>
          </div>
          <div className={styles.mMetaCell}>
            <div className={styles.eyebrow} style={{ fontSize: 8.5 }}>
              props
            </div>
            <div className={styles.mMetaN}>3</div>
          </div>
          <div className={styles.mMetaCell}>
            <div className={styles.eyebrow} style={{ fontSize: 8.5 }}>
              a11y
            </div>
            <div className={styles.mMetaN}>native</div>
          </div>
        </div>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK} style={{ fontFamily: 'var(--num)', fontSize: 11 }}>
              01
            </span>
            <span className={styles.mSecHT}>デモ</span>
            <span className={styles.mSecHE}>live</span>
          </div>
          <div className={styles.mDemoBox}>
            <Button variant="primary">保存</Button>
            <Button variant="secondary">キャンセル</Button>
            <Button variant="text">あとで</Button>
            <Button variant="danger">
              <Icon name="trash" size={14} />
              削除
            </Button>
            <Button variant="mini">複製</Button>
          </div>
        </div>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK} style={{ fontFamily: 'var(--num)', fontSize: 11 }}>
              02
            </span>
            <span className={styles.mSecHT}>variant</span>
            <span className={styles.mSecHE}>6 種</span>
          </div>
          <div className={styles.mVList}>
            {[
              { a: 'primary', b: '主アクション', el: <Button variant="primary">保存</Button> },
              { a: 'secondary', b: '中立', el: <Button variant="secondary">キャンセル</Button> },
              { a: 'danger', b: '破壊的', el: <Button variant="danger">削除</Button> },
              { a: 'mini', b: '追加操作', el: <Button variant="mini">複製</Button> },
            ].map((v) => (
              <div key={v.a} className={styles.mVrow}>
                <div className={styles.mVrowLbl}>
                  <span className={styles.mVrowA}>{v.a}</span>
                  <span className={styles.mVrowB}>{v.b}</span>
                </div>
                <div className={styles.mVrowVal}>{v.el}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK} style={{ fontFamily: 'var(--num)', fontSize: 11 }}>
              03
            </span>
            <span className={styles.mSecHT}>プレイグラウンド</span>
            <span className={styles.mSecHE}>try</span>
          </div>
          <div
            style={{
              marginTop: 8,
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 12px',
                background: 'var(--bg-2)',
                borderBottom: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                minHeight: 76,
              }}
            >
              <Button variant="primary">
                <Icon name="plus" size={16} />
                保存する
              </Button>
            </div>
            <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span className={styles.eyebrow} style={{ fontSize: 8.5 }}>
                  variant
                </span>
                <div className={styles.mSeg}>
                  <button type="button" className="on">
                    primary
                  </button>
                  <button type="button">secondary</button>
                  <button type="button">text</button>
                </div>
              </div>
              <div className={styles.mSwRow}>
                <span className={styles.mSwRowT}>block</span>
                <div className={styles.mSw} />
              </div>
              <div className={styles.mSwRow}>
                <span className={styles.mSwRowT}>disabled</span>
                <div className={styles.mSw} />
              </div>
              <div className={styles.mSwRow}>
                <span className={styles.mSwRowT}>アイコン付き</span>
                <div className={`${styles.mSw} on`} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK} style={{ fontFamily: 'var(--num)', fontSize: 11 }}>
              04
            </span>
            <span className={styles.mSecHT}>使い方</span>
            <span className={styles.mSecHE}>code</span>
          </div>
          <div className={styles.mCode}>
            <span className={styles.mCodeC}>{'// 主アクション'}</span>
            {'\n'}
            <span className={styles.mCodeK}>{'<Button'}</span>
            {' variant="primary">保存'}
            <span className={styles.mCodeK}>{'</Button>'}</span>
            {'\n\n'}
            <span className={styles.mCodeC}>{'// 削除'}</span>
            {'\n'}
            <span className={styles.mCodeK}>{'<Button'}</span>
            {' variant="danger">\n  '}
            <span className={styles.mCodeK}>{'<Icon'}</span>
            {' name="trash"'}
            <span className={styles.mCodeK}>{'/>'}</span>
            {' 削除\n'}
            <span className={styles.mCodeK}>{'</Button>'}</span>
          </div>
        </div>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK} style={{ fontFamily: 'var(--num)', fontSize: 11 }}>
              05
            </span>
            <span className={styles.mSecHT}>props</span>
            <span className={styles.mSecHE}>3 · + rest</span>
          </div>
          <div className={styles.mPropList}>
            <div className={styles.mProw}>
              <div className={styles.mProwTop}>
                <span className={styles.mProwNm}>variant</span>
                <span className={styles.mProwReq}>REQ</span>
                <span className={styles.mProwDef}>= 'primary'</span>
              </div>
              <div className={styles.mProwType}>
                'primary' | 'secondary' | 'text' | 'danger' | 'ghost' | 'mini'
              </div>
              <div className={styles.mProwDesc}>
                見た目のバリアント。ghost はクレイ罫線の控えめアクション。
              </div>
            </div>
            <div className={styles.mProw}>
              <div className={styles.mProwTop}>
                <span className={styles.mProwNm}>block</span>
                <span className={styles.mProwDef}>= false</span>
              </div>
              <div className={styles.mProwType}>boolean</div>
              <div className={styles.mProwDesc}>横幅いっぱいに広げる。</div>
            </div>
            <div className={styles.mProw}>
              <div className={styles.mProwTop}>
                <span className={styles.mProwNm}>...rest</span>
              </div>
              <div className={styles.mProwType}>ButtonHTMLAttributes</div>
              <div className={styles.mProwDesc}>onClick / disabled / type など native button 属性。</div>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.mSecH}>
            <span className={styles.mSecHK} style={{ fontFamily: 'var(--num)', fontSize: 11 }}>
              06
            </span>
            <span className={styles.mSecHT}>関連</span>
            <span className={styles.mSecHE}>related</span>
          </div>
          <div className={styles.mRel}>
            <div className={styles.mRelItem}>
              <div className={styles.mRelPv}>
                <div style={{ display: 'flex', gap: 3 }}>
                  <IconButton label="edit">
                    <Icon name="edit" size={12} />
                  </IconButton>
                  <IconButton label="copy">
                    <Icon name="copy" size={12} />
                  </IconButton>
                </div>
              </div>
              <div className={styles.mRelNm}>IconButton</div>
            </div>
            <div className={styles.mRelItem}>
              <div className={styles.mRelPv}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'var(--on-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  <Icon name="plus" size={14} />
                </div>
              </div>
              <div className={styles.mRelNm}>Fab</div>
            </div>
            <div className={styles.mRelItem}>
              <div className={styles.mRelPv}>
                <Chip active>筋トレ</Chip>
              </div>
              <div className={styles.mRelNm}>Chip</div>
            </div>
            <div className={styles.mRelItem}>
              <div className={styles.mRelPv}>
                <Badge variant="accent">完了</Badge>
              </div>
              <div className={styles.mRelNm}>Badge</div>
            </div>
          </div>
        </div>

        <div className={styles.mPnav}>
          <a href="#" className={styles.mPnavItem}>
            <span className={styles.mPnavDir}>← 前</span>
            <span className={styles.mPnavDesc}>最初</span>
          </a>
          <a href="#" className={`${styles.mPnavItem} ${styles.next}`}>
            <span className={styles.mPnavDir}>次 →</span>
            <span className={styles.mPnavName}>IconButton</span>
          </a>
        </div>
      </div>
    </>
  );
}

function MobilePage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headMeta}>
          <span
            style={{
              display: 'inline-grid',
              placeItems: 'center',
              width: 30,
              height: 30,
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              borderRadius: 7,
              fontFamily: 'var(--ja)',
              fontWeight: 900,
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            型
          </span>
          <span className={styles.headKey}>kata · Mobile Views</span>
          <span className={styles.headSize}>iPhone · 390 × 844</span>
        </div>
        <h1 className={styles.title}>モバイル</h1>
        <p className={styles.lede}>
          サイドバーの代わりに底タブ + ハンバーガー、カードは 2
          列に圧縮。フィルタチップは横スクロール。詳細ページは props テーブルを縦積みカードに変換する。
        </p>
      </header>

      <div className={styles.frames}>
        <Frame label="概要" sub="Overview" n="A" title="A / kata overview" activeTab="overview">
          <ScreenOverview />
        </Frame>
        <Frame label="型録" sub="Catalog" n="B" title="B / catalog" activeTab="components">
          <ScreenCatalog />
        </Frame>
        <Frame label="詳細" sub="Detail" n="C" title="C / button detail" activeTab="components">
          <ScreenDetail />
        </Frame>
      </div>
    </div>
  );
}
