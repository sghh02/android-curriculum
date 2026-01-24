# ViewModelとアーキテクチャ

大規模なアプリを作るには、適切な設計（アーキテクチャ）が必要です。
この章では、Androidの推奨アーキテクチャとViewModelを学びます。

---

## 前提

- [ナビゲーション](chapters/07-navigation.md) を完了し、画面遷移の骨格がある

## この章でできるようになること

- [ ] MVVMパターンを理解する
- [ ] ViewModelで状態を管理できる
- [ ] StateFlowでUIを更新できる
- [ ] Repositoryパターンを実装できる
- [ ] 依存性注入の概念を理解する

**所要時間の目安：3時間**

---

## なぜアーキテクチャが必要か

### 悪い例：すべてをComposableに書く

```kotlin
@Composable
fun MemoScreen() {
    var memos by remember { mutableStateOf(listOf<Memo>()) }
    var title by remember { mutableStateOf("") }

    // API呼び出し
    LaunchedEffect(Unit) {
        val response = api.getMemos()  // ここでAPI呼び出し
        memos = response
    }

    Column {
        TextField(value = title, onValueChange = { title = it })
        Button(onClick = {
            // ここでDB保存
            db.insertMemo(title = title, content = "")
            memos = memos + Memo(title = title, content = "")
            title = ""
        }) {
            Text("追加")
        }
        // ...
    }
}
```

**問題点：**
- 画面回転で状態が消える
- テストが困難
- コードが肥大化する
- 再利用できない

---

## Android推奨アーキテクチャ

```text
┌─────────────────────────────────────────┐
│                UI Layer                 │
│  (Composable + ViewModel)               │
├─────────────────────────────────────────┤
│              Domain Layer               │
│  (UseCase) ※必要に応じて                │
├─────────────────────────────────────────┤
│              Data Layer                 │
│  (Repository + DataSource)              │
└─────────────────────────────────────────┘
```

### 各層の責任

| レイヤー | 責任 |
|----------|------|
| **UI Layer** | 画面の表示、ユーザー入力の受け取り |
| **Domain Layer** | ビジネスロジック（省略可） |
| **Data Layer** | データの取得・保存 |

---

## ViewModel

### ViewModelとは

- UIの状態を保持する
- 画面回転しても状態が保持される
- ライフサイクルを意識したデータ管理

### セットアップ

```kotlin
// build.gradle.kts
dependencies {
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:<version>")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:<version>")
}
```

### 基本的なViewModel

```kotlin
class CounterViewModel : ViewModel() {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()

    fun increment() {
        _count.value++
    }

    fun decrement() {
        _count.value--
    }

    fun reset() {
        _count.value = 0
    }
}
```

### Composableでの使用

StateFlowは `collectAsStateWithLifecycle()` でComposeのStateに変換します（バックグラウンドでは自動で収集を止めます）。

```kotlin
@Composable
fun CounterScreen(
    viewModel: CounterViewModel = viewModel()
) {
    val count by viewModel.count.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "$count",
            fontSize = 48.sp
        )
        Row {
            Button(onClick = { viewModel.decrement() }) {
                Text("-")
            }
            Spacer(modifier = Modifier.width(16.dp))
            Button(onClick = { viewModel.increment() }) {
                Text("+")
            }
        }
        TextButton(onClick = { viewModel.reset() }) {
            Text("リセット")
        }
    }
}
```

---

## StateFlow vs LiveData

### StateFlow（推奨）

```kotlin
class MyViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun updateData(newData: String) {
        _uiState.update { it.copy(data = newData) }
    }
}

// Composableで使用
@Composable
fun MyScreen(viewModel: MyViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    // ...
}
```

### なぜStateFlowか

| 特徴 | StateFlow | LiveData |
|------|-----------|----------|
| Kotlin親和性 | ◎ | ○ |
| Null安全 | ◎ | △ |
| Flow演算子 | ◎ | × |
| 初期値必須 | ◎ | × |
| Compose統合 | ◎ | ○ |

---

## UI Stateパターン

### UI状態をdata classでまとめる

```kotlin
data class MemoUiState(
    val memos: List<Memo> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val draftTitle: String = "",
    val draftContent: String = ""
)

class MemoViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(MemoUiState())
    val uiState: StateFlow<MemoUiState> = _uiState.asStateFlow()

    fun onTitleChange(title: String) {
        _uiState.update { it.copy(draftTitle = title) }
    }

    fun onContentChange(content: String) {
        _uiState.update { it.copy(draftContent = content) }
    }

    fun addMemo() {
        val title = _uiState.value.draftTitle.trim()
        val content = _uiState.value.draftContent.trim()
        if (title.isBlank()) return

        _uiState.update {
            it.copy(
                memos = it.memos + Memo(title = title, content = content),
                draftTitle = "",
                draftContent = ""
            )
        }
    }

    fun removeMemo(memo: Memo) {
        _uiState.update {
            it.copy(memos = it.memos - memo)
        }
    }

    fun toggleArchive(memo: Memo) {
        _uiState.update { state ->
            state.copy(
                memos = state.memos.map { current ->
                    if (current == memo) current.copy(isArchived = !current.isArchived) else current
                }
            )
        }
    }
}
```

### Composableでの使用

```kotlin
@Composable
fun MemoScreen(viewModel: MemoViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Column(modifier = Modifier.padding(16.dp)) {
        // 入力欄
        OutlinedTextField(
            value = uiState.draftTitle,
            onValueChange = viewModel::onTitleChange,
            label = { Text("タイトル") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = uiState.draftContent,
            onValueChange = viewModel::onContentChange,
            label = { Text("本文") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = viewModel::addMemo,
            enabled = uiState.draftTitle.isNotBlank()
        ) {
            Text("保存")
        }

        // ローディング表示
        if (uiState.isLoading) {
            CircularProgressIndicator()
        }

        // エラー表示
        uiState.error?.let { error ->
            Text(text = error, color = Color.Red)
        }

        // メモ一覧
        LazyColumn {
            items(uiState.memos) { memo ->
                MemoItem(
                    memo = memo,
                    onDelete = { viewModel.removeMemo(memo) }
                )
            }
        }
    }
}
```

---

## イベント処理

### 単方向データフロー

```text
User Action → ViewModel → State Update → UI Update
```

### イベントの種類

```kotlin
// UIイベント（ボタンクリックなど）
sealed interface MemoEvent {
    data class OnTitleChange(val title: String) : MemoEvent
    data class OnContentChange(val content: String) : MemoEvent
    object OnSaveClick : MemoEvent
    data class OnDeleteClick(val memo: Memo) : MemoEvent
    data class OnToggleArchive(val memo: Memo) : MemoEvent
}

class MemoViewModel : ViewModel() {
    fun onEvent(event: MemoEvent) {
        when (event) {
            is MemoEvent.OnTitleChange -> {
                _uiState.update { it.copy(draftTitle = event.title) }
            }
            is MemoEvent.OnContentChange -> {
                _uiState.update { it.copy(draftContent = event.content) }
            }
            is MemoEvent.OnSaveClick -> addMemo()
            is MemoEvent.OnDeleteClick -> removeMemo(event.memo)
            is MemoEvent.OnToggleArchive -> toggleArchive(event.memo)
        }
    }
}
```

### 一回限りのイベント（Snackbar、画面遷移など）

```kotlin
class MemoViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(MemoUiState())
    val uiState: StateFlow<MemoUiState> = _uiState.asStateFlow()

    // 一回限りのイベント
    private val _event = MutableSharedFlow<UiEvent>()
    val event: SharedFlow<UiEvent> = _event.asSharedFlow()

    sealed interface UiEvent {
        data class ShowSnackbar(val message: String) : UiEvent
        object NavigateBack : UiEvent
    }

    fun deleteMemo(memo: Memo) {
        viewModelScope.launch {
            repository.deleteMemo(memo)
            _event.emit(UiEvent.ShowSnackbar("削除しました"))
        }
    }
}

// Composableでの受信
@Composable
fun MemoScreen(viewModel: MemoViewModel = viewModel()) {
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        viewModel.event.collect { event ->
            when (event) {
                is UiEvent.ShowSnackbar -> {
                    snackbarHostState.showSnackbar(event.message)
                }
                is UiEvent.NavigateBack -> {
                    // 画面を戻る
                }
            }
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) {
        // ...
    }
}
```

---

## Repositoryパターン

### なぜRepositoryが必要か

- データ取得元を抽象化
- ViewModelはデータの取得方法を知らなくていい
- テスト時にモックに差し替えやすい

### 実装例

```kotlin
// データモデル
data class Memo(
    val id: String = "",
    val title: String,
    val content: String,
    val isArchived: Boolean = false
)

// Repositoryインターフェース
interface MemoRepository {
    fun getMemos(): Flow<List<Memo>>
    suspend fun addMemo(memo: Memo)
    suspend fun updateMemo(memo: Memo)
    suspend fun deleteMemo(memo: Memo)
}

// 実装クラス
class MemoRepositoryImpl(
    private val memoDao: MemoDao
) : MemoRepository {
    override fun getMemos(): Flow<List<Memo>> {
        return memoDao.getAll().map { entities ->
            entities.map { it.toMemo() }
        }
    }

    override suspend fun addMemo(memo: Memo) {
        memoDao.insert(memo.toEntity())
    }

    override suspend fun updateMemo(memo: Memo) {
        memoDao.update(memo.toEntity())
    }

    override suspend fun deleteMemo(memo: Memo) {
        memoDao.delete(memo.toEntity())
    }
}
```

### ViewModelでの使用

```kotlin
class MemoViewModel(
    private val repository: MemoRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MemoUiState())
    val uiState: StateFlow<MemoUiState> = _uiState.asStateFlow()

    init {
        loadMemos()
    }

    private fun loadMemos() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            repository.getMemos()
                .catch { e ->
                    _uiState.update {
                        it.copy(isLoading = false, error = e.message)
                    }
                }
                .collect { memos ->
                    _uiState.update {
                        it.copy(isLoading = false, memos = memos)
                    }
                }
        }
    }

    fun addMemo(title: String, content: String) {
        viewModelScope.launch {
            repository.addMemo(Memo(title = title, content = content))
        }
    }
}
```

---

## viewModelScope

ViewModelにはCoroutineスコープが組み込まれています。

```kotlin
class MyViewModel : ViewModel() {

    fun doSomething() {
        // ViewModelが破棄されると自動でキャンセルされる
        viewModelScope.launch {
            // 非同期処理
            val result = repository.fetchData()
            _uiState.update { it.copy(data = result) }
        }
    }

    fun doMultipleThings() {
        viewModelScope.launch {
            // 並列実行
            val result1 = async { repository.fetchData1() }
            val result2 = async { repository.fetchData2() }

            _uiState.update {
                it.copy(
                    data1 = result1.await(),
                    data2 = result2.await()
                )
            }
        }
    }
}
```

---

## 依存性注入（DI）の基礎

### 手動での依存性注入

```kotlin
// Application クラスで依存関係を作成
class MyApplication : Application() {
    val database by lazy { AppDatabase.create(this) }
    val memoRepository by lazy { MemoRepositoryImpl(database.memoDao()) }
}

// ViewModelFactory
class MemoViewModelFactory(
    private val repository: MemoRepository
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return MemoViewModel(repository) as T
    }
}

// Composableで使用
@Composable
fun MemoScreen() {
    val context = LocalContext.current
    val app = context.applicationContext as MyApplication

    val viewModel: MemoViewModel = viewModel(
        factory = MemoViewModelFactory(app.memoRepository)
    )
    // ...
}
```

### Hilt（推奨DI）

```kotlin
// build.gradle.kts
plugins {
    id("com.google.dagger.hilt.android")
    id("com.google.devtools.ksp")
}

dependencies {
    implementation("com.google.dagger:hilt-android:<version>")
    ksp("com.google.dagger:hilt-compiler:<version>")
    implementation("androidx.hilt:hilt-navigation-compose:<version>")
}

// Application
@HiltAndroidApp
class MyApplication : Application()

// Module
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return AppDatabase.create(context)
    }

    @Provides
    fun provideMemoRepository(database: AppDatabase): MemoRepository {
        return MemoRepositoryImpl(database.memoDao())
    }
}

// ViewModel
@HiltViewModel
class MemoViewModel @Inject constructor(
    private val repository: MemoRepository
) : ViewModel() {
    // ...
}

// Composable
@Composable
fun MemoScreen(
    viewModel: MemoViewModel = hiltViewModel()
) {
    // ...
}
```

---

## 実践：メモアプリのアーキテクチャ

```kotlin
// UI State
data class MemoScreenUiState(
    val memos: List<Memo> = emptyList(),
    val isLoading: Boolean = false,
    val draftTitle: String = "",
    val draftContent: String = "",
    val filter: MemoFilter = MemoFilter.ALL
)

enum class MemoFilter { ALL, ACTIVE, ARCHIVED }

// ViewModel
@HiltViewModel
class MemoViewModel @Inject constructor(
    private val repository: MemoRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MemoScreenUiState())
    val uiState: StateFlow<MemoScreenUiState> = _uiState.asStateFlow()

    // フィルタリングされたメモ
    val filteredMemos: StateFlow<List<Memo>> = combine(
        repository.getMemos(),
        _uiState.map { it.filter }
    ) { memos, filter ->
        when (filter) {
            MemoFilter.ALL -> memos
            MemoFilter.ACTIVE -> memos.filter { !it.isArchived }
            MemoFilter.ARCHIVED -> memos.filter { it.isArchived }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    fun onTitleChange(title: String) {
        _uiState.update { it.copy(draftTitle = title) }
    }

    fun onContentChange(content: String) {
        _uiState.update { it.copy(draftContent = content) }
    }

    fun addMemo() {
        val title = _uiState.value.draftTitle.trim()
        val content = _uiState.value.draftContent.trim()
        if (title.isEmpty()) return

        viewModelScope.launch {
            repository.addMemo(Memo(title = title, content = content))
            _uiState.update { it.copy(draftTitle = "", draftContent = "") }
        }
    }

    fun toggleArchive(memo: Memo) {
        viewModelScope.launch {
            repository.updateMemo(memo.copy(isArchived = !memo.isArchived))
        }
    }

    fun deleteMemo(memo: Memo) {
        viewModelScope.launch {
            repository.deleteMemo(memo)
        }
    }

    fun setFilter(filter: MemoFilter) {
        _uiState.update { it.copy(filter = filter) }
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
（例：責務分離をしたい / UI Stateを設計したい / DIを整理したい）

【今の状態】
- 画面/機能：
- 該当コード：
- 迷っている判断：

【制約】
- 変えたくないこと：

【欲しい回答】
- 構成案（責務の境界）
- 実装の最小例
- リスクと確認ポイント（テスト含む）
```

### 質問例

```text
【質問】
ViewModelで状態を管理するとき、
StateFlowとLiveDataどっちを使うべき？
それぞれのメリット・デメリットを教えて。
```

```text
【質問】
UIイベント（Snackbar表示、画面遷移など）を
ViewModelからUIに通知する方法は？
SharedFlowとChannelの違いも教えて。
```

```text
【質問】
Hiltを使った依存性注入の設定方法を
ステップバイステップで教えて。
```

---

## 演習

- [ ] シンプルメモアプリにViewModelを導入し、UI State（Loading/Empty/Error含む）で状態を管理する
- [ ] Repositoryを用意し、UIからデータ取得/保存の詳細を隠す
- [ ] 可能ならHiltで依存を注入し、差し替え（Fake）できる形を意識する

---

## チェックリスト

- [ ] MVVMの各層の役割を説明できる
- [ ] ViewModelを作成できる
- [ ] StateFlowで状態を公開できる
- [ ] collectAsStateでUIに反映できる
- [ ] UI Stateパターンを実装できる
- [ ] Repositoryパターンを理解している
- [ ] viewModelScopeを使える

---

## まとめ

この章では以下を学びました：

1. **MVVM** - UI/ViewModel/Dataの分離
2. **ViewModel** - 状態の保持とロジック
3. **StateFlow** - リアクティブな状態管理
4. **UI State** - 状態をまとめるパターン
5. **Repository** - データ層の抽象化
6. **依存性注入** - テスタブルな設計

適切なアーキテクチャにより、保守性が高く、テストしやすいアプリを作れます。

---

## ふりかえり

- ViewModelに「入れてよいもの/入れないほうがよいもの」は何？
- UI Stateに入れるべき状態は何？（Loading/Empty/Errorなど）
- いまのシンプルメモで、責務が混ざっていそうな場所はどこ？

---

## 次の章

次は [Unit 4: 非同期処理とネットワーク（ガイド）](chapters/04-unit4-guide.md) に進み、非同期とネットワークの全体像を確認しましょう。
