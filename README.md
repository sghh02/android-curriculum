# android-curriculum

Android 学習用プログラム（Markdown）です。`index.json` が目次・メタ情報、`chapters/` が本文になります。

各章に「ゴール」「やるレッスン」「やらなくてOK な項目」「提出物」「AI への質問例」を整理し、レッスン本文（日本語・画像付き）を埋め込んでいます。

## Validate

`index.json` と `chapters/` の整合性チェック（パス存在・タイトル一致・`hasAssignment`・提出/完了セクション・提出ブランチ名）:

```bash
node scripts/validate-index.mjs
```

## Structure

- `index.json`: プログラム構造（Unit/lesson）
- `chapters/*.md`: レッスン本文
- `chapters/images/<lesson-slug>/`: レッスンの画像
- `index.html` / `app.js` / `styles.css`: ローカル確認用ビューア

## License note

`chapters/` に埋め込んだレッスン本文と画像は、Google Developers の「Android Basics with Compose」コース（CC BY 4.0、コードサンプルは Apache 2.0）を基にしています。
