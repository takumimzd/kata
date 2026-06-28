// カタログのコンポーネント一覧 (ナビのアコーディオンと一覧ページで共有)
export interface CompEntry {
  /** ルートのパスセグメント */
  slug: string;
  /** フルパス (/components/<slug>)。型付き Link 用に string で保持 */
  to: string;
  /** 表示名 */
  name: string;
  /** 一覧用の一言説明 */
  desc: string;
}

function entry(slug: string, name: string, desc: string): CompEntry {
  return { slug, to: `/components/${slug}`, name, desc };
}

export const COMPONENTS: CompEntry[] = [
  entry('button', 'Button', 'variant 5 種のボタン'),
  entry('icon-button', 'IconButton', '34×34 のアイコンボタン'),
  entry('icon', 'Icon', '38 種のラインアイコン'),
  entry('field', 'Field / Input', 'ラベル付きフォーム要素'),
  entry('stepper', 'Stepper', '±の数値入力'),
  entry('date-picker', 'DatePicker', 'カレンダー入力'),
  entry('search-box', 'SearchBox', '丸型の検索入力'),
  entry('section-title', 'SectionTitle', 'ヘアライン罫の見出し'),
  entry('modal', 'Modal', 'ボトムシート'),
  entry('confirm-dialog', 'ConfirmDialog', 'useConfirm() 確認ダイアログ'),
  entry('toast', 'Toast', 'useToast() トースト'),
  entry('switch', 'Switch', 'オン/オフ トグル'),
  entry('select', 'Select', '装飾したネイティブ select'),
  entry('search-select', 'SearchSelect', '検索付きセレクト'),
  entry('textarea', 'Textarea', '複数行テキスト入力'),
  entry('calendar', 'Calendar', '月グリッド'),
  entry('pin-pad', 'PinPad', 'パスコード入力'),
  entry('side-nav', 'SideNav', 'アコーディオン対応サイドナビ'),
  entry('rich-text-editor', 'RichTextEditor', 'Lexical ベースのエディタ'),
  entry('bar-chart', 'BarChart', '棒グラフ'),
  entry('line-chart', 'LineChart', '折れ線チャート'),
  entry('sparkline', 'Sparkline', 'ミニ折れ線'),
];
