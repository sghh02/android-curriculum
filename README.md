# android-curriculum

Android学習用カリキュラム（Markdown）です。`index.json` が目次・メタ情報、`chapters/` が本文になります。

## Authoring

### index.json (lessons metadata)

`items[]` は以下のフィールドを持ちます（すべて必須）:

- `id`: レッスンID（kebab-case）
- `title`: レッスンタイトル（本文MarkdownのH1と一致）
- `path`: `chapters/*.md`
- `type`: `guide` / `lesson` / `hands-on` / `project` / `reference`
- `difficulty`: `beginner` / `intermediate` / `advanced`
- `estimatedMinutes`: 目安時間（分）
- `practiceMinutes`: 演習の目安時間（分）
- `prerequisites`: 前提レッスンID（string[]）
- `tags`: タグ（string[]）

各レッスンMarkdownは、少なくとも以下の見出し（H2）を含むことを推奨します：

- `## 前提`
- `## この章でできるようになること`
- `## AIに聞いてみよう`
- `## 演習`
- `## ふりかえり`
- `## 次の章`

## Validate

`index.json` と `chapters/` の整合性チェック（パス存在・タイトル一致・`hasAssignment`・提出/完了セクション・提出ブランチ名・章内リンク）:

```bash
node scripts/validate-index.mjs
```

## Structure

- `index.json`: カリキュラム構造（Unit/lesson）
- `chapters/*.md`: レッスン本文
