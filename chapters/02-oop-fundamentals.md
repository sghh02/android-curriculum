# オブジェクト指向プログラミング

プログラムを「オブジェクト」という単位で組み立てる考え方を学びます。
これはAndroid開発だけでなく、すべての現代的なプログラミングに必須の概念です。

---

## 前提

- [Kotlinプログラミングの基礎](chapters/02-kotlin-basics.md) を完了し、Kotlinの基本（関数/クラス/Nullable）がわかる
- つまずいたら [用語集（Android/Compose）](chapters/00-glossary.md) で用語を確認できる

## この章でできるようになること

- [ ] オブジェクト指向とは何かを理解する
- [ ] なぜクラスが必要なのかを説明できる
- [ ] カプセル化・継承・ポリモーフィズムを理解する
- [ ] インターフェースと抽象クラスの使い分けがわかる
- [ ] 実践的なクラス設計ができる

**所要時間の目安：3〜4時間**

---

## この章で作るもの

メモアプリで使う**Memoクラス**を設計します。

```kotlin
data class Memo(
    val id: String,
    val title: String,
    val content: String,
    val createdAt: Long,
    val updatedAt: Long,
    val category: Category
)
```

このクラス設計を通じて、オブジェクト指向の考え方を身につけます。

---

## なぜオブジェクト指向を学ぶのか

### プログラミングの歴史

**1960年代：手続き型プログラミング**
```text
データと処理が別々
↓
データが増えると管理が困難に
```

**1980年代：オブジェクト指向の登場**
```text
データと処理をまとめる
↓
大規模なプログラムを管理しやすく
```

### 実際の開発での重要性

現代のアプリ開発では：
- コードの**再利用性**が求められる
- チームでの**協業**が必要
- **保守性**の高いコードが重要

オブジェクト指向は、これらの問題を解決する基本的な考え方です。

---

## オブジェクト指向とは何か

### 現実世界のモデル化

オブジェクト指向は、**現実世界をプログラムで表現する**考え方です。

**例：メモ帳アプリを作る場合**

現実世界：
```text
メモ帳
├─ メモ1（タイトル、本文、作成日時）
├─ メモ2（タイトル、本文、作成日時）
└─ メモ3（タイトル、本文、作成日時）

メモには以下の操作ができる：
- 作成する
- 編集する
- 削除する
```

プログラムでの表現：
```kotlin
// 「メモ」という概念をクラスで表現
class Memo(
    val title: String,
    val content: String,
    val createdAt: Long
) {
    // メモに対してできる操作
    fun edit(newContent: String) { ... }
    fun delete() { ... }
}

// 実際のメモはオブジェクト（インスタンス）
val memo1 = Memo("買い物リスト", "牛乳、卵", 1234567890)
val memo2 = Memo("TODO", "課題を提出", 1234567891)
```

### オブジェクトとクラスの違い

| 用語 | 説明 | 例 |
|------|------|-----|
| **クラス** | 設計図、型、テンプレート | 「メモ」という概念 |
| **オブジェクト** | 実体、インスタンス | 「買い物リスト」という具体的なメモ |

**比喩：**
- クラス = たい焼きの型
- オブジェクト = 実際に焼いたたい焼き

```kotlin
// Memoクラス（型）
class Memo(val title: String, val content: String)

// 実際のオブジェクト（インスタンス）
val memo1 = Memo("買い物", "牛乳")  // 1つ目のたい焼き
val memo2 = Memo("TODO", "課題")   // 2つ目のたい焼き
```

---

## なぜクラスが必要なのか

### 問題：クラスなしでメモを管理する

```kotlin
// クラスなし：個別の変数で管理
val memo1Title = "買い物リスト"
val memo1Content = "牛乳、卵、パン"
val memo1CreatedAt = 1234567890L

val memo2Title = "TODO"
val memo2Content = "課題を提出する"
val memo2CreatedAt = 1234567891L

val memo3Title = "アイデア"
val memo3Content = "新しいアプリのアイデア"
val memo3CreatedAt = 1234567892L

// メモを表示する関数
fun displayMemo(title: String, content: String, createdAt: Long) {
    println("タイトル: $title")
    println("内容: $content")
    println("作成日時: $createdAt")
}

displayMemo(memo1Title, memo1Content, memo1CreatedAt)
```

**問題点：**
1. 変数が増えて管理が大変
2. 関連するデータがバラバラ
3. 引数の順番を間違えやすい
4. メモを配列やリストにまとめにくい

### 解決：クラスでまとめる

```kotlin
// クラスあり：関連するデータをまとめる
data class Memo(
    val title: String,
    val content: String,
    val createdAt: Long
)

val memo1 = Memo("買い物リスト", "牛乳、卵、パン", 1234567890L)
val memo2 = Memo("TODO", "課題を提出する", 1234567891L)
val memo3 = Memo("アイデア", "新しいアプリのアイデア", 1234567892L)

// リストで管理できる
val memos = listOf(memo1, memo2, memo3)

// メモを表示する関数
fun displayMemo(memo: Memo) {
    println("タイトル: ${memo.title}")
    println("内容: ${memo.content}")
    println("作成日時: ${memo.createdAt}")
}

memos.forEach { displayMemo(it) }
```

**メリット：**
1. 関連するデータが1つにまとまる
2. コードが読みやすい
3. リストで管理できる
4. 拡張しやすい

---

## オブジェクト指向の3大原則

### 1. カプセル化（Encapsulation）

**データと操作をまとめ、内部の実装を隠す**

#### なぜカプセル化が必要か

```kotlin
// カプセル化なし：データが外から自由に変更できる
class BankAccount {
    var balance: Int = 0  // 残高
}

val account = BankAccount()
account.balance = 1000000  // 直接変更できてしまう（危険！）
account.balance = -500     // マイナスにもできる（バグ！）
```

**問題：**
- データの整合性が保証されない
- 不正な値が設定される可能性

```kotlin
// カプセル化あり：操作を制限する
class BankAccount {
    private var balance: Int = 0  // 外から直接アクセスできない

    // 残高を取得（読み取り専用）
    fun getBalance(): Int = balance

    // 入金（正の値のみ受け付ける）
    fun deposit(amount: Int) {
        if (amount > 0) {
            balance += amount
        }
    }

    // 出金（残高を超えない範囲で）
    fun withdraw(amount: Int): Boolean {
        return if (amount > 0 && amount <= balance) {
            balance -= amount
            true
        } else {
            false
        }
    }
}

val account = BankAccount()
account.deposit(1000)           // OK
account.withdraw(500)           // OK
account.withdraw(1000)          // 残高不足でfalse
// account.balance = -500       // コンパイルエラー！
```

**メリット：**
- データの整合性が保証される
- 内部実装を変更しても外部に影響しない

#### メモアプリでの例

```kotlin
data class Memo(
    val id: String,
    val title: String,
    val content: String,
    private val _createdAt: Long,
    private var _updatedAt: Long
) {
    val createdAt: Long
        get() = _createdAt

    val updatedAt: Long
        get() = _updatedAt

    // 更新時は必ず更新日時も更新
    fun update(newTitle: String, newContent: String): Memo {
        return copy(
            title = newTitle,
            content = newContent,
            _updatedAt = System.currentTimeMillis()
        )
    }
}
```

### 2. 継承（Inheritance）

**既存のクラスを拡張して新しいクラスを作る**

#### なぜ継承が必要か

共通する部分を一度だけ定義し、再利用できます。

```kotlin
// 継承なし：同じコードを繰り返す
class TextMemo(
    val title: String,
    val content: String,
    val createdAt: Long
) {
    fun display() {
        println("$title: $content")
    }
}

class VoiceMemo(
    val title: String,
    val audioFilePath: String,
    val createdAt: Long
) {
    fun display() {
        println("$title: [音声ファイル]")
    }
}

class ImageMemo(
    val title: String,
    val imageFilePath: String,
    val createdAt: Long
) {
    fun display() {
        println("$title: [画像]")
    }
}
```

**問題：**
- title、createdAtが重複
- displayメソッドの基本構造も同じ

```kotlin
// 継承あり：共通部分を基底クラスに
open class BaseMemo(
    val title: String,
    val createdAt: Long
) {
    open fun display() {
        println("タイトル: $title")
        println("作成日時: $createdAt")
    }
}

// テキストメモ
class TextMemo(
    title: String,
    val content: String,
    createdAt: Long
) : BaseMemo(title, createdAt) {
    override fun display() {
        super.display()
        println("内容: $content")
    }
}

// 音声メモ
class VoiceMemo(
    title: String,
    val audioFilePath: String,
    createdAt: Long
) : BaseMemo(title, createdAt) {
    override fun display() {
        super.display()
        println("音声: $audioFilePath")
    }
}

// 使い方
val textMemo = TextMemo("買い物", "牛乳、卵", 1234567890L)
val voiceMemo = VoiceMemo("アイデア", "/path/to/audio.mp3", 1234567891L)

textMemo.display()
voiceMemo.display()
```

**メリット：**
- コードの重複を削減（DRY原則）
- 共通の修正が1箇所で済む
- is-a関係を表現できる（VoiceMemoは BaseMemoである）

### 3. ポリモーフィズム（多態性）

**同じインターフェースで異なる実装を扱う**

```kotlin
// ポリモーフィズムの例
val memos: List<BaseMemo> = listOf(
    TextMemo("買い物", "牛乳、卵", 1234567890L),
    VoiceMemo("アイデア", "/path/to/audio.mp3", 1234567891L),
    ImageMemo("写真", "/path/to/image.jpg", 1234567892L)
)

// すべて同じように扱える
memos.forEach { memo ->
    memo.display()  // それぞれの実装が呼ばれる
}
```

**メリット：**
- 異なる型を統一的に扱える
- 拡張性が高い（新しい種類のメモを追加しやすい）

---

## インターフェース

### インターフェースとは

**「何ができるか」を定義する契約**

```kotlin
// Displayableインターフェース：表示できるものの契約
interface Displayable {
    fun display()
    fun getSummary(): String
}

// Editableインターフェース：編集できるものの契約
interface Editable {
    fun edit(newContent: String)
}

// Memoクラスは2つのインターフェースを実装
class Memo(
    var title: String,
    var content: String
) : Displayable, Editable {

    override fun display() {
        println("$title: $content")
    }

    override fun getSummary(): String {
        return if (content.length > 20) {
            content.substring(0, 20) + "..."
        } else {
            content
        }
    }

    override fun edit(newContent: String) {
        content = newContent
    }
}
```

### 継承 vs インターフェース

| 観点 | 継承 | インターフェース |
|------|------|-----------------|
| **関係** | is-a（〜である） | can-do（〜できる） |
| **実装** | 実装を継承できる | 実装は持たない（契約のみ） |
| **数** | 1つのクラスのみ継承 | 複数のインターフェースを実装可能 |
| **用途** | 共通の実装を再利用 | 振る舞いの保証 |

**使い分けの例：**
```kotlin
// Dog は Animal である（is-a） → 継承
class Dog : Animal()

// Dog は 走れる、泳げる（can-do） → インターフェース
class Dog : Animal(), Runnable, Swimmable
```

---

## 抽象クラス

### 抽象クラスとは

**一部の実装を持つが、インスタンス化できないクラス**

```kotlin
// 抽象クラス：一部は実装、一部は未実装
abstract class Memo(
    val id: String,
    val title: String,
    val createdAt: Long
) {
    // 共通の実装
    fun getFormattedDate(): String {
        // 日時フォーマット処理
        return "2024/01/01"
    }

    // 抽象メソッド：サブクラスで実装が必要
    abstract fun getContentPreview(): String
    abstract fun getContentSize(): Int
}

// テキストメモ
class TextMemo(
    id: String,
    title: String,
    val content: String,
    createdAt: Long
) : Memo(id, title, createdAt) {

    override fun getContentPreview(): String {
        return content.take(50)
    }

    override fun getContentSize(): Int {
        return content.length
    }
}

// 画像メモ
class ImageMemo(
    id: String,
    title: String,
    val imagePath: String,
    val fileSizeBytes: Int,
    createdAt: Long
) : Memo(id, title, createdAt) {

    override fun getContentPreview(): String {
        return "[画像: $imagePath]"
    }

    override fun getContentSize(): Int {
        return fileSizeBytes
    }
}
```

### インターフェース vs 抽象クラス

| 観点 | インターフェース | 抽象クラス |
|------|----------------|-----------|
| **状態** | 持てない | プロパティを持てる |
| **実装** | デフォルト実装のみ | 通常の実装も可能 |
| **継承** | 複数実装可能 | 1つのみ継承可能 |
| **用途** | 振る舞いの契約 | 共通の基底クラス |

---

## 実践：メモアプリのクラス設計

### 要件

シンプルメモアプリに必要なクラスを設計します。

**必要な情報：**
- メモID（一意の識別子）
- タイトル
- 本文
- 作成日時
- 更新日時
- カテゴリ

### 設計ステップ1：基本クラス

```kotlin
data class Memo(
    val id: String,
    val title: String,
    val content: String,
    val createdAt: Long,
    val updatedAt: Long
)
```

### 設計ステップ2：カテゴリを追加

```kotlin
// カテゴリを列挙型で定義
enum class Category(val displayName: String, val color: String) {
    WORK("仕事", "#FF6B6B"),
    PERSONAL("プライベート", "#4ECDC4"),
    IDEA("アイデア", "#FFE66D"),
    TODO("TODO", "#95E1D3")
}

// Memoクラスにカテゴリを追加
data class Memo(
    val id: String,
    val title: String,
    val content: String,
    val createdAt: Long,
    val updatedAt: Long,
    val category: Category = Category.PERSONAL
)
```

### 設計ステップ3：ユーティリティメソッド

```kotlin
data class Memo(
    val id: String,
    val title: String,
    val content: String,
    val createdAt: Long,
    val updatedAt: Long,
    val category: Category = Category.PERSONAL
) {
    // プレビュー用の短い本文
    fun getPreview(maxLength: Int = 50): String {
        return if (content.length > maxLength) {
            content.take(maxLength) + "..."
        } else {
            content
        }
    }

    // 文字数カウント
    fun getCharacterCount(): Int = content.length

    // 更新されたメモを返す
    fun update(newTitle: String = title, newContent: String = content): Memo {
        return copy(
            title = newTitle,
            content = newContent,
            updatedAt = System.currentTimeMillis()
        )
    }
}
```

### 使用例

```kotlin
// メモ作成
val memo = Memo(
    id = "memo_001",
    title = "買い物リスト",
    content = "牛乳、卵、パン、バナナを買う",
    createdAt = System.currentTimeMillis(),
    updatedAt = System.currentTimeMillis(),
    category = Category.PERSONAL
)

// プレビュー表示
println(memo.getPreview(10))  // "牛乳、卵、パン..."

// 文字数
println("${memo.getCharacterCount()}文字")  // "14文字"

// メモ更新
val updatedMemo = memo.update(
    newContent = "牛乳、卵、パン、バナナ、リンゴを買う"
)
```

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

オブジェクト指向でわからないことがあったら、AIに質問しましょう。

### 質問例

```text
【質問】
クラスとオブジェクトの違いがいまいちわからない。
たい焼きの例以外で、わかりやすい例えを教えて。
```

```text
【質問】
継承とインターフェースの使い分けがわからない。
どういう時に継承を使って、どういう時にインターフェースを使えばいいの？
```

```text
【質問】
カプセル化のメリットがよくわからない。
privateにすると何が嬉しいの？具体例で教えて。
```

```text
【コードレビューお願い】
以下のクラス設計、オブジェクト指向的に問題ない？
もっと良い設計があれば教えて。

class User(var name: String, var age: Int, var email: String)
```

---

## 演習

### 基礎レベル

**問題1：クラスの作成**
次の要件を満たす`Book`クラスを作成してください。
- プロパティ：title（タイトル）、author（著者）、pages（ページ数）
- メソッド：`getInfo()`で「タイトル by 著者（ページ数ページ）」を返す

<details>
<summary>解答例</summary>

```kotlin
data class Book(
    val title: String,
    val author: String,
    val pages: Int
) {
    fun getInfo(): String {
        return "$title by $author（${pages}ページ）"
    }
}

// 使用例
val book = Book("Kotlin入門", "山田太郎", 300)
println(book.getInfo())  // "Kotlin入門 by 山田太郎（300ページ）"
```
</details>

**問題2：カプセル化**
次の`Counter`クラスの問題点を指摘し、カプセル化を使って改善してください。

```kotlin
class Counter {
    var count: Int = 0
}

val counter = Counter()
counter.count = -10  // マイナスにできてしまう
```

<details>
<summary>解答例</summary>

```kotlin
class Counter {
    private var count: Int = 0

    fun getCount(): Int = count

    fun increment() {
        count++
    }

    fun decrement() {
        if (count > 0) {
            count--
        }
    }

    fun reset() {
        count = 0
    }
}

val counter = Counter()
counter.increment()
counter.increment()
println(counter.getCount())  // 2
counter.decrement()
println(counter.getCount())  // 1
```
</details>

**問題3：継承**
`Animal`クラスを継承して、`Dog`と`Cat`クラスを作成してください。
- `Animal`は`name`プロパティと`makeSound()`メソッドを持つ
- `Dog`は「ワンワン」、`Cat`は「ニャー」と鳴く

<details>
<summary>解答例</summary>

```kotlin
open class Animal(val name: String) {
    open fun makeSound() {
        println("...")
    }
}

class Dog(name: String) : Animal(name) {
    override fun makeSound() {
        println("$name: ワンワン！")
    }
}

class Cat(name: String) : Animal(name) {
    override fun makeSound() {
        println("$name: ニャー！")
    }
}

// 使用例
val dog = Dog("ポチ")
val cat = Cat("タマ")
dog.makeSound()  // "ポチ: ワンワン！"
cat.makeSound()  // "タマ: ニャー！"
```
</details>

### 応用レベル

**問題4：インターフェース**
`Playable`インターフェースを作成し、`MusicPlayer`と`VideoPlayer`クラスに実装してください。
- `Playable`は`play()`、`pause()`、`stop()`メソッドを持つ

<details>
<summary>解答例</summary>

```kotlin
interface Playable {
    fun play()
    fun pause()
    fun stop()
}

class MusicPlayer(val songTitle: String) : Playable {
    private var isPlaying = false

    override fun play() {
        isPlaying = true
        println("♪ $songTitle を再生中")
    }

    override fun pause() {
        isPlaying = false
        println("⏸ 一時停止")
    }

    override fun stop() {
        isPlaying = false
        println("⏹ 停止")
    }
}

class VideoPlayer(val videoTitle: String) : Playable {
    private var isPlaying = false

    override fun play() {
        isPlaying = true
        println("▶ $videoTitle を再生中")
    }

    override fun pause() {
        isPlaying = false
        println("⏸ 一時停止")
    }

    override fun stop() {
        isPlaying = false
        println("⏹ 停止")
    }
}

// 使用例
val players: List<Playable> = listOf(
    MusicPlayer("夏の思い出"),
    VideoPlayer("旅行の動画")
)

players.forEach { it.play() }
```
</details>

**問題5：メモアプリのクラス設計**
以下の要件を満たす`Task`クラスを設計してください。
- タイトル、説明、期限、完了状態を持つ
- 完了/未完了を切り替えるメソッド
- 期限切れかどうかを判定するメソッド

<details>
<summary>解答例</summary>

```kotlin
data class Task(
    val id: String,
    val title: String,
    val description: String,
    val dueDate: Long,
    private var _isCompleted: Boolean = false
) {
    val isCompleted: Boolean
        get() = _isCompleted

    fun toggle() {
        _isCompleted = !_isCompleted
    }

    fun complete() {
        _isCompleted = true
    }

    fun isOverdue(): Boolean {
        return !_isCompleted && System.currentTimeMillis() > dueDate
    }

    fun getDaysUntilDue(): Int {
        val diff = dueDate - System.currentTimeMillis()
        return (diff / (1000 * 60 * 60 * 24)).toInt()
    }
}

// 使用例
val task = Task(
    id = "task_001",
    title = "課題を提出",
    description = "プログラミング課題を完成させて提出する",
    dueDate = System.currentTimeMillis() + (7 * 24 * 60 * 60 * 1000) // 7日後
)

println(task.getDaysUntilDue())  // 7
task.complete()
println(task.isCompleted)  // true
```
</details>

### 発展レベル

**問題6：設計パターン**
メモアプリで、メモを作成する際にIDを自動生成する`MemoFactory`クラスを作成してください。

<details>
<summary>解答例</summary>

```kotlin
import java.util.UUID

object MemoFactory {
    fun createMemo(
        title: String,
        content: String,
        category: Category = Category.PERSONAL
    ): Memo {
        val now = System.currentTimeMillis()
        return Memo(
            id = UUID.randomUUID().toString(),
            title = title,
            content = content,
            createdAt = now,
            updatedAt = now,
            category = category
        )
    }
}

// 使用例
val memo1 = MemoFactory.createMemo("買い物", "牛乳、卵")
val memo2 = MemoFactory.createMemo("TODO", "課題提出", Category.WORK)
```
</details>

**問題7：リファクタリング**
以下のコードをオブジェクト指向の原則に従ってリファクタリングしてください。

```kotlin
fun calculateArea(shape: String, width: Double, height: Double): Double {
    return when (shape) {
        "rectangle" -> width * height
        "triangle" -> width * height / 2
        "circle" -> Math.PI * width * width
        else -> 0.0
    }
}
```

<details>
<summary>解答例</summary>

```kotlin
// インターフェース
interface Shape {
    fun calculateArea(): Double
}

// 各図形クラス
class Rectangle(val width: Double, val height: Double) : Shape {
    override fun calculateArea(): Double = width * height
}

class Triangle(val base: Double, val height: Double) : Shape {
    override fun calculateArea(): Double = base * height / 2
}

class Circle(val radius: Double) : Shape {
    override fun calculateArea(): Double = Math.PI * radius * radius
}

// 使用例
val shapes: List<Shape> = listOf(
    Rectangle(5.0, 3.0),
    Triangle(4.0, 6.0),
    Circle(2.0)
)

shapes.forEach { shape ->
    println("面積: ${shape.calculateArea()}")
}
```

**メリット：**
- 新しい図形を追加しやすい
- 各図形の計算ロジックが分離されている
- when文による分岐がなくなった
</details>

**問題8：総合問題**
メモアプリで、メモの検索機能を実装してください。
- タイトル、本文、カテゴリで検索できる
- 複数条件でのAND検索に対応

<details>
<summary>解答例</summary>

```kotlin
data class SearchCriteria(
    val titleKeyword: String? = null,
    val contentKeyword: String? = null,
    val category: Category? = null
)

class MemoRepository(private val memos: List<Memo>) {

    fun search(criteria: SearchCriteria): List<Memo> {
        return memos.filter { memo ->
            val matchesTitle = criteria.titleKeyword?.let {
                memo.title.contains(it, ignoreCase = true)
            } ?: true

            val matchesContent = criteria.contentKeyword?.let {
                memo.content.contains(it, ignoreCase = true)
            } ?: true

            val matchesCategory = criteria.category?.let {
                memo.category == it
            } ?: true

            matchesTitle && matchesContent && matchesCategory
        }
    }

    fun searchByKeyword(keyword: String): List<Memo> {
        return memos.filter { memo ->
            memo.title.contains(keyword, ignoreCase = true) ||
            memo.content.contains(keyword, ignoreCase = true)
        }
    }

    fun searchByCategory(category: Category): List<Memo> {
        return memos.filter { it.category == category }
    }
}

// 使用例
val memos = listOf(
    MemoFactory.createMemo("買い物リスト", "牛乳、卵、パン", Category.PERSONAL),
    MemoFactory.createMemo("仕事TODO", "会議資料作成", Category.WORK),
    MemoFactory.createMemo("アイデア", "新しいアプリ", Category.IDEA)
)

val repository = MemoRepository(memos)

// カテゴリで検索
val workMemos = repository.searchByCategory(Category.WORK)

// キーワードで検索
val searchResults = repository.searchByKeyword("アプリ")

// 複合検索
val criteria = SearchCriteria(
    titleKeyword = "TODO",
    category = Category.WORK
)
val results = repository.search(criteria)
```
</details>

---

## よくある間違い

### 間違い1：すべてをpublicにする

```kotlin
// NG: すべて外から変更できる
class User {
    var password: String = ""  // パスワードが丸見え
    var loginCount: Int = 0    // 外から自由に変更できる
}

// OK: 必要なものだけ公開
class User {
    private var password: String = ""
    private var loginCount: Int = 0

    fun login(inputPassword: String): Boolean {
        if (inputPassword == password) {
            loginCount++
            return true
        }
        return false
    }

    fun getLoginCount(): Int = loginCount
}
```

### 間違い2：継承の乱用

```kotlin
// NG: is-a関係ではないのに継承
class Button : Rectangle()  // ボタンは長方形ではない

// OK: 継承ではなくコンポジション
class Button(private val bounds: Rectangle) {
    fun getBounds(): Rectangle = bounds
}
```

### 間違い3：神クラス（God Class）

```kotlin
// NG: 1つのクラスに詰め込みすぎ
class MemoApp {
    fun createMemo() { ... }
    fun editMemo() { ... }
    fun deleteMemo() { ... }
    fun searchMemo() { ... }
    fun saveToDatabaseMemo() { ... }
    fun loadFromDatabase() { ... }
    fun exportToFile() { ... }
    fun importFromFile() { ... }
    fun sendEmail() { ... }
    // ... 100個のメソッド
}

// OK: 責任を分割
class MemoRepository {
    fun create(memo: Memo) { ... }
    fun update(memo: Memo) { ... }
    fun delete(id: String) { ... }
    fun findById(id: String): Memo? { ... }
}

class MemoSearchService {
    fun search(keyword: String): List<Memo> { ... }
}

class MemoFileService {
    fun export(memos: List<Memo>) { ... }
    fun import(): List<Memo> { ... }
}
```

---

## チェックリスト

この章を完了したか確認しましょう。

- [ ] オブジェクト指向とは何かを説明できる
- [ ] クラスとオブジェクトの違いがわかる
- [ ] カプセル化のメリットを説明できる
- [ ] 継承とインターフェースの使い分けができる
- [ ] 実践的なクラス設計ができる
- [ ] Memoクラスを実装できた
- [ ] 演習問題を5問以上解いた

---

## まとめ

この章では以下を学びました：

1. **オブジェクト指向の基本** - 現実世界のモデル化
2. **クラスの必要性** - データと操作をまとめる
3. **3大原則** - カプセル化、継承、ポリモーフィズム
4. **インターフェース** - 振る舞いの契約
5. **抽象クラス** - 共通実装の共有
6. **実践的な設計** - Memoクラスの設計

オブジェクト指向は、プログラミングの基本的な考え方です。
この章で学んだ概念は、Android開発だけでなく、すべてのプログラミングで活用できます。

次の章では、これらのクラスを使って実際のAndroidアプリを作っていきます。

---

## ふりかえり

- 「責務（責任）」を1つのクラスに詰め込むと、何が起きる？
- 継承よりインターフェースを優先したくなるのはどんなとき？
- シンプルメモアプリの `Memo` に、いま入れるべき/入れるべきでない責務は何？

---

## 次の章

次は [Androidアプリの基本](chapters/03-android-fundamentals.md) に進み、Androidアプリの基本（Activity/ライフサイクル等）を押さえましょう。
