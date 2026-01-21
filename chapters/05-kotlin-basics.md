# Kotlin基礎（Android向け）

Android開発で頻出のKotlin文法を短時間で押さえます。

## 目標
- Kotlinの基本構文を理解する
- null安全やデータクラスが説明できる

## 重要ポイント
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

## ミニ課題
- `data class Task(val title: String, val done: Boolean)` を作成
- `List<Task>` を作り、完了タスク数を数える関数を書く

---

次章では、Composeの **状態管理** を学びます。
