# android-curriculum

Android学習用カリキュラム（Markdown）です。`index.json` が目次・メタ情報、`chapters/` が本文になります。

## Validate

`index.json` と `chapters/` の整合性チェック（パス存在・タイトル一致）:

```bash
node scripts/validate-index.mjs
```

## Structure

- `index.json`: カリキュラム構造（Unit/lesson）
- `chapters/*.md`: レッスン本文
