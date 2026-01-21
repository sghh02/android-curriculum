# データ取得と非同期処理

アプリはAPIやデータベースなど外部からデータを取得します。そのために **Kotlin Coroutines / Flow** を使います。

## 目標
- Coroutineの基本概念を理解する
- Flowでデータの流れを扱える

## Coroutineの例
```kotlin
viewModelScope.launch {
    val result = repository.fetchItems()
    _items.value = result
}
```

## Flowの例
```kotlin
val items: StateFlow<List<Item>> = repository.itemsFlow
    .stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())
```

## ミニ課題
- `delay` を使った疑似APIを作成
- ローディング表示を追加

---

次章では、ネットワーク通信の具体的な実装に進みます。
