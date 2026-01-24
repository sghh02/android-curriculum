# Kotlin Coroutinesと非同期処理

Androidアプリでは、ネットワーク通信やデータベースアクセスなど時間のかかる処理を行います。
この章では、Kotlin Coroutinesを使った非同期処理を学びます。

---

## 前提

- [Unit 4: 非同期処理とネットワーク（ガイド）](chapters/04-unit4-guide.md) を読んでいる
- [ViewModelとアーキテクチャ](chapters/08-architecture.md) を完了し、ViewModel/Repositoryの骨格がある

## この章でできるようになること

- [ ] Coroutineの基本概念を理解する
- [ ] suspend関数を作成・呼び出せる
- [ ] Flowでデータストリームを扱える
- [ ] エラーハンドリングができる
- [ ] viewModelScopeを適切に使える

**所要時間の目安：2〜3時間**

---

## なぜCoroutineが必要か

### メインスレッドをブロックしてはいけない

```kotlin
// NG: メインスレッドをブロック
fun loadData() {
    val result = api.fetchData()  // 数秒かかる
    updateUI(result)
}
// → アプリがフリーズ！ANR（Application Not Responding）発生
```

### Coroutineで解決

```kotlin
// OK: バックグラウンドで実行
fun loadData() {
    viewModelScope.launch {
        val result = api.fetchData()  // 待機中もUIは動く
        updateUI(result)
    }
}
```

---

## Coroutineの基本

### セットアップ

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:<version>")
}
```

### launch - Coroutineを起動

```kotlin
// CoroutineScopeで起動
viewModelScope.launch {
    // ここが非同期で実行される
    val data = fetchData()
    _uiState.update { it.copy(data = data) }
}
```

### suspend関数

時間のかかる処理は`suspend`キーワードをつけます。

```kotlin
// suspend関数：Coroutine内からのみ呼び出せる
suspend fun fetchData(): List<Item> {
    delay(1000)  // 1秒待機（スレッドをブロックしない）
    return listOf(Item("A"), Item("B"))
}

// 呼び出し側
viewModelScope.launch {
    val data = fetchData()  // suspend関数はCoroutine内で呼ぶ
}
```

### Dispatcher - 実行スレッドの指定

```kotlin
viewModelScope.launch {
    // デフォルト：Dispatchers.Main（UIスレッド）
    showLoading()

    val result = withContext(Dispatchers.IO) {
        // IOスレッドで実行（ネットワーク、DB）
        api.fetchData()
    }

    // Mainスレッドに戻る
    hideLoading()
    updateUI(result)
}
```

| Dispatcher | 用途 |
|------------|------|
| `Main` | UI更新、軽い処理 |
| `IO` | ネットワーク、ファイル、DB |
| `Default` | CPU負荷の高い計算 |

---

## async/await - 並列実行

複数の処理を並列で実行する場合：

```kotlin
viewModelScope.launch {
    // 順番に実行（合計6秒）
    val user = fetchUser()      // 3秒
    val posts = fetchPosts()    // 3秒

    // 並列に実行（合計3秒）
    val userDeferred = async { fetchUser() }
    val postsDeferred = async { fetchPosts() }

    val user = userDeferred.await()
    val posts = postsDeferred.await()

    _uiState.update { it.copy(user = user, posts = posts) }
}
```

---

## Flow - データストリーム

### Flowとは

- 時間の経過とともに複数の値を発行
- データベースの変更監視などに最適
- Cold Stream（購読されるまで開始しない）

### 基本的なFlow

```kotlin
// Flowを作成
fun countDown(): Flow<Int> = flow {
    for (i in 10 downTo 0) {
        emit(i)       // 値を発行
        delay(1000)   // 1秒待機
    }
}

// Flowを収集
viewModelScope.launch {
    countDown().collect { value ->
        println(value)  // 10, 9, 8, ... 0
    }
}
```

### Flowの変換

```kotlin
val userFlow: Flow<User> = repository.getUserFlow()

// map：値を変換
val userNameFlow: Flow<String> = userFlow.map { it.name }

// filter：条件でフィルタ
val activeUsersFlow: Flow<User> = userFlow.filter { it.isActive }

// distinctUntilChanged：重複を除去
val distinctFlow: Flow<User> = userFlow.distinctUntilChanged()

// debounce：一定時間待ってから発行
val searchFlow: Flow<String> = searchQueryFlow.debounce(300)
```

### StateFlowとSharedFlow

```kotlin
// StateFlow：常に最新の値を保持
private val _uiState = MutableStateFlow(UiState())
val uiState: StateFlow<UiState> = _uiState.asStateFlow()

// SharedFlow：イベントの配信（値を保持しない）
private val _event = MutableSharedFlow<Event>()
val event: SharedFlow<Event> = _event.asSharedFlow()
```

### FlowをStateFlowに変換

```kotlin
val memos: StateFlow<List<Memo>> = repository.getMemosFlow()
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )
```

### SharingStartedの種類

| オプション | 動作 |
|------------|------|
| `Eagerly` | すぐに開始、ずっと維持 |
| `Lazily` | 最初の購読者で開始、ずっと維持 |
| `WhileSubscribed(ms)` | 購読者がいる間だけ、ms後に停止 |

---

## Composeでの使用

### collectAsState（簡易）

まずは `collectAsState()` でも動きますが、実務では次の `collectAsStateWithLifecycle()` を推奨します。

```kotlin
@Composable
fun MemoScreen(viewModel: MemoViewModel = viewModel()) {
    // StateFlowをCompose Stateに変換
    val uiState by viewModel.uiState.collectAsState()

    // UIを構築
    when {
        uiState.isLoading -> LoadingScreen()
        uiState.error != null -> ErrorScreen(uiState.error)
        else -> MemoList(uiState.memos)
    }
}
```

### collectAsStateWithLifecycle

アプリがバックグラウンドにいるときは収集を停止：

```kotlin
// build.gradle.kts
implementation("androidx.lifecycle:lifecycle-runtime-compose:<version>")

@Composable
fun MemoScreen(viewModel: MemoViewModel = viewModel()) {
    // ライフサイクルを考慮して収集
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
}
```

### LaunchedEffect

Composable内でCoroutineを起動：

```kotlin
@Composable
fun DataScreen(viewModel: DataViewModel = viewModel()) {
    // 初回のみ実行
    LaunchedEffect(Unit) {
        viewModel.loadData()
    }

    // keyが変わるたびに実行
    LaunchedEffect(userId) {
        viewModel.loadUser(userId)
    }
}
```

---

## エラーハンドリング

### try-catch

```kotlin
viewModelScope.launch {
    _uiState.update { it.copy(isLoading = true) }

    try {
        val data = repository.fetchData()
        _uiState.update { it.copy(data = data, isLoading = false) }
    } catch (e: Exception) {
        _uiState.update { it.copy(error = e.message, isLoading = false) }
    }
}
```

### Result型

```kotlin
suspend fun fetchData(): Result<List<Item>> {
    return try {
        val data = api.getItems()
        Result.success(data)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// 使用
viewModelScope.launch {
    repository.fetchData()
        .onSuccess { data ->
            _uiState.update { it.copy(data = data) }
        }
        .onFailure { e ->
            _uiState.update { it.copy(error = e.message) }
        }
}
```

### Flowのエラーハンドリング

```kotlin
repository.getMemos()
    .catch { e ->
        // エラーをキャッチしてUIに通知
        emit(emptyList())
        _error.emit(e.message)
    }
    .collect { memos ->
        _uiState.update { it.copy(memos = memos) }
    }
```

---

## キャンセル

### 自動キャンセル

```kotlin
// viewModelScopeはViewModel破棄時に自動キャンセル
viewModelScope.launch {
    while (true) {
        fetchAndUpdate()
        delay(5000)  // 5秒ごとに更新
    }
}
// ViewModel破棄で自動停止
```

### 手動キャンセル

```kotlin
class MyViewModel : ViewModel() {
    private var fetchJob: Job? = null

    fun startFetching() {
        fetchJob?.cancel()  // 前のジョブをキャンセル
        fetchJob = viewModelScope.launch {
            // ...
        }
    }

    fun stopFetching() {
        fetchJob?.cancel()
    }
}
```

### キャンセル可能な処理

```kotlin
suspend fun fetchLargeData() {
    for (page in 1..100) {
        ensureActive()  // キャンセルされていたら例外をスロー
        val data = fetchPage(page)
        processData(data)
    }
}
```

---

## 実践：検索機能

```kotlin
class SearchViewModel : ViewModel() {
    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    // 検索クエリが変わるたびに検索を実行
    val searchResults: StateFlow<List<Item>> = _query
        .debounce(300)                    // 300ms待機
        .filter { it.length >= 2 }        // 2文字以上
        .distinctUntilChanged()           // 重複を除去
        .flatMapLatest { query ->         // 最新のクエリのみ
            repository.search(query)
                .catch { emit(emptyList()) }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun onQueryChange(newQuery: String) {
        _query.value = newQuery
    }
}
```

---

## AIに聞いてみよう

### 質問テンプレ（コピペ）

```text
【前提】
この章を学習しています（この章のコンテキストは共有済み）。

【やりたいこと】
（例：Repositoryを作りたい / 例外設計を揃えたい / キャッシュ方針を決めたい）

【今の状態】
- 画面/機能：
- 該当コード：
- 期待する挙動：

【制約】
- 変えたくないこと：

【欲しい回答】
- 方針（Result/Exception/UiStateなど）
- 実装の最小例
- 確認ポイント（失敗系/テスト）
```

### 質問例

```text
【質問】
Coroutineのlaunchとasyncの違いは何？
どういう場面で使い分ける？
```

```text
【質問】
FlowとStateFlowの違いを教えて。
いつどっちを使えばいい？
```

```text
【質問】
Coroutineで複数のAPI呼び出しを並列実行して、
すべて完了したら結果をまとめて処理したい。
どう書けばいい？
```

---

## 演習

- [ ] ViewModelで `isLoading` / `error` を含むUI Stateを更新できるようにする
- [ ] 非同期処理の失敗を `Result` や `sealed class` で表現し、UIで分岐できるようにする
- [ ] 連打/多重実行を防ぐ（ボタン無効化やジョブ管理）方針を決めて実装する

---

## チェックリスト

- [ ] Coroutineを起動できる（launch）
- [ ] suspend関数を作成できる
- [ ] Dispatcherの使い分けがわかる
- [ ] asyncで並列実行できる
- [ ] Flowを作成・収集できる
- [ ] StateFlowに変換できる
- [ ] エラーハンドリングができる

---

## まとめ

この章では以下を学びました：

1. **Coroutine** - 非同期処理の基本
2. **suspend関数** - 中断可能な関数
3. **Dispatcher** - 実行スレッドの制御
4. **Flow** - データストリーム
5. **StateFlow** - 状態の保持と公開
6. **エラーハンドリング** - try-catch、Result、catch

Coroutineを使いこなすことで、スムーズなUXを提供できます。

---

## ふりかえり

- suspendとFlowの使い分けは、今の理解だとどうなっている？
- 例外は“どこで”握ると安全？（Repository/UseCase/VM/UI）
- いまのアプリで「二重実行」されやすい操作はどれ？

---

## 次の章

次は [ネットワーク通信（Retrofit）](chapters/10-network.md) に進み、Retrofitで通信を組み込みましょう。
