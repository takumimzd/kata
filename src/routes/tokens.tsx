import { createFileRoute } from '@tanstack/react-router';
import styles from '~/catalog/tokens.module.css';

export const Route = createFileRoute('/tokens')({
  component: TokensPage,
});

// --- 色トークン (kiri / sumi の実 hex or 派生指定を並記) ---
interface ColorRow {
  name: string;
  varName: string;
  hexKiri: string;
  hexSumi: string;
}

const SURFACES: ColorRow[] = [
  { name: '背景', varName: '--bg', hexKiri: '#e9e9ea', hexSumi: '#181715' },
  { name: '背景 2', varName: '--bg-2', hexKiri: '#f1f1f2', hexSumi: '#1e1d1a' },
  { name: 'サーフェス', varName: '--surface', hexKiri: '#fbfbfc', hexSumi: '#232220' },
  { name: 'サーフェス 2', varName: '--surface-2', hexKiri: '#efeff1', hexSumi: '#2b2a27' },
  { name: 'サーフェス 3', varName: '--surface-3', hexKiri: '#e3e3e6', hexSumi: '#353330' },
];

const FOREGROUND: ColorRow[] = [
  { name: '本文', varName: '--text', hexKiri: '#232427', hexSumi: '#ece9e3' },
  { name: '副文', varName: '--text-dim', hexKiri: '#66686e', hexSumi: '#9b968c' },
  { name: '薄字', varName: '--text-faint', hexKiri: '#9c9ea6', hexSumi: '#6a655c' },
];

const ACCENTS: ColorRow[] = [
  { name: 'アクセント', varName: '--accent', hexKiri: '#3a6157', hexSumi: '#6f9e82' },
  { name: 'アクセント 2', varName: '--accent-2', hexKiri: '#487469', hexSumi: '#83b195' },
  { name: 'on-accent', varName: '--on-accent', hexKiri: '#fbfbfc', hexSumi: '#15201a' },
  { name: 'accent soft', varName: '--accent-soft', hexKiri: '13% mix', hexSumi: '13% mix' },
  { name: 'accent line', varName: '--accent-line', hexKiri: '32% mix', hexSumi: '32% mix' },
];

const SEMANTIC: ColorRow[] = [
  { name: 'clay', varName: '--clay', hexKiri: '#34363a', hexSumi: '#b6b0a6' },
  { name: 'clay soft', varName: '--clay-soft', hexKiri: '12% mix', hexSumi: '12% mix' },
  { name: 'danger', varName: '--danger', hexKiri: '#c0564f', hexSumi: '#db7a72' },
  { name: 'danger soft', varName: '--danger-soft', hexKiri: '12% mix', hexSumi: '12% mix' },
  { name: 'danger line', varName: '--danger-line', hexKiri: '34% mix', hexSumi: '34% mix' },
  { name: 'line', varName: '--line', hexKiri: '8% mix', hexSumi: '8% mix' },
  { name: 'line 2', varName: '--line-2', hexKiri: '15% mix', hexSumi: '15% mix' },
  { name: 'fill 1', varName: '--fill-1', hexKiri: '5% mix', hexSumi: '5% mix' },
  { name: 'fill 2', varName: '--fill-2', hexKiri: '9% mix', hexSumi: '9% mix' },
];

const SPACING: Array<{ n: number; px: number; use: string }> = [
  { n: 1, px: 4, use: '罫線間' },
  { n: 2, px: 8, use: 'gap 小' },
  { n: 3, px: 12, use: 'gap 標準' },
  { n: 4, px: 16, use: 'padding 小' },
  { n: 5, px: 20, use: 'card 既定' },
  { n: 6, px: 24, use: 'section gap' },
  { n: 7, px: 28, use: 'card l' },
  { n: 8, px: 32, use: 'section 内' },
  { n: 9, px: 40, use: '見出し前' },
  { n: 10, px: 48, use: '章間' },
];

const RADII: Array<{ varName: string; px: number; note?: string; isDefault?: boolean }> = [
  { varName: '--radius-xs', px: 6 },
  { varName: '--radius-sm', px: 9, note: 'ボタン / 入力' },
  { varName: '--radius', px: 13, note: 'カード', isDefault: true },
  { varName: '--radius-lg', px: 18 },
  { varName: '--radius-xl', px: 24 },
  { varName: '--radius-full', px: 9999, note: 'ピル / 丸' },
];

function ColorPanel({ row }: { row: ColorRow }) {
  return (
    <div className={styles.colpanel}>
      <div className={styles.colpanelChip} style={{ background: `var(${row.varName})` }}>
        <span className={styles.colpanelHex}>{row.hexKiri}</span>
      </div>
      <div className={styles.colpanelMeta}>
        <span className={styles.colpanelName}>{row.name}</span>
        <span className={styles.colpanelVar}>{row.varName}</span>
      </div>
    </div>
  );
}

function Chapter({
  kanji,
  jp,
  en,
  side,
  sideDim,
}: {
  kanji: string;
  jp: string;
  en: string;
  side: string;
  sideDim?: string;
}) {
  return (
    <div className={styles.chap}>
      <span className={styles.chapKanji}>{kanji}</span>
      <div>
        <div className={styles.chapJp}>{jp}</div>
        <div className={styles.chapEn}>{en}</div>
      </div>
      <div className={styles.chapSide}>
        {side}
        {sideDim && (
          <>
            <br />
            <span className={styles.chapSideDim}>{sideDim}</span>
          </>
        )}
      </div>
    </div>
  );
}

function Sub({
  n,
  title,
  en,
  meta,
}: {
  n: string;
  title: string;
  en: string;
  meta?: string;
}) {
  return (
    <div className={styles.sub}>
      <span className={styles.subN}>{n}</span>
      <h3>{title}</h3>
      <span className={styles.subEn}>{en}</span>
      {meta && <span className={styles.subMeta}>{meta}</span>}
    </div>
  );
}

function TokensPage() {
  return (
    <div className={styles.page}>
      {/* ============ HEADER ============ */}
      <header className={styles.head}>
        <div className={styles.headMeta}>
          <span className={styles.headKey}>Foundation · 参</span>
          <span className={styles.headSub}>design tokens</span>
        </div>
        <div className={styles.headWrap}>
          <div className={styles.headBig}>
            <h1 className={styles.title}>トークン</h1>
            <p className={styles.lede}>
              全トークンは CSS カスタムプロパティで提供。色・余白・角丸は
              <code> var(--…)</code> で参照する。左下でテーマを切り替えると、
              以下の見本もそのテーマの値で再描画される。
            </p>
          </div>
          <div className={styles.headStats}>
            <div className={styles.headStat}>
              <div className={styles.headStatN}>22</div>
              <div className={styles.headStatL}>色</div>
            </div>
            <div className={styles.headStat}>
              <div className={styles.headStatN}>10</div>
              <div className={styles.headStatL}>間隔</div>
            </div>
            <div className={styles.headStat}>
              <div className={styles.headStatN}>6</div>
              <div className={styles.headStatL}>角丸</div>
            </div>
            <div className={styles.headStat}>
              <div className={styles.headStatN}>2</div>
              <div className={styles.headStatL}>影</div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ COLORS ============ */}
      <section id="colors">
        <Chapter
          kanji="壱"
          jp="カラー"
          en="colors · 22 tokens"
          side="派生色は color-mix()"
          sideDim="テーマ側では触らない"
        />

        <div className={styles.subSection}>
          <Sub n="01" title="背景・サーフェス" en="surface" meta="下地から面へ · 5 段" />
          <div className={`${styles.colgrid} ${styles.colMd}`}>
            {SURFACES.map((row) => (
              <ColorPanel key={row.varName} row={row} />
            ))}
          </div>
        </div>

        <div className={styles.subSection}>
          <Sub n="02" title="前景・テキスト" en="foreground" meta="3 段" />
          <div className={`${styles.colgrid} ${styles.colMd}`}>
            {FOREGROUND.map((row) => (
              <ColorPanel key={row.varName} row={row} />
            ))}
          </div>
          <div className={styles.pair}>
            <div className={styles.pairCard}>
              <span className={styles.pairName}>text on surface</span>
              <span className={styles.pairSample} style={{ color: 'var(--text)' }}>
                Aa 型 kata 123
              </span>
              <span className={styles.pairVar}>--text</span>
            </div>
            <div className={styles.pairCard}>
              <span className={styles.pairName}>text-dim on surface</span>
              <span className={styles.pairSample} style={{ color: 'var(--text-dim)' }}>
                Aa 型 kata 123
              </span>
              <span className={styles.pairVar}>--text-dim</span>
            </div>
            <div className={styles.pairCard}>
              <span className={styles.pairName}>text-faint on surface</span>
              <span className={styles.pairSample} style={{ color: 'var(--text-faint)' }}>
                Aa 型 kata 123
              </span>
              <span className={styles.pairVar}>--text-faint</span>
            </div>
          </div>
        </div>

        <div className={styles.subSection}>
          <Sub n="03" title="アクセント" en="accent · deep-green" meta="唯一の色 · 5 派生" />
          <div className={`${styles.colgrid} ${styles.colMd}`}>
            {ACCENTS.map((row) => (
              <ColorPanel key={row.varName} row={row} />
            ))}
          </div>
        </div>

        <div className={styles.subSection}>
          <Sub n="04" title="セマンティック・罫線・塗り" en="semantic" meta="9 派生" />
          <div className={`${styles.colgrid} ${styles.colSm}`}>
            {SEMANTIC.map((row) => (
              <ColorPanel key={row.varName} row={row} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ TYPOGRAPHY ============ */}
      <section id="type">
        <Chapter
          kanji="弐"
          jp="タイポグラフィ"
          en="typography · 2 families"
          side="日本語は Zen Kaku Gothic New"
          sideDim="数字は Space Grotesk"
        />

        <div className={styles.typeHero}>
          <div className={styles.typeHeroGrid}>
            <div>
              <div className={styles.eyebrow} style={{ marginBottom: 10 }}>
                japanese · zen kaku gothic new
              </div>
              <div
                style={{
                  fontFamily: 'var(--ja)',
                  fontWeight: 900,
                  fontSize: 96,
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                型録
              </div>
              <div
                style={{
                  fontFamily: 'var(--ja)',
                  fontSize: 22,
                  color: 'var(--text-dim)',
                  marginTop: 8,
                }}
              >
                習慣を、静かに積み上げる
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.eyebrow} style={{ marginBottom: 10 }}>
                latin · space grotesk
              </div>
              <div
                style={{
                  fontFamily: 'var(--num)',
                  fontWeight: 600,
                  fontSize: 96,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: 'var(--text)',
                }}
              >
                kata
              </div>
              <div
                style={{
                  fontFamily: 'var(--num)',
                  fontSize: 22,
                  color: 'var(--text-dim)',
                  marginTop: 8,
                }}
              >
                62.4 kg · 03 days
              </div>
            </div>
          </div>
        </div>

        <div className={styles.subSection} style={{ marginTop: 24 }}>
          <Sub n="01" title="ファミリー" en="font families" meta="3 変数" />
          <div className={styles.typeSpecimen}>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>本文（日本語）</span>
                <span className={styles.typeVar}>--ja</span>
                <span className={styles.typeSpec}>Zen Kaku Gothic New · 400/500/700/900 · palt on</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--ja)',
                  fontSize: 34,
                  fontWeight: 400,
                  color: 'var(--text)',
                  letterSpacing: '0.005em',
                }}
              >
                あいうえお カキクケコ 漢字 Aa 123
              </div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>数字・英字</span>
                <span className={styles.typeVar}>--num</span>
                <span className={styles.typeSpec}>Space Grotesk · 400/500/600/700 · tnum</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--num)',
                  fontSize: 34,
                  fontWeight: 500,
                  color: 'var(--text)',
                  letterSpacing: '0.005em',
                }}
              >
                0123456789 Aa Bb
              </div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>ディスプレイ</span>
                <span className={styles.typeVar}>--display</span>
                <span className={styles.typeSpec}>数字と同じ · Space Grotesk 大きく</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: 34,
                  fontWeight: 600,
                  color: 'var(--text)',
                  letterSpacing: '-0.01em',
                }}
              >
                1,280 kg
              </div>
            </div>
          </div>
        </div>

        <div className={styles.subSection}>
          <Sub n="02" title="スケール" en="scale · variants" meta="Text variant · 見出し" />
          <div className={styles.typeSpecimen}>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>Display / 数字</span>
                <span className={styles.typeVar}>--fs-display</span>
                <span className={styles.typeSpec}>34px · 600</span>
              </div>
              <div style={{ fontFamily: 'var(--num)', fontSize: 34, fontWeight: 600, color: 'var(--text)' }}>1,280</div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>PageTitle h1</span>
                <span className={styles.typeVar}>--fs-page-lg</span>
                <span className={styles.typeSpec}>24px · 700</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>習慣を続ける</div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>SectionTitle</span>
                <span className={styles.typeVar}>--fs-section</span>
                <span className={styles.typeSpec}>13px · 700 · 0.08em / hairline</span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  paddingBottom: 6,
                  borderBottom: '1px solid var(--line)',
                }}
              >
                SECTION TITLE
              </div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>bodyStrong</span>
                <span className={styles.typeVar}>--fs-body</span>
                <span className={styles.typeSpec}>14px · 700</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>今日のトレーニング 完了</div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>body</span>
                <span className={styles.typeVar}>--fs-body</span>
                <span className={styles.typeSpec}>14px · 500</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>この 1 週間で 4 回記録した。</div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>sub</span>
                <span className={styles.typeVar}>--fs-sub</span>
                <span className={styles.typeSpec}>13px · text-dim</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>補足の 1 行。強調しない情報に使う。</div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>label</span>
                <span className={styles.typeVar}>--fs-label</span>
                <span className={styles.typeSpec}>12px · 600 · 字間</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.06em' }}>ラベル LABEL</div>
            </div>
            <div className={styles.typeRow}>
              <div className={styles.typeLbl}>
                <span className={styles.typeName}>caption</span>
                <span className={styles.typeVar}>--fs-caption</span>
                <span className={styles.typeSpec}>11px · text-faint</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>最終更新 2026 / 07 / 04</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPACING ============ */}
      <section id="spacing">
        <Chapter
          kanji="参"
          jp="スペーシング"
          en="spacing · 4px grid"
          side="10 段 · 4 → 48px"
          sideDim="--space-1 〜 --space-10"
        />
        <div className={styles.spacingGrid}>
          {SPACING.map((s) => (
            <div key={s.n} className={styles.spaceRow}>
              <span className={styles.spaceLbl}>--space-{s.n}</span>
              <span className={styles.spacePx}>{s.px}px</span>
              <div className={styles.spaceBar} style={{ width: `var(--space-${s.n})` }} />
              <span className={styles.spaceUsed}>
                {s.n} · {s.use}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ RADIUS ============ */}
      <section id="radius">
        <Chapter
          kanji="四"
          jp="角丸"
          en="radius · corner"
          side="6 段 · xs → full"
          sideDim="既定は md (13px)"
        />
        <div className={styles.radiiRow}>
          {RADII.map((r) => (
            <div key={r.varName} className={styles.rbox}>
              <div className={styles.rboxShape} style={{ borderRadius: `var(${r.varName})` }}>
                <span className={styles.rboxCross} />
              </div>
              <div className={styles.rboxInfo}>
                <span className={styles.rboxVar}>
                  {r.varName}
                  {r.isDefault && <span className={styles.rboxDefault}> 既定</span>}
                </span>
                <span className={styles.rboxPx}>
                  {r.px >= 9999 ? '∞' : `${r.px}px`}
                  {r.note ? ` · ${r.note}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SHADOW ============ */}
      <section id="shadow">
        <Chapter
          kanji="五"
          jp="影"
          en="elevation · shadow"
          side="2 段 · 光彩は使わない"
          sideDim="低コントラストのソフト"
        />
        <div className={styles.shadowRow}>
          <div className={styles.sbox} style={{ boxShadow: 'var(--shadow-sm)' }}>
            <span className={styles.sboxName}>--shadow-sm</span>
            <span className={styles.sboxDesc}>カード・面のごく淡い影。1 段浮いた印象を作る。</span>
            <span className={styles.sboxVal}>0 5px 18px rgba(35 · 31 · 26 / 0.07)</span>
          </div>
          <div className={styles.sbox} style={{ boxShadow: 'var(--shadow)' }}>
            <span className={styles.sboxName}>--shadow</span>
            <span className={styles.sboxDesc}>FAB・モーダルなど浮遊要素の影。少し強め。</span>
            <span className={styles.sboxVal}>0 10px 34px rgba(40 · 45 · 55 / 0.13)</span>
          </div>
        </div>
      </section>

      {/* ============ BREAKPOINTS ============ */}
      <section id="bp">
        <Chapter
          kanji="六"
          jp="ブレークポイント"
          en="breakpoints · responsive"
          side="3 段 · モバイル→タブレット→デスクトップ"
          sideDim="600 / 880 / 1200px"
        />
        <div className={styles.spacingGrid}>
          <div className={styles.bpRow}>
            <span className={styles.bpLbl}>--bp-sm</span>
            <div className={styles.bpBar}>
              <div className={`${styles.bpFill} ${styles.bpFillSoft}`} style={{ width: '30%' }} />
            </div>
            <span className={styles.bpUse}>
              600px
              <br />
              <span style={{ color: 'var(--text-faint)' }}>2 列に</span>
            </span>
          </div>
          <div className={styles.bpRow}>
            <span className={styles.bpLbl}>--bp-md</span>
            <div className={styles.bpBar}>
              <div className={`${styles.bpFill} ${styles.bpFillMid}`} style={{ width: '55%' }} />
            </div>
            <span className={styles.bpUse}>
              880px
              <br />
              <span style={{ color: 'var(--text-faint)' }}>サイドバー</span>
            </span>
          </div>
          <div className={styles.bpRow}>
            <span className={styles.bpLbl}>--bp-lg</span>
            <div className={styles.bpBar}>
              <div className={styles.bpFill} style={{ width: '100%' }} />
            </div>
            <span className={styles.bpUse}>
              1200px
              <br />
              <span style={{ color: 'var(--text-faint)' }}>最大幅</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className={styles.footer}>
        <div className={styles.footerL}>
          <div className={styles.footerBrand}>
            <span className={styles.footerMark}>型</span>
            <span className={styles.footerName}>tokens · foundation</span>
          </div>
          <div className={styles.footerDesc}>CSS Custom Properties · color-mix() · 4px grid</div>
        </div>
        <div className={styles.footerR}>v0.1 · 2026 · foundation</div>
      </footer>
    </div>
  );
}
