import { createFileRoute } from '@tanstack/react-router';
import { Text, type TextVariant } from 'kata';
import styles from '~/catalog/page.module.css';

export const Route = createFileRoute('/tokens')({
  component: TokensPage,
});

const SURFACES = [
  { name: '背景', varName: '--bg' },
  { name: '背景 2', varName: '--bg-2' },
  { name: 'サーフェス', varName: '--surface' },
  { name: 'サーフェス 2', varName: '--surface-2' },
  { name: 'サーフェス 3', varName: '--surface-3' },
];

const FOREGROUND = [
  { name: '本文', varName: '--text' },
  { name: '副文', varName: '--text-dim' },
  { name: '薄字', varName: '--text-faint' },
];

const ACCENTS = [
  { name: 'アクセント', varName: '--accent' },
  { name: 'アクセント 2', varName: '--accent-2' },
  { name: 'アクセント上文字', varName: '--on-accent' },
  { name: 'アクセント soft', varName: '--accent-soft' },
  { name: 'アクセント line', varName: '--accent-line' },
];

const SEMANTIC = [
  { name: 'clay (中性強調)', varName: '--clay' },
  { name: 'clay soft', varName: '--clay-soft' },
  { name: 'danger (危険)', varName: '--danger' },
  { name: 'danger soft', varName: '--danger-soft' },
  { name: 'danger line', varName: '--danger-line' },
  { name: 'line', varName: '--line' },
  { name: 'line 2', varName: '--line-2' },
  { name: 'fill 1', varName: '--fill-1' },
  { name: 'fill 2', varName: '--fill-2' },
];

/** Text コンポーネントの variant とその役割 */
const TEXT_VARIANTS: Array<{ v: TextVariant; note: string }> = [
  { v: 'bodyStrong', note: 'bodyStrong · 14 / 700' },
  { v: 'body', note: 'body · 14 / 500' },
  { v: 'sub', note: 'sub · 13 / text-dim' },
  { v: 'label', note: 'label · 12 / 600 / 字間' },
  { v: 'caption', note: 'caption · 11 / text-faint' },
];

/** 見出し系 (Text の対象外。PageTitle / SectionTitle が担当) */
const HEADINGS = [
  { label: 'Display / 数字', font: 'var(--display)', size: 46, weight: 600, sample: '1,280' },
  { label: 'PageTitle h1', font: 'var(--ja)', size: 24, weight: 700, sample: '習慣を続ける' },
  { label: 'SectionTitle', font: 'var(--ja)', size: 16, weight: 700, sample: 'セクション見出し' },
];

const FONTS = [
  { name: '本文 (日本語)', varName: '--ja', sample: 'あいうえお 漢字 Aa' },
  { name: '数字・英字', varName: '--num', sample: '0123456789 Aa' },
  { name: 'ディスプレイ', varName: '--display', sample: '1,280 kg' },
];

const SPACING = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const SPACE_PX: Record<number, number> = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 9: 40, 10: 48,
};

const RADII = [
  { varName: '--radius-xs', px: 6 },
  { varName: '--radius-sm', px: 9 },
  { varName: '--radius', px: 13, note: '既定 (md)' },
  { varName: '--radius-lg', px: 18 },
  { varName: '--radius-xl', px: 24 },
  { varName: '--radius-full', px: 9999, note: 'ピル / 丸' },
];

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.swatchColor} style={{ background: `var(${varName})` }} />
      <div className={styles.swatchMeta}>
        <span className={styles.swatchName}>{name}</span>
        <span className={styles.swatchVar}>{varName}</span>
      </div>
    </div>
  );
}

function ColorSection({
  title,
  meta,
  items,
}: {
  title: string;
  meta: string;
  items: Array<{ name: string; varName: string }>;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>
        <h2>{title}</h2>
        <span>{meta}</span>
      </div>
      <div className={styles.swatchGrid}>
        {items.map((c) => (
          <Swatch key={c.varName} {...c} />
        ))}
      </div>
    </section>
  );
}

function TokensPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className={styles.eyebrow}>foundation</span>
        <h1 className={styles.h1}>トークン</h1>
        <p className={styles.lede}>
          全トークンは CSS カスタムプロパティで提供。色・余白・角丸はこれらを <code>var(--…)</code> で
          参照する。左メニュー下部でテーマを切り替えると、以下の見本もそのテーマの値で再描画される。
        </p>
      </header>

      <ColorSection title="背景・サーフェス" meta="surfaces" items={SURFACES} />
      <ColorSection title="前景・テキスト" meta="foreground" items={FOREGROUND} />
      <ColorSection title="アクセント" meta="accent" items={ACCENTS} />
      <ColorSection title="セマンティック・罫線・塗り" meta="semantic" items={SEMANTIC} />

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>フォント</h2>
          <span>Zen Kaku Gothic New / Space Grotesk</span>
        </div>
        <div className={styles.card}>
          {FONTS.map((f) => (
            <div key={f.varName} className={styles.typeRow}>
              <span style={{ fontFamily: `var(${f.varName})`, fontSize: 20 }}>{f.sample}</span>
              <span className={styles.typeMeta}>
                {f.name} · {f.varName}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>本文タイポ (Text)</h2>
          <span>variant</span>
        </div>
        <div className={styles.card}>
          {TEXT_VARIANTS.map((t) => (
            <div key={t.v} className={styles.typeRow}>
              <Text variant={t.v}>あいうえお Aa 123</Text>
              <span className={styles.typeMeta}>{t.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>見出しタイポ</h2>
          <span>PageTitle / SectionTitle / display</span>
        </div>
        <div className={styles.card}>
          {HEADINGS.map((t) => (
            <div key={t.label} className={styles.typeRow}>
              <span style={{ fontFamily: t.font, fontSize: t.size, fontWeight: t.weight }}>
                {t.sample}
              </span>
              <span className={styles.typeMeta}>
                {t.label} · {t.size}px / {t.weight}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>スペーシング</h2>
          <span>4px グリッド · --space-1〜10</span>
        </div>
        <div className={styles.card}>
          {SPACING.map((n) => (
            <div key={n} className={styles.spaceRow}>
              <span className={styles.spaceName}>--space-{n}</span>
              <span className={styles.spaceBar} style={{ width: `var(--space-${n})` }} />
              <span className={styles.spacePx}>{SPACE_PX[n]}px</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>角丸</h2>
          <span>radius</span>
        </div>
        <div className={styles.tokenRow}>
          {RADII.map((r) => (
            <div key={r.varName} className={styles.shapeBox} style={{ borderRadius: `var(${r.varName})` }}>
              <span className={styles.shapeName}>{r.varName}</span>
              <span className={styles.shapePx}>
                {r.px >= 9999 ? '∞' : `${r.px}px`}
                {r.note ? ` · ${r.note}` : ''}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>影</h2>
          <span>shadow</span>
        </div>
        <div className={styles.tokenRow}>
          <div className={styles.shadowBox} style={{ boxShadow: 'var(--shadow)' }}>
            --shadow
          </div>
          <div className={styles.shadowBox} style={{ boxShadow: 'var(--shadow-sm)' }}>
            --shadow-sm
          </div>
        </div>
      </section>
    </div>
  );
}
