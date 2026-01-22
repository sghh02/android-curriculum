# Kotlin基礎（Android向け）

Android開発で頻出のKotlin文法を短時間で押さえます。

## 目標
- Kotlinの基本構文を理解する
- null安全やデータクラスが説明できる

## 概念の説明
この章は、**メモアプリ開発で頻出のKotlin文法だけを短時間で押さえる**ための要点まとめです。

## コード例
### 変数
```kotlin
val name = "Android" // 不変
var count = 0        // 可変
```

### 関数
```kotlin
fun add(a: Int, b: Int): Int = a + b
```

### データクラス
```kotlin
data class User(val id: Int, val name: String)
```

### null安全
```kotlin
val nickname: String? = null
val length = nickname?.length ?: 0
```

## AIに聞いてみよう
- 「`val`と`var`はどちらを優先すべき？」
- 「`data class`が自動で生成するメソッドは？」
- 「`?.`と`?:`の意味をメモアプリの例で説明して」

## ハンズオン
- `data class Memo(val title: String, val content: String)` を作成
- `List<Memo>` を作り、タイトルの文字数合計を数える関数を書く

## よくあるエラー
- **`Unresolved reference`**：import忘れやスペルミスがないか確認。
- **null関連エラー**：型に`?`を付け忘れていないかチェック。

## チェックリスト
- [ ] `val`と`var`の違いを説明できる
- [ ] `data class`を定義できる
- [ ] null安全演算子を使える

---

次章では、オブジェクト指向プログラミングを学び、設計の土台を作ります。
