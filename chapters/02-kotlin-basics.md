# Kotlinプログラミングの基礎

Android開発では**Kotlin**というプログラミング言語を使います。
この章では、Android開発に必要なKotlinの基礎を学びます。

---

## 前提

- [Android Studioのインストールと環境準備](chapters/01-setup.md) を完了し、Android Studioでプロジェクトを開ける
- つまずいたら [用語集（Android/Compose）](chapters/00-glossary.md) で用語を確認できる

## この章でできるようになること

- [ ] 変数と型を理解する
- [ ] 条件分岐とループを書ける
- [ ] 関数を定義して呼び出せる
- [ ] クラスとオブジェクトを理解する
- [ ] Null安全の概念を理解する

**所要時間の目安：2〜3時間**

---

## なぜKotlinなのか

Kotlinは2017年にGoogleがAndroid開発の**公式言語**として採用した言語です。

### Kotlinの特徴

| 特徴 | 説明 |
|------|------|
| **簡潔** | Javaより少ないコードで同じことができる |
| **安全** | Null参照によるクラッシュを防ぐ仕組み |
| **相互運用** | Javaのライブラリをそのまま使える |
| **モダン** | ラムダ式、拡張関数など現代的な機能 |

### JavaとKotlinの比較

```java
// Java - データクラスの定義
public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }
    // equals, hashCode, toString も必要...
}
```

```kotlin
// Kotlin - たった1行で同じことができる
data class User(val name: String, val age: Int)
```

---

## 変数と定数

### val（読み取り専用）

一度代入したら変更できない変数です。**基本的にvalを使いましょう**。

```kotlin
val name = "田中"      // 型推論でStringになる
val age: Int = 25      // 型を明示的に指定
val pi = 3.14          // Doubleになる

// name = "鈴木"       // エラー！valは再代入できない
```

### var（変更可能）

後から値を変更できる変数です。

```kotlin
var count = 0
count = 1              // OK
count = count + 1      // OK（countは2になる）

var message = "Hello"
message = "World"      // OK
// message = 123       // エラー！型は変更できない
```

### 使い分けの原則

```kotlin
// 基本は val を使う
val userId = 123
val userName = "田中太郎"

// 本当に変更が必要な場合だけ var
var clickCount = 0
clickCount++  // ボタンクリックでカウントアップ
```

---

## 基本的なデータ型

### 数値型

```kotlin
val int: Int = 42              // 整数（32bit）
val long: Long = 42L           // 長整数（64bit）
val double: Double = 3.14      // 小数（64bit）
val float: Float = 3.14f       // 小数（32bit）

// 演算
val sum = 10 + 5               // 15
val diff = 10 - 5              // 5
val product = 10 * 5           // 50
val quotient = 10 / 3          // 3（整数の割り算）
val remainder = 10 % 3         // 1（余り）
```

### 文字列型

```kotlin
val name = "Android"
val greeting = "Hello, $name!"              // "Hello, Android!"
val length = "文字数は ${name.length} です"  // "文字数は 7 です"

// 複数行文字列
val json = """
    {
        "name": "Android",
        "version": 14
    }
""".trimIndent()
```

### 真偽型

```kotlin
val isAdult: Boolean = true
val isEmpty = false

val age = 20
val canDrink = age >= 20       // true
val isTeenager = age in 13..19 // false
```

---

## 条件分岐

### if式

Kotlinのifは**式**なので、値を返すことができます。

```kotlin
val age = 20

// 通常のif文
if (age >= 18) {
    println("成人です")
} else {
    println("未成年です")
}

// if式（値を返す）
val status = if (age >= 18) "成人" else "未成年"
println(status)  // "成人"

// 複数条件
val grade = if (age < 13) {
    "小学生"
} else if (age < 16) {
    "中学生"
} else if (age < 19) {
    "高校生"
} else {
    "成人"
}
```

### when式

複数の条件分岐には`when`を使います。他の言語の`switch`より強力です。

```kotlin
val score = 85

val grade = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    score >= 60 -> "D"
    else -> "F"
}
println(grade)  // "B"

// 値でマッチング
val dayOfWeek = 3
val dayName = when (dayOfWeek) {
    1 -> "月曜日"
    2 -> "火曜日"
    3 -> "水曜日"
    4 -> "木曜日"
    5 -> "金曜日"
    6, 7 -> "週末"    // 複数の値
    else -> "不明"
}

// 範囲でマッチング
val ageGroup = when (age) {
    in 0..12 -> "子供"
    in 13..19 -> "ティーンエイジャー"
    in 20..64 -> "大人"
    else -> "シニア"
}
```

---

## ループ

### for文

```kotlin
// 範囲をループ
for (i in 1..5) {
    println(i)  // 1, 2, 3, 4, 5
}

// 逆順
for (i in 5 downTo 1) {
    println(i)  // 5, 4, 3, 2, 1
}

// ステップ指定
for (i in 0..10 step 2) {
    println(i)  // 0, 2, 4, 6, 8, 10
}

// until（終端を含まない）
for (i in 0 until 5) {
    println(i)  // 0, 1, 2, 3, 4
}

// リストをループ
val fruits = listOf("りんご", "バナナ", "オレンジ")
for (fruit in fruits) {
    println(fruit)
}

// インデックス付きでループ
for ((index, fruit) in fruits.withIndex()) {
    println("$index: $fruit")
}
```

### while文

```kotlin
var count = 0
while (count < 5) {
    println(count)
    count++
}

// do-while（最低1回は実行）
do {
    println("実行中...")
} while (false)  // 条件がfalseでも1回は実行される
```

### 繰り返し関数

```kotlin
// repeat：指定回数繰り返し
repeat(3) {
    println("Hello!")
}

// forEach：コレクションの各要素に対して実行
val numbers = listOf(1, 2, 3, 4, 5)
numbers.forEach { number ->
    println(number * 2)
}
```

---

## 関数

### 関数の定義

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

// 戻り値がない関数（Unit）
fun printMessage(message: String) {
    println(message)
}
// fun printMessage(message: String): Unit と同じ
```

### デフォルト引数

```kotlin
fun greet(name: String, greeting: String = "Hello") = "$greeting, $name!"

println(greet("Android"))              // "Hello, Android!"
println(greet("Android", "Hi"))        // "Hi, Android!"
```

### 名前付き引数

```kotlin
fun createUser(name: String, age: Int, email: String) {
    println("$name ($age) - $email")
}

// 名前を指定して呼び出し（順番を変えられる）
createUser(
    email = "test@example.com",
    name = "田中",
    age = 25
)
```

### 拡張関数

既存のクラスに新しい関数を追加できます。

```kotlin
// Stringに新しい関数を追加
fun String.addExclamation() = "$this!"

val message = "Hello".addExclamation()
println(message)  // "Hello!"

// Intに偶数判定関数を追加
fun Int.isEven() = this % 2 == 0

println(4.isEven())  // true
println(5.isEven())  // false
```

---

## コレクション

### List（リスト）

順序付きのコレクションです。

```kotlin
// 読み取り専用リスト
val fruits = listOf("りんご", "バナナ", "オレンジ")
println(fruits[0])         // "りんご"
println(fruits.size)       // 3
println(fruits.first())    // "りんご"
println(fruits.last())     // "オレンジ"

// 変更可能なリスト
val mutableFruits = mutableListOf("りんご", "バナナ")
mutableFruits.add("オレンジ")
mutableFruits.remove("バナナ")
println(mutableFruits)     // [りんご, オレンジ]
```

### Map（辞書）

キーと値のペアを格納します。

```kotlin
// 読み取り専用Map
val capitals = mapOf(
    "日本" to "東京",
    "アメリカ" to "ワシントンD.C.",
    "フランス" to "パリ"
)
println(capitals["日本"])  // "東京"

// 変更可能なMap
val mutableCapitals = mutableMapOf("日本" to "東京")
mutableCapitals["韓国"] = "ソウル"
```

### Set（集合）

重複のないコレクションです。

```kotlin
val numbers = setOf(1, 2, 3, 2, 1)
println(numbers)  // [1, 2, 3]（重複は除去される）
```

### コレクション操作

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// filter：条件に合う要素を抽出
val evenNumbers = numbers.filter { it % 2 == 0 }
println(evenNumbers)  // [2, 4]

// map：各要素を変換
val doubled = numbers.map { it * 2 }
println(doubled)  // [2, 4, 6, 8, 10]

// find：条件に合う最初の要素
val firstEven = numbers.find { it % 2 == 0 }
println(firstEven)  // 2

// any/all：条件チェック
println(numbers.any { it > 3 })  // true（3より大きい要素がある）
println(numbers.all { it > 0 })  // true（すべて0より大きい）

// sum/average
println(numbers.sum())      // 15
println(numbers.average())  // 3.0

// チェーン（連続して操作）
val result = numbers
    .filter { it % 2 == 0 }
    .map { it * 10 }
    .sum()
println(result)  // 60（2*10 + 4*10）
```

---

## クラスとオブジェクト

### クラスの定義

```kotlin
class Person(val name: String, var age: Int) {
    fun introduce() {
        println("私は${name}、${age}歳です")
    }

    fun haveBirthday() {
        age++
        println("${name}は${age}歳になりました")
    }
}

// インスタンス作成（newは不要）
val person = Person("田中", 25)
person.introduce()       // "私は田中、25歳です"
person.haveBirthday()    // "田中は26歳になりました"
println(person.age)      // 26
```

### データクラス

データを保持するためのクラスです。`equals`、`hashCode`、`toString`、`copy`が自動生成されます。

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String
)

val user1 = User(1, "田中", "tanaka@example.com")
val user2 = User(1, "田中", "tanaka@example.com")

println(user1)              // User(id=1, name=田中, email=tanaka@example.com)
println(user1 == user2)     // true（内容が同じ）

// copy：一部を変更したコピーを作成
val user3 = user1.copy(name = "鈴木")
println(user3)              // User(id=1, name=鈴木, email=tanaka@example.com)
```

### 継承

```kotlin
// openキーワードで継承可能にする
open class Animal(val name: String) {
    open fun makeSound() {
        println("...")
    }
}

class Dog(name: String) : Animal(name) {
    override fun makeSound() {
        println("ワンワン！")
    }
}

class Cat(name: String) : Animal(name) {
    override fun makeSound() {
        println("ニャー！")
    }
}

val dog = Dog("ポチ")
dog.makeSound()  // "ワンワン！"
```

### インターフェース

```kotlin
interface Clickable {
    fun onClick()
    fun onLongClick() {
        // デフォルト実装
        println("長押しされました")
    }
}

class Button : Clickable {
    override fun onClick() {
        println("ボタンがクリックされました")
    }
}
```

---

## Null安全

Kotlinの最大の特徴の一つが**Null安全**です。
NullPointerException（NPE）を防ぐ仕組みが言語に組み込まれています。

### Nullable型とNon-null型

```kotlin
// Non-null型：nullを許可しない
var name: String = "田中"
// name = null  // コンパイルエラー！

// Nullable型：nullを許可する（?をつける）
var nickname: String? = "たなっち"
nickname = null  // OK
```

### 安全呼び出し（?.）

Nullable型のプロパティやメソッドにアクセスする安全な方法です。

```kotlin
val name: String? = null

// 安全呼び出し：nullならnullを返す
val length = name?.length
println(length)  // null

// チェーン
val user: User? = getUser()
val city = user?.address?.city  // どこかでnullならnull
```

### エルビス演算子（?:）

nullの場合のデフォルト値を指定します。

```kotlin
val name: String? = null

// nullの場合は "名無し" を使う
val displayName = name ?: "名無し"
println(displayName)  // "名無し"

// 関数の戻り値にも使える
fun getUsername(): String {
    val user = findUser()
    return user?.name ?: "Unknown"
}
```

### 非nullアサーション（!!）

nullではないことを保証します。**nullだと例外が発生するので注意**。

```kotlin
val name: String? = "田中"

// !!でNon-null型として扱う
val length = name!!.length  // OK

val nullName: String? = null
// val length2 = nullName!!.length  // 実行時にNullPointerException！
```

### let関数

nullでない場合のみ処理を実行します。

```kotlin
val name: String? = "田中"

name?.let { nonNullName ->
    println("名前は${nonNullName}です")
    println("文字数は${nonNullName.length}です")
}
// nullの場合は何も実行されない
```

### 安全なキャスト（as?）

```kotlin
val obj: Any = "Hello"

// 安全なキャスト：失敗するとnull
val str: String? = obj as? String
println(str)  // "Hello"

val num: Int? = obj as? Int
println(num)  // null（キャスト失敗）
```

---

## ラムダ式

### 基本構文

```kotlin
// ラムダ式：{ 引数 -> 本体 }
val sum = { a: Int, b: Int -> a + b }
println(sum(3, 5))  // 8

// 引数が1つの場合は it で参照
val double = { x: Int -> x * 2 }
val numbers = listOf(1, 2, 3)
println(numbers.map { it * 2 })  // [2, 4, 6]
```

### 高階関数

関数を引数や戻り値として扱う関数です。

```kotlin
// 関数を引数に取る
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val result1 = calculate(10, 5) { a, b -> a + b }  // 15
val result2 = calculate(10, 5) { a, b -> a * b }  // 50

// 末尾ラムダ
val numbers = listOf(1, 2, 3, 4, 5)

// 通常の書き方
numbers.filter({ it % 2 == 0 })

// 末尾ラムダ（最後の引数がラムダなら()の外に出せる）
numbers.filter { it % 2 == 0 }
```

---

## スコープ関数

オブジェクトのスコープ内で処理を行う便利な関数群です。

### let

nullチェックや、結果を別の変数に代入する場合に使います。

```kotlin
val name: String? = "田中"

// nullでない場合のみ実行
name?.let {
    println("名前は${it}です")
}

// 変数のスコープを限定
val length = name?.let {
    println("処理中: $it")
    it.length  // 最後の式が戻り値
}
```

### apply

オブジェクトの設定を行う場合に使います。**オブジェクト自身を返します**。

```kotlin
val person = Person("田中", 25).apply {
    // thisはPerson
    println("作成: $name")
}

// ビルダーパターン的な使い方
val textView = TextView(context).apply {
    text = "Hello"
    textSize = 16f
    setTextColor(Color.BLACK)
}
```

### also

副作用（ログ出力など）を行う場合に使います。**オブジェクト自身を返します**。

```kotlin
val numbers = mutableListOf(1, 2, 3)
    .also { println("初期値: $it") }
    .also { it.add(4) }
    .also { println("追加後: $it") }
```

### run

オブジェクトに対して処理を行い、結果を返す場合に使います。

```kotlin
val result = "Hello".run {
    println("処理中: $this")
    length  // 戻り値
}
println(result)  // 5
```

### with

オブジェクトに対して複数の処理を行う場合に使います。

```kotlin
val person = Person("田中", 25)
with(person) {
    println("名前: $name")
    println("年齢: $age")
    haveBirthday()
}
```

### 使い分けの目安

| 関数 | 参照 | 戻り値 | 主な用途 |
|------|------|--------|----------|
| let | it | ラムダの結果 | nullチェック、変換 |
| apply | this | オブジェクト自身 | オブジェクトの初期化 |
| also | it | オブジェクト自身 | 副作用（ログなど） |
| run | this | ラムダの結果 | 処理の実行と結果取得 |
| with | this | ラムダの結果 | 複数の処理をまとめる |

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：演習を完成させたい / エラーを直したい / もっと良い書き方にしたい）

【今の状態】
- 該当コード：
- エラー/ログ：
- 期待する挙動：

【制約】
- 変えたくないこと：

【欲しい回答】
- 結論（何を変えるか）
- 手順（最短）
- 理由
- 確認ポイント（動作確認/テスト）
```

Kotlinでわからないことがあったら、AIに質問しましょう。

### 質問例

```text
【質問】
KotlinでListの中から条件に合う要素だけを取り出したい。
filter と find の違いを教えて。
```

```text
【質問】
Kotlinの let, apply, also, run, with の違いがわからない。
それぞれどういう場面で使えばいいの？
具体例を交えて教えて。
```

```text
【質問】
val name: String? = null のとき、
name?.length ?: 0
これは何をしているの？
```

```text
【コードレビューお願い】
以下のKotlinコードをもっと簡潔に書けますか？

val result = mutableListOf<Int>()
for (num in numbers) {
    if (num % 2 == 0) {
        result.add(num * 2)
    }
}
```

---

## 演習

### FizzBuzzを書いてみよう

学んだ内容を使って、FizzBuzzを実装しましょう。

### ルール
- 1から100まで出力
- 3の倍数なら「Fizz」
- 5の倍数なら「Buzz」
- 15の倍数なら「FizzBuzz」
- それ以外は数字をそのまま

### 挑戦してみよう

```kotlin
fun main() {
    // ここにコードを書いてみよう
}
```

### 解答例

```kotlin
fun main() {
    for (i in 1..100) {
        val result = when {
            i % 15 == 0 -> "FizzBuzz"
            i % 3 == 0 -> "Fizz"
            i % 5 == 0 -> "Buzz"
            else -> i.toString()
        }
        println(result)
    }
}

// より関数型なスタイル
fun main() {
    (1..100)
        .map { i ->
            when {
                i % 15 == 0 -> "FizzBuzz"
                i % 3 == 0 -> "Fizz"
                i % 5 == 0 -> "Buzz"
                else -> i.toString()
            }
        }
        .forEach { println(it) }
}
```

---

## チェックリスト

この章を完了したか確認しましょう。

- [ ] val と var の違いを説明できる
- [ ] if式とwhen式を使い分けられる
- [ ] for文とforEachの使い方がわかる
- [ ] 関数を定義して呼び出せる
- [ ] data classを使ってデータを表現できる
- [ ] Nullable型（String?）とNon-null型（String）の違いがわかる
- [ ] 安全呼び出し（?.）とエルビス演算子（?:）を使える
- [ ] filter、mapなどのコレクション操作ができる

---

## まとめ

この章では以下を学びました：

1. **変数と型** - val/var、基本型、文字列
2. **制御構文** - if式、when式、for、while
3. **関数** - 定義、デフォルト引数、名前付き引数、拡張関数
4. **コレクション** - List、Map、Set、filter/map
5. **クラス** - クラス定義、データクラス、継承
6. **Null安全** - Nullable型、安全呼び出し、エルビス演算子
7. **ラムダ式** - 基本構文、高階関数
8. **スコープ関数** - let、apply、also、run、with

Kotlinはまだまだ奥が深いですが、ここまでの知識でAndroidアプリ開発を始められます。
わからないことはその都度AIに聞きながら進めましょう。

---

## ふりかえり

- 今日いちばん「使えそう」と思った構文/機能はどれ？（when/collection操作など）
- Nullable（`String?`）の扱いで、どこがまだ不安？
- 次章のOOPで「理解したいこと」は何？（責務/設計/テスト）

---

## 次の章

次は [オブジェクト指向プログラミング](chapters/02-oop-fundamentals.md) に進み、クラス設計の考え方を押さえましょう。
