# 初めてのプロジェクト作成

この章では、Android Studioで新規プロジェクトを作成し、アプリを起動するところまでを行います。

## 目標
- Android Studioで新規プロジェクトを作成できる
- エミュレータ or 実機でアプリが起動する
- Jetpack Composeの基本テンプレートを理解する

## 手順
1. **New Project** → **Empty Activity** を選択
2. 設定
   - Name: `HelloAndroid`
   - Package name: `com.example.helloandroid`
   - Language: **Kotlin**
   - Minimum SDK: **API 24 (Android 7.0)** 以上
3. **Finish** で作成
4. 右上の ▶ Run でビルド＆起動

## 生成される構成（重要ポイント）
- `MainActivity.kt` : 画面のエントリポイント
- `setContent { ... }` : Compose UIを描画するブロック
- `@Composable` : ComposeのUI部品を表すアノテーション

## 確認
- アプリが起動し、"Hello Android" の画面が表示される

## ミニ課題
- 画面中央のテキストを **自分の名前** に変更
- 文字色を `Color.Magenta` に変更

---

次章からは **Jetpack Compose** の基礎を学び、自由にUIを作れるようにしていきます。
