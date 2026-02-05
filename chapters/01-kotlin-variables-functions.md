# Kotlin入門（変数と関数）

Android開発では**Kotlin**というプログラミング言語を使います。
この章では、プログラミングの最も基本となる「変数」と「関数」を学びます。

---

## 前提

- プログラミング未経験でもOK
- パソコンの基本操作ができる

## この章でできるようになること

- [ ] Kotlinでプログラムを書いて実行できる
- [ ] 変数（val/var）を使ってデータを保存できる
- [ ] 基本的なデータ型（Int, String, Boolean）を理解する
- [ ] 関数を定義して呼び出せる

**所要時間の目安：2〜3時間**（公式Codelab含む）

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**
手を動かしながら学ぶことで、理解が深まります。

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [初めてのプログラム](https://developer.android.com/codelabs/basic-android-kotlin-compose-first-program?hl=ja) | Kotlinで最初のプログラムを書く | 45分 |
| [変数の作成と使用](https://developer.android.com/codelabs/basic-android-kotlin-compose-variables?hl=ja) | 変数でデータを保存する | 45分 |
| [関数の作成と使用](https://developer.android.com/codelabs/basic-android-kotlin-compose-functions?hl=ja) | 関数で処理をまとめる | 45分 |

> 💡 **ヒント**: Codelabで詰まったら、下の「つまずきポイント」を確認してください。

---

## 📚 STEP 2: 概念の深掘り

Codelabを完了したら、以下で理解を深めましょう。

### なぜKotlinなのか

Kotlinは2017年にGoogleがAndroid開発の**公式言語**として採用した言語です。

| 特徴 | 説明 |
|------|------|
| **簡潔** | Javaより少ないコードで同じことができる |
| **安全** | Null参照によるクラッシュを防ぐ仕組み |
| **相互運用** | Javaのライブラリをそのまま使える |
| **モダン** | ラムダ式、拡張関数など現代的な機能 |

### 変数と定数の復習

#### val（読み取り専用）

一度代入したら変更できない変数です。**基本的にvalを使いましょう**。

```kotlin
val name = "田中"      // 型推論でStringになる
val age: Int = 25      // 型を明示的に指定
val pi = 3.14          // Doubleになる

// name = "鈴木"       // エラー！valは再代入できない
```

#### var（変更可能）

後から値を変更できる変数です。

```kotlin
var count = 0
count = 1              // OK
count = count + 1      // OK（countは2になる）

var message = "Hello"
message = "World"      // OK
// message = 123       // エラー！型は変更できない
```

#### 使い分けの原則

```kotlin
// ✅ 基本は val を使う（変更されないことが保証される）
val userId = 123
val userName = "田中太郎"

// ✅ 本当に変更が必要な場合だけ var
var clickCount = 0
clickCount++  // ボタンクリックでカウントアップ
```

### 基本的なデータ型

| 型 | 説明 | 例 |
|---|------|-----|
| `Int` | 整数 | `42`, `-10`, `0` |
| `Long` | 長整数 | `42L`, `1000000000L` |
| `Double` | 小数 | `3.14`, `-0.5` |
| `Float` | 小数（精度低） | `3.14f` |
| `String` | 文字列 | `"Hello"`, `"こんにちは"` |
| `Boolean` | 真偽値 | `true`, `false` |
| `Char` | 1文字 | `'A'`, `'あ'` |

### 文字列テンプレート

Kotlinでは文字列の中に変数を埋め込めます。

```kotlin
val name = "Android"
val greeting = "Hello, $name!"              // "Hello, Android!"
val length = "文字数は ${name.length} です"  // "文字数は 7 です"

// 複数行文字列
val message = """
    こんにちは
    Androidの世界へようこそ！
""".trimIndent()
```

### 関数の復習

#### 基本的な関数

```kotlin
// 基本的な関数
fun greet(name: String): String {
    return "Hello, $name!"
}

// 呼び出し
val message = greet("Android")
println(message)  // "Hello, Android!"

// 単一式関数（1行で書ける場合）
fun greet(name: String) = "Hello, $name!"

// 戻り値がない関数
fun printMessage(message: String) {
    println(message)
}
```

#### デフォルト引数と名前付き引数

```kotlin
// デフォルト引数
fun greet(name: String, greeting: String = "Hello") = "$greeting, $name!"

println(greet("Android"))              // "Hello, Android!"
println(greet("Android", "Hi"))        // "Hi, Android!"

// 名前付き引数（順番を変えられる）
fun createUser(name: String, age: Int, email: String) {
    println("$name ($age) - $email")
}

createUser(
    email = "test@example.com",
    name = "田中",
    age = 25
)
```

---

## ⚠️ STEP 3: つまずきポイント集

### Q1: Kotlin Playgroundが動かない

**症状：** Codelabで使うKotlin Playgroundでコードが実行できない

**解決方法：**
1. ブラウザを更新（F5 または Ctrl+R）
2. 別のブラウザを試す（Chrome推奨）
3. [Kotlin Playground](https://play.kotlinlang.org/) に直接アクセス

### Q2: 「val cannot be reassigned」エラー

**症状：**
```
Val cannot be reassigned
```

**原因と解決：**
```kotlin
// ❌ NG: valは再代入できない
val name = "田中"
name = "鈴木"  // エラー！

// ✅ OK: 変更が必要ならvarを使う
var name = "田中"
name = "鈴木"  // OK
```

### Q3: 型が合わないエラー

**症状：**
```
Type mismatch: inferred type is Int but String was expected
```

**原因と解決：**
```kotlin
// ❌ NG: Stringの変数にIntを代入
var message = "Hello"
message = 123  // エラー！

// ✅ OK: 同じ型を代入
var message = "Hello"
message = "World"  // OK

// ✅ OK: 数値を文字列に変換
var message = "Hello"
message = 123.toString()  // OK
```

### Q4: 関数の戻り値の型がわからない

**症状：** 関数を書いたが、戻り値の型が合わない

**解決方法：**
```kotlin
// 明示的に戻り値の型を書くとエラーがわかりやすい
fun add(a: Int, b: Int): Int {
    return a + b  // IntからIntを返す
}

// 何も返さない場合はUnitまたは省略
fun printHello(): Unit {
    println("Hello")
}

// ↓ と同じ
fun printHello() {
    println("Hello")
}
```

---

## 🛠️ STEP 4: 確認問題

### 問題1: 変数の宣言

以下のコードの間違いを修正してください。

```kotlin
fun main() {
    val age = 25
    age = 26  // 誕生日を迎えた
    println(age)
}
```

<details>
<summary>解答</summary>

```kotlin
fun main() {
    var age = 25  // val → var に変更
    age = 26
    println(age)
}
```

`val`は再代入できないので、変更が必要な場合は`var`を使います。

</details>

### 問題2: 関数の作成

2つの整数を受け取り、大きい方を返す関数`max`を作成してください。

```kotlin
fun max(a: Int, b: Int): Int {
    // ここにコードを書く
}

fun main() {
    println(max(5, 3))  // 5
    println(max(2, 8))  // 8
}
```

<details>
<summary>解答</summary>

```kotlin
fun max(a: Int, b: Int): Int {
    return if (a > b) a else b
}

// または単一式関数で
fun max(a: Int, b: Int) = if (a > b) a else b
```

</details>

### 問題3: 文字列テンプレート

以下の出力を文字列テンプレートを使って作成してください。

出力: `田中さんは25歳です`

```kotlin
fun main() {
    val name = "田中"
    val age = 25
    // ここにコードを書く
}
```

<details>
<summary>解答</summary>

```kotlin
fun main() {
    val name = "田中"
    val age = 25
    println("${name}さんは${age}歳です")
    // または
    println("$nameさんは${age}歳です")
}
```

</details>

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabを3つとも完了した
- [ ] val と var の違いを説明できる
- [ ] 基本的なデータ型（Int, String, Boolean）を使える
- [ ] 関数を定義して呼び出せる
- [ ] 文字列テンプレート（$変数）を使える
- [ ] 確認問題を3問解いた

---

## 次の章

次は [Kotlin入門（制御構文）](./01-kotlin-control-flow.md) に進み、if/when/forなどの制御構文を学びましょう。
