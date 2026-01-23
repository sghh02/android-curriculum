# ViewModelとアーキテクチャ

大規模なアプリを作るには、適切な設計（アーキテクチャ）が必要です。
この章では、Androidの推奨アーキテクチャとViewModelを学びます。

---

## 前提

- `chapters/07-navigation.md` を完了し、画面遷移の骨格がある

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
fun TodoScreen() {
    var todos by remember { mutableStateOf(listOf<String>()) }
    var input by remember { mutableStateOf("") }

    // API呼び出し
    LaunchedEffect(Unit) {
        val response = api.getTodos()  // ここでAPI呼び出し
        todos = response
    }

    Column {
        TextField(value = input, onValueChange = { input = it })
        Button(onClick = {
            // ここでDB保存
            db.insert(Todo(input))
            todos = todos + input
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
data class TodoUiState(
    val todos: List<Todo> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val inputText: String = ""
)

class TodoViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(TodoUiState())
    val uiState: StateFlow<TodoUiState> = _uiState.asStateFlow()

    fun onInputChange(text: String) {
        _uiState.update { it.copy(inputText = text) }
    }

    fun addTodo() {
        val text = _uiState.value.inputText
        if (text.isBlank()) return

        _uiState.update {
            it.copy(
                todos = it.todos + Todo(text = text),
                inputText = ""
            )
        }
    }

    fun removeTodo(todo: Todo) {
        _uiState.update {
            it.copy(todos = it.todos - todo)
        }
    }
}
```

### Composableでの使用

```kotlin
@Composable
fun TodoScreen(viewModel: TodoViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.padding(16.dp)) {
        // 入力欄
        OutlinedTextField(
            value = uiState.inputText,
            onValueChange = viewModel::onInputChange,
            label = { Text("新しいTODO") },
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = viewModel::addTodo,
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

        // TODOリスト
        LazyColumn {
            items(uiState.todos) { todo ->
                TodoItem(
                    todo = todo,
                    onDelete = { viewModel.removeTodo(todo) }
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
sealed interface TodoEvent {
    data class OnInputChange(val text: String) : TodoEvent
    object OnAddClick : TodoEvent
    data class OnDeleteClick(val todo: Todo) : TodoEvent
    data class OnToggleComplete(val todo: Todo) : TodoEvent
}

class TodoViewModel : ViewModel() {
    fun onEvent(event: TodoEvent) {
        when (event) {
            is TodoEvent.OnInputChange -> {
                _uiState.update { it.copy(inputText = event.text) }
            }
            is TodoEvent.OnAddClick -> addTodo()
            is TodoEvent.OnDeleteClick -> removeTodo(event.todo)
            is TodoEvent.OnToggleComplete -> toggleComplete(event.todo)
        }
    }
}
```

### 一回限りのイベント（Snackbar、画面遷移など）

```kotlin
class TodoViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(TodoUiState())
    val uiState: StateFlow<TodoUiState> = _uiState.asStateFlow()

    // 一回限りのイベント
    private val _event = MutableSharedFlow<UiEvent>()
    val event: SharedFlow<UiEvent> = _event.asSharedFlow()

    sealed interface UiEvent {
        data class ShowSnackbar(val message: String) : UiEvent
        object NavigateBack : UiEvent
    }

    fun deleteTodo(todo: Todo) {
        viewModelScope.launch {
            repository.delete(todo)
            _event.emit(UiEvent.ShowSnackbar("削除しました"))
        }
    }
}

// Composableでの受信
@Composable
fun TodoScreen(viewModel: TodoViewModel = viewModel()) {
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
data class Todo(
    val id: Int = 0,
    val text: String,
    val isCompleted: Boolean = false
)

// Repositoryインターフェース
interface TodoRepository {
    fun getTodos(): Flow<List<Todo>>
    suspend fun addTodo(todo: Todo)
    suspend fun updateTodo(todo: Todo)
    suspend fun deleteTodo(todo: Todo)
}

// 実装クラス
class TodoRepositoryImpl(
    private val todoDao: TodoDao
) : TodoRepository {
    override fun getTodos(): Flow<List<Todo>> {
        return todoDao.getAll().map { entities ->
            entities.map { it.toTodo() }
        }
    }

    override suspend fun addTodo(todo: Todo) {
        todoDao.insert(todo.toEntity())
    }

    override suspend fun updateTodo(todo: Todo) {
        todoDao.update(todo.toEntity())
    }

    override suspend fun deleteTodo(todo: Todo) {
        todoDao.delete(todo.toEntity())
    }
}
```

### ViewModelでの使用

```kotlin
class TodoViewModel(
    private val repository: TodoRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TodoUiState())
    val uiState: StateFlow<TodoUiState> = _uiState.asStateFlow()

    init {
        loadTodos()
    }

    private fun loadTodos() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            repository.getTodos()
                .catch { e ->
                    _uiState.update {
                        it.copy(isLoading = false, error = e.message)
                    }
                }
                .collect { todos ->
                    _uiState.update {
                        it.copy(isLoading = false, todos = todos)
                    }
                }
        }
    }

    fun addTodo(text: String) {
        viewModelScope.launch {
            repository.addTodo(Todo(text = text))
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
    val todoRepository by lazy { TodoRepositoryImpl(database.todoDao()) }
}

// ViewModelFactory
class TodoViewModelFactory(
    private val repository: TodoRepository
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return TodoViewModel(repository) as T
    }
}

// Composableで使用
@Composable
fun TodoScreen() {
    val context = LocalContext.current
    val app = context.applicationContext as MyApplication

    val viewModel: TodoViewModel = viewModel(
        factory = TodoViewModelFactory(app.todoRepository)
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
    fun provideTodoRepository(database: AppDatabase): TodoRepository {
        return TodoRepositoryImpl(database.todoDao())
    }
}

// ViewModel
@HiltViewModel
class TodoViewModel @Inject constructor(
    private val repository: TodoRepository
) : ViewModel() {
    // ...
}

// Composable
@Composable
fun TodoScreen(
    viewModel: TodoViewModel = hiltViewModel()
) {
    // ...
}
```

---

## 実践：TODOアプリのアーキテクチャ

```kotlin
// UI State
data class TodoUiState(
    val todos: List<Todo> = emptyList(),
    val isLoading: Boolean = false,
    val inputText: String = "",
    val filter: TodoFilter = TodoFilter.ALL
)

enum class TodoFilter { ALL, ACTIVE, COMPLETED }

// ViewModel
@HiltViewModel
class TodoViewModel @Inject constructor(
    private val repository: TodoRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TodoUiState())
    val uiState: StateFlow<TodoUiState> = _uiState.asStateFlow()

    // フィルタリングされたTODO
    val filteredTodos: StateFlow<List<Todo>> = combine(
        repository.getTodos(),
        _uiState.map { it.filter }
    ) { todos, filter ->
        when (filter) {
            TodoFilter.ALL -> todos
            TodoFilter.ACTIVE -> todos.filter { !it.isCompleted }
            TodoFilter.COMPLETED -> todos.filter { it.isCompleted }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    fun onInputChange(text: String) {
        _uiState.update { it.copy(inputText = text) }
    }

    fun addTodo() {
        val text = _uiState.value.inputText.trim()
        if (text.isEmpty()) return

        viewModelScope.launch {
            repository.addTodo(Todo(text = text))
            _uiState.update { it.copy(inputText = "") }
        }
    }

    fun toggleComplete(todo: Todo) {
        viewModelScope.launch {
            repository.updateTodo(todo.copy(isCompleted = !todo.isCompleted))
        }
    }

    fun deleteTodo(todo: Todo) {
        viewModelScope.launch {
            repository.deleteTodo(todo)
        }
    }

    fun setFilter(filter: TodoFilter) {
        _uiState.update { it.copy(filter = filter) }
    }
}
```

---

## AIに聞いてみよう

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

次は `chapters/04-unit4-guide.md` に進み、非同期とネットワークの全体像を確認しましょう。
