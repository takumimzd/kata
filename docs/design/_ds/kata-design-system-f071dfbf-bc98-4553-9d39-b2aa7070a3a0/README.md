# 型 — kata Design System

> 個人開発のサービス間で共有する汎用デザインシステムを、デザインエージェント用に再構成したもの。
> A quiet, restrained design system for personal-project apps — soft greige surfaces, a deep-green accent, and a Japanese-first type pairing. Mobile-first.

## 1. 何であるか / Product context

**kata（型）** はオリジナル作者 [takumimzd](https://github.com/takumimzd) が複数の個人開発サービス間で共有するために作った汎用デザインシステムです。特定アプリに依存せず、トークン + React コンポーネントを 1 リポジトリにまとめ、各サービスから利用します。

- **性格**: 静かで生活感のあるツール。健康・習慣・記録系のパーソナルアプリ向け。派手さより継続のしやすさ。
- **基盤 (原典)**: React 19 + CSS Modules + CSS カスタムプロパティ（Tailwind / cva / clsx 不使用、クラス合成は `cn()` のみ）。
- **2 つのテーマ**: 霧 (kiri) = ライト既定 / 墨 (sumi) = ダーク。`data-theme='sumi'` で切替。
- **モバイルファースト**: ブレークポイント 600 / 880 / 1200px。ボトムシート・FAB・PinPad・safe-area 対応など、片手操作の UI が中心。

アイコンセット（dumbbell・glass・flame・scale・pill・bottle・note・book・calendar・chart…）が示すとおり、想定ドメインは**トレーニング・水分・体重・サプリ・日記といった健康/習慣トラッキング**です。

### このプロジェクトでの再構成

原典は CSS Modules + TSX。この design system プロジェクトでは、コンパイラが扱えるよう次のように移植しています（**見た目・トークン値・API は原典に忠実**）:

- CSS Modules → トークン参照のグローバルクラス（接頭辞 `k-`）を `components.css` に集約。
- `.tsx` + `cn()` → 素の `.jsx`（`export function`）。スタイルは `k-` クラスを参照。
- 公開トークンは `tokens/` に分割（colors / typography / shape）。

### Sources（入力に使ったもの）

- **GitHub**: `https://github.com/takumimzd/kata` (private)
  — トークン (`src/ds/styles/tokens.css`)、コンポーネント (`src/ds/components/**`)、テーマ管理 (`src/ds/lib/theme.tsx`)、カタログ (`src/catalog/`, `src/routes/`) を参照。
  より精度高く kata ブランドの設計を再現したい場合は、このリポジトリを直接読むことを勧めます。

---

## 2. Content fundamentals（コピーの書き方）

原典のカタログ・コンポーネント文言から観察したトーンです。

- **言語**: 日本語が主。UI ラベルは短い体言止め or 簡潔な動詞（「保存」「記録を追加」「データを書き出す」）。英語は eyebrow・セクション補足（`design system` / `principles` / `tokens`）に小さく添えるのみ。
- **人称**: ほぼ無人称。ユーザーへの直接呼びかけ（「あなた」）は使わず、機能を淡々と提示。励ましは控えめに 1 行（例: 「このまま続けよう。」）。
- **ケーシング**: 日本語は地の文。英語の eyebrow / ラベルは小文字 + `letter-spacing` を広げ大文字化（`text-transform: uppercase`）するパターンが定番。
- **数字**: 必ず Space Grotesk + `tnum`（等幅）。単位は小さく添える（`62.4` + `kg`）。
- **絵文字**: **使わない**。状態・カテゴリはラインアイコン + Badge で表す。
- **句読点**: 日本語の読点・句点を素直に。感嘆符はトースト等の小さな祝福でのみ稀に（「3 日連続！」）。
- **専門用語の和名**: テーマに固有名（霧 kiri / 墨 sumi）、トークンはセマンティック英語（`--surface` / `--text-dim`）。
- **Vibe**: 落ち着いた・余白多め・静か。「習慣を、静かに積み上げる」。

---

## 3. Visual foundations（ビジュアルの土台）

### カラー
- **下地**: 銀鼠（ぎんねず）系のグレー。`--bg #e9e9ea` → `--surface #fbfbfc` と、面が上がるほど明るくなる**段差設計**（bg → bg-2 → surface → surface-2 → surface-3）。彩度はほぼ無し。
- **アクセント**: ただ 1 色、**深緑 `--accent #3a6157`**。ボタン塗り・FAB・選択状態・進捗に使う。ホバーは `--accent-2`（やや明るい緑）。
- **中性強調 `--clay`**: アクセントを使いたくない控えめな強調（警告 Badge、進捗の超過など）。
- **危険 `--danger #c0564f`**: 赤系。削除・破壊的操作のみ。
- **派生色は `color-mix()` で自動生成**（`--accent-soft` 13% / `--accent-line` 32% / `--line` text 8% / `--fill-1` text 5% …）。テーマ側ではベース色のみ上書きし、派生は触らない。
- **ダーク (墨 sumi)**: 温かみのある黒茶 `--bg #181715`、文字は生成り `--text #ece9e3`、アクセントは明るい緑 `--accent #6f9e82`。冷たい純黒は使わない。
- **画像の色味**: 原典に写真素材はほぼ無く、面と罫線とアイコンで構成する**イラストレス / フォトレス**な作り。グラデーションは使わない（唯一、本キットの背景にアクセント 8% のごく薄い放射のみ演出として使用）。

### タイポグラフィ
- **本文**: `Zen Kaku Gothic New`（400/500/700/900）。`font-feature-settings: 'palt' 1` で日本語をプロポーショナル詰め。
- **数字・ラテン・表示**: `Space Grotesk`（400/500/600/700）。数値は `tnum` で等幅。
- 見出しは `PageTitle`（21→24px / 700）、セクションは `SectionTitle`（13px / 700 / `letter-spacing 0.08em` + ヘアライン罫）。本文 variant は body / bodyStrong / sub / caption / label。

### スペーシング・形状
- **4px グリッド**（`--space-1`=4 … `--space-10`=48）。
- **角丸**: xs 6 / sm 9 / md(既定) 13 / lg 18 / xl 24 / full。カードは md=13px、ボタン/入力は sm=9px、チップ/スイッチは full。
- **影**: 2 段。`--shadow-sm`（カード・面、ごく淡い）/ `--shadow`（FAB・モーダルなど浮遊）。光彩は使わず、低コントラストのソフトシャドウ。

### 罫線・カード
- **カード** = `--surface` 背景 + `1px var(--line)` 罫線 + `--shadow-sm` + 角丸 13px。塗りつぶしや色帯は使わず、罫線と微小シャドウで面を分ける。**左ボーダーだけ色を付けるパターンは使わない**。
- 罫線は 2 段（`--line` 淡 8% / `--line-2` 通常 15%）。区切りは罫線、選択は `--accent-line`。

### 透明・ブラー
- タブバー / モーダル背景でのみ `backdrop-filter: blur()`。タブバーは `bg-2` を 86% に透過 + blur 14px。モーダルのオーバーレイは黒 60% + blur 3px。多用しない。

### アニメーション
- 短く控えめ。ボタン/入力のトランジションは `0.15s ease`。
- モーダルは下から `slideUp 0.26s cubic-bezier(0.3,0.9,0.3,1)`、オーバーレイは `fade 0.2s`。トーストは上から `0.3s` の同 easing。
- 進捗バーは `width 0.6s ease`。バウンスや無限ループ装飾は使わない。

### ホバー / プレス状態
- **ホバー**: primary ボタンは `opacity .88`、secondary/中立は `--surface-2` に背景が乗る、チップ/入力は罫線がアクセント色に。
- **プレス**: FAB は `transform: scale(0.94)`、Stepper ボタンは `--surface-3` に沈む。色とわずかな縮小で表現。
- **無効**: `opacity 0.3〜0.4` + `cursor: default`。

### レイアウト規則
- 画面コンテナ `.screen` は最大 1180px・中央寄せ。モバイルは下部固定のタブバー / FAB（safe-area inset 考慮）。880px で sidebar 等のレイアウトを切替。

---

## 4. Iconography（アイコン）

- **方式**: 自前の **38 種ラインアイコン**（`Icon` コンポーネント）。すべて 24×24 viewBox / `fill: none` / `stroke: currentColor` / `stroke-width 1.8`（既定）/ `linecap・linejoin: round` に正規化。点状の要素（pin・more・list）のみ `fill: currentColor`。
- **色**: `currentColor` 追従。親の文字色を変えれば連動（Chip ホバーでアクセント、など）。
- **emoji**: 不使用。Unicode 記号もほぼ不使用（装飾的な ∞ 等を foundations カードで使う程度）。
- **PNG アイコン**: アプリの favicon / PWA アイコンとして `assets/icon-192.png` `icon-512.png` `apple-touch-icon.png` を同梱（型のモノグラム）。
- **本リポジトリのアイコン資産**: `Icon` の全名は `assets`/ブランドカード「アイコンセット」で一覧可能。新規アイコンは同じ 24/stroke 1.8 ルールで `components/core/Icon.jsx` の `PATHS` に追加する。
- ドメイン特化アイコン（dumbbell・glass・flame・scale・pill・bottle）は健康/習慣トラッキング用途。

### Assets
- `assets/logo-kata.svg` — 型のロゴマーク（深緑角丸 + 白の「型」）。
- `assets/icon-192.png` / `icon-512.png` / `apple-touch-icon.png` — PWA / favicon 用。

---

## 5. フォントについて（要確認）

原典は Google Fonts（Zen Kaku Gothic New / Space Grotesk）を `<head>` の `<link>` で読み込む方針です。本プロジェクトでも `tokens/typography.css` から **Google Fonts CDN を `@import`** しています（オフライン不可・ネット接続前提）。

> ⚠️ **フォントは CDN 参照です。** バイナリは同梱していません。オフライン配布や厳密な再現が必要な場合は、両フォントの woff2 を `assets/fonts/` に置き、`@font-face` へ差し替えてください。元データがあれば共有いただければ対応します。

---

## 6. Index / Manifest（このフォルダの中身）

**Global entry**
- `styles.css` — 利用側が読む唯一のエントリ（`@import` のみ）。
- `tokens/colors.css` `tokens/typography.css` `tokens/shape.css` — トークン。
- `reset.css` `utilities.css` `components.css` — リセット / ヘルパー / `k-` コンポーネントクラス。

**Components**（`window.KataDesignSystem_…` 名前空間で公開 / 各 `.jsx` + `.d.ts` + `.prompt.md`）
- `components/core/` — Button, IconButton, Fab, Card, Badge, Chip(+ChipGroup), Text, PageTitle, SectionTitle, ProgressBar, Icon
- `components/forms/` — Field, Input, Textarea, Select, Switch, Stepper
- `components/feedback/` — Modal, Toast
- `components/charts/` — Sparkline, BarList

**Foundations**（Design System タブの specimen カード）
- `foundations/colors-*.html` — surface / text / accent / semantic / themes
- `foundations/type-*.html` — families / headings / body
- `foundations/spacing-scale.html` `foundations/shape-radius.html` `foundations/shape-elevation.html`
- `foundations/brand-logo.html` `foundations/brand-icons.html`

**UI kit**
- `ui_kits/tracker/` — 「記録」: kata で組んだパーソナル習慣トラッカー（今日 / 統計 / 設定 + 記録追加シート）。`index.html` がインタラクティブなデモ。

**Skill**
- `SKILL.md` — Agent Skills 互換のエントリ。
- `README.md` — このファイル。

---

## 7. 使い方（このシステムでデザインする）

1. `styles.css` を読み込む（トークン + リセット + `k-` クラス）。
2. フォント `<link>`（Zen Kaku Gothic New / Space Grotesk）を `<head>` に。
3. コンポーネントは `window.KataDesignSystem_…` から使う（HTML カタログでは `_ds_bundle.js` を読み込み `const { Button } = window.KataDesignSystem_…`）。
4. 色・余白・角丸は必ずトークン `var(--…)` を使い、生の hex / px を書かない。アクセントは深緑 1 色に絞る。絵文字は使わない。
