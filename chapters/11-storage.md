# データ保存（Room / DataStore）

オフラインでも使えるアプリには、ローカルへのデータ保存が必要です。
この章では、RoomとDataStoreを使ったデータ永続化を学びます。

---

## この章の目標

- [ ] Roomでデータベースを構築できる
- [ ] Entity、DAO、Databaseを定義できる
- [ ] FlowでDBの変更を監視できる
- [ ] DataStoreで設定を保存できる
- [ ] マイグレーションを理解する

**所要時間の目安：3時間**

---

## RoomとDataStoreの使い分け

| 用途 | 推奨 |
|------|------|
| 構造化データ（TODO、ユーザー情報など） | **Room** |
| キー/値ペア（設定、フラグなど） | **DataStore** |
| 大量データ | **Room** |
| シンプルな値 | **DataStore** |

---

## Room - セットアップ

### 依存関係の追加

```kotlin
// build.gradle.kts
plugins {
    id("com.google.devtools.ksp") version "1.9.21-1.0.16"
}

dependencies {
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")  // Coroutine/Flow対応
    ksp("androidx.room:room-compiler:2.6.1")
}
```

---

## Room - Entity（テーブル定義）

```kotlin
@Entity(tableName = "todos")
data class TodoEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,

    @ColumnInfo(name = "title")
    val title: String,

    @ColumnInfo(name = "is_completed")
    val isCompleted: Boolean = false,

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis()
)

// 複数のプライマリキー
@Entity(primaryKeys = ["userId", "postId"])
data class UserPostCrossRef(
    val userId: Int,
    val postId: Int
)

// インデックス付き
@Entity(
    tableName = "users",
    indices = [Index(value = ["email"], unique = true)]
)
data class UserEntity(
    @PrimaryKey val id: Int,
    val name: String,
    val email: String
)
```

---

## Room - DAO（データアクセスオブジェクト）

```kotlin
@Dao
interface TodoDao {
    // 全件取得（Flow）
    @Query("SELECT * FROM todos ORDER BY created_at DESC")
    fun getAllTodos(): Flow<List<TodoEntity>>

    // 条件付き取得
    @Query("SELECT * FROM todos WHERE is_completed = :completed")
    fun getTodosByStatus(completed: Boolean): Flow<List<TodoEntity>>

    // 単一取得
    @Query("SELECT * FROM todos WHERE id = :id")
    suspend fun getTodoById(id: Int): TodoEntity?

    // 挿入（IDを返す）
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(todo: TodoEntity): Long

    // 複数挿入
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(todos: List<TodoEntity>)

    // 更新
    @Update
    suspend fun update(todo: TodoEntity)

    // 削除
    @Delete
    suspend fun delete(todo: TodoEntity)

    // IDで削除
    @Query("DELETE FROM todos WHERE id = :id")
    suspend fun deleteById(id: Int)

    // 全削除
    @Query("DELETE FROM todos")
    suspend fun deleteAll()

    // 完了済みを削除
    @Query("DELETE FROM todos WHERE is_completed = 1")
    suspend fun deleteCompleted()

    // カウント
    @Query("SELECT COUNT(*) FROM todos WHERE is_completed = 0")
    fun getActiveCount(): Flow<Int>
}
```

---

## Room - Database

```kotlin
@Database(
    entities = [TodoEntity::class],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun todoDao(): TodoDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                )
                    .fallbackToDestructiveMigration()  // 開発中のみ
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
```

---

## Room - Repository実装

```kotlin
interface TodoRepository {
    fun getAllTodos(): Flow<List<Todo>>
    fun getActiveTodos(): Flow<List<Todo>>
    suspend fun addTodo(title: String)
    suspend fun toggleComplete(todo: Todo)
    suspend fun deleteTodo(todo: Todo)
}

class TodoRepositoryImpl(
    private val todoDao: TodoDao
) : TodoRepository {

    override fun getAllTodos(): Flow<List<Todo>> {
        return todoDao.getAllTodos().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override fun getActiveTodos(): Flow<List<Todo>> {
        return todoDao.getTodosByStatus(completed = false).map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun addTodo(title: String) {
        val entity = TodoEntity(title = title)
        todoDao.insert(entity)
    }

    override suspend fun toggleComplete(todo: Todo) {
        val entity = todo.toEntity().copy(isCompleted = !todo.isCompleted)
        todoDao.update(entity)
    }

    override suspend fun deleteTodo(todo: Todo) {
        todoDao.delete(todo.toEntity())
    }
}

// マッピング関数
fun TodoEntity.toDomain() = Todo(
    id = id,
    title = title,
    isCompleted = isCompleted,
    createdAt = createdAt
)

fun Todo.toEntity() = TodoEntity(
    id = id,
    title = title,
    isCompleted = isCompleted,
    createdAt = createdAt
)
```

---

## Room - ViewModelでの使用

```kotlin
@HiltViewModel
class TodoViewModel @Inject constructor(
    private val repository: TodoRepository
) : ViewModel() {

    val todos: StateFlow<List<Todo>> = repository.getAllTodos()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    private val _inputText = MutableStateFlow("")
    val inputText: StateFlow<String> = _inputText.asStateFlow()

    fun onInputChange(text: String) {
        _inputText.value = text
    }

    fun addTodo() {
        val text = _inputText.value.trim()
        if (text.isEmpty()) return

        viewModelScope.launch {
            repository.addTodo(text)
            _inputText.value = ""
        }
    }

    fun toggleComplete(todo: Todo) {
        viewModelScope.launch {
            repository.toggleComplete(todo)
        }
    }

    fun deleteTodo(todo: Todo) {
        viewModelScope.launch {
            repository.deleteTodo(todo)
        }
    }
}
```

---

## Room - マイグレーション

スキーマを変更したときは、マイグレーションが必要です。

```kotlin
// バージョン1 → 2：カラム追加
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL(
            "ALTER TABLE todos ADD COLUMN priority INTEGER NOT NULL DEFAULT 0"
        )
    }
}

// バージョン2 → 3：テーブル追加
val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL(
            """
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name TEXT NOT NULL
            )
            """
        )
    }
}

// Databaseに適用
Room.databaseBuilder(context, AppDatabase::class.java, "app_database")
    .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
    .build()
```

---

## DataStore - セットアップ

```kotlin
// build.gradle.kts
dependencies {
    implementation("androidx.datastore:datastore-preferences:1.0.0")
}
```

---

## DataStore - Preferences DataStore

```kotlin
// DataStoreの定義
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

// キーの定義
object PreferencesKeys {
    val DARK_MODE = booleanPreferencesKey("dark_mode")
    val NOTIFICATION_ENABLED = booleanPreferencesKey("notification_enabled")
    val USERNAME = stringPreferencesKey("username")
    val FONT_SIZE = intPreferencesKey("font_size")
}

// Repository
class SettingsRepository(
    private val dataStore: DataStore<Preferences>
) {
    // 読み取り
    val darkMode: Flow<Boolean> = dataStore.data
        .map { preferences ->
            preferences[PreferencesKeys.DARK_MODE] ?: false
        }

    val settings: Flow<AppSettings> = dataStore.data
        .map { preferences ->
            AppSettings(
                darkMode = preferences[PreferencesKeys.DARK_MODE] ?: false,
                notificationEnabled = preferences[PreferencesKeys.NOTIFICATION_ENABLED] ?: true,
                username = preferences[PreferencesKeys.USERNAME] ?: "",
                fontSize = preferences[PreferencesKeys.FONT_SIZE] ?: 16
            )
        }

    // 書き込み
    suspend fun setDarkMode(enabled: Boolean) {
        dataStore.edit { preferences ->
            preferences[PreferencesKeys.DARK_MODE] = enabled
        }
    }

    suspend fun setNotificationEnabled(enabled: Boolean) {
        dataStore.edit { preferences ->
            preferences[PreferencesKeys.NOTIFICATION_ENABLED] = enabled
        }
    }

    suspend fun setUsername(name: String) {
        dataStore.edit { preferences ->
            preferences[PreferencesKeys.USERNAME] = name
        }
    }

    // 複数の値を一度に更新
    suspend fun updateSettings(settings: AppSettings) {
        dataStore.edit { preferences ->
            preferences[PreferencesKeys.DARK_MODE] = settings.darkMode
            preferences[PreferencesKeys.NOTIFICATION_ENABLED] = settings.notificationEnabled
            preferences[PreferencesKeys.USERNAME] = settings.username
            preferences[PreferencesKeys.FONT_SIZE] = settings.fontSize
        }
    }

    // クリア
    suspend fun clearAll() {
        dataStore.edit { it.clear() }
    }
}

data class AppSettings(
    val darkMode: Boolean = false,
    val notificationEnabled: Boolean = true,
    val username: String = "",
    val fontSize: Int = 16
)
```

---

## DataStore - ViewModelでの使用

```kotlin
@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val repository: SettingsRepository
) : ViewModel() {

    val settings: StateFlow<AppSettings> = repository.settings
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = AppSettings()
        )

    fun toggleDarkMode() {
        viewModelScope.launch {
            repository.setDarkMode(!settings.value.darkMode)
        }
    }

    fun toggleNotification() {
        viewModelScope.launch {
            repository.setNotificationEnabled(!settings.value.notificationEnabled)
        }
    }

    fun updateUsername(name: String) {
        viewModelScope.launch {
            repository.setUsername(name)
        }
    }
}
```

---

## DataStore - 設定画面の実装

```kotlin
@Composable
fun SettingsScreen(viewModel: SettingsViewModel = hiltViewModel()) {
    val settings by viewModel.settings.collectAsState()

    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "設定",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(24.dp))

        // ダークモード
        SettingsSwitchItem(
            title = "ダークモード",
            checked = settings.darkMode,
            onCheckedChange = { viewModel.toggleDarkMode() }
        )

        Divider()

        // 通知
        SettingsSwitchItem(
            title = "プッシュ通知",
            checked = settings.notificationEnabled,
            onCheckedChange = { viewModel.toggleNotification() }
        )

        Divider()

        // ユーザー名
        var showDialog by remember { mutableStateOf(false) }
        SettingsClickableItem(
            title = "ユーザー名",
            value = settings.username.ifEmpty { "未設定" },
            onClick = { showDialog = true }
        )

        if (showDialog) {
            UsernameDialog(
                currentName = settings.username,
                onConfirm = { name ->
                    viewModel.updateUsername(name)
                    showDialog = false
                },
                onDismiss = { showDialog = false }
            )
        }
    }
}

@Composable
fun SettingsSwitchItem(
    title: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = title)
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}
```

---

## オフラインファースト戦略

ネットワークとローカルDBを組み合わせる：

```kotlin
class UserRepository(
    private val api: ApiService,
    private val userDao: UserDao
) {
    // DBをSingle Source of Truth（信頼できる唯一の情報源）とする
    fun getUsers(): Flow<List<User>> {
        return userDao.getAllUsers()
            .map { entities -> entities.map { it.toDomain() } }
    }

    // APIから取得してDBを更新
    suspend fun refreshUsers(): Result<Unit> {
        return try {
            val users = api.getUsers()
            userDao.insertAll(users.map { it.toEntity() })
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// ViewModel
class UsersViewModel(private val repository: UserRepository) : ViewModel() {

    val users: StateFlow<List<User>> = repository.getUsers()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean> = _isRefreshing.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true
            repository.refreshUsers()
            _isRefreshing.value = false
        }
    }
}
```

---

## AIに聞いてみよう

### 質問例

```
【質問】
Roomでリレーション（1対多、多対多）を
どうやって定義すればいい？
@Relationの使い方を教えて。
```

```
【質問】
DataStoreとSharedPreferencesの違いは？
なぜDataStoreが推奨されてるの？
```

```
【質問】
Roomのマイグレーションでカラムを削除したい。
SQLiteはALTER TABLE DROP COLUMNをサポートしてないけど、
どうすればいい？
```

---

## チェックリスト

- [ ] Roomのセットアップができる
- [ ] Entity、DAO、Databaseを定義できる
- [ ] Flowでデータの変更を監視できる
- [ ] マイグレーションを実装できる
- [ ] DataStoreで設定を保存・読み取りできる
- [ ] オフラインファースト戦略を理解している

---

## まとめ

この章では以下を学びました：

1. **Room** - SQLiteのラッパー
2. **Entity** - テーブル定義
3. **DAO** - データアクセス
4. **Flow** - リアクティブなDB監視
5. **DataStore** - 軽量データの保存
6. **マイグレーション** - スキーマ変更

次の章ではテストの書き方を学びます。
