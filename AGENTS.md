# リポジトリ運用ガイドライン

## プロジェクト構成とモジュールの整理

- `index.json` はカリキュラムのナビゲーション（ユニット＋レッスンのメタデータ）を定義します。
- `chapters/*.md` には、利用側アプリでそのままレンダリングされるレッスン本文が入ります。
- `CLAUDE.md` にはエージェント向けの運用ルールが書かれています。

## ビルド／テスト／開発コマンド

- `node scripts/validate-index.mjs`: `index.json` の構文、参照しているレッスンパス、`title` ↔ H1 の整合性を検証します。
- `node -e "JSON.parse(require('fs').readFileSync('index.json','utf8'))"`: JSON の構文を素早くチェックします。
- `rg "keyword" chapters`: レッスン本文を横断検索します。

## コーディングスタイルと命名規則

- Markdown: 各レッスンは単一の H1（`# ...`）から開始し、対応する `index.json` の項目 `title` と一致させます。コードブロックは言語タグ付きのフェンス形式（例: `kotlin`, `bash`）を使います。
- ファイル名: `chapters/NN-topic.md`（例: `chapters/04-project-start.md`）。
- ID: `kebab-case` で、カリキュラム内で一意（例: `project-start`）。
- JSON: 厳密な JSON のみ（コメント不可、末尾カンマ不可）。インデントは 2 スペース、文字列はダブルクォートを推奨します。

## テスト指針

このリポジトリにはユニットテスト一式がありません。`node scripts/validate-index.mjs` を PR 前の必須チェックとして扱ってください。レッスンを追加／削除する場合は、`index.json` と `chapters/`（パス、タイトル、ID）を同期してください。

## コミット／プルリクエストの指針

- コミット: 履歴に合わせて、短い命令形のメッセージを使います（例: `Add ...`, `Expand Unit 3: ...`）。
- PR: サマリ、変更したレッスンパスの一覧、`index.json` のナビゲーション変更点を記載します。利用側アプリの UI／ナビゲーションに影響がある場合はスクリーンショットも追加してください。
