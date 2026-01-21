# Jetpack Composeとは

Jetpack Composeは、Androidの **宣言的UIフレームワーク** です。XMLではなくKotlinコードでUIを組み立てます。

## 目標
- Composeの思想（宣言的UI）を理解する
- `@Composable` 関数の基本を理解する
- プレビュー機能を使えるようになる

## Composeの基本
```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name")
}
```

### ポイント
- **状態を受け取って描画するだけ** が基本
- UIは「結果」であり、ロジックと分離しやすい

## Previewの使い方
```kotlin
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting("Android")
}
```
- 実機を起動せず、IDE上でUI確認できる

## ミニ課題
- `Greeting` の引数を受け取り、名前を動的に表示
- `@Preview` を複数用意して色違いのUIを見てみる

---

次章では、レイアウトを構成するための基本コンポーネントを学びます。
