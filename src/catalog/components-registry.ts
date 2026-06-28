// カタログのコンポーネント一覧 (ナビのアコーディオンと一覧ページで共有)。
// グループ分けは実体の src/ds/components/ ディレクトリ構成に対応させる:
//   root   = components/ 直下のフラットなファイル (表示/ナビ/オーバーレイ系)
//   forms  = components/forms/   (入力系)
//   charts = components/charts/  (チャート系)
//   editor = components/editor/  (RichTextEditor)
export interface CompEntry {
  /** ルートのパスセグメント */
  slug: string;
  /** フルパス (/components/<slug>)。型付き Link 用に string で保持 */
  to: string;
  /** 表示名 */
  name: string;
  /** 一覧用の一言説明 */
  desc: string;
  /** 所属ディレクトリ (GROUPS の key) */
  group: GroupKey;
}

export type GroupKey = 'root' | 'forms' | 'charts' | 'editor';

export interface CompGroup {
  key: GroupKey;
  /** ナビ・一覧の見出し */
  label: string;
  /** 対応するディレクトリ (補助メタ) */
  meta: string;
  /** ナビでフォルダ (アコーディオン) として畳むか。root は コンポーネント直下に並べる。 */
  folder: boolean;
}

/** ディレクトリ構成に対応するグループ定義と並び順 (ナビ・一覧で共有) */
export const GROUPS: CompGroup[] = [
  { key: 'root', label: 'ベース', meta: 'components/', folder: false },
  { key: 'forms', label: 'フォーム', meta: 'components/forms/', folder: true },
  { key: 'charts', label: 'チャート', meta: 'components/charts/', folder: true },
  { key: 'editor', label: 'エディタ', meta: 'components/editor/', folder: true },
];

function entry(slug: string, name: string, desc: string, group: GroupKey): CompEntry {
  return { slug, to: `/components/${slug}`, name, desc, group };
}

export const COMPONENTS: CompEntry[] = [
  // ---- components/ 直下 ----
  entry('button', 'Button', 'variant 5 種のボタン', 'root'),
  entry('icon-button', 'IconButton', '正方/円形のアイコンボタン', 'root'),
  entry('fab', 'Fab', 'フローティングアクションボタン', 'root'),
  entry('breadcrumb', 'Breadcrumb', '階層パンくず', 'root'),
  entry('action-sheet', 'ActionSheet', '下からせり上がるシート', 'root'),
  entry('icon', 'Icon', '38 種のラインアイコン', 'root'),
  entry('text', 'Text', '本文系テキスト (variant)', 'root'),
  entry('page-title', 'PageTitle', 'ページ見出し h1', 'root'),
  entry('section-title', 'SectionTitle', 'ヘアライン罫の見出し', 'root'),
  entry('card', 'Card', 'サーフェス容器', 'root'),
  entry('badge', 'Badge', '状態ラベル', 'root'),
  entry('chip', 'Chip', '角丸の小ボタン・タグ', 'root'),
  entry('progress-bar', 'ProgressBar', '進捗バー', 'root'),
  entry('search-box', 'SearchBox', '丸型の検索入力', 'root'),
  entry('calendar', 'Calendar', '月グリッド', 'root'),
  entry('pin-pad', 'PinPad', 'パスコード入力', 'root'),
  entry('modal', 'Modal', 'ボトムシート', 'root'),
  entry('menu', 'Menu', 'ドロップダウンメニュー', 'root'),
  entry('confirm-dialog', 'ConfirmDialog', 'useConfirm() 確認ダイアログ', 'root'),
  entry('toast', 'Toast', 'useToast() トースト', 'root'),
  entry('side-nav', 'SideNav', '多階層対応サイドナビ', 'root'),

  // ---- components/forms/ (入力系) ----
  entry('field', 'Field', 'ラベル + ヒント/エラーのラッパー', 'forms'),
  entry('input', 'Input', 'フィールド見た目のテキスト入力', 'forms'),
  entry('stepper', 'Stepper', '±の数値入力', 'forms'),
  entry('textarea', 'Textarea', '複数行テキスト入力', 'forms'),
  entry('select', 'Select', '装飾したネイティブ select', 'forms'),
  entry('search-select', 'SearchSelect', '検索付きセレクト', 'forms'),
  entry('switch', 'Switch', 'オン/オフ トグル', 'forms'),
  entry('date-picker', 'DatePicker', 'カレンダー入力', 'forms'),

  // ---- components/charts/ ----
  entry('bar-chart', 'BarChart', '棒グラフ (枠つき)', 'charts'),
  entry('line-chart', 'LineChart', '折れ線チャート (枠つき)', 'charts'),
  entry('bar-list', 'BarList', '横棒ランキング (枠つき)', 'charts'),
  entry('sparkline', 'Sparkline', 'ミニ折れ線', 'charts'),

  // ---- components/editor/ ----
  entry('rich-text-editor', 'RichTextEditor', 'Lexical ベースのエディタ', 'editor'),
];

/** group ごとにまとめた [group, entries] の配列 (定義順) */
export function groupedComponents(): Array<{ group: CompGroup; items: CompEntry[] }> {
  return GROUPS.map((group) => ({
    group,
    items: COMPONENTS.filter((c) => c.group === group.key),
  }));
}
