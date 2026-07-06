import { createFileRoute } from '@tanstack/react-router';
import { Heatmap, type HeatmapDatum } from 'kata';
import { Doc } from '~/catalog/Doc';
import { Code, Demo, PropsTable } from '~/catalog/parts';

export const Route = createFileRoute('/components/heatmap')({
  component: HeatmapPage,
});

/** デモ用: 直近 90 日のランダムな値を生成 */
function buildDemoData(from: string, to: string): HeatmapDatum[] {
  const out: HeatmapDatum[] = [];
  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  const start = new Date(fy!, (fm ?? 1) - 1, fd ?? 1);
  const end = new Date(ty!, (tm ?? 1) - 1, td ?? 1);
  let cursor = start.getTime();
  let seed = 12345;
  const p = (n: number) => String(n).padStart(2, '0');
  while (cursor <= end.getTime()) {
    seed = (seed * 9301 + 49297) % 233280;
    const rand = seed / 233280;
    const d = new Date(cursor);
    // 8 割の日は 0-3、残りが 3-6
    const v = rand < 0.5 ? 0 : rand < 0.8 ? Math.floor(rand * 4) : Math.floor(rand * 7);
    if (v > 0) {
      out.push({ date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`, value: v });
    }
    cursor += 24 * 60 * 60 * 1000;
  }
  return out;
}

const FROM = '2026-04-06';
const TO = '2026-07-06';
const DATA = buildDemoData(FROM, TO);

function HeatmapPage() {
  return (
    <Doc
      title="Heatmap"
      lede="週 = 列 (月曜はじまり) のカレンダー草型ヒートマップ。値は 0..max を levels 段階に量子化して色の濃さで表す。常に枠 (タイトル / 説明 / 数値) でラップされる。"
    >
      <Demo>
        <div style={{ maxWidth: 520 }}>
          <Heatmap
            title="習慣ヒートマップ"
            sub="直近 3 ヶ月"
            value={`${DATA.length} 日`}
            data={DATA}
            from={FROM}
            to={TO}
          />
        </div>
      </Demo>
      <Code>{`<Heatmap
  title="習慣ヒートマップ"
  sub="直近 3 ヶ月"
  value="24 日"
  from="2026-04-06"
  to="2026-07-06"
  data={[{ date: '2026-04-08', value: 2 }, ...]}
/>`}</Code>
      <PropsTable
        rows={[
          { name: 'data', type: 'HeatmapDatum[]', desc: '{ date: "YYYY-MM-DD", value }[]' },
          { name: 'from / to', type: 'string', desc: '表示範囲。from は週頭に切り下げ' },
          { name: 'color', type: 'string', def: `'var(--accent)'`, desc: '濃色の基準' },
          { name: 'levels', type: 'number', def: '4', desc: '濃さの段階数' },
          { name: 'cellTitle', type: '(date, value) => string', desc: 'セルの title (省略時は「日付: 値」)' },
          { name: 'title / sub / value', type: '枠', desc: 'ChartCard の見出し / 説明 / 右上数値' },
        ]}
      />
    </Doc>
  );
}
