import { createFileRoute } from '@tanstack/react-router';
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
  { name: 'line', varName: '--line' },
  { name: 'line 2', varName: '--line-2' },
];

const TYPE_SAMPLES = [
  { label: 'Display / 数字', font: 'var(--display)', size: 46, weight: 600, sample: '1,280' },
  { label: '見出し H1', font: 'var(--ja)', size: 24, weight: 700, sample: '習慣を続ける' },
  { label: 'セクション', font: 'var(--ja)', size: 16, weight: 700, sample: 'セクション見出し' },
  { label: '本文', font: 'var(--ja)', size: 14.5, weight: 600, sample: '本文テキストの標準サイズ' },
  { label: 'サブ', font: 'var(--ja)', size: 12, weight: 500, sample: '補足のサブテキスト' },
  { label: 'キャプション', font: 'var(--ja)', size: 10.5, weight: 600, sample: 'キャプション' },
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
          全トークンは CSS カスタムプロパティで提供。左メニュー下部でテーマを切り替えると、
          以下の見本もそのテーマの値で再描画される。
        </p>
      </header>

      <ColorSection title="背景・サーフェス" meta="surfaces" items={SURFACES} />
      <ColorSection title="前景・テキスト" meta="foreground" items={FOREGROUND} />
      <ColorSection title="アクセント" meta="accent" items={ACCENTS} />
      <ColorSection title="セマンティック・罫線" meta="semantic" items={SEMANTIC} />

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>タイポグラフィ</h2>
          <span>Zen Kaku Gothic New / Space Grotesk</span>
        </div>
        <div className={styles.card}>
          {TYPE_SAMPLES.map((t) => (
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
          <h2>形状</h2>
          <span>radius</span>
        </div>
        <div className={styles.tokenRow}>
          <div className={styles.shapeBox} style={{ borderRadius: 'var(--radius)' }}>
            --radius
          </div>
          <div className={styles.shapeBox} style={{ borderRadius: 'var(--radius-sm)' }}>
            --radius-sm
          </div>
          <div className={styles.shapeBox} style={{ borderRadius: '999px' }}>
            999px
          </div>
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
