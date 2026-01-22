# ViewModelとアーキテクチャ

大規模なアプリを作るには、適切な設計（アーキテクチャ）が必要です。
この章では、Androidの推奨アーキテクチャとViewModelを学びます。

---

## この章の目標

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
    var memos by remember { mutableStateOf(listOf<String>()) }
    var input by remember { mutableStateOf("") }

    // API呼び出し
    LaunchedEffect(Unit) {
        val response = api.getMemos()  // ここでAPI呼び出し
        memos = response
    }

    Column {
        TextField(value = input, onValueChange = { input = it })
        Button(onClick = {
            // ここでDB保存
            db.insert(Memo(input))
            memos = memos + input
            input = ""
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

```
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
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
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

```kotlin
@Composable
fun CounterScreen(
    viewModel: CounterViewModel = viewModel()
) {
    val count by viewModel.count.collectAsState()

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
    val uiState by viewModel.uiState.collectAsState()
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
    val inputText: String = ""
)

class MemoViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(MemoUiState())
    val uiState: StateFlow<MemoUiState> = _uiState.asStateFlow()

    fun onInputChange(text: String) {
        _uiState.update { it.copy(inputText = text) }
    }

    fun addMemo() {
        val text = _uiState.value.inputText
        if (text.isBlank()) return

        _uiState.update {
            it.copy(
                memos = it.memos + Memo(text = text),
                inputText = ""
            )
        }
    }

    fun removeMemo(memo: Memo) {
        _uiState.update {
            it.copy(memos = it.memos - memo)
        }
    }
}
```

### Composableでの使用

```kotlin
@Composable
fun MemoScreen(viewModel: MemoViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.padding(16.dp)) {
        // 入力欄
        OutlinedTextField(
            value = uiState.inputText,
            onValueChange = viewModel::onInputChange,
            label = { Text("新しいメモ") },
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = viewModel::addMemo,
            enabled = uiState.inputText.isNotBlank()
        ) {
            Text("追加")
        }

        // ローディング表示
        if (uiState.isLoading) {
            CircularProgressIndicator()
        }

        // エラー表示
        uiState.error?.let { error ->
            Text(text = error, color = Color.Red)
        }

        // メモリスト
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

```
User Action → ViewModel → State Update → UI Update
```

### イベントの種類

```kotlin
// UIイベント（ボタンクリックなど）
sealed interface MemoEvent {
    data class OnInputChange(val text: String) : MemoEvent
    object OnAddClick : MemoEvent
    data class OnDeleteClick(val memo: Memo) : MemoEvent
    data class OnToggleComplete(val memo: Memo) : MemoEvent
}

class MemoViewModel : ViewModel() {
    fun onEvent(event: MemoEvent) {
        when (event) {
            is MemoEvent.OnInputChange -> {
                _uiState.update { it.copy(inputText = event.text) }
            }
            is MemoEvent.OnAddClick -> addMemo()
            is MemoEvent.OnDeleteClick -> removeMemo(event.memo)
            is MemoEvent.OnToggleComplete -> toggleComplete(event.memo)
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
            repository.delete(memo)
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
    val id: Int = 0,
    val text: String,
    val isCompleted: Boolean = false
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

    fun addMemo(text: String) {
        viewModelScope.launch {
            repository.addMemo(Memo(text = text))
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
    implementation("com.google.dagger:hilt-android:2.50")
    ksp("com.google.dagger:hilt-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")
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
data class MemoUiState(
    val memos: List<Memo> = emptyList(),
    val isLoading: Boolean = false,
    val inputText: String = "",
    val filter: MemoFilter = MemoFilter.ALL
)

enum class MemoFilter { ALL, ACTIVE, COMPLETED }

// ViewModel
@HiltViewModel
class MemoViewModel @Inject constructor(
    private val repository: MemoRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MemoUiState())
    val uiState: StateFlow<MemoUiState> = _uiState.asStateFlow()

    // フィルタリングされたメモ
    val filteredMemos: StateFlow<List<Memo>> = combine(
        repository.getMemos(),
        _uiState.map { it.filter }
    ) { memos, filter ->
        when (filter) {
            MemoFilter.ALL -> memos
            MemoFilter.ACTIVE -> memos.filter { !it.isCompleted }
            MemoFilter.COMPLETED -> memos.filter { it.isCompleted }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    fun onInputChange(text: String) {
        _uiState.update { it.copy(inputText = text) }
    }

    fun addMemo() {
        val text = _uiState.value.inputText.trim()
        if (text.isEmpty()) return

        viewModelScope.launch {
            repository.addMemo(Memo(text = text))
            _uiState.update { it.copy(inputText = "") }
        }
    }

    fun toggleComplete(memo: Memo) {
        viewModelScope.launch {
            repository.updateMemo(memo.copy(isCompleted = !memo.isCompleted))
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

### 質問例

```
【質問】
ViewModelで状態を管理するとき、
StateFlowとLiveDataどっちを使うべき？
それぞれのメリット・デメリットを教えて。
```

```
【質問】
UIイベント（Snackbar表示、画面遷移など）を
ViewModelからUIに通知する方法は？
SharedFlowとChannelの違いも教えて。
```

```
【質問】
Hiltを使った依存性注入の設定方法を
ステップバイステップで教えて。
```

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
