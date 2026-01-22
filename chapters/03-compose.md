# Jetpack Composeとは

Jetpack Composeは、Androidの **宣言的UIフレームワーク** です。XMLではなくKotlinコードでUIを組み立てます。

## 目標
- Composeの思想（宣言的UI）を理解する
- `@Composable` 関数の基本を理解する
- プレビュー機能を使えるようになる

## 概念の説明
- Composeは「状態からUIを描く」宣言的な仕組みです。
- UI部品は`@Composable`関数として表現します。
- Previewを使うと実機を起動せずにUIを確認できます。

## コード例
```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name")
}
```

### ポイント
- **状態を受け取って描画するだけ** が基本
- UIは「結果」であり、ロジックと分離しやすい

## Previewの使い方（コード例）
```kotlin
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting("Android")
}
```
- 実機を起動せず、IDE上でUI確認できる

## AIに聞いてみよう
- 「宣言的UIと命令的UIの違いは？」
- 「`@Composable`を付けた関数は何が特別なの？」
- 「Previewが表示されないときに確認すべきことは？」

## ハンズオン
- `Greeting` の引数を受け取り、名前を動的に表示
- `@Preview` を複数用意して色違いのUIを見てみる

## よくあるエラー
- **Previewが真っ白**：Gradle Syncが未完了の可能性。右上のSyncを再実行。
- **`@Composable`エラー**：`@Composable`の付与忘れやimport漏れを確認。
- **`Text`が未解決**：`androidx.compose.material3.Text`のimportを確認。

## チェックリスト
- [ ] `@Composable`関数を自分で書けた
- [ ] PreviewでUIを確認できた
- [ ] 引数を使ってテキストを切り替えられた

---

次章では、Composeの基本をより詳しく学び、UIの組み立てに慣れていきます。
