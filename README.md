# android-curriculum

Android 学習用プログラム（Markdown）です。`index.json` が目次・メタ情報、`chapters/` が本文になります。

Google 公式コース [Compose を用いた Android アプリ開発の基礎](https://developer.android.com/courses/android-basics-compose/course?hl=ja) を教材にし、**パスウェイ 1 つ = 1 章** で構成しています。各章に「やる Codelab」「やらなくてOK な項目」「提出物」を整理しています。

## Validate

`index.json` と `chapters/` の整合性チェック（パス存在・タイトル一致・`hasAssignment`・提出/完了セクション・提出ブランチ名）:

```bash
node scripts/validate-index.mjs
```

## Structure

- `index.json`: プログラム構造（Unit/lesson）
- `chapters/*.md`: レッスン本文（公式 Codelab の本文を日本語のまま埋め込み。CC BY 4.0）
- `chapters/images/<codelab-slug>/`: Codelab の画像（公式サイトからダウンロード）
- `index.html` / `app.js` / `styles.css`: ローカル確認用ビューア
