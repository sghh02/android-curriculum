# Kotlin入門（制御構文）

プログラムの流れを制御する「条件分岐」と「ループ」を学びます。
これらをマスターすると、より複雑な処理が書けるようになります。

---

## 前提

- [Kotlin入門（変数と関数）](./01-kotlin-variables-functions.md) を完了している

## この章でできるようになること

- [ ] if式で条件分岐ができる
- [ ] when式で複数の条件を扱える
- [ ] forループで繰り返し処理ができる
- [ ] whileループを使い分けられる

**所要時間の目安：2時間**（公式Codelab含む）

---

## 🎯 STEP 1: 公式Codelabで実践（必須）

**まず以下のCodelabを完了してください。**

| Codelab | 内容 | 所要時間 |
|---------|------|----------|
| [Kotlinで条件を記述する](https://developer.android.com/codelabs/basic-android-kotlin-compose-conditionals-and-booleans?hl=ja) | if/when/Boolean | 60分 |

> 💡 **ヒント**: Codelabの内容を理解したら、下の概念説明で復習しましょう。

---

## 📚 STEP 2: 概念の深掘り

### 条件分岐（if式）

#### 基本的なif文

```kotlin
val age = 20

if (age >= 18) {
    println("成人です")
} else {
    println("未成年です")
}
```

#### Kotlinのifは「式」

**重要！** Kotlinのifは値を返すことができます（式として使える）。

```kotlin
val age = 20

// if式（値を返す）
val status = if (age >= 18) "成人" else "未成年"
println(status)  // "成人"

// 複数行の場合、最後の式が値になる
val grade = if (age < 13) {
    println("小学生以下")
    "小学生"  // この値が返る
} else if (age < 16) {
    "中学生"
} else if (age < 19) {
    "高校生"
} else {
    "成人"
}
```

### when式（超強力なswitch文）

Kotlinの`when`は、他の言語の`switch`より遥かに強力です。

#### 基本的な使い方

```kotlin
val dayOfWeek = 3

val dayName = when (dayOfWeek) {
    1 -> "月曜日"
    2 -> "火曜日"
    3 -> "水曜日"
    4 -> "木曜日"
    5 -> "金曜日"
    6, 7 -> "週末"    // 複数の値をまとめられる
    else -> "不明"
}
println(dayName)  // "水曜日"
```

#### 範囲でマッチング

```kotlin
val score = 85

val grade = when (score) {
    in 90..100 -> "A"
    in 80..89 -> "B"
    in 70..79 -> "C"
    in 60..69 -> "D"
    else -> "F"
}
println(grade)  // "B"
```

#### 条件式でマッチング（引数なしwhen）

```kotlin
val age = 25
val hasLicense = true

val canDrive = when {
    age < 18 -> "年齢不足"
    !hasLicense -> "免許なし"
    else -> "運転OK"
}
```

#### 型でマッチング

```kotlin
fun describe(obj: Any): String {
    return when (obj) {
        is Int -> "整数: $obj"
        is String -> "文字列: ${obj.length}文字"
        is Boolean -> "真偽値: $obj"
        else -> "不明な型"
    }
}

println(describe(42))       // "整数: 42"
println(describe("Hello"))  // "文字列: 5文字"
```

### forループ

#### 範囲をループ

```kotlin
// 1から5まで（5を含む）
for (i in 1..5) {
    println(i)  // 1, 2, 3, 4, 5
}

// 0から4まで（5を含まない）
for (i in 0 until 5) {
    println(i)  // 0, 1, 2, 3, 4
}

// 逆順
for (i in 5 downTo 1) {
    println(i)  // 5, 4, 3, 2, 1
}

// ステップ指定
for (i in 0..10 step 2) {
    println(i)  // 0, 2, 4, 6, 8, 10
}
```

#### リストをループ

```kotlin
val fruits = listOf("りんご", "バナナ", "オレンジ")

// 要素だけ
for (fruit in fruits) {
    println(fruit)
}

// インデックス付き
for ((index, fruit) in fruits.withIndex()) {
    println("$index: $fruit")
}
// 出力:
// 0: りんご
// 1: バナナ
// 2: オレンジ
```

### whileループ

```kotlin
// 基本的なwhile
var count = 0
while (count < 5) {
    println(count)
    count++
}

// do-while（最低1回は実行される）
var input: String
do {
    print("名前を入力: ")
    input = readLine() ?: ""
} while (input.isEmpty())
```

### 繰り返し関数

```kotlin
// repeat：指定回数繰り返し
repeat(3) {
    println("Hello!")
}

// forEach：リストの各要素に対して実行
val numbers = listOf(1, 2, 3, 4, 5)
numbers.forEach { number ->
    println(number * 2)
}

// forEachIndexed：インデックス付き
numbers.forEachIndexed { index, number ->
    println("$index: $number")
}
```

---

## ⚠️ STEP 3: つまずきポイント集

### Q1: if文で「式として使う」がわからない

**ポイント：** Kotlinのifは値を返すことができる

```kotlin
// ❌ Javaスタイル（動くけど冗長）
val status: String
if (age >= 18) {
    status = "成人"
} else {
    status = "未成年"
}

// ✅ Kotlinスタイル（if式）
val status = if (age >= 18) "成人" else "未成年"
```

### Q2: whenでelseを忘れてエラー

**症状：**
```
'when' expression must be exhaustive
```

**原因と解決：**
```kotlin
// ❌ NG: 式として使う場合、すべてのケースをカバーする必要がある
val result = when (x) {
    1 -> "一"
    2 -> "二"
    // elseがないとエラー
}

// ✅ OK: elseを追加
val result = when (x) {
    1 -> "一"
    2 -> "二"
    else -> "その他"
}
```

### Q3: forループの範囲が紛らわしい

```kotlin
// 1..5  → 1, 2, 3, 4, 5（5を含む）
// 1 until 5 → 1, 2, 3, 4（5を含まない）
// 5 downTo 1 → 5, 4, 3, 2, 1（逆順）

// よく使うパターン
val list = listOf("a", "b", "c")

// インデックスでループ
for (i in 0 until list.size) {  // 0, 1, 2
    println(list[i])
}

// より良い方法
for (item in list) {
    println(item)
}
```

### Q4: 無限ループになってしまう

**症状：** プログラムが終わらない

**原因と解決：**
```kotlin
// ❌ NG: countが増えない
var count = 0
while (count < 5) {
    println(count)
    // count++ を忘れている！
}

// ✅ OK: ループ変数を更新する
var count = 0
while (count < 5) {
    println(count)
    count++  // これが必要
}
```

---

## 🛠️ STEP 4: 確認問題

### 問題1: FizzBuzz

1から15までの数字を出力し、3の倍数なら「Fizz」、5の倍数なら「Buzz」、15の倍数なら「FizzBuzz」と出力してください。

```kotlin
fun main() {
    for (i in 1..15) {
        // ここにコードを書く
    }
}
```

<details>
<summary>解答</summary>

```kotlin
fun main() {
    for (i in 1..15) {
        val result = when {
            i % 15 == 0 -> "FizzBuzz"
            i % 3 == 0 -> "Fizz"
            i % 5 == 0 -> "Buzz"
            else -> i.toString()
        }
        println(result)
    }
}
```

</details>

### 問題2: 成績判定

点数（0〜100）を受け取り、成績を返す関数を作成してください。
- 90以上: "A"
- 80以上: "B"
- 70以上: "C"
- 60以上: "D"
- 60未満: "F"

```kotlin
fun getGrade(score: Int): String {
    // ここにコードを書く
}

fun main() {
    println(getGrade(95))  // A
    println(getGrade(82))  // B
    println(getGrade(55))  // F
}
```

<details>
<summary>解答</summary>

```kotlin
fun getGrade(score: Int): String {
    return when {
        score >= 90 -> "A"
        score >= 80 -> "B"
        score >= 70 -> "C"
        score >= 60 -> "D"
        else -> "F"
    }
}

// または範囲を使って
fun getGrade(score: Int) = when (score) {
    in 90..100 -> "A"
    in 80..89 -> "B"
    in 70..79 -> "C"
    in 60..69 -> "D"
    else -> "F"
}
```

</details>

### 問題3: 合計値を計算

1から10までの合計値を計算してください（forループを使用）。

```kotlin
fun main() {
    var sum = 0
    // ここにコードを書く
    println(sum)  // 55
}
```

<details>
<summary>解答</summary>

```kotlin
fun main() {
    var sum = 0
    for (i in 1..10) {
        sum += i
    }
    println(sum)  // 55
}

// 関数型スタイル
fun main() {
    val sum = (1..10).sum()
    println(sum)  // 55
}
```

</details>

---

## ✅ チェックリスト

この章を完了したか確認しましょう。

- [ ] 公式Codelabを完了した
- [ ] if式で値を返す書き方ができる
- [ ] when式を使い分けられる（値、範囲、条件）
- [ ] for文で範囲やリストをループできる
- [ ] whileとdo-whileの違いを説明できる
- [ ] 確認問題を3問解いた

---

## 次の章

次は [Android Studioのインストールと環境準備](./01-setup.md) に進み、開発環境を整えましょう。
