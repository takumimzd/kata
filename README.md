# kata（型）

個人開発のサービス間で共有する汎用デザインシステム。トークン・コンポーネントと、その
カタログアプリを 1 リポジトリにまとめている。

> 「型」はデザインシステムの名前。ダークテーマの「墨 (sumi)」とは別物。

- **基盤**: React 19 + CSS Modules + CSS カスタムプロパティ（Tailwind / cva / clsx 不使用）
- **配布**: CSS Modules ソースをそのまま配布し、利用側の Vite でコンパイル
- **カタログ**: TanStack Start + Cloudflare（`pnpm dev` / `pnpm deploy`）

## 構成

```
src/
├─ ds/              # 公開するデザインシステム本体 (= パッケージ "kata")
│  ├─ styles/       # reset / tokens(霧kiri:ライト / 墨sumi:ダーク) / utilities / index.css
│  ├─ lib/          # cn() / date / 外観管理 theme.tsx
│  ├─ components/   # 各コンポーネント (<Name>/Name.tsx + .module.css + index.ts)
│  └─ index.ts      # 公開エントリ
├─ catalog/         # カタログアプリのシェル (SideNav・テーマ切替・共通パーツ)
├─ routes/          # カタログのページ (TanStack Start)
└─ router.tsx
```

## コンポーネント

| 分類 | コンポーネント |
|---|---|
| ボタン | `Button` / `IconButton` |
| 表示 | `Icon` / `SectionTitle` |
| 入力 | `Field` / `Input` / `Stepper` / `DatePicker` / `SearchBox` / `PinPad` |
| オーバーレイ | `Modal` / `ConfirmDialog`(`useConfirm`) / `Toast`(`useToast`) |
| ナビ | `SideNav`(アコーディオン対応・ルーター非依存) |
| チャート | `BarChart` / `LineChart` / `Sparkline` |
| エディタ | `RichTextEditor`(Lexical) |

lib: `cn()` / `AppearanceProvider` ・ `useAppearance` / 日付ユーティリティ (`today` ほか)。

## カタログの起動

```sh
pnpm install
pnpm dev        # http://localhost:3100
pnpm deploy     # Cloudflare へデプロイ
```

## 他リポジトリからの利用（git 依存）

利用する各サービスの `package.json` に git 依存として追加する。

```jsonc
{
  "dependencies": {
    "kata": "github:takumimzd/kata"
    // タグ/ブランチ固定: "github:takumimzd/kata#v0.1.0"
  }
}
```

利用側（アプリ）のコード:

```tsx
// 1) スタイル（トークン + リセット）を一度だけ読み込む
import 'kata/styles.css';

// 2) フォントは <head> で読み込む（Zen Kaku Gothic New / Space Grotesk）
//    <link rel="stylesheet"
//      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap" />

// 3) ライト/ダーク/システム追従（任意）
import { AppearanceProvider, APPEARANCE_INIT_SCRIPT } from 'kata';
//    <head> に APPEARANCE_INIT_SCRIPT を同期実行して FOUC を防ぐ

// 4) コンポーネント
import { Button, Icon } from 'kata';
```

> 利用側は Vite で CSS Modules と `.css?url` を解決できる前提。

## 方針

- トークン命名はセマンティック（`--surface` / `--text` / `--text-dim` / `--line` …）。
- danger は危険操作の赤系 `--danger`、`--clay` は中性の強調色として併存。
- ブレークポイントは 600 / 880 / 1200px に統一。
- テーマは霧 (kiri) をライト既定、墨 (sumi) をダークに。
- クラス合成はテンプレートリテラルを直書きせず `cn()` を使う。

## 新しいコンポーネントの追加

1. `src/ds/components/<Name>/` に `Name.tsx` / `Name.module.css` / `index.ts` を作る（色・余白はトークン `var(--…)` を使い生の hex を書かない）。
2. `src/ds/index.ts` から `export` して公開 API に追加する。
3. カタログに載せる: `src/catalog/components-registry.ts` に 1 行追加し、`src/routes/components/<slug>.tsx` を作る（`Doc` + `Demo` + `Code` + `PropsTable`）。ナビと一覧には registry から自動で並ぶ。
4. `pnpm typecheck` / `pnpm lint` / `pnpm build` が通ることを確認する。

> 設計思想・トークンの使い方・規約の詳細はカタログの「特徴」ページにまとめている。
