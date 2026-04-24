# 支礎学コンパス (shisogaku-compass) プロジェクトメモ

このファイルは Claude 向けのプロジェクト記憶ファイルです。セッションが切れても
ここを読めば最低限の文脈を復元できるようにまとめてあります。

---

## 1. プロジェクト概要

- アプリ名: **支礎学コンパス**（血液型 × 性別 ベースの人間関係サポートアプリ）
- 公開 URL: https://shisogaku.github.io/shisogaku-compass/
- GitHub リポジトリ: `shisogaku/shisogaku-compass`（master ブランチが本番）
- デプロイ: GitHub Pages（`.github/workflows/deploy.yml` 経由で自動デプロイ）
- ローカル開発パス（ユーザーの Mac）: `~/Desktop/` 以下のどこか（`支礎学` フォルダ）

## 2. 技術スタック

- **フレームワーク**: React 18 + Vite 5
- **スタイル**: Tailwind CSS（PostCSS）
- **バックエンド**: Supabase（認証・プロフィール永続化）
- **ビルド**: `npm run build`（vite build）
- **開発サーバ**: `npm run dev`
- **チャンク分割**: `vendor-react`, `vendor-supabase`, `vendor`, 各ビュー（React.lazy）

## 3. ディレクトリ構造

```
支礎学/
├── src/
│   ├── data.js            # データとロジックの単一ソース（※超重要・巨大）
│   ├── index.css          # Tailwind + 独自スタイル
│   ├── main.jsx           # エントリ
│   ├── lib/               # Supabase クライアント等
│   └── views/
│       ├── app.jsx           # ルートレイアウト／サイドバー／ルータ
│       ├── ErrorBoundary.jsx
│       ├── knowledge.jsx     # 血液型ナレッジ／変換ツール／XYマップ
│       ├── life.jsx          # ライフステージ
│       ├── pair.jsx          # ペア相性診断
│       ├── plan.jsx          # PLAN_DB カテゴリ別プラン
│       ├── profile.jsx       # ユーザープロフィール入力
│       └── social.jsx        # シーン・シミュレーション（メッセージ変換）
├── public/                # 静的アセット
├── dist/                  # ビルド出力
├── index.html             # エントリ HTML（OGP / PWA manifest 等設定済）
├── vite.config.js         # manualChunks 設定あり
├── tailwind.config.js
└── package.json
```

## 4. `src/data.js` の主要データ構造

巨大な単一ファイルに全データが集約されている。頻繁に編集する。

| 名前 | 役割 |
|------|------|
| `BC` / `GS` / `CATS` / `NENDAI` | 血液型・性別・カテゴリ・年代の選択肢 |
| `ALL_PROFILES` | 8タイプ（血液型×性別）の基本情報 |
| `COMPAT` / `COMPAT_KEY` | ペア相性データとキー生成 |
| `MSG_TIPS` | **メッセージ変換テンプレート**（血液型×性別×トーン×msgType） |
| `MSG_CLASSIFY` / `classifyMsg` | 本文からメッセージタイプ（誘い/依頼/承認/批判/告白/連絡/感謝/謝罪/その他）を推定 |
| `improveMsg` | 元メッセージ＋ターゲット＋msgType＋トーンから改善文を生成 |
| `REACTION_DB` | msgType × 関係性ごとの反応シミュレーション |
| `SCENE_DB` | シーン別（会社・恋愛・キャバ嬢・ホスト 等 18種）の接し方Tips |
| `FEMALE_STAGES` | 女性の心理段階（信頼→気になる→心配→恋心→独占→本母性） |
| `RADAR_AXES` / `RADAR_DATA` / `RADAR_DESC` | レーダーチャート用 |
| `LEVELUP_TIPS` | 各タイプのレベルアップ助言 |
| `PLAN_DB` | カテゴリ別の行動プラン |
| `TONE_OPTIONS` | フランク / 普通 / 丁寧 |

### 4-1. `MSG_TIPS` の構造（2026-04 再構築後）

```js
MSG_TIPS["O型女性"] = {
  prefix, style, avoid,
  templates: {
    frank:  { 誘い:fn, 依頼:fn, 承認:fn, 批判:fn, 告白:fn, 連絡:fn, 感謝:fn, 謝罪:fn, その他:fn },
    normal: { ...同上 },
    polite: { ...同上 },
  },
  // 後方互換アクセサ（自動で classifyMsg する）
  frank(msg),  normal(msg),  polite(msg),  pattern(msg),
}
```

- `improveMsg(original, targetLabel, msgType, tone)` は `templates[tone][msgType]` を
  直接選択し、なければ `その他` にフォールバック。
- `knowledge.jsx` / `pair.jsx` の直接呼び出し（`tips.pattern(msg)`）は自動分類でそのまま動く。

### 4-2. `SCENE_DB` の構造

```js
SCENE_DB["会社上司"] = {
  label, icon, desc,
  genderLock: "female" | "male" | null,   // キャバ嬢="female"/ホスト="male"
  tips: {
    "O型女性": { basic, example, avoid },
    "O型男性": { ... }, ...
  },
}
```

- `genderLock` があるシーンでは UI の性別切り替えを無効化し、その性別に固定する。
- キャバ嬢／ホストは「相手に対しての接し方」視点で書く（本人視点ではない）。

## 5. 運用ルール（重要）

### 5-1. Git ID（サンドボックス内でコミットする場合）

```bash
git -c user.email="sochi34@gmail.com" -c user.name="shisogaku" commit -m "..."
```

サンドボックスではリモート push 権限が無いため、**push はユーザーがローカル Mac から手動実行**する。

### 5-2. ユーザーへの push 案内

ユーザーはすでに Mac ターミナルで `~/Desktop/.../支礎学` フォルダにいる前提。
案内する最短コマンドは:

```bash
git pull --rebase && git push
```

（フルパス `cd ~/Desktop/support/shisogaku-compass && ...` は環境によって存在しないので
使わない。ユーザーが既に作業フォルダにいる前提で短いコマンドを渡す。）

### 5-3. ビルド確認

編集後は必ず:

```bash
npm run build
```

で Vite ビルドが通ることを確認してからコミットする。

### 5-4. コミットメッセージ

- 日本語 OK。`feat:` / `fix:` / `perf:` / `refactor:` / `design:` のプレフィックスを使う。
- 1 行目は要約、本文で「何をなぜ」を説明。
- **Co-Authored-By の Claude 署名は付けない**（ユーザーが個人プロジェクトとして管理しているため。過去コミット履歴も同様）。

## 6. ユーザー設定・好み

- 言語: **日本語**で応答。
- トーン: カジュアル寄り、絵文字 🙂 はユーザーが使ったら返す程度。
- ユーザー名: sa (sochi34@gmail.com) / GitHub: shisogaku
- 作業スタイル: 毎回 Claude がコード修正 → サンドボックスでコミット →
  ユーザーが Mac で `git pull --rebase && git push` して GitHub Pages にデプロイ。
- 「日本語っぽくない」と言われたら中程度のトーンでリライト（過度に硬くも軟らかくもしない）。

## 7. 最近の主要変更履歴（新しい順）

| Commit | 内容 |
|--------|------|
| `76b9e5a` | **MSG_TIPSをmsgType別テンプレートに再構築**（O型「手伝って」固定バグ修正） |
| `7fc0bf7` | キャバ嬢・ホストの視点を「本人として」→「相手に対して」に修正 |
| `a2c7fef` | `genderLock` を導入してキャバ嬢=女性・ホスト=男性のみに絞る |
| `3c082c7` | SCENE_DB・MSG_TIPS の日本語を自然化 |
| `60ca02e` | サイドバーに血液型クイック検索ボタン |
| `9067125` | ペア情報を Supabase にも保存して再ログイン後も保持 |
| `1fc6b43` | AI相談タブをフィーチャーフラグで非表示化 |
| `7b9c800` | ErrorBoundary / 空ステート / ローディング整備 |
| `11fe2d9` | ベンダー分割 + 重いビューを React.lazy で遅延ロード |
| `a2a79f6` | a11y: aria-label / role=dialog / Escape / スキップリンク |
| `284f43f` | SEO: description / OGP / Twitter / PWA manifest |
| `efa7488` | 初回起動 3ステップウェルカムモーダル |
| `357201e` | 検索精度改善（正規化 + スコアリング + 表記ゆれ） |
| `e084118` | CDN+ランタイムBabel → **Vite + React 18 + Tailwind** にビルド化 |

## 8. 既知の設計上の注意点

- `data.js` は 1 ファイルで巨大。編集時は該当ブロックを限定して Edit する。
- `classifyMsg` は `MSG_TIPS` より後に定義されているが、テンプレートは UI 実行時に呼ばれるため、クロージャ経由の遅延参照で問題なし（定義順を入れ替えると hoisting しない const でエラーになるので注意）。
- `knowledge.jsx`/`pair.jsx` は `tips.pattern(msg)` を直接呼ぶ。このアクセサは内部で `classifyMsg` を呼んで msgType を自動判定する。
- `social.jsx` の SimulateView は `classifyMsg` で msgType を取得してから `improveMsg(..., msgType, tone)` を呼ぶ。
- Supabase のプロフィールは `user_profiles` テーブル。キー制約は `id` ＝ auth.uid。
- GitHub Pages デプロイは `main`/`master` への push で自動走行。

## 9. 未解決・保留事項

（現時点なし。追加があればここに書く）

---

*このメモは随時追記・更新する。セッション冒頭で読むと文脈が素早く戻る。*
