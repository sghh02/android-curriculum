# アーキテクチャ基礎（MVVM）

Android開発では **MVVM** が標準的な設計です。

## 目標
- UI / ViewModel / Data の役割を理解する
- 状態とロジックを分離できる

## MVVMの構造
- **UI (Composable)** : 表示に専念
- **ViewModel** : 状態管理とイベント処理
- **Repository** : データ取得や保存

## ViewModel例
```kotlin
class TodoViewModel : ViewModel() {
    private val _todos = MutableStateFlow(listOf<String>())
    val todos = _todos.asStateFlow()

    fun addTodo(text: String) {
        _todos.value = _todos.value + text
    }
}
```

## ミニ課題
- ViewModelにカウンター状態を持たせる
- UIからViewModelのメソッドを呼び出す

---

次章では、データ取得の基礎を学びます。
